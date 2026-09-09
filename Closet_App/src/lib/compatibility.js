// Hand-authored fabric/style compatibility. Unlisted pairs fall back to a
// neutral default score rather than requiring every combination to be
// filled in up front — extend FABRIC_PAIRS as you notice gaps.

const FABRIC_PAIRS = {
  "cotton|denim": 8,
  "cotton|linen": 7,
  "cotton|silk": 6,
  "denim|leather": 7,
  "denim|knit": 7,
  "silk|athletic": 2,
  "silk|leather": 5,
  "wool|leather": 7,
  "athletic|leather": 3,
  "athletic|silk": 2,
  "linen|wool": 4,
};

function pairKey(a, b) {
  return [a, b].sort().join("|");
}

/** Scores how well two fabrics pair, 0–10. */
export function fabricScore(fabricA, fabricB) {
  if (!fabricA || !fabricB) return 5;
  if (fabricA === fabricB) return 7; // same fabric is safe, if a little unadventurous
  return FABRIC_PAIRS[pairKey(fabricA, fabricB)] ?? 5;
}

/** Scores style-tag overlap between two items, 0–10 (more shared tags = higher). */
export function styleScore(stylesA = [], stylesB = []) {
  if (stylesA.length === 0 || stylesB.length === 0) return 5;
  const overlap = stylesA.filter((s) => stylesB.includes(s)).length;
  const maxPossible = Math.min(stylesA.length, stylesB.length);
  if (maxPossible === 0) return 5;
  return 4 + (overlap / maxPossible) * 6; // 4 (no overlap) to 10 (full overlap)
}