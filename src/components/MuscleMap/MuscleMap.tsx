import Model, { IExerciseData } from 'react-body-highlighter';
import { MuscleGroup, RoutineExercise } from '@/types';
import { getMuscleHeat } from '@/utils/muscleHeat';

interface Props {
  routine: RoutineExercise[];
}

export default function MuscleMap({ routine }: Props) {
  const heat = getMuscleHeat(routine);

  const data: IExerciseData[] = (Object.keys(heat) as MuscleGroup[])
    .filter((muscle) => heat[muscle] > 0)
    .map((muscle) => ({
      name: muscle,
      muscles: [muscle],
      frequency: heat[muscle],
    }));

  return (
    <div className="flex gap-4 justify-center">
      <Model
        data={data}
        style={{ width: '14rem' }}
        type="anterior"
      />
      <Model
        data={data}
        style={{ width: '14rem' }}
        type="posterior"
      />
    </div>
  );
}
