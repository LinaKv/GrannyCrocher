import { useState } from 'react';
import type { PaletteColor } from '../../../types';
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
        aria-label="Добавить цвета"
        className="button button--secondary button--sm button--icon"
      >
        <svg viewBox="0 0 16 16" width={12} height={12} aria-hidden="true">
          <line x1="8" y1="2" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
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
