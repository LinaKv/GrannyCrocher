import { useCallback } from 'react';
import { useLocalStorageState } from '../storage/useLocalStorageState';

const STORAGE_KEY = 'granny-square:cardigan';
export const CARDIGAN_SLOT_COUNT = 16;

export type CardiganAssignments = Array<string | null>;

export function isCardiganAssignments(value: unknown): value is CardiganAssignments {
  return (
    Array.isArray(value) &&
    value.length === CARDIGAN_SLOT_COUNT &&
    value.every((entry) => entry === null || typeof entry === 'string')
  );
}

export function emptyCardiganAssignments(): CardiganAssignments {
  return Array<string | null>(CARDIGAN_SLOT_COUNT).fill(null);
}

// One global 16-slot layout (slot N -> SavedCombination.id | null), shared
// across all three diagram views — assigning a square in one view updates
// the same slot everywhere it appears.
export function useCardiganLayout() {
  const [assignments, setAssignments] = useLocalStorageState<CardiganAssignments>(
    STORAGE_KEY,
    isCardiganAssignments,
    emptyCardiganAssignments(),
  );

  // A combination can only occupy one slot at a time — physically it's one
  // crocheted square, so assigning it here clears any other slot it was in.
  const assign = useCallback(
    (slot: number, combinationId: string | null) => {
      setAssignments((current) =>
        current.map((value, index) => {
          if (index === slot - 1) {
            return combinationId;
          }
          return combinationId !== null && value === combinationId ? null : value;
        }),
      );
    },
    [setAssignments],
  );

  const replace = useCallback(
    (next: CardiganAssignments) => {
      setAssignments(next);
    },
    [setAssignments],
  );

  return { assignments, assign, replace };
}
