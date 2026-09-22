import { useClampedPosition } from '../hooks/useClampedPosition';

interface RowContextMenuProps {
  x: number;
  y: number;
  onChangeColor: () => void;
  onDismiss: () => void;
}

export function RowContextMenu({ x, y, onChangeColor, onDismiss }: RowContextMenuProps) {
  const { ref, style } = useClampedPosition<HTMLDivElement>(x, y);
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onDismiss} />
      <div
        ref={ref}
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-white text-base shadow-lg ring-1 ring-stone-200"
        style={style}
      >
        <button
          type="button"
          onClick={onChangeColor}
          className="px-4 py-2 text-left text-stone-700 hover:bg-stone-50"
        >
          Изменить цвет
        </button>
      </div>
    </>
  );
}
