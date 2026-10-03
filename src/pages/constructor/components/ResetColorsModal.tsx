interface ResetColorsModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function ResetColorsModal({ onConfirm, onClose }: ResetColorsModalProps) {
  return (
    <div className="modal">
      <div className="modal__panel">
        <h2 className="modal__title">Сбросить все цвета?</h2>
        <p className="modal__description">
          Цвета всех рядов будут удалены. Это действие нельзя отменить.
        </p>

        <div className="modal__actions action-row">
          <button type="button" onClick={onClose} className="button button--secondary button--modal">
            Отмена
          </button>
          <button type="button" onClick={onConfirm} className="button button--danger button--modal">
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
