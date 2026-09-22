import { useState } from 'react';
import type { PaletteColor } from '../types';
import { normalizeHex } from '../utils/color';
import { AddColorForm } from './AddColorForm';
import { LibraryColorPicker } from './LibraryColorPicker';

type Tab = 'custom' | 'library';

interface AddColorModalProps {
  palette: PaletteColor[];
  onAddColor: (hex: string) => boolean;
  onAddLibraryColors: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
  onClose: () => void;
  singleSelect?: boolean;
  onColorPicked?: (color: Omit<PaletteColor, 'id'>) => void;
}

export function AddColorModal({
  palette,
  onAddColor,
  onAddLibraryColors,
  onClose,
  singleSelect = false,
  onColorPicked,
}: AddColorModalProps) {
  const [tab, setTab] = useState<Tab>('custom');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-1 rounded-full bg-stone-100 p-1">
            <button
              type="button"
              onClick={() => setTab('custom')}
              className={`rounded-full px-3 py-1 text-base font-medium ${
                tab === 'custom' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'
              }`}
            >
              Свой цвет
            </button>
            <button
              type="button"
              onClick={() => setTab('library')}
              className={`rounded-full px-3 py-1 text-base font-medium ${
                tab === 'library' ? 'bg-white text-stone-800 shadow-sm' : 'text-stone-500'
              }`}
            >
              Библиотека
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Закрыть"
            className="rounded-full px-2 py-1 text-stone-400 hover:bg-stone-50 hover:text-stone-700"
          >
            ×
          </button>
        </div>

        {tab === 'custom' ? (
          <AddColorForm
            onSave={(hex) => {
              const success = onAddColor(hex);
              if (success) {
                onColorPicked?.({ hex: normalizeHex(hex) });
                onClose();
              }
              return success;
            }}
            onCancel={onClose}
          />
        ) : (
          <LibraryColorPicker
            palette={palette}
            singleSelect={singleSelect}
            onSave={(colors) => {
              onAddLibraryColors(colors);
              const [color] = colors;
              if (singleSelect && color) {
                onColorPicked?.(color);
              }
              onClose();
            }}
            onClose={onClose}
          />
        )}
      </div>
    </div>
  );
}
