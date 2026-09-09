import { colorHarmonyScore } from "./colorHarmony";
import { fabricScore, styleScore } from "./compatibility";

// occasionIncludeOnly, if present, is a hard restriction: the item is ONLY
// valid for those occasions. Otherwise occasionExclude blocks specific ones.
// With neither set, the item is assumed fine for anything.
export function isValidForOccasion(item, occasion) {
  if (item.occasionIncludeOnly?.length) return item.occasionIncludeOnly.includes(occasion);
  if (item.occasionExclude?.length) return !item.occasionExclude.includes(occasion);
  return true;
}

/**
 * Builds every top/bottom pair for the given occasion, scores each on
 * color harmony + fabric compatibility + style overlap, and returns the
 * top-scoring slice as a pool (not just the single best pair) so the
 * "surprise me" pick still has some variety instead of always landing
 * on the exact same outfit.
 */
export function generateOutfits(tops, bottoms, occasion, { poolFraction = 0.3, minPoolSize = 3 } = {}) {
  const validTops = tops.filter((t) => isValidForOccasion(t, occasion));
  const validBottoms = bottoms.filter((b) => isValidForOccasion(b, occasion));

  const combos = [];
  for (const top of validTops) {
    for (const bottom of validBottoms) {
      const color = colorHarmonyScore(top.primaryColor?.hex, bottom.primaryColor?.hex);
      const fabric = fabricScore(top.fabric, bottom.fabric);
      const style = styleScore(top.styleTags, bottom.styleTags);
      const score = color * 0.4 + fabric * 0.3 + style * 0.3;
      combos.push({ top, bottom, score, breakdown: { color, fabric, style } });
    }
  }

  combos.sort((a, b) => b.score - a.score);
  const poolSize = Math.max(minPoolSize, Math.ceil(combos.length * poolFraction));
  return combos.slice(0, poolSize);
}