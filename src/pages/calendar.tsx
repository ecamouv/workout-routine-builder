import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import { Routine, RoutineAssignment } from '@/types';
import BottomNav from '@/components/BottomNav';
import RoutineTab from '@/components/RoutineTab'

type Day = RoutineAssignment['day'];

const DAYS: { key: Day; label: string }[] = [
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
];

const ASSIGNMENTS_KEY = 'workout-routine-assignments';

export default function Calendar() {
  const router = useRouter();
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [assignments, setAssignments] = useState<RoutineAssignment[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Which day's picker overlay is open, if any
  const [pickerDay, setPickerDay] = useState<Day | null>(null);
  const [search, setSearch] = useState('');

  // Load routines + assignments
  useEffect(() => {
    setIsMounted(true);

    const storedRoutines = localStorage.getItem('workout-routine-builder-routines');
    if (storedRoutines) {
      try {
        setRoutines(JSON.parse(storedRoutines));
      } catch (e) {
        console.error('Error parsing routines from localStorage', e);
      }
    }

    const storedAssignments = localStorage.getItem(ASSIGNMENTS_KEY);
    if (storedAssignments) {
      try {
        setAssignments(JSON.parse(storedAssignments));
      } catch (e) {
        console.error('Error parsing assignments from localStorage', e);
      }
    }
  }, []);

  // Persist assignments whenever they change (post-mount)
  useEffect(() => {
    if (!isMounted) return;
    localStorage.setItem(ASSIGNMENTS_KEY, JSON.stringify(assignments));
  }, [assignments, isMounted]);

  const assignmentsByDay = useMemo(() => {
    const map: Record<Day, { assignment: RoutineAssignment; routine: Routine }[]> = {
      monday: [], tuesday: [], wednesday: [], thursday: [], friday: [], saturday: [], sunday: [],
    };
    assignments.forEach((a) => {
      const routine = routines.find((r) => r.id === a.routineId);
      if (routine) map[a.day].push({ assignment: a, routine });
    });
    return map;
  }, [assignments, routines]);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase();
    return routines.filter((r) => r.name.toLowerCase().includes(q));
  }, [routines, search]);

  const openPicker = (day: Day) => {
    setSearch('');
    setPickerDay(day);
  };

  const closePicker = () => {
    setPickerDay(null);
    setSearch('');
  };

  const assignRoutineToDay = (routine: Routine, day: Day) => {
    const newAssignment: RoutineAssignment = {
      id: `assign-${day}-${routine.id}-${Date.now()}`,
      routineId: routine.id,
      day,
    };
    setAssignments((prev) => [...prev, newAssignment]);
    closePicker();
  };

  const removeAssignment = (assignmentId: string) => {
    setAssignments((prev) => prev.filter((a) => a.id !== assignmentId));
  };

  const openRoutine = (routineId: string) => {
    router.push(`/routine/${routineId}`);
  };
  return (
    <div className="min-h-screen bg-neutral-950 text-white font-sans antialiased">
      {/* Set a max width on main so it stays centered and readable on all screens */}
      <main className="max-w-md mx-auto px-4 pt-12 pb-32 flex flex-col gap-6">
  
        {/* Header */}
        <div>
          <h1 className="font-bold text-2xl tracking-tight">Weekly Schedule</h1>
        </div>
  
        {/* Week list */}
        <div className="flex flex-col gap-6">
          {DAYS.map(({ key, label }) => {
            const dayAssignments = assignmentsByDay[key];
            return (
              <div key={key} className="w-full flex flex-col gap-3 border-b border-neutral-900 pb-5 last:border-0 last:pb-0">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
                  {label}
                </span>
  
                <div className="flex flex-col gap-2 w-full">
                  {dayAssignments.map(({ assignment, routine }) => (
                    <div
                      key={assignment.id}
                      className="w-full bg-light border border-black rounded-xl flex items-center justify-between gap-3 px-3.5 py-2.5 hover:border-neutral-800 transition-colors"
                    >
                      <button
                        onClick={() => openRoutine(routine.id)}
                        className="flex-1 min-w-0 text-black text-xs font-semibold text-center line-clamp-1 transition-transform duration-200 hover:text-black hover:scale-110 hover:cursor-pointer"
                        title="Open routine"
                      >
                        {routine.name}
                      </button>
                      <button
                        onClick={() => removeAssignment(assignment.id)}
                        className="text-neutral-500 hover:text-neutral-300 text-sm p-1 leading-none shrink-0 transition-colors hover:cursor-pointer"
                        title="Remove from this day"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
  
                  <button
                    onClick={() => openPicker(key)}
                    className="w-full py-2.5 bg-neutral-900/30 border border-dashed border-neutral-800 rounded-xl flex items-center justify-center text-neutral-500 hover:text-neutral-300 hover:border-neutral-700 transition-all hover:cursor-pointer text-sm gap-1"
                  >
                    <span className="text-lg font-medium leading-none">+</span>
                    <span className="text-xs font-medium">Add Routine</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
  
        {/* Empty state hint */}
        {isMounted && routines.length === 0 && (
          <p className="text-sm text-neutral-500 text-center py-4 bg-neutral-900/20 rounded-xl border border-neutral-900">
            No routines yet — create one first, then assign it to a day.
          </p>
        )}
  
      </main>
  
      {/* Routine picker overlay */}
      {pickerDay && (
        <div className="fixed inset-0 z-50 items-end justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={closePicker}
          />
  
          {/* Sheet */}
          <div className="relative bg-neutral-950 border-t border-neutral-800 rounded-t-3xl px-6 pt-6 pb-10 max-w-md mx-auto w-full flex flex-col gap-5 max-h-[80vh] shadow-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white capitalize">
                Add to {pickerDay}
              </h2>
              <button
                onClick={closePicker}
                className="text-neutral-500 hover:text-neutral-300 transition-colors text-sm p-1 hover:cursor-pointer"
              >
                ✕
              </button>
            </div>
  
            {/* Search */}
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">⌕</span>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search routines..."
                autoFocus
                className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-700 transition-colors"
              />
            </div>
  
            {/* Results */}
            <div className="rounded-xl overflow-hidden border border-neutral-800 divide-y divide-neutral-900 overflow-y-auto bg-neutral-900/20">
              {filteredOptions.length === 0 ? (
                <p className="text-sm text-neutral-600 px-5 py-5 text-center">
                  No routines found.
                </p>
              ) : (
                filteredOptions.map((routine) => (
                  <RoutineTab
                    key={routine.id}
                    routine={routine}
                    onClick={(r) => assignRoutineToDay(r, pickerDay)}
                    compact
                  />
                ))
                )}
            </div>
          </div>
        </div>
      )}
  
      <BottomNav active="calendar" />
    </div>
  );
}