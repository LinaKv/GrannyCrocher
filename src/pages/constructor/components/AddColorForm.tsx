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
    <div className="card add-color-form">
      <label className="add-color-form__label">
        Цвет:
        <input
          type="text"
          value={hex}
          onChange={(event) => {
            setHex(event.target.value);
            setHasError(false);
          }}
          placeholder="#A3D8F4"
          className="add-color-form__input"
        />
      </label>

      {hasError && <p className="add-color-form__error">Введите цвет в формате #RRGGBB</p>}

      <div className="add-color-form__actions action-row">
        <button type="button" onClick={handleClear} className="button button--ghost button--sm">
          Удалить
        </button>
        <button type="button" onClick={handleSave} className="button button--primary button--sm">
          Сохранить
        </button>
      </div>
    </div>
  );
}
