import { useRef, useState, type ChangeEvent } from 'react';
import { parseCombinationsFile, type CombinationsFile } from '../utils/combinationsFile';
import { ImportCombinationsModal } from './ImportCombinationsModal';

interface ImportCombinationsButtonProps {
  onImport: (data: CombinationsFile) => void;
}

export function ImportCombinationsButton({ onImport }: ImportCombinationsButtonProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [pendingData, setPendingData] = useState<CombinationsFile | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) {
      return;
    }

    try {
      const data = await parseCombinationsFile(file);
      setError(null);
      setPendingData(data);
    } catch {
      setPendingData(null);
      setError('Не удалось загрузить файл — проверьте, что это файл с комбинациями.');
    }
  }

  return (
    <div className="w-full lg:w-auto">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full lg:w-auto rounded-full bg-stone-100 px-3 py-2 lg:px-4 lg:py-2 text-base font-medium text-stone-700 hover:bg-stone-200"
      >
        Загрузить комбинации
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="hidden"
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

      {pendingData && (
        <ImportCombinationsModal
          onConfirm={() => {
            onImport(pendingData);
            setPendingData(null);
          }}
          onClose={() => setPendingData(null)}
        />
      )}
    </div>
  );
}
