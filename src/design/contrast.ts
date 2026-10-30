/**
 * WCAG 2 kontrast oranı. `scripts/check-contrast.mjs` ve tasarım vitrini kullanır; Node'un
 * doğrudan okuyabilmesi için import içermez.
 */

/** "#RGB", "#RRGGBB" ya da "#RRGGBBAA" (saydamlık yok sayılır) → [r, g, b] (0-255). */
function parseHex(hex: string): [number, number, number] {
  const value = hex.replace('#', '');
  const full =
    value.length === 3 || value.length === 4
      ? value
          .slice(0, 3)
          .split('')
          .map((c) => c + c)
          .join('')
      : value.slice(0, 6);
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

function luminance(hex: string): number {
  const [r, g, b] = parseHex(hex).map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/** İki rengin kontrast oranı (1-21). */
export function contrastRatio(a: string, b: string): number {
  const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (light + 0.05) / (dark + 0.05);
}

/** Metin için 4,5:1; büyük metin ve ikon için 3:1. */
export const CONTRAST_MIN = { text: 4.5, large: 3, icon: 3 } as const;
