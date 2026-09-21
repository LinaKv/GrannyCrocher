import type { PaletteColor } from '../types';
import { HeartSwatch } from './HeartSwatch';

interface ColorPickerPopoverProps {
  x: number;
  y: number;
  palette: PaletteColor[];
  selectedColorId: string | null;
  onPreview: (colorId: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ColorPickerPopover({
  x,
  y,
  palette,
  selectedColorId,
  onPreview,
  onSave,
  onClose,
}: ColorPickerPopoverProps) {
  return (
    <div
      className="fixed z-50 w-64 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-stone-200"
      style={{ left: x, top: y }}
    >
      <p className="mb-3 text-sm font-medium text-stone-600">Выберите цвет</p>

      {palette.length === 0 ? (
        <p className="mb-3 text-xs text-stone-400">Палитра пуста — добавьте цвета справа.</p>
      ) : (
        <div className="mb-3 flex flex-wrap gap-2">
          {palette.map((color) => (
            <HeartSwatch
              key={color.id}
              hex={color.hex}
              selected={selectedColorId === color.id}
              onClick={() => onPreview(color.id)}
            />
          ))}
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-1.5 text-sm text-stone-500 hover:bg-stone-50"
        >
          Закрыть
        </button>
        <button
          type="button"
          onClick={onSave}
          className="rounded-full bg-stone-800 px-3 py-1.5 text-sm text-white hover:bg-stone-700"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
