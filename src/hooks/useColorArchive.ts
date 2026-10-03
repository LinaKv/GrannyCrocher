import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { PaletteColor } from '../types';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:color-archive';

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === 'string';
}

function isPaletteColor(value: unknown): value is PaletteColor {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.hex === 'string' &&
    isOptionalString(value.code) &&
    isOptionalString(value.nameRu) &&
    isOptionalString(value.yarnName)
  );
}

function isPaletteColorArray(value: unknown): value is PaletteColor[] {
  return Array.isArray(value) && value.every(isPaletteColor);
}

// Colors removed from the palette or replaced as the primary color are kept
// here so squares saved while they were current keep resolving to the same
// hex, instead of going blank once the color is no longer "active".
export function useColorArchive() {
  const [archivedColors, setArchivedColors] = useLocalStorageState<PaletteColor[]>(
    STORAGE_KEY,
    isPaletteColorArray,
    [],
  );

  const archive = useCallback(
    (color: PaletteColor) => {
      setArchivedColors((current) =>
        current.some((entry) => entry.id === color.id) ? current : [...current, color],
      );
    },
    [setArchivedColors],
  );

  return { archivedColors, archive };
}
