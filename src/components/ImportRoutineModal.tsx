import { useRef, useState } from 'react';
import { importRoutineFromFile, ImportResult } from '@/utils/routineSharing';

interface Props {
  onClose: () => void;
  onImported: () => void;
}

export default function ImportRoutineModal({ onClose, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setResult({ status: 'invalid' });
      return;
    }
    setLoading(true);
    const res = await importRoutineFromFile(file);
    setResult(res);
    setLoading(false);
    if (res.status === 'success') onImported();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handlePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-20 px-6">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-5">

        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">Import Routine</h3>
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-white transition-colors text-lg hover:cursor-pointer"
          >
            ✕
          </button>
        </div>

        {!result ? (
          <>
            {/* Drop zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => inputRef.current?.click()}
              className="border-2 border-dashed border-light rounded-2xl flex flex-col items-center justify-center gap-2 py-10 cursor-pointer transition-colors"
            >
              <span className="text-2xl text-light">+</span>
              <p className="text-sm font-medium text-white">Drop file or tap to browse</p>
              <p className="text-xs text-neutral-500">Import the .workout.json file</p>
            </div>

            <input
              ref={inputRef}
              type="file"
              accept=".json"
              onChange={handlePick}
              className="hidden"
            />

            {loading && (
              <p className="text-xs text-neutral-500 text-center">Importing...</p>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-4">
            {result.status === 'success' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">✅ Routine imported</p>
                <p className="text-xs text-neutral-400">
                  <span className="text-white">{result.routineName}</span> has been added to your routines.
                </p>
                {result.newExercises > 0 && (
                  <p className="text-xs text-neutral-500 mt-1">
                    {result.newExercises} custom exercise{result.newExercises > 1 ? 's' : ''} added to your library.
                  </p>
                )}
              </div>
            )}

            {result.status === 'duplicate' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">⚠️ Already in your library</p>
                <p className="text-xs text-neutral-400">
                  <span className="text-white">{result.routineName}</span> was skipped because you already have it.
                </p>
              </div>
            )}

            {result.status === 'invalid' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">❌ Invalid file</p>
                <p className="text-xs text-neutral-400">
                  This doesn't look like a valid .workout.json file. Make sure it was exported from the app.
                </p>
              </div>
            )}

            {result.status === 'error' && (
              <div className="flex flex-col gap-1">
                <p className="text-sm font-semibold text-white">❌ Something went wrong</p>
                <p className="text-xs text-neutral-400">{result.message}</p>
              </div>
            )}

            <div className="flex gap-2">
              {(result.status === 'invalid' || result.status === 'error' || result.status === 'duplicate') && (
                <button
                  onClick={() => setResult(null)}
                  className="flex-1 border border-neutral-700 text-white text-sm font-medium rounded-xl py-2.5 hover:bg-neutral-800 transition-colors hover:cursor-pointer"
                >
                  Try another
                </button>
              )}
              <button
                onClick={onClose}
                className="flex-1 bg-light text-black text-sm font-semibold rounded-xl py-2.5 hover:opacity-90 active:scale-95 transition-all hover:cursor-pointer"
              >
                {result.status === 'success' ? 'Done' : 'Close'}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}