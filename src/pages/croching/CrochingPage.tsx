import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { usePalette } from '../../hooks/usePalette';
import { usePrimaryColorValue } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { useCrochetProgress } from '../../hooks/useCrochetProgress';
import { TrackedSquareCard } from './components/TrackedSquareCard';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';

type Tab = 'todo' | 'done';

export function CrochingPage() {
  const [tab, setTab] = useState<Tab>('todo');
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { palette } = usePalette();
  const [primaryColor] = usePrimaryColorValue();
  const { archivedColors } = useColorArchive();
  const { combinations, duplicate: duplicateCombination, remove: removeCombination } = useSavedCombinations();
  const { progress, setDone, remove: removeProgress } = useCrochetProgress();

  const colorById = useMemo(() => {
    const map = new Map(archivedColors.map((color) => [color.id, color.hex]));
    for (const color of palette) {
      map.set(color.id, color.hex);
    }
    if (primaryColor) {
      map.set(primaryColor.id, primaryColor.hex);
    }
    return map;
  }, [palette, archivedColors, primaryColor]);

  const todoCombinations = combinations.filter((combination) => !(progress[combination.id]?.done ?? false));
  const doneCombinations = combinations.filter((combination) => progress[combination.id]?.done ?? false);
  const visibleCombinations = tab === 'todo' ? todoCombinations : doneCombinations;

  function handleRemove(id: string) {
    removeCombination(id);
    removeProgress(id);
  }

  return (
    <div>
      <h1 className="croching-page__title">Croching</h1>
      <p className="croching-page__subtitle">Все квадраты, которые вы сохранили в конструкторе.</p>

      <div className="croching-page__tabs">
        <button
          type="button"
          onClick={() => setTab('todo')}
          className={classNames('croching-page__tab', { 'croching-page__tab--active': tab === 'todo' })}
        >
          Надо связать ({todoCombinations.length})
        </button>
        <button
          type="button"
          onClick={() => setTab('done')}
          className={classNames('croching-page__tab', { 'croching-page__tab--active': tab === 'done' })}
        >
          Связано ({doneCombinations.length})
        </button>
      </div>

      {visibleCombinations.length === 0 ? (
        <p className="empty-state croching-page__empty">
          {tab === 'todo' ? 'Все квадраты связаны.' : 'Пока нет связанных квадратов.'}
        </p>
      ) : (
        <div className="croching-page__grid">
          {visibleCombinations.map((combination) => (
            <TrackedSquareCard
              key={combination.id}
              combination={combination}
              colorById={colorById}
              done={progress[combination.id]?.done ?? false}
              onToggleDone={(id) => setDone(id, !(progress[id]?.done ?? false))}
              onOpen={(id) => navigate(`/croching/${id}`)}
              onDuplicate={duplicateCombination}
              onRemove={setPendingRemoveId}
            />
          ))}
        </div>
      )}

      {pendingRemoveId && (
        <ConfirmDeleteModal
          title="Удалить квадрат?"
          description="Раскраска и прогресс вязания будут удалены. Это действие нельзя отменить."
          onConfirm={() => {
            handleRemove(pendingRemoveId);
            setPendingRemoveId(null);
          }}
          onClose={() => setPendingRemoveId(null)}
        />
      )}
    </div>
  );
}
