import { useMemo, useState, type MouseEvent } from 'react';
import { ColorPickerPopover } from './components/ColorPickerPopover';
import { GrannySquare } from './components/GrannySquare';
import { Palette } from './components/Palette';
import { RowContextMenu } from './components/RowContextMenu';
import { SavedCombinations } from './components/SavedCombinations';
import { usePalette } from './hooks/usePalette';
import { useSavedCombinations } from './hooks/useSavedCombinations';
import { useWorkingSquare } from './hooks/useWorkingSquare';

interface ContextMenuState {
  rowId: string;
  x: number;
  y: number;
}

interface ColorPickerState {
  rowId: string;
  previewColorId: string | null;
  x: number;
  y: number;
}

export default function App() {
  const { palette, addColor, addLibraryColors, removeColor } = usePalette();
  const { rows, addRow, removeRow, setRowColor } = useWorkingSquare();
  const { combinations, save, remove: removeCombination } = useSavedCombinations();

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [colorPicker, setColorPicker] = useState<ColorPickerState | null>(null);

  const colorById = useMemo(() => new Map(palette.map((color) => [color.id, color.hex])), [palette]);

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

  function handleRowClick(rowId: string, event: MouseEvent<SVGPathElement>) {
    setContextMenu({ rowId, x: event.clientX, y: event.clientY });
  }

  function handleDeleteRow() {
    if (contextMenu) {
      removeRow(contextMenu.rowId);
    }
    setContextMenu(null);
  }

  function handleOpenColorPicker() {
    if (!contextMenu) {
      return;
    }
    const row = rows.find((candidate) => candidate.id === contextMenu.rowId);
    setColorPicker({
      rowId: contextMenu.rowId,
      previewColorId: row?.colorId ?? null,
      x: contextMenu.x,
      y: contextMenu.y,
    });
    setContextMenu(null);
  }

  function handleSaveColor() {
    if (colorPicker) {
      setRowColor(colorPicker.rowId, colorPicker.previewColorId);
    }
    setColorPicker(null);
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-6 py-10 text-stone-800">
      <div className="mx-auto flex max-w-4xl flex-col gap-10">
        <header>
          <h1 className="text-2xl font-semibold text-stone-800">Бабушкин квадрат</h1>
          <p className="text-sm text-stone-500">Собери ряды и подбери для них цвета из своей палитры.</p>
        </header>

        <div className="flex flex-col-reverse gap-8 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-col items-start gap-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
              <GrannySquare rows={displayRows} colorById={colorById} displayScale={2} onRowClick={handleRowClick} />
            </div>
            <button
              type="button"
              onClick={() => save(rows)}
              className="rounded-full bg-stone-800 px-4 py-2 text-sm font-medium text-white hover:bg-stone-700"
            >
              Сохранить
            </button>
          </div>

          <div className="flex flex-1 flex-col gap-4">
            <button
              type="button"
              onClick={addRow}
              className="self-start rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
            >
              Добавить слой
            </button>

            <Palette
              colors={palette}
              onAddColor={addColor}
              onAddLibraryColors={addLibraryColors}
              onRemoveColor={removeColor}
            />
          </div>
        </div>

        <SavedCombinations combinations={combinations} colorById={colorById} onRemove={removeCombination} />
      </div>

      {contextMenu && (
        <RowContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onChangeColor={handleOpenColorPicker}
          onDelete={handleDeleteRow}
          onDismiss={() => setContextMenu(null)}
        />
      )}

      {colorPicker && (
        <ColorPickerPopover
          x={colorPicker.x}
          y={colorPicker.y}
          palette={palette}
          selectedColorId={colorPicker.previewColorId}
          onPreview={(colorId) => setColorPicker({ ...colorPicker, previewColorId: colorId })}
          onSave={handleSaveColor}
          onClose={() => setColorPicker(null)}
        />
      )}
    </div>
  );
}
