import { useState } from 'react';
import type { PaletteColor } from '../types';
import { AddColorModal } from './AddColorModal';
import { HeartSwatch } from './HeartSwatch';

interface PaletteProps {
  colors: PaletteColor[];
  onAddColor: (hex: string) => boolean;
  onAddLibraryColors: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
  onRemoveColor: (id: string) => void;
}

export function Palette({ colors, onAddColor, onAddLibraryColors, onRemoveColor }: PaletteProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="self-start rounded-full bg-stone-100 px-4 py-2 text-sm font-medium text-stone-700 hover:bg-stone-200"
      >
        Добавить цвета
      </button>

      {modalOpen && (
        <AddColorModal
          palette={colors}
          onAddColor={onAddColor}
          onAddLibraryColors={onAddLibraryColors}
          onClose={() => setModalOpen(false)}
        />
      )}

      <div>
        <p className="mb-2 text-sm font-medium text-stone-500">Палитра</p>
        {colors.length === 0 ? (
          <p className="text-xs text-stone-400">Пока нет добавленных цветов.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {colors.map((color) => (
              <HeartSwatch key={color.id} hex={color.hex} onRemove={() => onRemoveColor(color.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
