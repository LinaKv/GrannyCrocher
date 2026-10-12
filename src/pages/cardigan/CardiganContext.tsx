import { createContext, useContext } from 'react';
import type { SavedCombination } from '../../types';
import type { CardiganAssignments } from '../../hooks/useCardiganLayout';

interface CardiganContextValue {
  colorById: Map<string, string>;
  combinations: SavedCombination[];
  assignments: CardiganAssignments;
}

export const CardiganContext = createContext<CardiganContextValue | null>(null);

export function useCardiganContext(): CardiganContextValue {
  const value = useContext(CardiganContext);
  if (value === null) {
    throw new Error('useCardiganContext must be used within CardiganContext.Provider');
  }
  return value;
}
