import type { PaletteColor } from '../../../types';
import { HeartSwatch } from './HeartSwatch';

interface PrimaryColorSwatchProps {
  color: PaletteColor | null;
  onClick: () => void;
}

export function PrimaryColorSwatch({ color, onClick }: PrimaryColorSwatchProps) {
  return (
    <div>
      <div className="section-header">
        <p className="section-label">Основной цвет</p>
        <button
          type="button"
          onClick={onClick}
          aria-label="Обновить основной цвет"
          className="button button--secondary button--sm button--icon"
        >
          <svg viewBox="0 0 24 24" width={12} height={12} fill="none" aria-hidden="true">
            <path
              d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M8 16H3v5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
      {color && <HeartSwatch hex={color.hex} code={color.code} size={56} onClick={onClick} />}
    </div>
  );
}
