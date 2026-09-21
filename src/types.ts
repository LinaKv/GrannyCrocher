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
}
