import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { PaletteColor, SquareRow } from '../types';
import { createId } from '../utils/id';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:primary-color';

// Rows 6 and 7 (0-indexed) always carry the primary color; re-exported so
// App.tsx can reuse the same indices for locking and reset-preserving them.
export const PRIMARY_ROW_INDICES = [5, 6] as const;

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

export function isNullablePaletteColor(value: unknown): value is PaletteColor | null {
  return value === null || isPaletteColor(value);
}

export function usePrimaryColor(
  rows: SquareRow[],
  setRowColor: (id: string, colorId: string | null) => void,
) {
  const [primaryColor, setPrimaryColorState] = useLocalStorageState<PaletteColor | null>(
    STORAGE_KEY,
    isNullablePaletteColor,
    null,
  );

  const syncPrimaryRows = useCallback(
    (colorId: string | null) => {
      for (const index of PRIMARY_ROW_INDICES) {
        const row = rows[index];
        if (row && row.colorId !== colorId) {
          setRowColor(row.id, colorId);
        }
      }
    },
    [rows, setRowColor],
  );

  // Stored independently of the palette (own id) so it survives the palette
  // entry it was copied from being removed.
  const setPrimaryColor = useCallback(
    (color: Omit<PaletteColor, 'id'>) => {
      const next = { ...color, id: createId() };
      setPrimaryColorState(next);
      syncPrimaryRows(next.id);
    },
    [setPrimaryColorState, syncPrimaryRows],
  );

  // Preserves the id as-is, unlike setPrimaryColor, so imported combinations
  // that reference this exact color id keep resolving correctly.
  const replace = useCallback(
    (color: PaletteColor | null) => {
      setPrimaryColorState(color);
      syncPrimaryRows(color?.id ?? null);
    },
    [setPrimaryColorState, syncPrimaryRows],
  );

  return { primaryColor, setPrimaryColor, replace };
}
