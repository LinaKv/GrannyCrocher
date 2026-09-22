import { getReadableTextColor } from '../utils/color';

interface HeartSwatchProps {
  hex: string;
  size?: number;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  code?: string;
  picked?: boolean;
  dimmed?: boolean;
  note?: string;
  usedInSquare?: boolean;
}

const HEART_PATH =
  'M12 21s-7.5-4.6-10-9C0.2 8.4 2 4.5 6 4c2.2-0.3 4.2 0.9 6 2.8C13.8 4.9 15.8 3.7 18 4c4 0.5 5.8 4.4 4 8-2.5 4.4-10 9-10 9z';

export function HeartSwatch({
  hex,
  size = 40,
  selected = false,
  onClick,
  onRemove,
  code,
  picked = false,
  dimmed = false,
  note,
  usedInSquare = false,
}: HeartSwatchProps) {
  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <div className="relative inline-flex" style={{ width: size, height: size }}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Цвет ${hex}`}
          className="h-full w-full"
          disabled={!onClick || dimmed}
          style={{ opacity: dimmed ? 0.35 : 1 }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path d={HEART_PATH} fill={hex} stroke="#fff" strokeWidth={0.75} />
          </svg>
        </button>

        {selected && (
          <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] leading-none text-white shadow ring-1 ring-white">
            ✓
          </span>
        )}

        {usedInSquare && (
          <span
            title="Этот цвет уже используется в квадрате"
            className="absolute -left-1 -top-1 h-3 w-3 rounded-full bg-stone-500 shadow ring-1 ring-white"
          />
        )}

        {code && (
          <span
            className="pointer-events-none absolute inset-0 flex items-center justify-center font-medium leading-none"
            style={{ color: getReadableTextColor(hex), fontSize: Math.max(9, size * 0.24) }}
          >
            {code}
          </span>
        )}

        {picked && (
          <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] leading-none text-white shadow ring-1 ring-white">
            ✓
          </span>
        )}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Удалить цвет ${hex} из палитры`}
            className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] leading-none text-stone-500 shadow ring-1 ring-stone-200 hover:text-stone-800"
          >
            ×
          </button>
        )}
      </div>

      {note && <span className="text-[9px] text-stone-400">{note}</span>}
    </div>
  );
}
