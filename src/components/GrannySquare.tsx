import type { MouseEvent } from 'react';
import classNames from 'classnames';

interface GrannySquareRow {
  id: string;
  colorId: string | null;
}

interface GrannySquareProps {
  rows: GrannySquareRow[];
  colorById: Map<string, string>;
  ringThickness?: number;
  displayScale?: number;
  activeRowId?: string | null;
  lockedRowIndices?: Set<number>;
  // Rings beyond this count are skipped, but sizing still uses the full
  // `rows` length so the square's footprint stays stable while they reveal.
  visibleRowCount?: number;
  // Drops the pixel width/height so CSS sizes the square from its container
  // instead, preserving the square aspect ratio via its viewBox.
  fluid?: boolean;
  onRowClick?: (rowId: string, event: MouseEvent<SVGPathElement>) => void;
}

const EMPTY_RING_FILL = '#efeaf0';
const BACKGROUND = '#fdfcfb';
const ACTIVE_STROKE = '#44403c';
// Mirrors $color-border — the outline for rows past visibleRowCount, not yet revealed.
const PENDING_STROKE = '#e7e5e4';
const GAP = 2;

// Closed rounded-square outline, centered at the origin, as an SVG path.
function roundedSquarePath(half: number, radius: number): string {
  const r = Math.max(0, Math.min(radius, half));
  return (
    `M ${-half + r} ${-half} ` +
    `H ${half - r} A ${r} ${r} 0 0 1 ${half} ${-half + r} ` +
    `V ${half - r} A ${r} ${r} 0 0 1 ${half - r} ${half} ` +
    `H ${-half + r} A ${r} ${r} 0 0 1 ${-half} ${half - r} ` +
    `V ${-half + r} A ${r} ${r} 0 0 1 ${-half + r} ${-half} Z`
  );
}

export function GrannySquare({
  rows,
  colorById,
  ringThickness = 16,
  displayScale = 0.8,
  activeRowId = null,
  lockedRowIndices,
  visibleRowCount,
  fluid = false,
  onRowClick,
}: GrannySquareProps) {
  const centerHole = ringThickness * 0.35;
  const half = centerHole + rows.length * ringThickness;
  const size = half * 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={fluid ? undefined : size * displayScale}
      height={fluid ? undefined : size * displayScale}
      className={classNames('granny-square', { 'granny-square--fluid': fluid })}
      role="img"
      aria-label="Бабушкин квадрат"
    >
      <g transform={`translate(${half}, ${half})`}>
        <circle r={centerHole} fill={BACKGROUND} />

        {rows.map((row, index) => {
          const isPending = index >= (visibleRowCount ?? rows.length);
          const outer = centerHole + (index + 1) * ringThickness - GAP / 2;
          const inner = centerHole + index * ringThickness + GAP / 2;
          const fill = row.colorId ? colorById.get(row.colorId) ?? EMPTY_RING_FILL : EMPTY_RING_FILL;
          const d =
            `${roundedSquarePath(outer, ringThickness * 0.9)} ` +
            roundedSquarePath(inner, ringThickness * 0.9);
          const isActive = row.id === activeRowId;
          const isLocked = lockedRowIndices?.has(index) ?? false;

          return (
            <path
              key={row.id}
              d={d}
              fill={isPending ? 'none' : fill}
              fillRule="evenodd"
              stroke={isPending ? PENDING_STROKE : isActive ? ACTIVE_STROKE : BACKGROUND}
              strokeWidth={isActive ? 1.25 : 1}
              className={classNames({
                'granny-square__row--interactive': Boolean(onRowClick) && !isLocked,
                'granny-square__row--locked': isLocked,
              })}
              onClick={onRowClick && !isLocked ? (event) => onRowClick(row.id, event) : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
}
