import { MuscleGroup, RoutineExercise } from '@/types';

export const MAX_HEAT = 10;

export function getMuscleHeat(
  routine: RoutineExercise[]
): Record<MuscleGroup, number> {
  const heat = {
    trapezius: 0,
    'upper-back': 0,
    'lower-back': 0,
    chest: 0,
    biceps: 0,
    triceps: 0,
    forearm: 0,
    'back-deltoids': 0,
    'front-deltoids': 0,
    abs: 0,
    obliques: 0,
    adductor: 0,
    hamstring: 0,
    quadriceps: 0,
    abductors: 0,
    calves: 0,
    gluteal: 0,
    head: 0,
    neck: 0,
  } as Record<MuscleGroup, number>;

  for (const { exercise } of routine) {
    for (const muscle of exercise.muscles) {
      heat[muscle] = Math.min(heat[muscle] + 1, MAX_HEAT);
    }
  }

  return heat;
}