import { useMemo, useState, type MouseEvent } from 'react';
import { ColorPickerPopover } from './components/ColorPickerPopover';
import { GrannySquare } from './components/GrannySquare';
import { AddColorButton } from './components/AddColorButton';
import { AddColorModal } from './components/AddColorModal';
import { AddPrimaryColorButton } from './components/AddPrimaryColorButton';
import { ImportCombinationsButton } from './components/ImportCombinationsButton';
import { Palette } from './components/Palette';
import { PrimaryColorSwatch } from './components/PrimaryColorSwatch';
import { ResetColorsModal } from './components/ResetColorsModal';
import { RowContextMenu } from './components/RowContextMenu';
import { SavedCombinations } from './components/SavedCombinations';
import { usePalette } from './hooks/usePalette';
import { PRIMARY_ROW_INDICES, usePrimaryColor } from './hooks/usePrimaryColor';
import { useSavedCombinations } from './hooks/useSavedCombinations';
import { useWorkingSquare } from './hooks/useWorkingSquare';
import { downloadCombinationsFile, type CombinationsFile } from './utils/combinationsFile';

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

const PRIMARY_ROW_INDICES_SET = new Set<number>(PRIMARY_ROW_INDICES);

export default function App() {
  const { palette, addColor, addLibraryColors, removeColor, replace: replacePalette } = usePalette();
  const { rows, setRowColor, resetColors } = useWorkingSquare();
  const { primaryColor, setPrimaryColor, replace: replacePrimaryColor } = usePrimaryColor(rows, setRowColor);
  const {
    combinations,
    save,
    remove: removeCombination,
    replace: replaceCombinations,
  } = useSavedCombinations();

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const [colorPicker, setColorPicker] = useState<ColorPickerState | null>(null);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isPrimaryColorModalOpen, setIsPrimaryColorModalOpen] = useState(false);

  const hasAssignedColors = rows.some(
    (row, index) => !PRIMARY_ROW_INDICES_SET.has(index) && row.colorId !== null,
  );

  const colorById = useMemo(() => {
    const map = new Map(palette.map((color) => [color.id, color.hex]));
    if (primaryColor) {
      map.set(primaryColor.id, primaryColor.hex);
    }
    return map;
  }, [palette, primaryColor]);

  const activeRowId = contextMenu?.rowId ?? colorPicker?.rowId ?? null;

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

  const displayScale = 2;

  function handleRowClick(rowId: string, event: MouseEvent<SVGPathElement>) {
    setContextMenu({ rowId, x: event.clientX, y: event.clientY });
  }

  function handleRemoveColor(colorId: string) {
    removeColor(colorId);
    for (const row of rows) {
      if (row.colorId === colorId) {
        setRowColor(row.id, null);
      }
    }
  }

  function handleResetColors() {
    const preserveIds = new Set(
      PRIMARY_ROW_INDICES.map((index) => rows[index]?.id).filter((id): id is string => id !== undefined),
    );
    resetColors(preserveIds);
    setIsResetModalOpen(false);
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

  function handleExportCombinations() {
    downloadCombinationsFile({ combinations, palette, primaryColor });
  }

  function handleImportCombinations(data: CombinationsFile) {
    replacePalette(data.palette);
    replacePrimaryColor(data.primaryColor);
    replaceCombinations(data.combinations);
  }

  return (
    <div className="min-h-screen bg-[#fdfcfb] px-4 py-6 lg:px-6 lg:py-10 text-stone-800">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 lg:gap-10">
        <header>
          <h1 className="text-xl lg:text-2xl font-semibold text-stone-800">Бабушкин квадрат</h1>
          <p className="text-base text-stone-500">Это квадрат из 7 рядов, где 6 и 7 ряд вяжутся базовым цветом. Тут можно выбрать разные цвета и посмотреть, как будет выглядеть внутрений квадрат в разных вариациях</p>
        </header>

        <div className="flex flex-col-reverse gap-6 lg:gap-8 lg:flex-row lg:items-start">
          <div className="flex min-w-0 flex-col items-center lg:items-start gap-4">
            <div className="h-80 w-80 rounded-3xl bg-white p-4 lg:p-6 shadow-sm ring-1 ring-stone-200 flex items-center justify-center overflow-hidden">
              <GrannySquare
                rows={displayRows}
                colorById={colorById}
                displayScale={displayScale}
                activeRowId={activeRowId}
                lockedRowIndices={PRIMARY_ROW_INDICES_SET}
                onRowClick={handleRowClick}
              />
            </div>
            <button
              type="button"
              onClick={() => save(rows)}
              className="rounded-full w-full lg:w-80 bg-stone-800 px-3 py-2 lg:px-4 lg:py-2 text-base font-medium text-white hover:bg-stone-700"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => setIsResetModalOpen(true)}
              disabled={!hasAssignedColors}
              className="rounded-full w-full lg:w-80 bg-red-600 px-3 py-2 lg:px-4 lg:py-2 text-base font-medium text-white hover:bg-red-700 disabled:bg-stone-100 disabled:text-stone-400 disabled:cursor-not-allowed"
            >
              Сбросить
            </button>
          </div>

          <div className="flex flex-col gap-4 lg:flex-1">
            <div className="w-full lg:w-auto">
              <AddColorButton
                palette={palette}
                onAddColor={addColor}
                onAddLibraryColors={addLibraryColors}
              />
            </div>

            <div className="w-full lg:w-auto">
              <AddPrimaryColorButton onClick={() => setIsPrimaryColorModalOpen(true)} />
            </div>

            <ImportCombinationsButton onImport={handleImportCombinations} />

            <div className="w-full lg:w-auto">
              <Palette
                colors={palette}
                onRemoveColor={handleRemoveColor}
              />
            </div>

            {primaryColor && (
              <PrimaryColorSwatch
                color={primaryColor}
                onClick={() => setIsPrimaryColorModalOpen(true)}
              />
            )}
          </div>
        </div>

        <SavedCombinations
          combinations={combinations}
          colorById={colorById}
          onRemove={removeCombination}
          onExport={handleExportCombinations}
        />
      </div>

      {contextMenu && (
        <RowContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onChangeColor={handleOpenColorPicker}
          onDismiss={() => setContextMenu(null)}
        />
      )}

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

      {isResetModalOpen && (
        <ResetColorsModal onConfirm={handleResetColors} onClose={() => setIsResetModalOpen(false)} />
      )}

      {isPrimaryColorModalOpen && (
        <AddColorModal
          palette={palette}
          onAddColor={addColor}
          onAddLibraryColors={addLibraryColors}
          singleSelect
          onColorPicked={setPrimaryColor}
          onClose={() => setIsPrimaryColorModalOpen(false)}
        />
      )}
    </div>
  );
}
