import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { usePalette } from '../../hooks/usePalette';
import { usePrimaryColorValue } from '../../hooks/usePrimaryColor';
import { useColorArchive } from '../../hooks/useColorArchive';
import { useSavedCombinations } from '../../hooks/useSavedCombinations';
import { useCrochetProgress } from '../../hooks/useCrochetProgress';
import { TrackedSquareCard } from './components/TrackedSquareCard';
import { CrochingFilterPanel, type RowFilterValue } from './components/CrochingFilterPanel';
import { ConfirmDeleteModal } from '../../components/ConfirmDeleteModal';
import { buildColorMaps, buildRowOptions } from './helpers';

type Tab = 'todo' | 'done';

const ROW_FILTER_COUNT = 5;

export function CrochingPage() {
  const [tab, setTab] = useState<Tab>('todo');
  const [pendingRemoveId, setPendingRemoveId] = useState<string | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [rowFilters, setRowFilters] = useState<RowFilterValue[]>(() => Array(ROW_FILTER_COUNT).fill(null));
  
  const navigate = useNavigate();
  const { palette } = usePalette();
  const [primaryColor] = usePrimaryColorValue();
  const { archivedColors } = useColorArchive();
  const { combinations, duplicate: duplicateCombination, remove: removeCombination } = useSavedCombinations();
  const { progress, setDone, remove: removeProgress } = useCrochetProgress();

  const { colorById, colorRecordById } = buildColorMaps(archivedColors, palette, primaryColor);
  const rowOptions = buildRowOptions(combinations, colorRecordById, ROW_FILTER_COUNT);

  const hasActiveFilter = rowFilters.some((value) => value);

  function matchesRowFilters(combination: (typeof combinations)[number]): boolean {
    return rowFilters.every((filterValue, rowIndex) => {
      if (!filterValue) {
        return true;
      }
      const colorId = combination.rows[rowIndex]?.colorId ?? null;
      return colorId === filterValue;
    });
  }

  function toggleRowFilter(rowIndex: number, value: string | null) {
    setRowFilters((current) =>
      current.map((existing, index) => (index === rowIndex ? (existing === value ? null : value) : existing)),
    );
  }

  function resetRowFilters() {
    setRowFilters(Array(ROW_FILTER_COUNT).fill(null));
  }

  const todoCombinations = combinations.filter(
    (combination) => !(progress[combination.id]?.done ?? false) && matchesRowFilters(combination),
  );
  const doneCombinations = combinations.filter(
    (combination) => (progress[combination.id]?.done ?? false) && matchesRowFilters(combination),
  );
  const visibleCombinations = tab === 'todo' ? todoCombinations : doneCombinations;
  const activeFilterCount = rowFilters.filter((value) => value).length;

  function handleRemove(id: string) {
    removeCombination(id);
    removeProgress(id);
  }

  return (
    <div>
      <h1 className="croching-page__title">Croching</h1>

      <div className="croching-page__header-row">
        <p className="croching-page__subtitle">Все квадраты, которые вы сохранили в конструкторе.</p>

        <div
          className={classNames('croching-page__filter-toggle', {
            'croching-page__filter-toggle--active': filterOpen,
          })}
        >
          <button
            type="button"
            onClick={() => setFilterOpen((current) => !current)}
            aria-label="Фильтр"
            className="croching-page__filter-toggle-trigger"
          >
            <svg viewBox="0 0 16 16" width={16} height={16} aria-hidden="true">
              <line x1="2" y1="4" x2="14" y2="4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="4" y1="8" x2="12" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="6" y1="12" x2="10" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <span className="croching-page__filter-toggle-label">
              Фильтр{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
            </span>
          </button>

          {activeFilterCount > 0 && (
            <>
              <button
                type="button"
                onClick={resetRowFilters}
                aria-label="Сбросить фильтр"
                className="croching-page__filter-toggle-reset"
              >
                ×
              </button>
              <button
                type="button"
                onClick={resetRowFilters}
                aria-label="Сбросить фильтр"
                className="croching-page__filter-toggle-badge"
              >
                ×
              </button>
            </>
          )}
        </div>
      </div>

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

      <CrochingFilterPanel
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
        rowOptions={rowOptions.options}
        rowHasNoColorOption={rowOptions.hasNoColor}
        rowFilters={rowFilters}
        onToggleRow={toggleRowFilter}
        onReset={resetRowFilters}
        hasActiveFilter={hasActiveFilter}
      />

      {visibleCombinations.length === 0 ? (
        <p className="empty-state croching-page__empty">
          {hasActiveFilter
            ? 'Нет квадратов, подходящих под фильтр.'
            : tab === 'todo'
              ? 'Все квадраты связаны.'
              : 'Пока нет связанных квадратов.'}
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
