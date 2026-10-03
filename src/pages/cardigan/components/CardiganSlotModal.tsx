import type { SavedCombination } from '../../../types';
import { GrannySquare } from '../../../components/GrannySquare';

interface CardiganSlotModalProps {
  slot: number;
  combinations: SavedCombination[];
  colorById: Map<string, string>;
  hasAssignment: boolean;
  onPick: (combinationId: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function CardiganSlotModal({
  slot,
  combinations,
  colorById,
  hasAssignment,
  onPick,
  onClear,
  onClose,
}: CardiganSlotModalProps) {
  return (
    <div className="modal">
      <div className="modal__panel">
        <div className="cardigan-slot-modal__header flex items-center justify-between">
          <h2 className="modal__title">Квадрат {slot}</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="cardigan-slot-modal__close">
            ×
          </button>
        </div>

        {hasAssignment && (
          <button
            type="button"
            onClick={onClear}
            className="button button--danger button--sm cardigan-slot-modal__clear"
          >
            × Убрать выбранный квадрат
          </button>
        )}

        {combinations.length === 0 ? (
          <p className="empty-state">Нет свободных сохранённых комбинаций.</p>
        ) : (
          <div className="saved-combinations__grid cardigan-slot-modal__grid">
            {combinations.map((combination) => (
              <button
                key={combination.id}
                type="button"
                onClick={() => onPick(combination.id)}
                className="card square-preview cardigan-slot-modal__option"
              >
                <GrannySquare
                  rows={combination.rows.map((row, index) => ({
                    id: `${combination.id}-${index}`,
                    colorId: row.colorId,
                  }))}
                  colorById={colorById}
                  fluid
                />
                <span className="square-preview__number">№{combination.number}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
