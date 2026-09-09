// Pure color-wheel math — no ML, no API calls. Converts a hex color to
// HSL and scores two colors based on hue relationships.

function hexToHsl(hex) {
  const clean = hex.replace("#", "");
  const bigint = parseInt(clean, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h *= 60;
  }
  return { h, s, l };
}

// Very desaturated or near-black/near-white colors read as "neutral" —
// they pair fine with almost anything, same as in real styling.
function isNeutral({ s, l }) {
  return s < 0.12 || l < 0.12 || l > 0.92;
}

/**
 * Scores how well two hex colors pair, 0–10.
 * Neutrals score high with anything. Otherwise: analogous (close hues)
 * and complementary (near-opposite hues) score highest, two loud
 * saturated colors 60–120° apart score lowest (a classic clash zone).
 */
export function colorHarmonyScore(hexA, hexB) {
  if (!hexA || !hexB) return 5; // unknown color — neutral default, not a penalty
  const a = hexToHsl(hexA);
  const b = hexToHsl(hexB);

  if (isNeutral(a) || isNeutral(b)) return 9;

  let diff = Math.abs(a.h - b.h);
  if (diff > 180) diff = 360 - diff;

  if (diff <= 30) return 8; // analogous
  if (diff >= 150) return 9; // complementary
  if (diff >= 60 && diff <= 120 && a.s > 0.5 && b.s > 0.5) return 3; // loud clash
  return 6;
}