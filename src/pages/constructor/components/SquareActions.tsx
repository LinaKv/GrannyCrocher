import { useState } from 'react';
import type { SquareRow } from '../../../types';
import { PRIMARY_ROW_INDICES } from '../../../hooks/usePrimaryColor';
import { ResetColorsModal } from './ResetColorsModal';

const PRIMARY_ROW_INDICES_SET = new Set<number>(PRIMARY_ROW_INDICES);

interface SquareActionsProps {
  rows: SquareRow[];
  resetColors: (preserveIds: Set<string>) => void;
  onSaveCombination: (rows: SquareRow[]) => void;
}

// Separated from ColorActionsPanel on purpose — this is the part that must
// always stay visible next to the square without scrolling; "Основной
// цвет"/"Палитра" are allowed to scroll out of view, this isn't.
export function SquareActions({ rows, resetColors, onSaveCombination }: SquareActionsProps) {
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const hasAssignedColors = rows.some(
    (row, index) => !PRIMARY_ROW_INDICES_SET.has(index) && row.colorId !== null,
  );

  function handleResetColors() {
    const preserveIds = new Set(
      PRIMARY_ROW_INDICES.map((index) => rows[index]?.id).filter((id): id is string => id !== undefined),
    );
    resetColors(preserveIds);
    setIsResetModalOpen(false);
  }

  return (
    <div className="constructor-page__square-actions">
      <button
        type="button"
        onClick={() => onSaveCombination(rows)}
        className="constructor-page__action-button button button--primary button--lg"
      >
        Сохранить
      </button>
      <button
        type="button"
        onClick={() => setIsResetModalOpen(true)}
        disabled={!hasAssignedColors}
        className="constructor-page__action-button button button--danger button--lg"
      >
        Сбросить
      </button>

      {isResetModalOpen && (
        <ResetColorsModal onConfirm={handleResetColors} onClose={() => setIsResetModalOpen(false)} />
      )}
    </div>
  );
}
