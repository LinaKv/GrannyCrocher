import { PRIMARY_ROW_INDICES } from '../../hooks/usePrimaryColor';
import type { PaletteColor, SavedCombination } from '../../types';

export interface ColorStatsRow {
  colorId: string;
  hex: string;
  label: string;
  isPrimary: boolean;
  rowCounts: number[];
  weightedSum: number;
  percentage: number;
}

function labelForColor(color: PaletteColor | undefined, colorId: string): string {
  if (!color) {
    return colorId;
  }
  if (color.nameRu) {
    return color.nameRu;
  }
  if (color.yarnName) {
    return color.code ? `${color.yarnName} ${color.code}` : color.yarnName;
  }
  return color.hex;
}

// Weight of a color = sum of (1-based row index) over every square row it
// occupies, so colors used in outer (longer) rings count for more.
export function computeColorStats(
  combinations: SavedCombination[],
  colorById: Map<string, PaletteColor>,
): ColorStatsRow[] {
  const maxRowCount = combinations.reduce((max, combination) => Math.max(max, combination.rows.length), 0);
  const rowCountsById = new Map<string, number[]>();
  const weightedSumById = new Map<string, number>();
  let total = 0;

  for (const combination of combinations) {
    combination.rows.forEach((row, index) => {
      if (row.colorId === null) {
        return;
      }
      const weight = index + 1;
      total += weight;

      const counts = rowCountsById.get(row.colorId) ?? Array(maxRowCount).fill(0);
      counts[index] += 1;
      rowCountsById.set(row.colorId, counts);

      weightedSumById.set(row.colorId, (weightedSumById.get(row.colorId) ?? 0) + weight);
    });
  }

  const stats: ColorStatsRow[] = [];
  for (const [colorId, weightedSum] of weightedSumById) {
    const color = colorById.get(colorId);
    const rowCounts = rowCountsById.get(colorId) ?? Array(maxRowCount).fill(0);
    stats.push({
      colorId,
      hex: color?.hex ?? '#000000',
      label: labelForColor(color, colorId),
      // A color only ever lands in a locked row (see PRIMARY_ROW_INDICES) by having
      // been the primary color when that square was saved — true even for a primary
      // color later replaced and archived, unlike comparing against the live primary id.
      isPrimary: PRIMARY_ROW_INDICES.some((index) => (rowCounts[index] ?? 0) > 0),
      rowCounts,
      weightedSum,
      percentage: total > 0 ? (weightedSum * 100) / total : 0,
    });
  }

  stats.sort((a, b) => b.percentage - a.percentage);
  return stats;
}
