export interface PaletteColor {
  id: string;
  hex: string;
  code?: string;
  nameRu?: string;
  yarnName?: string;
}

export interface SquareRow {
  id: string;
  colorId: string | null;
}

export interface SavedCombination {
  id: string;
  rows: Array<{ colorId: string | null }>;
  createdAt: number;
  // Assigned once at save time and never recomputed, so it stays the same
  // even after earlier squares are deleted — unlike a list position.
  number: number;
}

// Shape of combinations as persisted/exported — `number` is optional here
// because data saved before per-square numbering existed won't have it;
// useSavedCombinations backfills it into a full SavedCombination on load.
export interface StoredCombination extends Omit<SavedCombination, 'number'> {
  number?: number;
}

export interface CrochetProgress {
  done: boolean;
  revealedRows: number;
}
