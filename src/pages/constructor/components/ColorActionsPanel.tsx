import { useState } from 'react';
import type { PaletteColor } from '../../../types';
import { AddColorModal } from './AddColorModal';
import { Palette } from './Palette';
import { PrimaryColorSwatch } from './PrimaryColorSwatch';

interface ColorActionsPanelProps {
  palette: PaletteColor[];
  onAddColor: (hex: string) => boolean;
  onAddLibraryColors: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
  onRemoveColor: (colorId: string) => void;
  primaryColor: PaletteColor | null;
  onSetPrimaryColor: (color: Omit<PaletteColor, 'id'>) => void;
}

// Deliberately allowed to shrink/scroll out of the way before the square
// does (see .constructor-page__right-column in _constructor-page.scss) —
// unlike SquareActions, nothing here needs to stay visible without scrolling.
export function ColorActionsPanel({
  palette,
  onAddColor,
  onAddLibraryColors,
  onRemoveColor,
  primaryColor,
  onSetPrimaryColor,
}: ColorActionsPanelProps) {
  const [isPrimaryColorModalOpen, setIsPrimaryColorModalOpen] = useState(false);

  return (
    <div className="constructor-page__right-column">
      <PrimaryColorSwatch color={primaryColor} onClick={() => setIsPrimaryColorModalOpen(true)} />

      <div className="constructor-page__right-column-scroll">
        <Palette
          colors={palette}
          onRemoveColor={onRemoveColor}
          onAddColor={onAddColor}
          onAddLibraryColors={onAddLibraryColors}
        />
      </div>

      {isPrimaryColorModalOpen && (
        <AddColorModal
          palette={palette}
          onAddColor={onAddColor}
          onAddLibraryColors={onAddLibraryColors}
          singleSelect
          onColorPicked={onSetPrimaryColor}
          onClose={() => setIsPrimaryColorModalOpen(false)}
        />
      )}
    </div>
  );
}
