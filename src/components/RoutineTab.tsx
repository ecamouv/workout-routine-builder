import { Routine } from '@/types';

interface RoutineTabProps {
  routine: Routine;
  onClick: (routine: Routine) => void;
  compact?: boolean;
  highlight?: boolean;
}

export default function RoutineTab({ routine, onClick, compact = false, highlight = false }: RoutineTabProps) {
  const exerciseCount = routine.exercises.length;
  return (
    <button
      key={routine.id}
      onClick={() => onClick(routine)}
      className={`w-full flex items-center gap-4 text-left hover:cursor-pointer transition-colors
      ${highlight
          ? 'px-5 py-4 bg-light hover:bg-light/90 '
          : compact
            ? 'px-4 py-3.5 bg-neutral-900/40 hover:bg-neutral-900'
            : 'px-5 py-4 bg-neutral-900 hover:bg-neutral-800'
        }`}
    >
      <div className={`rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${highlight
          ? 'w-9 h-9 bg-black text-light '
          : compact
            ? 'w-8 h-8 bg-light/10 text-light'
            : 'w-9 h-9 bg-light/10 text-light'
        }`}>
        {routine.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm truncate ${highlight ? 'text-black font-bold' : 'text-white font-semibold'}`}>
          {routine.name}
        </p>
        <p className={`text-xs mt-0.5 ${highlight ? 'text-black/60' : 'text-neutral-500'}`}>
          {exerciseCount} {exerciseCount === 1 ? 'exercise' : 'exercises'}
        </p>
      </div>
      <span className={`text-lg font-light ${highlight ? 'text-black/40' : 'text-neutral-600'}`}>›</span>
    </button>
  );
}