import { useState, type MouseEvent } from 'react';
import type { SavedCombination } from '../../../types';
import { GrannySquare } from '../../../components/GrannySquare';
import { TrackedSquareMenu } from './TrackedSquareMenu';

interface TrackedSquareCardProps {
  combination: SavedCombination;
  colorById: Map<string, string>;
  done: boolean;
  onToggleDone: (id: string) => void;
  onOpen: (id: string) => void;
  onDuplicate: (id: string) => void;
  onRemove: (id: string) => void;
}

export function TrackedSquareCard({
  combination,
  colorById,
  done,
  onToggleDone,
  onOpen,
  onDuplicate,
  onRemove,
}: TrackedSquareCardProps) {
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  function openMenu(event: MouseEvent<HTMLButtonElement>) {
    setMenuPosition({ x: event.clientX, y: event.clientY });
  }

  return (
    <div className="card tracked-square-card">
      <GrannySquare
        rows={combination.rows.map((row, index) => ({
          id: `${combination.id}-${index}`,
          colorId: row.colorId,
        }))}
        colorById={colorById}
        fluid
      />

      <span className="tracked-square-card__number">№{combination.number}</span>

      <button
        type="button"
        onClick={openMenu}
        aria-label="Действия с квадратом"
        className="tracked-square-card__menu-trigger"
      >
        <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
          <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="2" y1="12" x2="14" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {menuPosition && (
        <TrackedSquareMenu
          x={menuPosition.x}
          y={menuPosition.y}
          done={done}
          onOpen={() => {
            setMenuPosition(null);
            onOpen(combination.id);
          }}
          onToggleDone={() => {
            setMenuPosition(null);
            onToggleDone(combination.id);
          }}
          onDuplicate={() => {
            setMenuPosition(null);
            onDuplicate(combination.id);
          }}
          onRemove={() => {
            setMenuPosition(null);
            onRemove(combination.id);
          }}
          onDismiss={() => setMenuPosition(null)}
        />
      )}
    </div>
  );
}
