import type { PaletteColor, SavedCombination } from '../../types';
import type { RowColorOption } from './components/CrochingFilterPanel';

export function buildColorMaps(
  archivedColors: PaletteColor[],
  palette: PaletteColor[],
  primaryColor: PaletteColor | null,
): { colorById: Map<string, string>; colorRecordById: Map<string, PaletteColor> } {
  const colorById = new Map(archivedColors.map((color) => [color.id, color.hex]));
  const colorRecordById = new Map<string, PaletteColor>(archivedColors.map((color) => [color.id, color]));

  for (const color of palette) {
    colorById.set(color.id, color.hex);
    colorRecordById.set(color.id, color);
  }
  if (primaryColor) {
    colorById.set(primaryColor.id, primaryColor.hex);
    colorRecordById.set(primaryColor.id, primaryColor);
  }

  return { colorById, colorRecordById };
}

// Only colors (and "без цвета") that actually occur at that row position —
// an option nobody has never matches anything.
export function buildRowOptions(
  combinations: SavedCombination[],
  colorRecordById: Map<string, PaletteColor>,
  rowCount: number,
): { options: RowColorOption[][]; hasNoColor: boolean[] } {
  const options: RowColorOption[][] = [];
  const hasNoColor: boolean[] = [];

  for (let rowIndex = 0; rowIndex < rowCount; rowIndex++) {
    const seenColorIds = new Set<string>();
    let noColorSeen = false;

    for (const combination of combinations) {
      const colorId = combination.rows[rowIndex]?.colorId ?? null;
      if (colorId === null) {
        noColorSeen = true;
      } else {
        seenColorIds.add(colorId);
      }
    }

    const rowColorOptions: RowColorOption[] = [];
    for (const colorId of seenColorIds) {
      const record = colorRecordById.get(colorId);
      if (record) {
        rowColorOptions.push({ colorId, hex: record.hex, code: record.code });
      }
    }

    options.push(rowColorOptions);
    hasNoColor.push(noColorSeen);
  }

  return { options, hasNoColor };
}
