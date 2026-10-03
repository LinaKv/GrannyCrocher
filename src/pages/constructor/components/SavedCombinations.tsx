import { useState } from 'react';
import type { SavedCombination } from '../../../types';
import { SquarePreview } from '../../../components/SquarePreview';
import { ConfirmDeleteModal } from '../../../components/ConfirmDeleteModal';

interface SavedCombinationsProps {
  combinations: SavedCombination[];
  colorById: Map<string, string>;
  onRemove: (id: string) => void;
}

export function SavedCombinations({ combinations, colorById, onRemove }: SavedCombinationsProps) {
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);

  return (
    <div>
      <p className="section-label">Сохранённые комбинации {combinations.length}/16</p>

      {combinations.length === 0 ? (
        <p className="empty-state">Пока нет сохранённых комбинаций.</p>
      ) : (
        <div className="saved-combinations__grid">
          {combinations.map((combination) => (
            <SquarePreview
              key={combination.id}
              combination={combination}
              colorById={colorById}
              onRemove={setPendingRemoveId}
            />
          ))}
        </div>
      )}

      {pendingRemoveId && (
        <ConfirmDeleteModal
          title="Удалить квадрат?"
          description="Эта раскраска будет удалена. Это действие нельзя отменить."
          onConfirm={() => {
            onRemove(pendingRemoveId);
            setPendingRemoveId(null);
          }}
          onClose={() => setPendingRemoveId(null)}
        />
      )}
    </div>
  );
}
