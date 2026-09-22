import type { PaletteColor } from '../types';
import { HeartSwatch } from './HeartSwatch';

interface PaletteProps {
  colors: PaletteColor[];
  onRemoveColor: (id: string) => void;
}

export function Palette({ colors, onRemoveColor }: PaletteProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-2 text-base font-medium text-stone-500">Палитра</p>
        {colors.length === 0 ? (
          <p className="text-base text-stone-400">Пока нет добавленных цветов.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <HeartSwatch key={color.id} hex={color.hex} code={color.code} size={56} onRemove={() => onRemoveColor(color.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
