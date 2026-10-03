import { useCallback, useEffect, useMemo } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { SavedCombination, SquareRow, StoredCombination } from '../types';
import { createId } from '../utils/id';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:combinations';

function isCombinationRow(value: unknown): value is { colorId: string | null } {
  return isRecord(value) && (value.colorId === null || typeof value.colorId === 'string');
}

function isStoredCombination(value: unknown): value is StoredCombination {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.createdAt === 'number' &&
    Array.isArray(value.rows) &&
    value.rows.every(isCombinationRow) &&
    (value.number === undefined || typeof value.number === 'number')
  );
}

export function isSavedCombinationArray(value: unknown): value is StoredCombination[] {
  return Array.isArray(value) && value.every(isStoredCombination);
}

// Assigns a number to any item missing one (data saved before numbering
// existed), oldest first, continuing after the highest number already in
// use — so backfilled numbers also reflect creation order.
function withNumbers(items: StoredCombination[]): SavedCombination[] {
  const existingMax = items.reduce((max, item) => Math.max(max, item.number ?? 0), 0);
  const missingIds = items
    .filter((item) => item.number === undefined)
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((item) => item.id);
  const numberById = new Map(missingIds.map((id, index) => [id, existingMax + 1 + index]));

  return items.map((item) => ({
    ...item,
    number: item.number ?? numberById.get(item.id) ?? existingMax + 1,
  }));
}

export function useSavedCombinations() {
  const [stored, setStored] = useLocalStorageState<StoredCombination[]>(
    STORAGE_KEY,
    isSavedCombinationArray,
    [],
  );

  const combinations = useMemo(() => withNumbers(stored), [stored]);

  useEffect(() => {
    if (stored.some((item) => item.number === undefined)) {
      setStored(combinations);
    }
  }, [stored, combinations, setStored]);

  const save = useCallback(
    (rows: SquareRow[]) => {
      const nextNumber = combinations.reduce((max, item) => Math.max(max, item.number), 0) + 1;
      const combination: SavedCombination = {
        id: createId(),
        rows: rows.map((row) => ({ colorId: row.colorId })),
        createdAt: Date.now(),
        number: nextNumber,
      };
      setStored((current) => [combination, ...current]);
    },
    [setStored, combinations],
  );

  const duplicate = useCallback(
    (id: string) => {
      const source = combinations.find((combination) => combination.id === id);
      if (!source) {
        return;
      }
      const nextNumber = combinations.reduce((max, item) => Math.max(max, item.number), 0) + 1;
      const copy: SavedCombination = {
        id: createId(),
        rows: source.rows.map((row) => ({ colorId: row.colorId })),
        createdAt: Date.now(),
        number: nextNumber,
      };
      setStored((current) => [copy, ...current]);
    },
    [combinations, setStored],
  );

  const remove = useCallback(
    (id: string) => {
      setStored((current) => current.filter((combination) => combination.id !== id));
    },
    [setStored],
  );

  const replace = useCallback(
    (next: StoredCombination[]) => {
      setStored(next);
    },
    [setStored],
  );

  return { combinations, save, duplicate, remove, replace };
}
