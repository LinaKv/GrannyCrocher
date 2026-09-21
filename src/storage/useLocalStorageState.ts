import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';
import { readJSON, writeJSON } from './localStorage';

export function useLocalStorageState<T>(
  key: string,
  isValid: (value: unknown) => value is T,
  defaultValue: T,
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => readJSON(key, isValid) ?? defaultValue);

  useEffect(() => {
    writeJSON(key, state);
  }, [key, state]);

  return [state, setState];
}
