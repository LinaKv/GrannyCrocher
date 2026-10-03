import { NavLink } from 'react-router-dom';
import classNames from 'classnames';
import { usePalette } from '../hooks/usePalette';
import { usePrimaryColorValue } from '../hooks/usePrimaryColor';
import { useSavedCombinations } from '../hooks/useSavedCombinations';
import { useCardiganLayout } from '../hooks/useCardiganLayout';
import { CombinationsFileActions } from '../components/CombinationsFileActions';
import { downloadCombinationsFile, type CombinationsFile } from '../utils/combinationsFile';

const NAV_ITEMS = [
  { to: '/', label: 'Конструктор', end: true },
  { to: '/croching', label: 'Croching', end: false },
  { to: '/cardigan', label: 'Кардиган', end: false },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { palette, replace: replacePalette } = usePalette();
  const [primaryColor, setPrimaryColor] = usePrimaryColorValue();
  const { combinations, replace: replaceCombinations } = useSavedCombinations();
  const { assignments: cardiganLayout, replace: replaceCardiganLayout } = useCardiganLayout();

  function handleExportCombinations() {
    downloadCombinationsFile({ combinations, palette, primaryColor, cardiganLayout });
  }

  function handleImportCombinations(data: CombinationsFile) {
    replacePalette(data.palette);
    setPrimaryColor(data.primaryColor);
    replaceCombinations(data.combinations);
    replaceCardiganLayout(data.cardiganLayout);
  }

  return (
    <>
      {isOpen && <div className="sidebar__backdrop" onClick={onClose} />}
      <nav className={classNames('sidebar', 'flex', 'flex-col', { 'sidebar--open': isOpen })}>
        <div className="sidebar__nav flex flex-col">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={onClose}
              className={({ isActive }) => (isActive ? 'sidebar__link sidebar__link--active' : 'sidebar__link')}
            >
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="sidebar__file-actions">
          <CombinationsFileActions onImport={handleImportCombinations} onExport={handleExportCombinations} />
        </div>
      </nav>
    </>
  );
}
