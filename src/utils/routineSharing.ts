import { Exercise, Routine } from '@/types';

export interface RoutineShareFile {
  version: 1;
  routine: Routine;
  customExercises: Exercise[];
}

// ── Export ──────────────────────────────────────────────────────────────────

export function exportRoutine(routine: Routine): void {
  // Collect any custom exercises referenced by this routine
  const storedCustom = localStorage.getItem('workout-routine-builder-exercises');
  const allCustom: Exercise[] = storedCustom ? JSON.parse(storedCustom) : [];
  const customIds = new Set(allCustom.map(e => e.id));

  const referencedCustom = routine.exercises
    .map(({ exercise }) => exercise)
    .filter(e => customIds.has(e.id));

  const payload: RoutineShareFile = {
    version: 1,
    routine,
    customExercises: referencedCustom,
  };

  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${routine.name.replace(/\s+/g, '-').toLowerCase()}.workout.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// ── Import ──────────────────────────────────────────────────────────────────

export type ImportResult =
  | { status: 'success'; routineName: string; newExercises: number }
  | { status: 'duplicate'; routineName: string }
  | { status: 'invalid' }
  | { status: 'error'; message: string };

function isValidShareFile(obj: unknown): obj is RoutineShareFile {
  if (typeof obj !== 'object' || obj === null) return false;
  const f = obj as Record<string, unknown>;
  if (f.version !== 1) return false;
  if (typeof f.routine !== 'object' || f.routine === null) return false;
  const r = f.routine as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.name !== 'string') return false;
  if (!Array.isArray(r.exercises)) return false;
  if (!Array.isArray(f.customExercises)) return false;
  return true;
}

export function importRoutineFromFile(file: File): Promise<ImportResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const raw = JSON.parse(e.target?.result as string);

        if (!isValidShareFile(raw)) {
          return resolve({ status: 'invalid' });
        }

        const { routine, customExercises } = raw;

        // Check for duplicate routine by ID
        const storedRoutines: Routine[] = JSON.parse(
          localStorage.getItem('workout-routine-builder-routines') || '[]'
        );
        const isDuplicate = storedRoutines.some(r => r.id === routine.id);
        if (isDuplicate) {
          return resolve({ status: 'duplicate', routineName: routine.name });
        }

        // Merge custom exercises — skip any that already exist by ID
        const storedCustom: Exercise[] = JSON.parse(
          localStorage.getItem('workout-routine-builder-exercises') || '[]'
        );
        const existingCustomIds = new Set(storedCustom.map(e => e.id));
        const newCustom = customExercises.filter((e: Exercise) => !existingCustomIds.has(e.id));
        const mergedCustom = [...storedCustom, ...newCustom];

        // Give the routine a fresh updatedAt so it surfaces at the top
        const importedRoutine: Routine = {
          ...routine,
          updatedAt: Date.now(),
        };

        const mergedRoutines = [...storedRoutines, importedRoutine];

        localStorage.setItem('workout-routine-builder-routines', JSON.stringify(mergedRoutines));
        localStorage.setItem('workout-routine-builder-exercises', JSON.stringify(mergedCustom));

        resolve({
          status: 'success',
          routineName: routine.name,
          newExercises: newCustom.length,
        });
      } catch {
        resolve({ status: 'error', message: 'Failed to read file.' });
      }
    };

    reader.onerror = () => resolve({ status: 'error', message: 'Could not open file.' });
    reader.readAsText(file);
  });
}