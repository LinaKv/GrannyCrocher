import { useMemo, useState } from 'react';
import { yarnLibrary } from '../data/yarnLibrary';
import type { PaletteColor } from '../types';
import { normalizeHex } from '../utils/color';
import { HeartSwatch } from './HeartSwatch';

interface LibraryColorPickerProps {
  palette: PaletteColor[];
  onSave: (colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }>) => void;
  onClose: () => void;
}

export function LibraryColorPicker({ palette, onSave, onClose }: LibraryColorPickerProps) {
  const [filter, setFilter] = useState('');
  const [pickedKeys, setPickedKeys] = useState<Set<string>>(new Set());

  const existingHexes = useMemo(() => new Set(palette.map((color) => color.hex)), [palette]);

  const normalizedFilter = filter.trim().toLowerCase();

  function toggle(key: string) {
    setPickedKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function handleSave() {
    const colors: Array<{ hex: string; code: string; nameRu: string; yarnName: string }> = [];
    for (const entry of yarnLibrary) {
      for (const color of entry.colors) {
        const key = `${entry.yarnName}:${color.code}`;
        if (pickedKeys.has(key)) {
          colors.push({ hex: color.hex, code: color.code, nameRu: color.nameRu, yarnName: entry.yarnName });
        }
      }
    }
    onSave(colors);
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        type="text"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
        placeholder="Поиск по коду или названию"
        className="w-full rounded-xl border border-stone-200 px-3 py-1.5 text-sm outline-none focus:border-stone-400"
      />

      <div className="flex max-h-80 flex-col gap-5 overflow-y-auto pr-1">
        {yarnLibrary.map((entry) => {
          const colors = entry.colors.filter(
            (color) =>
              normalizedFilter === '' ||
              color.code.toLowerCase().includes(normalizedFilter) ||
              color.nameRu.toLowerCase().includes(normalizedFilter),
          );
          if (colors.length === 0) {
            return null;
          }
          return (
            <div key={entry.yarnName}>
              <p className="mb-2 text-sm font-medium text-stone-500">{entry.yarnName}</p>
              <div className="flex flex-wrap gap-3">
                {colors.map((color) => {
                  const key = `${entry.yarnName}:${color.code}`;
                  const dimmed = existingHexes.has(normalizeHex(color.hex));
                  return (
                    <HeartSwatch
                      key={key}
                      hex={color.hex}
                      code={color.code}
                      dimmed={dimmed}
                      picked={pickedKeys.has(key)}
                      onClick={dimmed ? undefined : () => toggle(key)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full px-3 py-1.5 text-sm text-stone-500 hover:bg-stone-50"
        >
          Закрыть
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={pickedKeys.size === 0}
          className="rounded-full bg-stone-800 px-3 py-1.5 text-sm text-white hover:bg-stone-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Сохранить
        </button>
      </div>
    </div>
  );
}
