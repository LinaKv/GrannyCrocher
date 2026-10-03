import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { GrannySquare } from '../../components/GrannySquare';
import { HeartSwatch } from '../constructor/components/HeartSwatch';
import { usePalette } from '../../hooks/usePalette';
import { usePrimaryColorValue } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { useCrochetProgress } from '../../hooks/useCrochetProgress';
import type { PaletteColor } from '../../types';

export function KnitSquarePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { palette } = usePalette();
  const [primaryColor] = usePrimaryColorValue();
  const { archivedColors } = useColorArchive();
  const { combinations } = useSavedCombinations();
  const { getProgress, revealNextRow, revealPreviousRow, setDone } = useCrochetProgress();

  const combination = combinations.find((item) => item.id === id);

  useEffect(() => {
    if (!combination) {
      navigate('/croching', { replace: true });
    }
  }, [combination, navigate]);

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

  const paletteById = useMemo(() => {
    const map = new Map<string, PaletteColor>(archivedColors.map((color) => [color.id, color]));
    for (const color of palette) {
      map.set(color.id, color);
    }
    if (primaryColor) {
      map.set(primaryColor.id, primaryColor);
    }
    return map;
  }, [palette, archivedColors, primaryColor]);

  if (!combination) {
    return null;
  }

  const rowCount = combination.rows.length;
  const progress = getProgress(combination.id);
  const rows = combination.rows.map((row, index) => ({
    id: `${combination.id}-${index}`,
    colorId: row.colorId,
  }));

  const close = () => navigate('/croching');

  if (progress.done) {
    return (
      <div className="knit-square-page">
        <div className="knit-square-page__preview">
          <GrannySquare rows={rows} colorById={colorById} fluid />
        </div>
        <div className="knit-square-page__controls">
          <button type="button" onClick={close} className="button button--lg button--secondary">
            Закрыть
          </button>
        </div>
      </div>
    );
  }

  const revealedRows = progress.revealedRows;
  const started = revealedRows > 0;
  const finished = revealedRows >= rowCount;
  const currentColor = started ? paletteById.get(combination.rows[revealedRows - 1]?.colorId ?? '') : undefined;

  function handlePrimaryAction() {
    if (!combination) {
      return;
    }
    if (finished) {
      setDone(combination.id, true);
      navigate('/croching');
      return;
    }
    revealNextRow(combination.id, rowCount);
  }

  function handleBack() {
    if (!combination) {
      return;
    }
    revealPreviousRow(combination.id);
  }

  return (
    <div className="knit-square-page">
      <div className="knit-square-page__preview">
        <GrannySquare
          rows={rows}
          colorById={colorById}
          fluid
          visibleRowCount={started ? revealedRows : rowCount}
        />
      </div>

      <div className="knit-square-page__controls">
        {started && (
          <>
            <p className="knit-square-page__row-progress">
              Ряд {revealedRows} из {rowCount}
              {!finished && <> · осталось {rowCount - revealedRows}</>}
            </p>
            <p className="knit-square-page__current-color">
              Текущий цвет:
              {currentColor ? (
                <HeartSwatch hex={currentColor.hex} code={currentColor.code} size={32} />
              ) : (
                ' —'
              )}
            </p>
          </>
        )}

        <div className="knit-square-page__actions">
          <div className="knit-square-page__step-actions">
            {started && (
              <button
                type="button"
                onClick={handleBack}
                disabled={revealedRows <= 1}
                className="button button--lg button--secondary"
              >
                Назад
              </button>
            )}
            <button type="button" onClick={handlePrimaryAction} className="button button--lg button--primary">
              {!started ? 'Начать вязать' : finished ? 'Квадрат связан' : 'Дальше'}
            </button>
          </div>
          <button type="button" onClick={close} className="button button--lg button--secondary">
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}
