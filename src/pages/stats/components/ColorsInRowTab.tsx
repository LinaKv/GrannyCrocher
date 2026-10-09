import { useState } from 'react';
import classNames from 'classnames';
import { ColorsInRowChart } from './ColorsInRowChart';
import type { ColorStatsRow } from '../colorStats';

interface ColorsInRowTabProps {
  rows: ColorStatsRow[];
  rowIndices: number[];
}

export function ColorsInRowTab({ rows, rowIndices }: ColorsInRowTabProps) {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number>(rowIndices[0] ?? 0);

  const rowsForSelected = rows.filter((row) => (row.rowCounts[selectedRowIndex] ?? 0) > 0);
  const counts = rowsForSelected.map((row) => row.rowCounts[selectedRowIndex] ?? 0);
  const maxCount = counts.length > 0 ? Math.max(...counts) : 0;
  const minCount = counts.length > 0 ? Math.min(...counts) : 0;
  const maxGroup = rowsForSelected.filter((row) => (row.rowCounts[selectedRowIndex] ?? 0) === maxCount);
  const minGroup = rowsForSelected.filter((row) => (row.rowCounts[selectedRowIndex] ?? 0) === minCount);

  return (
    <div>
      <div className="stats-page__tabs">
        {rowIndices.map((index) => (
          <button
            key={index}
            type="button"
            onClick={() => setSelectedRowIndex(index)}
            className={classNames('stats-page__tab', { 'stats-page__tab--active': index === selectedRowIndex })}
          >
            Ряд {index + 1}
          </button>
        ))}
      </div>

      {rowsForSelected.length === 0 ? (
        <p className="empty-state stats-page__empty">В этом ряду пока нет окрашенных квадратов.</p>
      ) : (
        <>
          <ColorsInRowChart rows={rowsForSelected} rowIndex={selectedRowIndex} />

          <div className="stats-page__row-summary">
            {maxGroup.length <= 2 && <p>Больше всего в ряду: {maxGroup.map((row) => row.label).join(', ')}</p>}
            {minGroup.length <= 2 && <p>Меньше всего в ряду: {minGroup.map((row) => row.label).join(', ')}</p>}
          </div>
        </>
      )}
    </div>
  );
}
