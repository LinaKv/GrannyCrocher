// Reads and validates JSON from localStorage. Returns null on missing,
// broken or shape-mismatched data instead of throwing.
export function readJSON<T>(
  key: string,
  isValid: (value: unknown) => value is T,
): T | null {
  const raw = localStorage.getItem(key);
  if (raw === null) {
    return null;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return null;
  }

  return isValid(parsed) ? parsed : null;
}

export function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
