interface ResetColorsModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

export function ResetColorsModal({ onConfirm, onClose }: ResetColorsModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <h2 className="text-lg font-semibold text-stone-800">Сбросить все цвета?</h2>
        <p className="mt-2 text-base text-stone-500">
          Цвета всех рядов будут удалены. Это действие нельзя отменить.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-stone-100 px-4 py-2 text-base font-medium text-stone-700 hover:bg-stone-200"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-full bg-red-600 px-4 py-2 text-base font-medium text-white hover:bg-red-700"
          >
            Сбросить
          </button>
        </div>
      </div>
    </div>
  );
}
