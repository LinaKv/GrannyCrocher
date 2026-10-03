import { useMemo } from 'react';
import { ColorActionsPanel } from './components/ColorActionsPanel';
import { SavedCombinations } from './components/SavedCombinations';
import { SquareActions } from './components/SquareActions';
import { SquareEditor } from './components/SquareEditor';
import { usePalette } from '../../hooks/usePalette';
import { usePrimaryColor } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { useWorkingSquare } from '../../hooks/useWorkingSquare';
import type { PaletteColor } from '../../types';

export function ConstructorPage() {
  const { palette, addColor, addLibraryColors, removeColor } = usePalette();
  const { rows, setRowColor, resetColors } = useWorkingSquare();
  const { primaryColor, setPrimaryColor } = usePrimaryColor(rows, setRowColor);
  const { archivedColors, archive } = useColorArchive();
  const { combinations, save, remove: removeCombination } = useSavedCombinations();

  // Archived colors resolve ids that already-saved squares still reference
  // after that color was removed or replaced, so those squares keep looking
  // the way they did when saved.
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

  function handleRemoveColor(colorId: string) {
    const color = palette.find((candidate) => candidate.id === colorId);
    if (color) {
      archive(color);
    }
    removeColor(colorId);
    for (const row of rows) {
      if (row.colorId === colorId) {
        setRowColor(row.id, null);
      }
    }
  }

  function handleSetPrimaryColor(color: Omit<PaletteColor, 'id'>) {
    if (primaryColor) {
      archive(primaryColor);
    }
    setPrimaryColor(color);
  }

  return (
    <div className="constructor-page">
      <div className="constructor-page__container flex flex-col">
        <div className="constructor-page__hero">
          <header>
            <h1 className="constructor-page__title">Бабушкин квадрат</h1>
            <p className="constructor-page__subtitle">Это квадрат из 7 рядов, где 6 и 7 ряд вяжутся базовым цветом. Тут можно выбрать разные цвета и посмотреть, как будет выглядеть внутрений квадрат в разных вариациях</p>
          </header>

          <div className="constructor-page__columns flex">
            <SquareEditor rows={rows} setRowColor={setRowColor} palette={palette} colorById={colorById} />

            <div className="constructor-page__right-column-group">
              <SquareActions rows={rows} resetColors={resetColors} onSaveCombination={save} />

              <ColorActionsPanel
                palette={palette}
                onAddColor={addColor}
                onAddLibraryColors={addLibraryColors}
                onRemoveColor={handleRemoveColor}
                primaryColor={primaryColor}
                onSetPrimaryColor={handleSetPrimaryColor}
              />
            </div>
          </div>
        </div>

        <SavedCombinations combinations={combinations} colorById={colorById} onRemove={removeCombination} />
      </div>
    </div>
  );
}
