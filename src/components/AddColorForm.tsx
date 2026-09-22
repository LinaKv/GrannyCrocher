import { useState } from 'react';

interface AddColorFormProps {
  onSave: (hex: string) => boolean;
  onCancel: () => void;
}

export function AddColorForm({ onSave, onCancel }: AddColorFormProps) {
  const [hex, setHex] = useState('#');
  const [hasError, setHasError] = useState(false);

  function handleSave() {
    const success = onSave(hex);
    if (success) {
      setHex('#');
      setHasError(false);
    } else {
      setHasError(true);
    }
  }

  function handleClear() {
    setHex('#');
    setHasError(false);
    onCancel();
  }

  return (
    <div className="rounded-2xl bg-white p-4 shadow-md ring-1 ring-stone-200">
      <label className="block text-base font-medium text-stone-600">
        Цвет:
        <input
          type="text"
          value={hex}
          onChange={(event) => {
            setHex(event.target.value);
            setHasError(false);
          }}
          placeholder="#A3D8F4"
          className="mt-1 w-full rounded-xl border border-stone-200 px-3 py-1.5 text-base outline-none focus:border-stone-400"
        />
      </label>

      {hasError && <p className="mt-1 text-base text-rose-500">Введите цвет в формате #RRGGBB</p>}

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleClear}
          className="rounded-full px-3 py-1.5 text-base text-stone-500 hover:bg-stone-50"
        >
          Удалить
        </button>
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-stone-800 px-3 py-1.5 text-base text-white hover:bg-stone-700"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
