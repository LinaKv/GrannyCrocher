import type { PaletteColor } from '../../../types';
import { useClampedPosition } from '../../../hooks/useClampedPosition';
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
      <div className="color-picker-popover__backdrop" onClick={onClose} />
      <div ref={ref} className="card color-picker-popover" style={style}>
        <p className="color-picker-popover__label">Выберите цвет</p>

        {palette.length === 0 ? (
          <p className="empty-state color-picker-popover__empty">Палитра пуста — добавьте цвета справа.</p>
        ) : (
          <div className="color-picker-popover__swatches flex flex-wrap gap-2">
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

        <div className="action-row">
          <button type="button" onClick={onClose} className="button button--ghost button--sm">
            Закрыть
          </button>
          <button type="button" onClick={onSave} className="button button--primary button--sm">
            Сохранить
          </button>
        </div>
      </div>
    </>
  );
}
