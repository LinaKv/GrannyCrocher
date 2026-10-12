import classNames from 'classnames';
import type { SavedCombination } from '../../../types';
import { GrannySquare } from '../../../components/GrannySquare';
import { useCardiganContext } from '../CardiganContext';

interface CardiganSquareSlotProps {
  slot: number;
  col: number;
  row: number;
  combination: SavedCombination | undefined;
  done: boolean;
  onClick: () => void;
}

export function CardiganSquareSlot({ slot, col, row, combination, done, onClick }: CardiganSquareSlotProps) {
  const { colorById } = useCardiganContext();

  return (
    <button
      type="button"
      onClick={onClick}
      style={{ gridColumn: col, gridRow: row }}
      aria-label={combination ? `Квадрат ${slot}` : `Квадрат ${slot} — выбрать комбинацию`}
      className={classNames('cardigan-square-slot', { 'cardigan-square-slot--empty': !combination })}
    >
      {combination ? (
        <GrannySquare
          rows={combination.rows.map((combinationRow, index) => ({
            id: `${combination.id}-${index}`,
            colorId: combinationRow.colorId,
          }))}
          colorById={colorById}
          fluid
        />
      ) : (
        <span className="cardigan-square-slot__placeholder" aria-hidden="true">
          +
        </span>
      )}

      {done && (
        <span className="cardigan-square-slot__done" aria-label="Связан" title="Связан">
          ✓
        </span>
      )}
    </button>
  );
}
