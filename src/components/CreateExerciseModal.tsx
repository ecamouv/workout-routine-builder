import { Exercise, ExerciseType, MuscleGroup } from '@/types';
import { useState } from 'react';
import Model, { IExerciseData, IMuscleStats } from 'react-body-highlighter';
import { BiSolidChevronDownSquare, BiChevronUpSquare } from 'react-icons/bi';


interface Props {
  onClose: () => void;
  onCreate: (exercise: Exercise) => void;
}

const AVAILABLE_MUSCLES: MuscleGroup[] = [
  'trapezius', 'upper-back', 'lower-back', 'chest', 'biceps',
  'triceps', 'forearm', 'back-deltoids', 'front-deltoids',
  'abs', 'obliques', 'adductor', 'hamstring', 'quadriceps',
  'abductors', 'calves', 'gluteal'
];

const MUSCLE_LABELS: Record<MuscleGroup, string> = {
  trapezius: 'Traps',
  'upper-back': 'Upper Back',
  'lower-back': 'Lower Back',
  chest: 'Chest',
  biceps: 'Biceps',
  triceps: 'Triceps',
  forearm: 'Forearms',
  'back-deltoids': 'Rear Delts',
  'front-deltoids': 'Front & Mid Delts',
  abs: 'Abs',
  obliques: 'Obliques',
  adductor: 'Adductors',
  hamstring: 'Hamstrings',
  quadriceps: 'Quads',
  abductors: 'Abductors',
  calves: 'Calves',
  gluteal: 'Glutes',
  head: 'Head',
  neck: 'Neck',
};

const EXERCISE_TYPES: ExerciseType[] = ['compound', 'isolation', 'cardio', 'stretching'];

const OPTION_BASE =
  'text-xs px-2 py-2 rounded-md border capitalize transition-all font-bold';
const OPTION_UNSELECTED =
  'bg-darkGreen text-white/60 border-light hover:bg-light/30';
const OPTION_SELECTED =
  'bg-light text-black border-darkGreen';

export default function CreateExerciseModal({ onClose, onCreate }: Props) {
  const [inputName, setInputName] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [selectedType, setSelectedType] = useState<ExerciseType>('compound');
  const [showBodyPicker, setShowBodyPicker] = useState(false);

  function handleMuscleToggle(muscle: MuscleGroup) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
  }

  // Drives the interactive body-map picker. Same state as the button grid,
  // so selecting either place updates both automatically.
  const bodyPickerData: IExerciseData[] =
    selectedMuscles.length > 0
      ? [{ name: 'selected', muscles: selectedMuscles, frequency: 1 }]
      : [];

  function handleBodyClick({ muscle }: IMuscleStats) {
    handleMuscleToggle(muscle as MuscleGroup);
  }

  function handleSubmit() {
    if (!inputName.trim()) return alert('Please enter an exercise name');
    if (selectedMuscles.length === 0) return alert('Select at least one muscle');

    const date = new Date().toISOString().split('T')[0];

    const exercise: Exercise = {
      id: `custom-${date}-${Date.now()}`,
      name: inputName.trim(),
      muscles: selectedMuscles,
      type: selectedType,
      isCustom: true,
    };

    onCreate(exercise);
  }

  return (
    <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-20 overflow-y-auto">
      <div className="bg-black text-white rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
        <h3 className="text-lg font-medium">Create exercise</h3>

        {/* Name */}
        <div>
          <label className="text-sm font-medium block mb-1">Exercise name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="e.g. Single arm tricep extension"
            className="w-full border-light border p-2 rounded-md text-sm bg-darkGreen text-white font-bold placeholder-white/60 focus:outline-none focus:bg-light/30 transition-colors"
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium block mb-2">Select type</label>
          <div className="flex gap-2 flex-wrap p-2 rounded-lg">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`${OPTION_BASE} ${selectedType === type ? OPTION_SELECTED : OPTION_UNSELECTED} hover:cursor-pointer`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Muscles */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Target muscles</label>
            <button
              type="button"
              onClick={() => setShowBodyPicker((v) => !v)}
              className="text-xs font-bold text-light/45 hover:text-light/80 underline-offset-2 transition-colors hover:cursor-pointer"
            >
              {showBodyPicker
                ? <BiChevronUpSquare className="text-[25px] shrink-0" />
                : <BiSolidChevronDownSquare className="text-light text-[25px] shrink-0" />
              }
            </button>
          </div>

          {showBodyPicker && (
            <div className=" border border-light/20 rounded-lg p-3 mb-2 flex flex-col items-center gap-2">

              <div className="flex gap-4 justify-center">
                <Model
                  data={bodyPickerData}
                  onClick={handleBodyClick}
                  style={{ width: '9rem' }}
                  type="anterior"
                />
                <Model
                  data={bodyPickerData}
                  onClick={handleBodyClick}
                  style={{ width: '9rem' }}
                  type="posterior"
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 p-2 rounded-lg">
            {AVAILABLE_MUSCLES.map((muscle) => {
              const isSelected = selectedMuscles.includes(muscle);
              return (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => handleMuscleToggle(muscle)}
                  className={`${OPTION_BASE} text-center hover:cursor-pointer ${isSelected ? OPTION_SELECTED : OPTION_UNSELECTED}`}
                >
                  {MUSCLE_LABELS[muscle]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border border-zinc-700 text-white rounded-md hover:bg-zinc-800 transition-colors hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-light text-black font-bold rounded-md border-2 border-black ring-2 ring-light/50 ring-offset-2 ring-offset-black hover:opacity-90 transition-all active:scale-95 hover:cursor-pointer"
          >
            Save exercise
          </button>
        </div>
      </div>
    </div>
  );
}