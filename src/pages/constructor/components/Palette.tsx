import type { PaletteColor } from '../../../types';
import { HeartSwatch } from './HeartSwatch';
import { AddColorButton } from './AddColorButton';

interface PaletteProps {
  colors: PaletteColor[];
  onRemoveColor: (id: string) => void;
  onAddColor: (hex: string) => boolean;
  onAddLibraryColors: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
}

export function Palette({ colors, onRemoveColor, onAddColor, onAddLibraryColors }: PaletteProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div className="section-header">
          <p className="section-label">Палитра</p>
          <AddColorButton palette={colors} onAddColor={onAddColor} onAddLibraryColors={onAddLibraryColors} />
        </div>
        {colors.length === 0 ? (
          <p className="empty-state">Пока нет добавленных цветов.</p>
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
