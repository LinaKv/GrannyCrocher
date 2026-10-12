import classNames from 'classnames';
import { HeartSwatch } from '../../constructor/components/HeartSwatch';

export interface RowColorOption {
  colorId: string;
  hex: string;
  code?: string;
}

export type RowFilterValue = string | null;

interface CrochingFilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  rowOptions: RowColorOption[][];
  rowHasNoColorOption: boolean[];
  rowFilters: RowFilterValue[];
  onToggleRow: (rowIndex: number, value: string | null) => void;
  onReset: () => void;
  hasActiveFilter: boolean;
}

export function CrochingFilterPanel({
  isOpen,
  onClose,
  rowOptions,
  rowHasNoColorOption,
  rowFilters,
  onToggleRow,
  onReset,
  hasActiveFilter,
}: CrochingFilterPanelProps) {
  return (
    <>
      {isOpen && <div className="croching-filter-drawer__backdrop" onClick={onClose} />}
      <div className={classNames('croching-filter-drawer', { 'croching-filter-drawer--open': isOpen })}>
        <div className="croching-filter-drawer__header flex items-center justify-between">
          <h2 className="croching-filter-drawer__title">Фильтр</h2>
          <button type="button" onClick={onClose} aria-label="Закрыть" className="croching-filter-drawer__close">
            ×
          </button>
        </div>

        {rowOptions.map((options, rowIndex) => (
          <div key={rowIndex} className="croching-filter-drawer__row">
            <p className="croching-filter-drawer__row-label">Ряд {rowIndex + 1}</p>
            <div className="croching-filter-drawer__swatches flex flex-wrap gap-2">
              {options.map((option) => (
                <HeartSwatch
                  key={option.colorId}
                  hex={option.hex}
                  code={option.code}
                  size={40}
                  selected={rowFilters[rowIndex] === option.colorId}
                  onClick={() => onToggleRow(rowIndex, option.colorId)}
                />
              ))}
              {rowHasNoColorOption[rowIndex] && (
                <button
                  type="button"
                  onClick={() => onToggleRow(rowIndex, null)}
                  className={classNames('croching-filter-drawer__no-color', {
                    'croching-filter-drawer__no-color--active': rowFilters[rowIndex] === null,
                  })}
                >
                  Без цвета
                </button>
              )}
            </div>
          </div>
        ))}

        <div className="action-row">
          <button
            type="button"
            onClick={onReset}
            disabled={!hasActiveFilter}
            className="button button--ghost button--sm"
          >
            Сбросить фильтр
          </button>
        </div>
      </div>
    </>
  );
}
