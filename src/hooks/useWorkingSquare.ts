import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { SquareRow } from '../types';
import { createId } from '../utils/id';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:working-square';
const DEFAULT_ROW_COUNT = 7;

function createDefaultRows(): SquareRow[] {
  return Array.from({ length: DEFAULT_ROW_COUNT }, () => ({
    id: createId(),
    colorId: null,
  }));
}

function isSquareRow(value: unknown): value is SquareRow {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    (value.colorId === null || typeof value.colorId === 'string')
  );
}

function isSquareRowArray(value: unknown): value is SquareRow[] {
  return Array.isArray(value) && value.every(isSquareRow);
}

export function useWorkingSquare() {
  const [rows, setRows] = useLocalStorageState<SquareRow[]>(
    STORAGE_KEY,
    isSquareRowArray,
    createDefaultRows(),
  );

  const setRowColor = useCallback(
    (id: string, colorId: string | null) => {
      setRows((current) => current.map((row) => (row.id === id ? { ...row, colorId } : row)));
    },
    [setRows],
  );

  const resetColors = useCallback(
    (preserveIds?: Set<string>) => {
      setRows((current) =>
        current.map((row) => (preserveIds?.has(row.id) ? row : { ...row, colorId: null })),
      );
    },
    [setRows],
  );

  return { rows, setRowColor, resetColors };
}
