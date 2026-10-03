import type { SavedCombination } from '../types';
import { GrannySquare } from './GrannySquare';

interface SquarePreviewProps {
  combination: SavedCombination;
  colorById: Map<string, string>;
  onRemove: (id: string) => void;
}

export function SquarePreview({ combination, colorById, onRemove }: SquarePreviewProps) {
  return (
    <div className="card square-preview">
      <GrannySquare
        rows={combination.rows.map((row, index) => ({
          id: `${combination.id}-${index}`,
          colorId: row.colorId,
        }))}
        colorById={colorById}
        fluid
      />
      <span className="square-preview__number">№{combination.number}</span>
      <button
        type="button"
        onClick={() => onRemove(combination.id)}
        aria-label="Удалить сохранённую комбинацию"
        className="remove-badge"
      >
        ×
      </button>
    </div>
  );
}
