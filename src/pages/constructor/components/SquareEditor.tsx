import { useMemo, useState, type MouseEvent } from 'react';
import type { PaletteColor, SquareRow } from '../../../types';
import { PRIMARY_ROW_INDICES } from '../../../hooks/usePrimaryColor';
import { ColorPickerPopover } from './ColorPickerPopover';
import { GrannySquare } from '../../../components/GrannySquare';

interface ColorPickerState {
  rowId: string;
  previewColorId: string | null;
  x: number;
  y: number;
}

const PRIMARY_ROW_INDICES_SET = new Set<number>(PRIMARY_ROW_INDICES);

interface SquareEditorProps {
  rows: SquareRow[];
  setRowColor: (rowId: string, colorId: string | null) => void;
  palette: PaletteColor[];
  colorById: Map<string, string>;
}

export function SquareEditor({ rows, setRowColor, palette, colorById }: SquareEditorProps) {
  const [colorPicker, setColorPicker] = useState<ColorPickerState | null>(null);

  const activeRowId = colorPicker?.rowId ?? null;

  // While the color picker is open, the target row shows a live preview
  // instead of its committed color.
  const displayRows = useMemo(() => {
    if (!colorPicker) {
      return rows;
    }
    return rows.map((row) =>
      row.id === colorPicker.rowId ? { ...row, colorId: colorPicker.previewColorId } : row,
    );
  }, [rows, colorPicker]);

  const usedColorIds = colorPicker
    ? new Set(
        rows.flatMap((row) =>
          row.id !== colorPicker.rowId && row.colorId !== null ? [row.colorId] : [],
        ),
      )
    : new Set<string>();

  function handleRowClick(rowId: string, event: MouseEvent<SVGPathElement>) {
    const row = rows.find((candidate) => candidate.id === rowId);
    setColorPicker({ rowId, previewColorId: row?.colorId ?? null, x: event.clientX, y: event.clientY });
  }

  function handleSaveColor() {
    if (colorPicker) {
      setRowColor(colorPicker.rowId, colorPicker.previewColorId);
    }
    setColorPicker(null);
  }

  return (
    <div className="constructor-page__square-column">
      <GrannySquare
        rows={displayRows}
        colorById={colorById}
        fluid
        activeRowId={activeRowId}
        lockedRowIndices={PRIMARY_ROW_INDICES_SET}
        onRowClick={handleRowClick}
      />

      {colorPicker && (
        <ColorPickerPopover
          x={colorPicker.x}
          y={colorPicker.y}
          palette={palette}
          selectedColorId={colorPicker.previewColorId}
          usedColorIds={usedColorIds}
          onPreview={(colorId) => setColorPicker({ ...colorPicker, previewColorId: colorId })}
          onSave={handleSaveColor}
          onClose={() => setColorPicker(null)}
        />
      )}
    </div>
  );
}
