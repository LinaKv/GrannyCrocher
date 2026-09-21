interface RowContextMenuProps {
  x: number;
  y: number;
  onChangeColor: () => void;
  onDelete: () => void;
  onDismiss: () => void;
}

export function RowContextMenu({ x, y, onChangeColor, onDelete, onDismiss }: RowContextMenuProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onDismiss} />
      <div
        className="fixed z-50 flex flex-col overflow-hidden rounded-2xl bg-white text-sm shadow-lg ring-1 ring-stone-200"
        style={{ left: x, top: y }}
      >
        <button
          type="button"
          onClick={onChangeColor}
          className="px-4 py-2 text-left text-stone-700 hover:bg-stone-50"
        >
          Изменить цвет
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="px-4 py-2 text-left text-rose-500 hover:bg-stone-50"
        >
          Удалить
        </button>
      </div>
    </>
  );
}
