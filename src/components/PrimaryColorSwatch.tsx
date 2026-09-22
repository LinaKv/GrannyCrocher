import type { PaletteColor } from '../types';
import { HeartSwatch } from './HeartSwatch';

interface PrimaryColorSwatchProps {
  color: PaletteColor;
  onClick: () => void;
}

export function PrimaryColorSwatch({ color, onClick }: PrimaryColorSwatchProps) {
  return (
    <div>
      <p className="mb-2 text-base font-medium text-stone-500">Основной цвет</p>
      <HeartSwatch hex={color.hex} code={color.code} size={56} onClick={onClick} />
    </div>
  );
}
