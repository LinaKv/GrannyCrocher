interface ConfirmDeleteModalProps {
  title: string;
  description: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onClose: () => void;
}

export function ConfirmDeleteModal({
  title,
  description,
  confirmLabel = 'Удалить',
  onConfirm,
  onClose,
}: ConfirmDeleteModalProps) {
  return (
    <div className="modal">
      <div className="modal__panel">
        <h2 className="modal__title">{title}</h2>
        <p className="modal__description">{description}</p>

        <div className="modal__actions action-row">
          <button type="button" onClick={onClose} className="button button--secondary button--modal">
            Отмена
          </button>
          <button type="button" onClick={onConfirm} className="button button--danger button--modal">
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
