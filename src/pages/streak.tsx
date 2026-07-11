import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Routine } from '@/types';
import BottomNav from '@/components/BottomNav';
import RoutineTab from '@/components/RoutineTab';

// ── Constants ────────────────────────────────────────────────────────────────

const DAY_ACRONYMS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

// ── Types ────────────────────────────────────────────────────────────────────

interface SessionLog {
  timestamp: number;
  routineId: string;
  routineName: string;
  logs: Record<string, { weight: number; unit: 'lb' | 'kg' }>;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

const toDateString = (date: Date) => date.toDateString();

const dayKey = (date: Date) =>
  `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

const weightKey = (exerciseId: string, dk: string) =>
  `workout-streak-weight-${dk}-${exerciseId}`;

const unitKey = (exerciseId: string, dk: string) =>
  `workout-streak-unit-${dk}-${exerciseId}`;

const convertWeight = (val: string, from: 'lb' | 'kg', to: 'lb' | 'kg'): string => {
  const num = parseFloat(val);
  if (isNaN(num)) return '';
  if (from === to) return val;
  const factor = to === 'kg' ? 0.453592 : 2.20462;
  return (Math.round(num * factor * 100) / 100).toString();
};

const getHistory = (): SessionLog[] => {
  const raw = localStorage.getItem('workout-routine-builder-history');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return []; }
};

const saveHistory = (history: SessionLog[]) => {
  history.sort((a, b) => a.timestamp - b.timestamp);
  localStorage.setItem('workout-routine-builder-history', JSON.stringify(history));
};

// ── DayCell ──────────────────────────────────────────────────────────────────

interface DayCellProps {
  date: Date;
  isToday: boolean;
  isFuture: boolean;
  isCurrentMonth: boolean;
  logged: boolean;
  onClick: () => void;
}

function DayCell({ date, isToday, isFuture, isCurrentMonth, logged, onClick }: DayCellProps) {
  return (
    <button
      onClick={isFuture ? undefined : onClick}
      disabled={isFuture}
      className={`flex flex-col items-center justify-between py-2.5 px-1 rounded-2xl border gap-1.5 w-full transition-colors
        ${isFuture
          ? 'opacity-30 cursor-default border-neutral-800 bg-neutral-900'
          : isToday
            ? 'bg-neutral-800 border-neutral-700 hover:bg-neutral-700 hover:cursor-pointer'
            : isCurrentMonth
              ? 'bg-neutral-900 border-neutral-800 hover:bg-neutral-800 hover:cursor-pointer'
              : 'bg-neutral-950 border-neutral-900 hover:bg-neutral-900 hover:cursor-pointer opacity-50'
        }`}
    >
      <span className="text-[9px] font-semibold text-neutral-500 uppercase leading-none">
        {DAY_ACRONYMS[date.getDay()]}
      </span>
      <span className={`text-xs font-bold leading-none ${isToday ? 'text-white' : 'text-neutral-400'}`}>
        {date.getDate()}
      </span>
      <div className={`w-1.5 h-1.5 rounded-full ${isFuture ? 'border border-neutral-700' : logged ? 'bg-light' : 'bg-red-500'
        }`} />
    </button>
  );
}

// ── RoutinePicker ─────────────────────────────────────────────────────────────

interface RoutinePickerProps {
  date: Date;
  routines: Routine[];
  onSelect: (routine: Routine) => void;
  onClose: () => void;
}

function RoutinePicker({ date, routines, onSelect, onClose }: RoutinePickerProps) {
  const [search, setSearch] = useState('');
  const filtered = routines.filter(r =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );
  const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center px-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md flex flex-col max-h-[80vh]">
        <div className="px-5 pt-5 pb-5 flex flex-col gap-4 overflow-hidden">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">Log a workout</p>
              <p className="text-xs text-neutral-500 mt-0.5">{label}</p>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg transition-colors hover:cursor-pointer">✕</button>
          </div>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 text-lg">⌕</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search routines..."
              className="w-full bg-neutral-800 border border-neutral-700 rounded-2xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-light transition-colors"
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-neutral-800 divide-y divide-neutral-800 overflow-y-auto">
            {filtered.length === 0
              ? <p className="text-sm text-neutral-600 px-5 py-5 text-center">No routines found.</p>
              : filtered.map(routine => (
                <RoutineTab key={routine.id} routine={routine} onClick={onSelect} compact />
              ))
            }
          </div>
        </div>
      </div>
    </div>
  );
}

// ── WorkoutLogger ─────────────────────────────────────────────────────────────

interface WorkoutLoggerProps {
  date: Date;
  routine: Routine;
  // If editing an existing session, pass its timestamp
  existingTimestamp?: number;
  onLogged: () => void;
  onBack: () => void;
}

function WorkoutLogger({ date, routine, existingTimestamp, onLogged, onBack }: WorkoutLoggerProps) {
  const dk = dayKey(date);
  const isEditing = existingTimestamp !== undefined;
  const [weights, setWeights] = useState<Record<string, string>>({});
  const [units, setUnits] = useState<Record<string, 'lb' | 'kg'>>({});
  const [globalUnit, setGlobalUnit] = useState<'lb' | 'kg'>('lb');

  useEffect(() => {
    const storedGlobal = localStorage.getItem(`workout-streak-global-unit-${dk}`);
    setGlobalUnit(storedGlobal === 'kg' ? 'kg' : 'lb');

    const w: Record<string, string> = {};
    const u: Record<string, 'lb' | 'kg'> = {};

    // If editing, seed from the existing session's logs first
    let existingLogs: Record<string, { weight: number; unit: 'lb' | 'kg' }> = {};
    if (isEditing) {
      const history = getHistory();
      const session = history.find(s => s.timestamp === existingTimestamp);
      if (session) existingLogs = session.logs;
    }

    routine.exercises.forEach(({ exercise }) => {
      if (isEditing && existingLogs[exercise.id]) {
        // Seed from existing session data
        w[exercise.id] = existingLogs[exercise.id].weight.toString();
        u[exercise.id] = existingLogs[exercise.id].unit;
      } else {
        // New session: day-specific → most recent active → empty
        w[exercise.id] =
          localStorage.getItem(weightKey(exercise.id, dk)) ||
          localStorage.getItem(`workout-active-weight-${exercise.id}`) ||
          '';
        const streakUnit = localStorage.getItem(unitKey(exercise.id, dk));
        const activeUnit = localStorage.getItem(`workout-active-unit-${exercise.id}`);
        u[exercise.id] = (streakUnit === 'kg' || (!streakUnit && activeUnit === 'kg') ? 'kg' : 'lb') as 'lb' | 'kg';
      }
    });

    setWeights(w);
    setUnits(u);
  }, []);

  const handleWeightChange = (exerciseId: string, value: string) => {
    setWeights(prev => ({ ...prev, [exerciseId]: value }));
    localStorage.setItem(weightKey(exerciseId, dk), value);
  };

  const handleUnitChange = (exerciseId: string) => {
    const cur = units[exerciseId] || 'lb';
    const next = cur === 'lb' ? 'kg' : 'lb';
    const converted = weights[exerciseId] ? convertWeight(weights[exerciseId], cur, next) : '';
    setUnits(prev => ({ ...prev, [exerciseId]: next }));
    setWeights(prev => ({ ...prev, [exerciseId]: converted }));
    localStorage.setItem(unitKey(exerciseId, dk), next);
    localStorage.setItem(weightKey(exerciseId, dk), converted);
  };

  const handleGlobalUnitChange = (next: 'lb' | 'kg') => {
    if (next === globalUnit) return;
    const nw = { ...weights };
    const nu = { ...units };
    routine.exercises.forEach(({ exercise }) => {
      const cur = units[exercise.id] || 'lb';
      if (cur !== next) {
        const converted = weights[exercise.id] ? convertWeight(weights[exercise.id], cur, next) : '';
        nw[exercise.id] = converted;
        nu[exercise.id] = next;
        localStorage.setItem(weightKey(exercise.id, dk), converted);
        localStorage.setItem(unitKey(exercise.id, dk), next);
      }
    });
    setGlobalUnit(next);
    setWeights(nw);
    setUnits(nu);
    localStorage.setItem(`workout-streak-global-unit-${dk}`, next);
  };

  const handleLog = () => {
    const logs: Record<string, { weight: number; unit: 'lb' | 'kg' }> = {};
    let hasInputs = false;

    routine.exercises.forEach(({ exercise }) => {
      const w = weights[exercise.id];
      const u = units[exercise.id] || 'lb';
      if (w && w !== '') {
        const num = parseFloat(w);
        if (!isNaN(num)) {
          logs[exercise.id] = { weight: num, unit: u };
          hasInputs = true;
        }
      }
    });

    if (!hasInputs) {
      alert('Please enter at least one weight to log this session.');
      return;
    }

    const history = getHistory();

    if (isEditing) {
      // Direct edit: find by timestamp and mutate in place
      const idx = history.findIndex(s => s.timestamp === existingTimestamp);
      if (idx !== -1) {
        // Merge: keep any exercise logs not in this routine, update the rest
        history[idx].logs = { ...history[idx].logs, ...logs };
        history[idx].routineName = routine.name;
      }
    } else {
      const ts = new Date(date);
      ts.setHours(12, 0, 0, 0);
      history.push({
        timestamp: ts.getTime(),
        routineId: routine.id,
        routineName: routine.name,
        logs,
      });
    }

    saveHistory(history);
    onLogged();
  };

  const dateLabel = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-zinc-400 hover:text-white transition-colors text-lg hover:cursor-pointer">←</button>
          <div>
            <h2 className="text-lg font-bold text-white">{routine.name}</h2>
            <p className="text-xs text-neutral-500">{dateLabel}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold text-white">Weight unit</span>
          <span className="text-xs text-neutral-500">Auto-saved per day</span>
        </div>
        <div className="flex bg-neutral-950 p-1 rounded-xl border border-neutral-700">
          {(['lb', 'kg'] as const).map(u => (
            <button key={u} onClick={() => handleGlobalUnitChange(u)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:cursor-pointer uppercase ${globalUnit === u ? 'bg-light text-black shadow' : 'text-neutral-400 hover:text-white'
                }`}>{u}</button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold text-neutral-500 uppercase tracking-widest px-1">Exercises</span>
        <ul className="flex flex-col gap-3">
          {routine.exercises.map(({ exercise }) => {
            const weightVal = weights[exercise.id] || '';
            const exUnit = units[exercise.id] || 'lb';
            return (
              <li key={exercise.id} className="flex items-center justify-between bg-neutral-900 border border-neutral-800 rounded-2xl px-5 py-4 gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{exercise.name}</p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                    <span className="inline-block bg-neutral-800 text-neutral-400 text-[10px] font-bold px-2 py-0.5 rounded capitalize">{exercise.type}</span>
                  </div>
                </div>
                <div className="flex items-center bg-neutral-800 border border-neutral-700 rounded-xl overflow-hidden px-2 py-1.5 w-[140px] justify-between">
                  <input
                    type="number" min="0" placeholder="0" value={weightVal}
                    onChange={e => handleWeightChange(exercise.id, e.target.value)}
                    className="bg-transparent w-full text-right focus:outline-none text-white text-sm font-medium pr-1.5"
                  />
                  <button onClick={() => handleUnitChange(exercise.id)}
                    className="bg-neutral-700 text-light text-[10px] font-bold px-2.5 py-1 rounded-lg hover:bg-neutral-600 transition-colors uppercase hover:cursor-pointer min-w-[34px]">
                    {exUnit}
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      <button onClick={handleLog}
        className="w-full bg-light text-black hover:opacity-90 active:scale-95 transition-all text-sm font-semibold rounded-2xl py-4 tracking-wide shadow-lg shadow-light/10 hover:cursor-pointer">
        {isEditing ? 'Resubmit Session' : 'Finish & Log Workout'}
      </button>
    </div>
  );
}

// ── DayOverlay ────────────────────────────────────────────────────────────────
// Shown when clicking a logged day: lists all sessions, allows editing or adding another

interface DayOverlayProps {
  date: Date;
  sessions: SessionLog[];
  routines: Routine[];
  onEditSession: (session: SessionLog) => void;
  onAddRoutine: () => void;
  onClose: () => void;
}

function DayOverlay({ date, sessions, routines, onEditSession, onAddRoutine, onClose }: DayOverlayProps) {
  const label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  return (
    <div className="fixed inset-0 bg-black/60 z-20 flex items-center justify-center px-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl w-full max-w-md flex flex-col max-h-[80vh] overflow-hidden">
        <div className="px-5 pt-5 pb-5 flex flex-col gap-4 overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base font-semibold text-white">{label}</p>
              <p className="text-xs text-neutral-500 mt-0.5">{sessions.length} session{sessions.length !== 1 ? 's' : ''} logged</p>
            </div>
            <button onClick={onClose} className="text-neutral-500 hover:text-white text-lg transition-colors hover:cursor-pointer">✕</button>
          </div>

          {/* Sessions list */}
          <div className="flex flex-col gap-2">
            {sessions.map((session) => {
              const routine = routines.find(r => r.id === session.routineId);
              const exerciseCount = Object.keys(session.logs).length;
              const time = new Date(session.timestamp).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
              return (
                <button
                  key={session.timestamp}
                  onClick={() => onEditSession(session)}
                  className="w-full flex items-center gap-4 px-4 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-2xl transition-colors text-left hover:cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-light/10 flex items-center justify-center text-light text-xs font-bold shrink-0">
                    {session.routineName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{session.routineName}</p>
                    <p className="text-xs text-neutral-500 mt-0.5">{exerciseCount} exercises · {time}</p>
                  </div>
                  {routine && <span className="text-neutral-500 text-xs">Edit ›</span>}
                </button>
              );
            })}
          </div>

          {/* Add another */}
          <button
            onClick={onAddRoutine}
            className="w-full border border-neutral-700 text-neutral-400 hover:text-white hover:border-neutral-500 text-sm font-medium rounded-2xl py-3 transition-colors hover:cursor-pointer"
          >
            + Add another routine
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────────────────────

type OverlayMode =
  | { type: 'none' }
  | { type: 'day'; date: Date; sessions: SessionLog[] }
  | { type: 'picker'; date: Date }
  | { type: 'logger'; date: Date; routine: Routine; existingTimestamp?: number };

export default function StreakPage() {
  const router = useRouter();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [loggedDays, setLoggedDays] = useState<Set<string>>(new Set());
  const [overlay, setOverlay] = useState<OverlayMode>({ type: 'none' });

  useEffect(() => {
    const raw = localStorage.getItem('workout-routine-builder-routines');
    if (raw) { try { setRoutines(JSON.parse(raw)); } catch { } }
    refreshLoggedDays();
  }, []);

  const refreshLoggedDays = () => {
    const history = getHistory();
    setLoggedDays(new Set(history.map(s => toDateString(new Date(s.timestamp)))));
  };

  const handleDayClick = (date: Date) => {
    const history = getHistory();
    const dateStr = toDateString(date);
    const sessions = history.filter(s => toDateString(new Date(s.timestamp)) === dateStr);

    if (sessions.length > 0) {
      setOverlay({ type: 'day', date, sessions });
    } else {
      setOverlay({ type: 'picker', date });
    }
  };

  const handleLogged = () => {
    refreshLoggedDays();
    setOverlay({ type: 'none' });
  };

  // Calendar grid
  const firstOfMonth = new Date(viewYear, viewMonth, 1);
  const lastOfMonth = new Date(viewYear, viewMonth + 1, 0);
  const gridStart = new Date(firstOfMonth);
  gridStart.setDate(gridStart.getDate() - gridStart.getDay());
  const gridEnd = new Date(lastOfMonth);
  gridEnd.setDate(gridEnd.getDate() + (6 - gridEnd.getDay()));

  const gridDays: Date[] = [];
  const cur = new Date(gridStart);
  while (cur <= gridEnd) {
    gridDays.push(new Date(cur));
    cur.setDate(cur.getDate() + 1);
  }

  const isFuture = (date: Date) => date > today;
  const isToday = (date: Date) => date.toDateString() === today.toDateString();
  const isCurrentMonth = (date: Date) => date.getMonth() === viewMonth;

  const goToPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
    else setViewMonth(m => m - 1);
  };

  const goToNextMonth = () => {
    const next = new Date(viewYear, viewMonth + 1, 1);
    if (next <= today) {
      if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
      else setViewMonth(m => m + 1);
    }
  };

  const isNextMonthFuture = () => new Date(viewYear, viewMonth + 1, 1) > today;

  // Streak count
  let streak = 0;
  const streakCur = new Date(today);
  while (loggedDays.has(streakCur.toDateString())) {
    streak++;
    streakCur.setDate(streakCur.getDate() - 1);
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white flex flex-col">
      <main className="flex-1 px-6 pt-16 pb-32 max-w-md mx-auto w-full flex flex-col gap-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Streak</h1>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-bold text-white">{streak}</span>
            <span className="text-[10px] text-neutral-500 uppercase tracking-widest">day streak</span>
          </div>
        </div>

        {/* Workout logger (full page, replaces calendar) */}
        {overlay.type === 'logger' ? (
          <WorkoutLogger
            date={overlay.date}
            routine={overlay.routine}
            existingTimestamp={overlay.existingTimestamp}
            onLogged={handleLogged}
            onBack={() => {
              // If editing go back to day overlay, if new go back to picker
              if (overlay.existingTimestamp !== undefined) {
                const history = getHistory();
                const dateStr = toDateString(overlay.date);
                const sessions = history.filter(s => toDateString(new Date(s.timestamp)) === dateStr);
                setOverlay({ type: 'day', date: overlay.date, sessions });
              } else {
                setOverlay({ type: 'picker', date: overlay.date });
              }
            }}
          />
        ) : (
          <>
            {/* Month nav */}
            <div className="flex items-center justify-between px-1">
              <button onClick={goToPrevMonth} className="text-neutral-400 hover:text-white transition-colors text-lg px-2 hover:cursor-pointer">‹</button>
              <span className="text-sm font-semibold text-white">{MONTH_NAMES[viewMonth]} {viewYear}</span>
              <button onClick={goToNextMonth} disabled={isNextMonthFuture()}
                className="text-neutral-400 hover:text-white transition-colors text-lg px-2 hover:cursor-pointer disabled:opacity-30 disabled:cursor-default">›</button>
            </div>

            {/* Calendar */}
            <div className="grid grid-cols-7 gap-1.5">
              {DAY_ACRONYMS.map(d => (
                <div key={d} className="text-center text-[9px] font-semibold text-neutral-600 uppercase py-1">{d}</div>
              ))}
              {gridDays.map((date, i) => (
                <DayCell
                  key={i}
                  date={date}
                  isToday={isToday(date)}
                  isFuture={isFuture(date)}
                  isCurrentMonth={isCurrentMonth(date)}
                  logged={loggedDays.has(date.toDateString())}
                  onClick={() => handleDayClick(date)}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 px-1">
              {[
                { color: 'bg-light', label: 'Logged' },
                { color: 'bg-red-500', label: 'Missed' },
              ].map(({ color, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-[10px] text-neutral-500">{label}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Day overlay — existing sessions */}
      {overlay.type === 'day' && (
        <DayOverlay
          date={overlay.date}
          sessions={overlay.sessions}
          routines={routines}
          onEditSession={(session) => {
            const routine = routines.find(r => r.id === session.routineId);
            if (!routine) return;
            setOverlay({ type: 'logger', date: overlay.date, routine, existingTimestamp: session.timestamp });
          }}
          onAddRoutine={() => setOverlay({ type: 'picker', date: overlay.date })}
          onClose={() => setOverlay({ type: 'none' })}
        />
      )}

      {/* Routine picker overlay */}
      {overlay.type === 'picker' && (
        <RoutinePicker
          date={overlay.date}
          routines={routines}
          onSelect={routine => setOverlay({ type: 'logger', date: overlay.date, routine })}
          onClose={() => setOverlay({ type: 'none' })}
        />
      )}

      <BottomNav active="stats" />
    </div>
  );
}