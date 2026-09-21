const HEX_PATTERN = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

export function isValidHex(value: string): boolean {
  return HEX_PATTERN.test(value.trim());
}

// Normalizes #abc / #ABC into full lowercase #aabbcc form.
export function normalizeHex(value: string): string {
  const trimmed = value.trim().toLowerCase();
  if (trimmed.length === 4) {
    const [, r, g, b] = trimmed;
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return trimmed;
}

// Picks readable text color for a label placed on top of a hex fill,
// using the standard relative-luminance contrast formula (WCAG).
export function getReadableTextColor(hex: string): string {
  const normalized = normalizeHex(hex);
  const r = parseInt(normalized.slice(1, 3), 16) / 255;
  const g = parseInt(normalized.slice(3, 5), 16) / 255;
  const b = parseInt(normalized.slice(5, 7), 16) / 255;
  const toLinear = (channel: number) =>
    channel <= 0.03928 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  const luminance = 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return luminance > 0.45 ? '#1e1e1e' : '#ffffff';
}
