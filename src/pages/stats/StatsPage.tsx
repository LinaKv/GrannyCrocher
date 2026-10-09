import { useMemo, useState } from 'react';
import classNames from 'classnames';
import { usePalette } from '../../hooks/usePalette';
import { PRIMARY_ROW_INDICES, usePrimaryColorValue } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { computeColorStats, type ColorStatsRow } from './colorStats';
import { ColorPercentageChart } from './components/ColorPercentageChart';
import { RowComparisonTab } from './components/RowComparisonTab';
import type { PaletteColor } from '../../types';

type View = 'overview' | 'rows';

export function StatsPage() {
  const [view, setView] = useState<View>('overview');
  const { palette } = usePalette();
  const [primaryColor] = usePrimaryColorValue();
  const { archivedColors } = useColorArchive();
  const { combinations } = useSavedCombinations();

  const colorById = useMemo(() => {
    const map = new Map<string, PaletteColor>(archivedColors.map((color) => [color.id, color]));
    for (const color of palette) {
      map.set(color.id, color);
    }
    if (primaryColor) {
      map.set(primaryColor.id, primaryColor);
    }
    return map;
  }, [palette, archivedColors, primaryColor]);

  const stats = useMemo(() => computeColorStats(combinations, colorById), [combinations, colorById]);

  const rowCount = stats.reduce((max, row) => Math.max(max, row.rowCounts.length), 0);
  const rowIndices = Array.from({ length: rowCount }, (_, index) => index);
  const columnCount = rowIndices.length + 2;

  // Primary color(s) always sit last, under their own subheading, regardless of percentage.
  const regularStats = stats.filter((row) => !row.isPrimary);
  const primaryStats = stats.filter((row) => row.isPrimary);
  const lockedRowIndices = new Set<number>(PRIMARY_ROW_INDICES);
  const freeRowIndices = rowIndices.filter((index) => !lockedRowIndices.has(index));

  function renderRow(row: ColorStatsRow) {
    return (
      <tr key={row.colorId} className={row.isPrimary ? 'stats-page__row--primary' : undefined}>
        <td className="stats-page__color-cell">
          <span className="stats-page__swatch" style={{ backgroundColor: row.hex }} />
          <span>{row.label}</span>
        </td>
        {rowIndices.map((index) =>
          row.isPrimary && !lockedRowIndices.has(index) ? (
            <td key={index}>—</td>
          ) : (
            <td key={index}>{row.rowCounts[index] ?? 0}</td>
          ),
        )}
        <td>{row.percentage.toFixed(1)}%</td>
      </tr>
    );
  }

  return (
    <div>
      <h1 className="stats-page__title">Статистика</h1>
      <p className="stats-page__subtitle">Использование цветов по всем сохранённым квадратам.</p>

      {stats.length === 0 ? (
        <p className="empty-state stats-page__empty">Пока нет сохранённых квадратов.</p>
      ) : (
        <>
          <div className="stats-page__tabs">
            <button
              type="button"
              onClick={() => setView('overview')}
              className={classNames('stats-page__tab', { 'stats-page__tab--active': view === 'overview' })}
            >
              Обзор
            </button>
            <button
              type="button"
              onClick={() => setView('rows')}
              className={classNames('stats-page__tab', { 'stats-page__tab--active': view === 'rows' })}
            >
              По рядам
            </button>
          </div>

          {view === 'overview' ? (
            <>
              <ColorPercentageChart rows={regularStats} />

              <div className="stats-page__table-wrapper">
                <table className="stats-page__table">
                  <thead>
                    <tr>
                      <th>Цвет</th>
                      {rowIndices.map((index) => (
                        <th key={index}>Ряд {index + 1}</th>
                      ))}
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {regularStats.map(renderRow)}
                    {primaryStats.length > 0 && (
                      <tr className="stats-page__section-row">
                        <td colSpan={columnCount}>Главный цвет</td>
                      </tr>
                    )}
                    {primaryStats.map(renderRow)}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <RowComparisonTab rows={regularStats} rowIndices={freeRowIndices} />
          )}
        </>
      )}
    </div>
  );
}
