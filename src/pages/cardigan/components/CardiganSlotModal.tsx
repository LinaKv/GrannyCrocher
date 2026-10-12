import { useState } from 'react';
import classNames from 'classnames';
import type { SavedCombination } from '../../../types';
import { GrannySquare } from '../../../components/GrannySquare';
import { ConfirmDeleteModal } from '../../../components/ConfirmDeleteModal';
import { useCardiganContext } from '../CardiganContext';

const CardiganSlotModalTab = {
  Free: 'free',
  Taken: 'taken',
} as const;

type CardiganSlotModalTab = (typeof CardiganSlotModalTab)[keyof typeof CardiganSlotModalTab];

interface CardiganSlotModalProps {
  slot: number;
  hasAssignment: boolean;
  onPick: (combinationId: string) => void;
  onClear: () => void;
  onClose: () => void;
}

export function CardiganSlotModal({ slot, hasAssignment, onPick, onClear, onClose }: CardiganSlotModalProps) {
  const { colorById, combinations, assignments } = useCardiganContext();
  const [tab, setTab] = useState<CardiganSlotModalTab>(CardiganSlotModalTab.Free);
  const [pendingMoveId, setPendingMoveId] = useState<string | null>(null);

  const freeCombinations = combinations.filter((combination) => !assignments.includes(combination.id));

  const takenCombinations = combinations.filter((combination) => {
    const assignedIndex = assignments.indexOf(combination.id);
    return assignedIndex !== -1 && assignedIndex !== slot - 1;
  });

  const pendingMoveCombination = pendingMoveId
    ? combinations.find((combination) => combination.id === pendingMoveId)
    : undefined;

  const activeCombinations = tab === CardiganSlotModalTab.Free ? freeCombinations : takenCombinations;

  function handleOptionClick(combination: SavedCombination) {
    if (tab === CardiganSlotModalTab.Taken) {
      setPendingMoveId(combination.id);
      return;
    }
    onPick(combination.id);
  }

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

        <div className="cardigan-slot-modal__tabs">
          <button
            type="button"
            onClick={() => setTab(CardiganSlotModalTab.Free)}
            className={classNames('cardigan-slot-modal__tab', {
              'cardigan-slot-modal__tab--active': tab === CardiganSlotModalTab.Free,
            })}
          >
            Свободные
          </button>
          <button
            type="button"
            onClick={() => setTab(CardiganSlotModalTab.Taken)}
            className={classNames('cardigan-slot-modal__tab', {
              'cardigan-slot-modal__tab--active': tab === CardiganSlotModalTab.Taken,
            })}
          >
            Занятые
          </button>
        </div>

        {activeCombinations.length === 0 ? (
          <p className="empty-state">
            {tab === CardiganSlotModalTab.Free
              ? 'Нет свободных сохранённых комбинаций.'
              : 'Нет квадратов в других слотах.'}
          </p>
        ) : (
          <div className="saved-combinations__grid cardigan-slot-modal__grid">
            {activeCombinations.map((combination) => (
              <button
                key={combination.id}
                type="button"
                onClick={() => handleOptionClick(combination)}
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

      {pendingMoveCombination && (
        <ConfirmDeleteModal
          title="Переместить квадрат?"
          description={`Квадрат №${pendingMoveCombination.number} уже используется в другом слоте кардигана. Он будет убран оттуда и добавлен в этот слот.`}
          confirmLabel="Переместить"
          onConfirm={() => {
            onPick(pendingMoveCombination.id);
            setPendingMoveId(null);
          }}
          onClose={() => setPendingMoveId(null)}
        />
      )}
    </div>
  );
}
