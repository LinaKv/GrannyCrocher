import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';
import type { CrochetProgress } from '../types';
import { isRecord } from '../utils/validate';

const STORAGE_KEY = 'granny-square:progress';

function isCrochetProgress(value: unknown): value is CrochetProgress {
  return isRecord(value) && typeof value.done === 'boolean' && typeof value.revealedRows === 'number';
}

function isProgressMap(value: unknown): value is Record<string, CrochetProgress> {
  return isRecord(value) && Object.values(value).every(isCrochetProgress);
}

const emptyProgress: CrochetProgress = { done: false, revealedRows: 0 };

export function useCrochetProgress() {
  const [progress, setProgress] = useLocalStorageState<Record<string, CrochetProgress>>(
    STORAGE_KEY,
    isProgressMap,
    {},
  );

  const getProgress = useCallback((id: string): CrochetProgress => progress[id] ?? emptyProgress, [progress]);

  const revealNextRow = useCallback(
    (id: string, rowCount: number) => {
      setProgress((current) => {
        const existing = current[id] ?? emptyProgress;
        const revealedRows = Math.min(existing.revealedRows + 1, rowCount);
        return { ...current, [id]: { ...existing, revealedRows } };
      });
    },
    [setProgress],
  );

  const revealPreviousRow = useCallback(
    (id: string) => {
      setProgress((current) => {
        const existing = current[id] ?? emptyProgress;
        const revealedRows = Math.max(existing.revealedRows - 1, 0);
        return { ...current, [id]: { ...existing, revealedRows } };
      });
    },
    [setProgress],
  );

  const setDone = useCallback(
    (id: string, done: boolean) => {
      setProgress((current) => {
        const existing = current[id] ?? emptyProgress;
        return { ...current, [id]: { ...existing, done } };
      });
    },
    [setProgress],
  );

  const remove = useCallback(
    (id: string) => {
      setProgress((current) => {
        if (!(id in current)) {
          return current;
        }
        const next = { ...current };
        delete next[id];
        return next;
      });
    },
    [setProgress],
  );

  return { progress, getProgress, revealNextRow, revealPreviousRow, setDone, remove };
}
