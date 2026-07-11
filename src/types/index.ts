export type MuscleGroup =
  | 'trapezius'
  | 'upper-back'
  | 'lower-back'
  | 'chest'
  | 'biceps'
  | 'triceps'
  | 'forearm'
  | 'back-deltoids'
  | 'front-deltoids'
  | 'abs'
  | 'obliques'
  | 'adductor'
  | 'hamstring'
  | 'quadriceps'
  | 'abductors'
  | 'calves'
  | 'gluteal'
  | 'head'
  | 'neck';

export type ExerciseType =
  | 'compound'
  | 'isolation'
  | 'cardio'
  | 'stretching';

export interface Exercise {
  id: string;
  name: string;
  muscles: MuscleGroup[];
  type: ExerciseType;
  isCustom?: boolean;
}

export interface RoutineExercise {
  instanceId: string;
  exercise: Exercise;
}

export interface Routine {
  id: string;
  name: string;
  exercises: RoutineExercise[];
  updatedAt?: number;
}

export interface RoutineAssignment {
  id: string;
  routineId: string;
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
}
