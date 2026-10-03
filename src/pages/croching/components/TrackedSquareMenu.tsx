import { useClampedPosition } from '../../../hooks/useClampedPosition';

interface TrackedSquareMenuProps {
  x: number;
  y: number;
  done: boolean;
  onOpen: () => void;
  onToggleDone: () => void;
  onDuplicate: () => void;
  onRemove: () => void;
  onDismiss: () => void;
}

export function TrackedSquareMenu({
  x,
  y,
  done,
  onOpen,
  onToggleDone,
  onDuplicate,
  onRemove,
  onDismiss,
}: TrackedSquareMenuProps) {
  const { ref, style } = useClampedPosition<HTMLDivElement>(x, y);
  return (
    <>
      <div className="tracked-square-menu__backdrop" onClick={onDismiss} />
      <div ref={ref} className="card tracked-square-menu flex flex-col" style={style}>
        <button type="button" onClick={onOpen} className="tracked-square-menu__item">
          {done ? 'Открыть' : 'Начать вязать'}
        </button>
        <button type="button" onClick={onToggleDone} className="tracked-square-menu__item">
          {done ? 'Снять отметку' : 'Отметить связанным'}
        </button>
        <button type="button" onClick={onDuplicate} className="tracked-square-menu__item">
          Дублировать
        </button>
        <button
          type="button"
          onClick={onRemove}
          className="tracked-square-menu__item tracked-square-menu__item--danger"
        >
          Удалить
        </button>
      </div>
    </>
  );
}
