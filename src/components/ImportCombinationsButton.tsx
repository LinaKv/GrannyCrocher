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
    <div className="combinations-file-actions__button">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="button button--secondary button--lg combinations-file-actions__button"
      >
        Загрузить комбинации
      </button>
      <input
        ref={inputRef}
        type="file"
        accept=".json,application/json"
        onChange={handleFileChange}
        className="import-combinations-button__input"
      />
      {error && <p className="import-combinations-button__error">{error}</p>}

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
