import type { SavedCombination } from '../types';
import { GrannySquare } from './GrannySquare';

interface SavedCombinationsProps {
  combinations: SavedCombination[];
  colorById: Map<string, string>;
  onRemove: (id: string) => void;
}

export function SavedCombinations({ combinations, colorById, onRemove }: SavedCombinationsProps) {
  if (combinations.length === 0) {
    return null;
  }

  return (
    <div>
      <p className="mb-3 text-sm font-medium text-stone-500">Сохранённые комбинации</p>
      <div className="flex flex-wrap gap-4">
        {combinations.map((combination) => (
          <div key={combination.id} className="relative rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200">
            <GrannySquare
              rows={combination.rows.map((row, index) => ({
                id: `${combination.id}-${index}`,
                colorId: row.colorId,
              }))}
              colorById={colorById}
              ringThickness={6}
            />

            <button
              type="button"
              onClick={() => onRemove(combination.id)}
              aria-label="Удалить сохранённую комбинацию"
              className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[10px] leading-none text-stone-500 shadow ring-1 ring-stone-200 hover:text-stone-800"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
