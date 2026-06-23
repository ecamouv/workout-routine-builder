import { Routine } from '@/types';

interface RoutineTabProps {
  routine: Routine;
  onClick: (routine: Routine) => void;
  compact?: boolean;
}

export default function RoutineTab({ routine, onClick, compact = false }: RoutineTabProps) {
  const exerciseCount = routine.exercises.length;
  return (
    <button
      key={routine.id}
      onClick={() => onClick(routine)}
      className={`w-full flex items-center gap-4 text-left hover:cursor-pointer transition-colors
      ${compact
          ? 'px-4 py-3.5 bg-neutral-900/40 hover:bg-neutral-900'
          : 'px-5 py-4 bg-neutral-900 hover:bg-neutral-800'
        }`}    >
      <div className={`rounded-full flex items-center justify-center text-xs font-bold shrink-0
        ${compact
          ? 'w-8 h-8 bg-light/10 text-light'
          : 'w-9 h-9 bg-light/10 text-light'
        }`}>     
        {routine.name.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white truncate">{routine.name}</p>
        <p className="text-xs text-neutral-500 mt-0.5">
          {exerciseCount} {compact && exerciseCount === 1 ? 'exercise' : 'exercises'}
        </p>
      </div>
      <span className="text-neutral-600 text-lg font-light">›</span>
    </button>
  );
}
