export interface SlotPosition {
  slot: number;
  col: number;
  row: number;
}

export interface SeamLine {
  // Seam sits exactly between columns 2 and 3 of a 4-column grid, i.e. at
  // the 50% width mark — only its vertical extent (as a fraction of the
  // view's row count) differs per view.
  rows: number;
}

export interface CardiganView {
  label: string;
  columns: number;
  rows: number;
  positions: SlotPosition[];
  seam: SeamLine | null;
}

// Спина has a real center-back seam; Перед is two open front panels that
// are never sewn together, so it gets no seam line.
export const CARDIGAN_VIEWS = {
  general: {
    label: 'Схема',
    columns: 4,
    rows: 6,
    positions: [
      { slot: 1, col: 2, row: 1 },
      { slot: 9, col: 3, row: 1 },
      { slot: 2, col: 2, row: 2 },
      { slot: 10, col: 3, row: 2 },
      { slot: 3, col: 1, row: 3 },
      { slot: 4, col: 2, row: 3 },
      { slot: 11, col: 3, row: 3 },
      { slot: 12, col: 4, row: 3 },
      { slot: 5, col: 1, row: 4 },
      { slot: 6, col: 2, row: 4 },
      { slot: 13, col: 3, row: 4 },
      { slot: 14, col: 4, row: 4 },
      { slot: 7, col: 2, row: 5 },
      { slot: 15, col: 3, row: 5 },
      { slot: 8, col: 2, row: 6 },
      { slot: 16, col: 3, row: 6 },
    ],
    // Only spans the "Спина" portion (rows 1-3) — the seam doesn't
    // continue alongside the "Перед" rows below it.
    seam: { rows: 3 },
  },
  back: {
    label: 'Спина',
    columns: 4,
    rows: 3,
    positions: [
      { slot: 12, col: 1, row: 1 },
      { slot: 11, col: 2, row: 1 },
      { slot: 4, col: 3, row: 1 },
      { slot: 3, col: 4, row: 1 },
      { slot: 10, col: 2, row: 2 },
      { slot: 2, col: 3, row: 2 },
      { slot: 9, col: 2, row: 3 },
      { slot: 1, col: 3, row: 3 },
    ],
    seam: { rows: 3 },
  },
  front: {
    label: 'Перед',
    columns: 4,
    rows: 3,
    positions: [
      { slot: 5, col: 1, row: 1 },
      { slot: 6, col: 2, row: 1 },
      { slot: 13, col: 3, row: 1 },
      { slot: 14, col: 4, row: 1 },
      { slot: 7, col: 2, row: 2 },
      { slot: 15, col: 3, row: 2 },
      { slot: 8, col: 2, row: 3 },
      { slot: 16, col: 3, row: 3 },
    ],
    seam: null,
  },
} as const satisfies Record<string, CardiganView>;

export type CardiganViewKey = keyof typeof CARDIGAN_VIEWS;

export const CARDIGAN_VIEW_ORDER: CardiganViewKey[] = ['general', 'back', 'front'];

// Squares within the same piece sit edge to edge (they're sewn together),
// but there's always a visible opening between columns 2 and 3 — a real
// seam on Спина, an unsewn gap between the two front panels on Перед. This
// is the width of that one gutter track, relative to a normal 1fr column;
// it's inserted into the grid as its own track (see toGridColumn) rather
// than via the uniform `gap`, which would space every square apart equally.
export const SEAM_TRACK_WIDTH = 0.5;

// Maps a slot's logical column (1-4) to its actual grid-column-start in a
// template with the extra seam track spliced in after column 2.
export function toGridColumn(col: number): number {
  return col <= 2 ? col : col + 1;
}
