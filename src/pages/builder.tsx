import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Exercise, RoutineExercise, Routine } from '@/types';
import { exercises as defaultExercises } from '@/data/exercises';
import MuscleMap from '@/components/MuscleMap/MuscleMap';
import CreateExerciseModal from '@/components/CreateExerciseModal';
import BottomNav from '@/components/BottomNav';

export default function Builder() {
  const router = useRouter();
  const [routine, setRoutine] = useState<RoutineExercise[]>([]);
  const [library, setLibrary] = useState<Exercise[]>(defaultExercises);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');
  const [name, setName] = useState('Change Routine Name');

  // Load custom exercises and existing routine from local storage
  useEffect(() => {
    const storedExercises = localStorage.getItem('workout-routine-builder-exercises');
    let loadedExercises: Exercise[] = [];
    if (storedExercises) {
      try {
        loadedExercises = JSON.parse(storedExercises);
        setLibrary([...defaultExercises, ...loadedExercises]);
      } catch (e) {
        console.error('Error parsing custom exercises', e);
      }
    }

    if (!router.isReady) return;
    const routineId = router.query.routineId as string;
    if (routineId && routineId !== 'New Routine') {
      const storedRoutines = localStorage.getItem('workout-routine-builder-routines');
      if (storedRoutines) {
        try {
          const routines: Routine[] = JSON.parse(storedRoutines);
          const found = routines.find((r) => r.id === routineId);
          if (found) {
            setName(found.name);
            setRoutine(found.exercises);
          } else {
            // Fallback for mock routines if they haven't been saved yet
            const mockDefaults: Record<string, string> = {
              'routine-1': 'Push Day',
              'routine-2': 'Pull Day',
              'routine-3': 'Leg Day',
            };
            if (routineId in mockDefaults) {
              setName(mockDefaults[routineId]);
            }
          }
        } catch (e) {
          console.error('Error parsing routines', e);
        }
      } else {
        // Fallback if routines aren't in local storage yet
        const mockDefaults: Record<string, string> = {
          'routine-1': 'Push Day',
          'routine-2': 'Pull Day',
          'routine-3': 'Leg Day',
        };
        if (routineId in mockDefaults) {
          setName(mockDefaults[routineId]);
        }
      }
    }
  }, [router.isReady, router.query.routineId]);

  function addExercise(exercise: Exercise) {
    setRoutine((prev) => [
      ...prev,
      {
        instanceId: `${exercise.id}-${Date.now()}`,
        exercise,
      },
    ]);
  }

  function removeExercise(instanceId: string) {
    setRoutine((prev) => prev.filter((e) => e.instanceId !== instanceId));
  }

  function createExercise(exercise: Exercise) {
    // Save to local storage
    const storedExercises = localStorage.getItem('workout-routine-builder-exercises');
    const customExercises: Exercise[] = storedExercises ? JSON.parse(storedExercises) : [];
    customExercises.push(exercise);
    localStorage.setItem('workout-routine-builder-exercises', JSON.stringify(customExercises));

    setLibrary((prev) => [...prev, exercise]);
    setShowModal(false);
  }

  function saveRoutine() {
    if (!name.trim() || name === 'New Routine') {
      alert('Please enter a custom routine name');
      return;
    }
    if (routine.length === 0) {
      alert('Please add at least one exercise to your routine');
      return;
    }

    const storedRoutines = localStorage.getItem('workout-routine-builder-routines');
    let routines: Routine[] = [];
    if (storedRoutines) {
      try {
        routines = JSON.parse(storedRoutines);
      } catch (e) {
        console.error('Error parsing routines', e);
      }
    }

    const routineId = router.query.routineId as string;
    const targetId = routineId && routineId !== 'New Routine' ? routineId : `routine-${Date.now()}`;

    const newRoutine: Routine = {
      id: targetId,
      name: name.trim(),
      exercises: routine,
      updatedAt: Date.now(),
    };

    const existingIndex = routines.findIndex((r) => r.id === targetId);
    if (existingIndex > -1) {
      routines[existingIndex] = newRoutine;
    } else {
      routines.push(newRoutine);
    }

    localStorage.setItem('workout-routine-builder-routines', JSON.stringify(routines));
    router.push('/');
  }

  const filteredLibrary = library.filter((e) =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 px-5 pt-10 pb-24 max-w-md mx-auto w-full flex flex-col gap-5">

        {/* Header */}
        <div className="flex items-center gap-3 bg-light p-2 rounded-lg">
          <button
            onClick={() => router.back()}
            className="text-black hover:text-white transition-colors text-lg"
          >
            ←
          </button>
          
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Routine Name"
            className=" text-xl font-semibold text-black focus:outline-none border-b border-transparent focus:border-zinc-700 w-full"
          />
        </div>

        {/* Search + add */}
        <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="bg-transparent text-sm text-white placeholder-zinc-500 flex-1 focus:outline-none"
          />
        </div>

        {/* Dark card — exercise list + muscle map */}
        <div className="bg-zinc-900 rounded-2xl overflow-hidden">

          {/* Routine exercise list */}
          <div className="p-4">
            {routine.length === 0 ? (
              <p className="text-sm text-zinc-500 py-2">
                Add exercises below to build your routine.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-white/10">
                {routine.map((entry) => (
                  <li
                    key={entry.instanceId}
                    className="flex items-center justify-between py-3"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {entry.exercise.name}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5">
                        {entry.exercise.muscles.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(entry.instanceId)}
                      className="text-zinc-600 hover:text-red-400 transition-colors text-lg leading-none"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Muscle map */}
          <div className="bg-zinc-800 p-4">
            <MuscleMap routine={routine} />
          </div>

        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 border border-zinc-800 bg-zinc-900 text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors hover:cursor-pointer"
          >
            Create Exercise
          </button>
          <button
            onClick={saveRoutine}
            className="flex-1 bg-light text-black font-semibold rounded-xl py-3 text-sm hover:opacity-90 transition-all active:scale-95 hover:cursor-pointer"
          >
            Save Routine
          </button>
        </div>

        {/* Library list */}
        <div>
          <h2 className="text-xs font-medium text-zinc-500 uppercase tracking-wide mb-3">
            Exercise library
          </h2>
          <ul className="grid grid-cols-3 gap-2">
            {filteredLibrary.map((exercise) => (
              <li
                key={exercise.id}
                className="flex items-center justify-between bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-white">{exercise.name}</p>
                </div>
                <button
                  onClick={() => addExercise(exercise)}
                  className="text-purple-400 hover:text-purple-300 transition-colors text-xl leading-none"
                >
                  +
                </button>
              </li>
            ))}
          </ul>
        </div>

      </main>

      <BottomNav active="routines" />

      {showModal && (
        <CreateExerciseModal
          onClose={() => setShowModal(false)}
          onCreate={createExercise}
        />
      )}
    </div>
  );
}