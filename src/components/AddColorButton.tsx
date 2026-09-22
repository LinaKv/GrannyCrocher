import { useState } from 'react';
import type { PaletteColor } from '../types';
import { AddColorModal } from './AddColorModal';

interface AddColorButtonProps {
  palette: PaletteColor[];
  onAddColor: (hex: string) => boolean;
  onAddLibraryColors: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
}

export function AddColorButton({ palette, onAddColor, onAddLibraryColors }: AddColorButtonProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        className="w-full lg:w-auto rounded-full bg-stone-100 px-3 py-2 lg:px-4 lg:py-2 text-base font-medium text-stone-700 hover:bg-stone-200"
      >
        Добавить цвета
      </button>

      {modalOpen && (
        <AddColorModal
          palette={palette}
          onAddColor={onAddColor}
          onAddLibraryColors={onAddLibraryColors}
          onClose={() => setModalOpen(false)}
        />
      )}
    </>
  );
}
