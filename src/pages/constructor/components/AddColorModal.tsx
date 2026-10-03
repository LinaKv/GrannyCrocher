import { useState } from 'react';
import classNames from 'classnames';
import type { PaletteColor } from '../../../types';
import { normalizeHex } from '../../../utils/color';
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
    <div className="modal">
      <div className="modal__panel">
        <div className="add-color-modal__header flex items-center justify-between">
          <div className="add-color-modal__tabs">
            <button
              type="button"
              onClick={() => setTab('custom')}
              className={classNames('add-color-modal__tab', { 'add-color-modal__tab--active': tab === 'custom' })}
            >
              Свой цвет
            </button>
            <button
              type="button"
              onClick={() => setTab('library')}
              className={classNames('add-color-modal__tab', { 'add-color-modal__tab--active': tab === 'library' })}
            >
              Библиотека
            </button>
          </div>

          <button type="button" onClick={onClose} aria-label="Закрыть" className="add-color-modal__close">
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
