// Geometry for one "item" (a 3-double-crochet cluster) on the granny square
// chart: three lines fanned from a shared base point to three spread tips.

export interface StitchItem {
  base: [number, number];
  tips: [[number, number], [number, number], [number, number]];
}

const CORNER_ANGLES = [Math.PI / 4, (3 * Math.PI) / 4, (5 * Math.PI) / 4, (7 * Math.PI) / 4];
const CORNER_ITEM_SPREAD = 0.22; // angle between the two items of a corner "V"
const ITEM_FAN_SPREAD = 0.16; // angle between each of the 3 lines within one item

// Point on the boundary of an axis-aligned square (half-size `half`) in the given direction.
function squareBoundaryPoint(angle: number, half: number): [number, number] {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const scale = half / Math.max(Math.abs(cos), Math.abs(sin));
  return [cos * scale, sin * scale];
}

function buildItem(angle: number, innerHalf: number, outerHalf: number): StitchItem {
  return {
    base: squareBoundaryPoint(angle, innerHalf),
    tips: [
      squareBoundaryPoint(angle - ITEM_FAN_SPREAD, outerHalf),
      squareBoundaryPoint(angle, outerHalf),
      squareBoundaryPoint(angle + ITEM_FAN_SPREAD, outerHalf),
    ],
  };
}

// Round 1 (roundIndex 0): one item per corner, no side items.
// Round n >= 2: each corner gets a 2-item "V", each side gets (n - 2) items
// evenly spaced between the corner pairs.
export function buildRoundItems(roundIndex: number, innerHalf: number, outerHalf: number): StitchItem[] {
  const roundNumber = roundIndex + 1;
  const items: StitchItem[] = [];

  for (let corner = 0; corner < 4; corner += 1) {
    const cornerAngle = CORNER_ANGLES[corner];
    const angles =
      roundNumber === 1
        ? [cornerAngle]
        : [cornerAngle - CORNER_ITEM_SPREAD / 2, cornerAngle + CORNER_ITEM_SPREAD / 2];
    angles.forEach((angle) => items.push(buildItem(angle, innerHalf, outerHalf)));

    const sideItemCount = Math.max(0, roundNumber - 2);
    if (sideItemCount > 0) {
      const rawNextAngle = CORNER_ANGLES[(corner + 1) % 4];
      const nextCornerAngle = rawNextAngle < cornerAngle ? rawNextAngle + 2 * Math.PI : rawNextAngle;
      const span = nextCornerAngle - cornerAngle;
      for (let k = 1; k <= sideItemCount; k += 1) {
        const angle = cornerAngle + (span * k) / (sideItemCount + 1);
        items.push(buildItem(angle, innerHalf, outerHalf));
      }
    }
  }

  return items;
}
