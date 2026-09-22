import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { SavedCombination, SquareRow } from '../types';
import { createId } from '../utils/id';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:combinations';

function isCombinationRow(value: unknown): value is { colorId: string | null } {
  return isRecord(value) && (value.colorId === null || typeof value.colorId === 'string');
}

function isSavedCombination(value: unknown): value is SavedCombination {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'number' &&
    Array.isArray(value.rows) &&
    value.rows.every(isCombinationRow)
  );
}

export function isSavedCombinationArray(value: unknown): value is SavedCombination[] {
  return Array.isArray(value) && value.every(isSavedCombination);
}

export function useSavedCombinations() {
  const [combinations, setCombinations] = useLocalStorageState<SavedCombination[]>(
    STORAGE_KEY,
    isSavedCombinationArray,
    [],
  );

  const save = useCallback(
    (rows: SquareRow[]) => {
      const combination: SavedCombination = {
        id: createId(),
        rows: rows.map((row) => ({ colorId: row.colorId })),
        createdAt: Date.now(),
      };
      setCombinations((current) => [combination, ...current]);
    },
    [setCombinations],
  );

  const remove = useCallback(
    (id: string) => {
      setCombinations((current) => current.filter((combination) => combination.id !== id));
    },
    [setCombinations],
  );

  const replace = useCallback(
    (next: SavedCombination[]) => {
      setCombinations(next);
    },
    [setCombinations],
  );

  return { combinations, save, remove, replace };
}
