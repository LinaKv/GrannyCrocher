import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { usePalette } from '../../hooks/usePalette';
import { usePrimaryColorValue } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { useCrochetProgress } from '../../hooks/useCrochetProgress';
import { useCardiganLayout } from '../../hooks/useCardiganLayout';
import { CardiganSquareSlot } from './components/CardiganSquareSlot';
import { CardiganSlotModal } from './components/CardiganSlotModal';
import { CardiganContext } from './CardiganContext';
import {
  CARDIGAN_VIEWS,
  CARDIGAN_VIEW_ORDER,
  SEAM_TRACK_WIDTH,
  toGridColumn,
  type CardiganViewKey,
} from './layouts';

export function CardiganPage() {
  const [view, setView] = useState<CardiganViewKey>('general');
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  const { palette } = usePalette();
  const [primaryColor] = usePrimaryColorValue();
  const { archivedColors } = useColorArchive();
  const { combinations } = useSavedCombinations();
  const { progress } = useCrochetProgress();
  const { assignments, assign } = useCardiganLayout();

  const colorById = useMemo(() => {
    const map = new Map(archivedColors.map((color) => [color.id, color.hex]));
    for (const color of palette) {
      map.set(color.id, color.hex);
    }
    if (primaryColor) {
      map.set(primaryColor.id, primaryColor.hex);
    }
    return map;
  }, [palette, archivedColors, primaryColor]);

  const combinationById = useMemo(
    () => new Map(combinations.map((combination) => [combination.id, combination])),
    [combinations],
  );

  const seamColor = primaryColor ? colorById.get(primaryColor.id) : undefined;
  const activeView = CARDIGAN_VIEWS[view];

  const contextValue = ({ colorById, combinations, assignments }
  );

  function handlePick(combinationId: string) {
    if (openSlot !== null) {
      assign(openSlot, combinationId);
    }
    setOpenSlot(null);
  }

  function handleClear() {
    if (openSlot !== null) {
      assign(openSlot, null);
    }
    setOpenSlot(null);
  }

  return (
    <CardiganContext.Provider value={contextValue}>
      <div className="cardigan-page">
        <h1 className="cardigan-page__title">Кардиган</h1>

        <div className="cardigan-page__tabs">
          {CARDIGAN_VIEW_ORDER.map((key) => (
            <button
              type="button"
              key={key}
              onClick={() => setView(key)}
              className={classNames('cardigan-page__tab', { 'cardigan-page__tab--active': view === key })}
            >
              {CARDIGAN_VIEWS[key].label}
            </button>
          ))}
        </div>

        <div className="cardigan-page__diagram">
          <div
            className="cardigan-page__canvas"
            style={{ aspectRatio: `${activeView.columns + SEAM_TRACK_WIDTH} / ${activeView.rows}` }}
          >
            <div
              className="cardigan-page__grid"
              style={{
                gridTemplateColumns: `repeat(2, 1fr) ${SEAM_TRACK_WIDTH}fr repeat(2, 1fr)`,
                gridTemplateRows: `repeat(${activeView.rows}, 1fr)`,
              }}
            >
              {activeView.seam && seamColor && (
                <span
                  className="cardigan-page__seam"
                  style={{
                    gridColumn: 3,
                    gridRow: `1 / span ${activeView.seam.rows}`,
                    background: seamColor,
                  }}
                />
              )}

              {activeView.positions.map(({ slot, col, row }) => {
                const combinationId = assignments[slot - 1];
                const combination = combinationId ? combinationById.get(combinationId) : undefined;
                const done = combinationId ? (progress[combinationId]?.done ?? false) : false;

                return (
                  <CardiganSquareSlot
                    key={slot}
                    slot={slot}
                    col={toGridColumn(col)}
                    row={row}
                    combination={combination}
                    done={done}
                    onClick={() => setOpenSlot(slot)}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {openSlot !== null && (
          <CardiganSlotModal
            slot={openSlot}
            hasAssignment={assignments[openSlot - 1] !== null}
            onPick={handlePick}
            onClear={handleClear}
            onClose={() => setOpenSlot(null)}
          />
        )}
      </div>
    </CardiganContext.Provider>
  );
}
