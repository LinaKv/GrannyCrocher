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
  onRowClick?: (rowId: string, event: MouseEvent<SVGPathElement>) => void;
}

const EMPTY_RING_FILL = '#efeaf0';
const BACKGROUND = '#fdfcfb';
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

export function GrannySquare({ rows, colorById, ringThickness = 16, displayScale = 0.8, onRowClick }: GrannySquareProps) {
  const centerHole = ringThickness * 0.35; 
  const half = centerHole + rows.length * ringThickness;
  const size = half * 2;

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size * displayScale}
      height={size * displayScale}
      className="max-w-full"
      role="img"
      aria-label="Бабушкин квадрат"
    >
      <g transform={`translate(${half}, ${half})`}>
        <circle r={centerHole} fill={BACKGROUND} />

        {rows.map((row, index) => {
          const outer = centerHole + (index + 1) * ringThickness - GAP / 2;
          const inner = centerHole + index * ringThickness + GAP / 2;
          const fill = row.colorId ? colorById.get(row.colorId) ?? EMPTY_RING_FILL : EMPTY_RING_FILL;
          const d =
            `${roundedSquarePath(outer, ringThickness * 0.9)} ` +
            roundedSquarePath(inner, ringThickness * 0.9);

          return (
            <path
              key={row.id}
              d={d}
              fill={fill}
              fillRule="evenodd"
              stroke={BACKGROUND}
              strokeWidth={1}
              className={classNames({ 'cursor-pointer transition-opacity hover:opacity-80': onRowClick })}
              onClick={onRowClick ? (event) => onRowClick(row.id, event) : undefined}
            />
          );
        })}
      </g>
    </svg>
  );
}
