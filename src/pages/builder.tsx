import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import Fuse from 'fuse.js';
import { Exercise, RoutineExercise, Routine } from '@/types';
import { exercises as defaultExercises } from '@/data/exercises';
import MuscleMap from '@/components/MuscleMap/MuscleMap';
import CreateExerciseModal from '@/components/CreateExerciseModal';
import BottomNav from '@/components/BottomNav';
import { BiEditAlt, BiSearch } from 'react-icons/bi';

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

  // Fuzzy, typo-tolerant search over the exercise library
  const fuse = useMemo(
    () => new Fuse(library, { keys: ['name'], threshold: 0.4, ignoreLocation: true }),
    [library]
  );

  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    return fuse.search(search).map((r) => r.item);
  }, [search, fuse]);

  function addExercise(exercise: Exercise) {
    // New exercises go to the top of the routine list
    setRoutine((prev) => [
      {
        instanceId: `${exercise.id}-${Date.now()}`,
        exercise,
      },
      ...prev,
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

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <main className="flex-1 px-5 pt-10 pb-24 max-w-md mx-auto w-full flex flex-col gap-5">

        {/* Header — inline editable name, no boxed background */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-zinc-400 hover:text-white transition-colors text-xl shrink-0 hover:cursor-pointer"
          >
            ←
          </button>
          <div className="flex-1 flex items-center gap-2 border-b border-zinc-800 focus-within:border-light pb-1.5 transition-colors">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Routine Name"
              className="flex-1 min-w-0 bg-transparent text-xl font-semibold text-white placeholder-zinc-600 focus:outline-none"
            />
            <BiEditAlt className="text-zinc-600 text-lg shrink-0" />
          </div>
        </div>

        {/* Exercise list + muscle map, side by side */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-zinc-900 rounded-2xl p-3 h-72 overflow-y-auto">
            {routine.length === 0 ? (
              <p className="text-xs text-zinc-500 py-2">
                Add exercises below to build your routine.
              </p>
            ) : (
              <ul className="flex flex-col divide-y divide-white/10">
                {routine.map((entry) => (
                  <li
                    key={entry.instanceId}
                    className="flex items-center justify-between gap-2 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-white truncate">
                        {entry.exercise.name}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5 truncate">
                        {entry.exercise.muscles.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => removeExercise(entry.instanceId)}
                      className="text-zinc-600 hover:text-red-400 transition-colors text-base leading-none shrink-0 hover:cursor-pointer"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-zinc-900 rounded-2xl p-3 h-72 overflow-y-auto flex flex-col gap-2">
            {/* Assumes MuscleMap accepts a `view` prop; if not, swap for a single instance */}
            <MuscleMap routine={routine} />
          </div>
        </div>

        {/* Search with typeahead results dropdown */}
        <div className="relative">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-4 py-2 focus-within:border-light/60 transition-colors">
            <BiSearch className="text-zinc-500 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exercises..."
              className="bg-transparent text-sm text-white placeholder-zinc-500 flex-1 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="text-zinc-600 hover:text-white text-sm shrink-0 hover:cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {search.trim() && (
            <div className="absolute z-20 top-full left-0 right-0 mt-2 bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden max-h-64 overflow-y-auto shadow-xl">
              {searchResults.length === 0 ? (
                <p className="text-xs text-zinc-500 px-4 py-4 text-center">
                  No matches found.
                </p>
              ) : (
                searchResults.map((exercise) => {
                  const inRoutine = routine.some((e) => e.exercise.id === exercise.id);
                  return (
                    <button
                      key={exercise.id}
                      onClick={() => {
                        addExercise(exercise);
                        setSearch('');
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors hover:bg-zinc-800 hover:cursor-pointer ${inRoutine ? 'text-light' : 'text-white'
                        }`}
                    >
                      <span className="text-sm font-medium truncate">{exercise.name}</span>
                    </button>
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 border border-black ring-2 ring-light/50 ring-offset-2 ring-offset-black bg-light/15 text-white rounded-xl py-3 text-sm font-semibold hover:bg-zinc-800 transition-colors hover:cursor-pointer"
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
          <ul className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
            {library.map((exercise) => {
              const inRoutine = routine.some((e) => e.exercise.id === exercise.id);
              return (
                <li key={exercise.id}>
                  <button
                    onClick={() => addExercise(exercise)}
                    className={`w-full text-left border rounded-xl px-2 py-3 transition-colors hover:cursor-pointer ${inRoutine
                      ? 'border-light text-light bg-light/5'
                      : 'border-zinc-800 bg-zinc-900 text-white hover:border-zinc-700'
                      }`}
                  >
                    <p className="text-sm font-medium truncate">{exercise.name}</p>
                  </button>
                </li>
              );
            })}
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