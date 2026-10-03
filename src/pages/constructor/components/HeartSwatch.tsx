import { getReadableTextColor } from '../../../utils/color';

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
    <div className="heart-swatch flex-col items-center gap-1">
      <div className="heart-swatch__frame" style={{ width: size, height: size }}>
        <button
          type="button"
          onClick={onClick}
          aria-label={`Цвет ${hex}`}
          className="heart-swatch__trigger"
          disabled={!onClick || dimmed}
          style={{ opacity: dimmed ? 0.35 : 1 }}
        >
          <svg viewBox="0 0 24 24" width={size} height={size}>
            <path d={HEART_PATH} fill={hex} stroke="#fff" strokeWidth={0.75} />
          </svg>
        </button>

        {selected && <span className="heart-swatch__badge">✓</span>}

        {usedInSquare && (
          <span
            title="Этот цвет уже используется в квадрате"
            className="heart-swatch__used-indicator"
          />
        )}

        {code && (
          <span
            className="heart-swatch__code"
            style={{ color: getReadableTextColor(hex), fontSize: Math.max(9, size * 0.24) }}
          >
            {code}
          </span>
        )}

        {picked && <span className="heart-swatch__badge">✓</span>}

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            aria-label={`Удалить цвет ${hex} из палитры`}
            className="remove-badge"
          >
            ×
          </button>
        )}
      </div>

      {note && <span className="heart-swatch__note">{note}</span>}
    </div>
  );
}
