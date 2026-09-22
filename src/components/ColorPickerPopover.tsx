import type { PaletteColor } from '../types';
import { useClampedPosition } from '../hooks/useClampedPosition';
import { HeartSwatch } from './HeartSwatch';

interface ColorPickerPopoverProps {
  x: number;
  y: number;
  palette: PaletteColor[];
  selectedColorId: string | null;
  usedColorIds: Set<string>;
  onPreview: (colorId: string) => void;
  onSave: () => void;
  onClose: () => void;
}

export function ColorPickerPopover({
  x,
  y,
  palette,
  selectedColorId,
  usedColorIds,
  onPreview,
  onSave,
  onClose,
}: ColorPickerPopoverProps) {
  const { ref, style } = useClampedPosition<HTMLDivElement>(x, y);
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        ref={ref}
        className="fixed z-50 w-64 rounded-2xl bg-white p-4 shadow-xl ring-1 ring-stone-200"
        style={style}
      >
        <p className="mb-3 text-base font-medium text-stone-600">Выберите цвет</p>

        {palette.length === 0 ? (
          <p className="mb-3 text-base text-stone-400">Палитра пуста — добавьте цвета справа.</p>
        ) : (
          <div className="mb-3 flex flex-wrap gap-2">
            {palette.map((color) => (
              <HeartSwatch
                key={color.id}
                hex={color.hex}
                code={color.code}
                size={52}
                selected={selectedColorId === color.id}
                usedInSquare={usedColorIds.has(color.id)}
                onClick={() => onPreview(color.id)}
              />
            ))}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1.5 text-base text-stone-500 hover:bg-stone-50"
          >
            Закрыть
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-full bg-stone-800 px-3 py-1.5 text-base text-white hover:bg-stone-700"
          >
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
}
