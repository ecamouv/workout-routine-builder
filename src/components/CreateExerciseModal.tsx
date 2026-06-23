import { Exercise, ExerciseType, Intensity, MuscleGroup } from '@/types';
import { useState } from 'react';

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

const EXERCISE_TYPES: ExerciseType[] = ['compound', 'isolation', 'cardio', 'stretching'];
const INTENSITIES: Intensity[] = ['beginner', 'intermediate', 'advanced'];

export default function CreateExerciseModal({ onClose, onCreate }: Props) {
  const [inputName, setInputName] = useState('');
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [selectedType, setSelectedType] = useState<ExerciseType>('compound');
  const [selectedIntensity, setSelectedIntensity] = useState<Intensity>('beginner');

  function handleMuscleToggle(muscle: MuscleGroup) {
    setSelectedMuscles((prev) =>
      prev.includes(muscle)
        ? prev.filter((m) => m !== muscle)
        : [...prev, muscle]
    );
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
      intensity: selectedIntensity,
      isCustom: true,
    };

    onCreate(exercise);
  }
  return (

    <div className="fixed inset-0 bg-white/10 flex items-center justify-center z-20 overflow-y-auto">
      <div className="bg-black rounded-xl p-6 w-full max-w-md flex flex-col gap-4">
        <h3 className="text-lg font-medium">Create exercise</h3>

        {/* Name */}
        <div>
          <label className="text-sm font-medium block mb-1">Exercise name</label>
          <input
            type="text"
            value={inputName}
            onChange={(e) => setInputName(e.target.value)}
            placeholder="e.g. Single arm tricep extension"
            className="w-full border-light border p-2 rounded-md text-sm"
          />
        </div>

        {/* Type */}
        <div>
          <label className="text-sm font-medium block mb-2">Select type</label>
          <div className="flex gap-2 flex-wrap bg-light/20 p-2 rounded-lg">
            {EXERCISE_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setSelectedType(type)}
                className={`text-xs px-3 py-2 rounded-md border capitalize transition-all
    ${selectedType === type
                    ? 'bg-light text-black border-black'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Intensity */}
        <div>
          <label className="text-sm font-medium block mb-2">Select intensity</label>
          <div className="flex gap-2 bg-light/20 p-2 rounded-lg">
            {INTENSITIES.map((level) => (
              <button
                key={level}
                type="button"
                onClick={() => setSelectedIntensity(level)}
                className={`text-xs px-3 py-2 rounded-md border capitalize transition-all
    ${selectedIntensity === level
                    ? 'bg-light text-black border-black'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        {/* Muscles */}
        <div>
          <label className="text-sm font-medium block mb-2">Target muscles</label>
          <div className="grid grid-cols-3 gap-2 bg-light/20 p-2 rounded-lg">
            {AVAILABLE_MUSCLES.map((muscle) => {
              const isSelected = selectedMuscles.includes(muscle);
              return (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => handleMuscleToggle(muscle)}
                  className={`text-xs px-3 py-2 rounded-md border capitalize transition-all text-center
                    ${isSelected
                      ? 'bg-light text-black border-black'
                      : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                    }`}
                >
                  {muscle.replace(/-/g, ' ')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="text-sm px-4 py-2 border rounded-md hover:bg-gray-100 hover:text-black"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="text-sm px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800"
          >
            Save exercise
          </button>
        </div>
      </div>
    </div>
  );
}