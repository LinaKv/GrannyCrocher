import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { PaletteColor } from '../types';
import { createId } from '../utils/id';
import { isValidHex, normalizeHex } from '../utils/color';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:palette';

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

export function isPaletteColorArray(value: unknown): value is PaletteColor[] {
  return Array.isArray(value) && value.every(isPaletteColor);
}

export function usePalette() {
  const [palette, setPalette] = useLocalStorageState<PaletteColor[]>(
    STORAGE_KEY,
    isPaletteColorArray,
    [],
  );

  // Returns false when the hex is invalid, so the form can show an error.
  const addColor = useCallback(
    (hex: string): boolean => {
      if (!isValidHex(hex)) {
        return false;
      }
      const normalized = normalizeHex(hex);
      setPalette((current) => {
        if (current.some((color) => color.hex === normalized)) {
          return current;
        }
        return [...current, { id: createId(), hex: normalized }];
      });
      return true;
    },
    [setPalette],
  );

  // Batch add from the color library; colors already present (by hex) are skipped.
  const addLibraryColors = useCallback(
    (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => {
      setPalette((current) => {
        const existingHexes = new Set(current.map((color) => color.hex));
        const additions: PaletteColor[] = [];
        for (const color of colors) {
          const normalized = normalizeHex(color.hex);
          if (existingHexes.has(normalized)) {
            continue;
          }
          existingHexes.add(normalized);
          additions.push({ ...color, id: createId(), hex: normalized });
        }
        return additions.length > 0 ? [...current, ...additions] : current;
      });
    },
    [setPalette],
  );

  const removeColor = useCallback(
    (id: string) => {
      setPalette((current) => current.filter((color) => color.id !== id));
    },
    [setPalette],
  );

  const replace = useCallback(
    (colors: PaletteColor[]) => {
      setPalette(colors);
    },
    [setPalette],
  );

  return { palette, addColor, addLibraryColors, removeColor, replace };
}
