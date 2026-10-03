interface ImportCombinationsModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function ImportCombinationsModal({ onConfirm, onClose }: ImportCombinationsModalProps) {
  return (
    <div className="modal">
      <div className="modal__panel">
        <h2 className="modal__title">Загрузить комбинации?</h2>
        <p className="modal__description">
          Текущие цвета и сохранённые комбинации будут заменены содержимым файла, а прогресс вязания уже
          начатых квадратов — потерян. Это действие нельзя отменить.
        </p>

        <div className="modal__actions action-row">
          <button type="button" onClick={onClose} className="button button--secondary button--modal">
            Отмена
          </button>
          <button type="button" onClick={onConfirm} className="button button--danger button--modal">
            Загрузить
          </button>
        </div>
      </div>
    </div>
  );
}
