import { useState } from 'react';
import { HeartSwatch } from '../../constructor/components/HeartSwatch';
import { RowComparisonChart } from './RowComparisonChart';
import type { ColorStatsRow } from '../colorStats';

interface RowComparisonTabProps {
  rows: ColorStatsRow[];
  rowIndices: number[];
}

export function RowComparisonTab({ rows, rowIndices }: RowComparisonTabProps) {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  function toggleColor(colorId: string) {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(colorId)) {
        next.delete(colorId);
      } else {
        next.add(colorId);
      }
      return next;
    });
  }

  const selectedRows = rows.filter((row) => selectedIds.has(row.colorId));

  return (
    <div>
      <div className="stats-page__color-picker">
        {rows.map((row) => (
          <HeartSwatch
            key={row.colorId}
            hex={row.hex}
            size={44}
            picked={selectedIds.has(row.colorId)}
            note={row.label}
            onClick={() => toggleColor(row.colorId)}
          />
        ))}
      </div>

      {selectedRows.length === 0 ? (
        <p className="empty-state stats-page__empty">Выберите хотя бы один цвет, чтобы увидеть график.</p>
      ) : (
        <RowComparisonChart rows={selectedRows} rowIndices={rowIndices} />
      )}
    </div>
  );
}
