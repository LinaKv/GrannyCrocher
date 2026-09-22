import { isPaletteColorArray } from '../hooks/usePalette';
import { isNullablePaletteColor } from '../hooks/usePrimaryColor';
import { isSavedCombinationArray } from '../hooks/useSavedCombinations';
import type { PaletteColor, SavedCombination } from '../types';
import { isRecord } from './validate';

export interface CombinationsFile {
  combinations: SavedCombination[];
  palette: PaletteColor[];
  primaryColor: PaletteColor | null;
}

export function isCombinationsFile(value: unknown): value is CombinationsFile {
  return (
    isRecord(value) &&
    isSavedCombinationArray(value.combinations) &&
    isPaletteColorArray(value.palette) &&
    isNullablePaletteColor(value.primaryColor)
  );
}

function buildFileName(): string {
  const today = new Date().toISOString().slice(0, 10);
  return `combinations-${today}.json`;
}

export function downloadCombinationsFile(data: CombinationsFile): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = buildFileName();
  link.click();
  URL.revokeObjectURL(url);
}

export async function parseCombinationsFile(file: File): Promise<CombinationsFile> {
  const text = await file.text();

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error('invalid-json');
  }

  if (!isCombinationsFile(parsed)) {
    throw new Error('invalid-shape');
  }

  return parsed;
}
