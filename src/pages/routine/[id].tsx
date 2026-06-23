import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Routine } from '@/types';
import BottomNav from '@/components/BottomNav';

const convertWeight = (val: string, from: 'lb' | 'kg', to: 'lb' | 'kg'): string => {
  const num = parseFloat(val);
  if (isNaN(num)) return '';
  if (from === to) return val;
  const factor = to === 'kg' ? 0.453592 : 2.20462;
  return (Math.round(num * factor * 100) / 100).toString();
};

export default function WorkoutSession() {
  const router = useRouter();
  const { id } = router.query;

  const [routine, setRoutine] = useState<Routine | null>(null);
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [reps, setReps] = useState<Record<string, string>>({});
  const [sets, setSets] = useState<Record<string, string>>({});

  const [units, setUnits] = useState<Record<string, 'lb' | 'kg'>>({});
  const [globalUnit, setGlobalUnit] = useState<'lb' | 'kg'>('lb');
  const [openLoggerIds, setOpenLoggerIds] = useState<Set<string>>(new Set());

  // Fetch routine from localStorage by id
  useEffect(() => {
    if (!id) return;
    const stored = localStorage.getItem('workout-routine-builder-routines');
    if (!stored) return;
    try {
      const routines: Routine[] = JSON.parse(stored);
      const found = routines.find((r) => r.id === id);
      if (found) setRoutine(found);
    } catch (e) {
      console.error('Error loading routine', e);
    }
  }, [id]);

  // Load weights and units for this routine
  useEffect(() => {
    if (!routine) return;

    const storedGlobalUnit = localStorage.getItem('workout-active-global-unit');
    setGlobalUnit((storedGlobalUnit === 'kg' ? 'kg' : 'lb') as 'lb' | 'kg');

    const loadedWeights: Record<string, string> = {};
    const finishedSets: Record<string, string> = {};
    const finishedReps: Record<string, string> = {};

    const loadedUnits: Record<string, 'lb' | 'kg'> = {};

    routine.exercises.forEach(({ exercise }) => {
      const storedWeight = localStorage.getItem(`workout-active-weight-${exercise.id}`);
      const storedReps = localStorage.getItem(`workout-active-sets-${exercise.id}`);
      const storedSets = localStorage.getItem(`workout-active-reps-${exercise.id}`);
      const storedUnit = localStorage.getItem(`workout-active-unit-${exercise.id}`);

      loadedWeights[exercise.id] = storedWeight || '';
      finishedReps[exercise.id] = storedReps || '';
      finishedSets[exercise.id] = storedSets || '';
      loadedUnits[exercise.id] = (storedUnit === 'kg' ? 'kg' : 'lb') as 'lb' | 'kg';
    });

    setWeights(loadedWeights);
    setReps(finishedReps);
    setSets(finishedSets);
    setUnits(loadedUnits);
  }, [routine]);

  const handleWeightChange = (exerciseId: string, value: string) => {
    setWeights((prev) => ({ ...prev, [exerciseId]: value }));
    localStorage.setItem(`workout-active-weight-${exerciseId}`, value);
  };

  const handleSetsChange = (exerciseId: string, value: string) => {
    setSets((prev) => ({ ...prev, [exerciseId]: value }));
    localStorage.setItem(`workout-active-sets-${exerciseId}`, value);
  };

  const handleRepsChange = (exerciseId: string, value: string) => {
    setReps((prev) => ({ ...prev, [exerciseId]: value }));
    localStorage.setItem(`workout-active-reps-${exerciseId}`, value);
  };

  const handleIndividualUnitChange = (exerciseId: string) => {
    const currentUnit = units[exerciseId] || 'lb';
    const nextUnit = currentUnit === 'lb' ? 'kg' : 'lb';
    const currentWeight = weights[exerciseId] || '';
    const nextWeight = currentWeight ? convertWeight(currentWeight, currentUnit, nextUnit) : '';

    setUnits((prev) => ({ ...prev, [exerciseId]: nextUnit }));
    setWeights((prev) => ({ ...prev, [exerciseId]: nextWeight }));
    localStorage.setItem(`workout-active-unit-${exerciseId}`, nextUnit);
    localStorage.setItem(`workout-active-weight-${exerciseId}`, nextWeight);
  };

  const handleGlobalUnitChange = (newGlobalUnit: 'lb' | 'kg') => {
    if (!routine || newGlobalUnit === globalUnit) return;

    const nextWeights = { ...weights };
    const nextUnits = { ...units };

    routine.exercises.forEach(({ exercise }) => {
      const currentUnit = units[exercise.id] || 'lb';
      if (currentUnit !== newGlobalUnit) {
        const currentWeight = weights[exercise.id] || '';
        const nextWeight = currentWeight ? convertWeight(currentWeight, currentUnit, newGlobalUnit) : '';
        nextWeights[exercise.id] = nextWeight;
        nextUnits[exercise.id] = newGlobalUnit;
        localStorage.setItem(`workout-active-weight-${exercise.id}`, nextWeight);
        localStorage.setItem(`workout-active-unit-${exercise.id}`, newGlobalUnit);
      }
    });

    setGlobalUnit(newGlobalUnit);
    setWeights(nextWeights);
    setUnits(nextUnits);
    localStorage.setItem('workout-active-global-unit', newGlobalUnit);
  };

  const logWorkoutSession = () => {
    if (!routine) return;

    const logs: Record<string, { weight: number; unit: 'lb' | 'kg' }> = {};
    let hasInputs = false;

    routine.exercises.forEach(({ exercise }) => {
      const w = weights[exercise.id];
      const u = units[exercise.id] || 'lb';
      if (w !== undefined && w !== '') {
        const num = parseFloat(w);
        if (!isNaN(num)) {
          logs[exercise.id] = { weight: num, unit: u };
          hasInputs = true;
        }
      }
    });

    for (const { exercise } of routine.exercises) {
      const s = sets[exercise.id];
      const r = reps[exercise.id];
      const hasS = s !== undefined && s !== '' && parseFloat(s) !== 0;
      const hasR = r !== undefined && r !== '' && parseFloat(r) !== 0;

      if (hasS !== hasR) {
        alert(`Please fill in both sets and reps for "${exercise.name}", or leave both empty.`);
        return;
      }
    }

    if (!hasInputs) {
      alert('Please enter at least one weight lifted to log your session.');
      return;
    }

    const payload = {
      timestamp: Date.now(),
      routineId: routine.id,
      routineName: routine.name,
      logs,
    };

    const storedHistory = localStorage.getItem('workout-routine-builder-history');
    const history = storedHistory ? JSON.parse(storedHistory) : [];
    history.push(payload);
    localStorage.setItem('workout-routine-builder-history', JSON.stringify(history));

    alert('Workout session successfully logged!');
    router.push('/');
  };

  if (!routine) {
    return (
      <div className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
        <p className="text-neutral-500 text-sm">Loading workout...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 px-6 pt-16 pb-32 max-w-md mx-auto w-full flex flex-col gap-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="text-zinc-400 hover:text-white transition-colors text-lg hover:cursor-pointer"
            >
              ←
            </button>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {routine.name}
            </h1>
          </div>
          <button
            onClick={() => router.push(`/builder?routineId=${routine.id}`)}
            className="bg-light text-black px-3.5 py-1.5 rounded-xl text-xs font-semibold hover:opacity-90 active:scale-95 transition-all hover:cursor-pointer"
          >
            Edit
          </button>
        </div>

        {/* Global Unit Toggle */}
        <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-semibold text-white">Switch weight unit</span>
            <span className="text-xs text-neutral-500">Inputs auto-save immediately</span>
          </div>
          <div className="flex bg-neutral-805 p-1 rounded-xl border border-neutral-700">
            <button
              onClick={() => handleGlobalUnitChange('lb')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:cursor-pointer ${globalUnit === 'lb' ? 'bg-light text-black shadow' : 'text-neutral-400 hover:text-white'}`}
            >
              LB
            </button>
            <button
              onClick={() => handleGlobalUnitChange('kg')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:cursor-pointer ${globalUnit === 'kg' ? 'bg-light text-black shadow' : 'text-neutral-400 hover:text-white'}`}
            >
              KG
            </button>
          </div>
        </div>

        {/* Exercise List */}
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-1">
            Exercises
          </span>
          <ul className="flex flex-col gap-6">
            {routine.exercises.map(({ exercise }) => {
              const isCurrentOpen = openLoggerIds.has(exercise.id);
              const weightVal = weights[exercise.id] || '';
              const setsVal = sets[exercise.id] || '';
              const repsVal = reps[exercise.id] || '';

              const exUnit = units[exercise.id] || 'lb';
              return (
                <li
                  key={exercise.id}
                  className="flex relative items-center justify-between bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{exercise.name}</p>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                      <span className="inline-block bg-neutral-800 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {exercise.intensity}
                      </span>
                      <span className="inline-block bg-neutral-800 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded capitalize">
                        {exercise.type}
                      </span>
                    </div>

                    {isCurrentOpen && (
                      <div
                        className="mt-9 mb-1 items-center gap-2">
                        <p
                        className="  text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded mb-2"
                        >
                          Optional </p>                       
                         <span className=" text-xs text-light font-bold px-2.5 py-1">
                          REPS
                        </span>

                        <input type="number"
                          placeholder="8"
                          value={repsVal}
                          min="0"
                          onChange={(e) => handleRepsChange(exercise.id, e.target.value)}
                          className="bg-neutral-800 rounded-xl text-center text-light text-sm py-1 w-12 focus:outline-none"
                        />

                        <span className="text-xs text-light font-bold px-2.5 py-1 ">
                          SETS
                        </span>

                        <input type="number"
                          placeholder="3"
                          value={setsVal}
                          min="0"
                          onChange={(e) => handleSetsChange(exercise.id, e.target.value)}
                          className="bg-neutral-800  rounded-xl text-center text-light text-sm py-1 w-12 focus:outline-none"
                        />

                      </div>
                    )}
                  </div>

                  <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden px-2 py-1.5 w-35 justify-between">
                    <input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={weightVal}
                      onChange={(e) => handleWeightChange(exercise.id, e.target.value)}
                      className="bg-transparent w-full text-right focus:outline-none text-white text-sm font-medium pr-1.5"
                    />
                    <button
                      onClick={() => handleIndividualUnitChange(exercise.id)}
                      className="bg-neutral-700 text-light text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-neutral-650 transition-colors uppercase hover:cursor-pointer min-w-8.5"
                    >
                      {exUnit}
                    </button>
                  </div>


                  {/* Sets and reps extender */}
                  <button
                    className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 
                  bg-black border-light border-2 text-light font-medium px-4 py-1 rounded-xl text-xs 
                  shadow-lg hover:bg-lime-400 hover:text-black transition-colors"
                    onClick={() => setOpenLoggerIds((prev) => {
                      const next = new Set(prev);
                      next.has(exercise.id) ? next.delete(exercise.id) : next.add(exercise.id);
                      return next;
                    })}                  >

                    {isCurrentOpen ? '−' : '+'}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Log Session Button */}
        <button
          onClick={logWorkoutSession}
          className="w-full border border-light text-light active:scale-95 transition-all 
          text-sm font-semibold rounded-2xl py-4 tracking-wide shadow-lg shadow-light/30 mt-4 
          hover:cursor-pointer hover:bg-light hover:text-black"
        >
          Finish & Log Workout
        </button>

      </main>
      

      <BottomNav active="home" />
    </div>
  );
}