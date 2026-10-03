import type { CombinationsFile } from '../utils/combinationsFile';
import { ImportCombinationsButton } from './ImportCombinationsButton';

interface CombinationsFileActionsProps {
  onImport: (data: CombinationsFile) => void;
  onExport: () => void;
}

export function CombinationsFileActions({ onImport, onExport }: CombinationsFileActionsProps) {
  return (
    <div className="combinations-file-actions">
      <ImportCombinationsButton onImport={onImport} />
      <button
        type="button"
        onClick={onExport}
        className="button button--secondary button--lg combinations-file-actions__button"
      >
        Сохранить комбинации
      </button>
    </div>
  );
}
