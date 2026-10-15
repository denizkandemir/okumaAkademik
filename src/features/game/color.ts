/** Renk yardımcıları: WCAG kontrast oranı ve beyaz yazı için koyulaştırma. Yalnızca #RRGGBB. */

type Rgb = readonly [number, number, number];

function parseHex(hex: string): Rgb | null {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  if (!match) return null;
  const value = parseInt(match[1] ?? '', 16);
  return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
}

function toHex([r, g, b]: Rgb): string {
  return `#${[r, g, b].map((channel) => Math.round(channel).toString(16).padStart(2, '0')).join('')}`;
}

/** WCAG 2 bağıl parlaklık. */
function luminance([r, g, b]: Rgb): number {
  const linear = (channel: number) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * linear(r) + 0.7152 * linear(g) + 0.0722 * linear(b);
}

/** İki renk arasındaki WCAG kontrast oranı (1-21). */
export function contrastRatio(a: string, b: string): number {
  const rgbA = parseHex(a);
  const rgbB = parseHex(b);
  if (!rgbA || !rgbB) return 1;
  const [light, dark] = [luminance(rgbA), luminance(rgbB)].sort((x, y) => y - x);
  return ((light ?? 0) + 0.05) / ((dark ?? 0) + 0.05);
}

/**
 * Renkleri, üstlerindeki beyaz yazı en az `minRatio` kontrast verene kadar aynı oranda koyulaştırır
 * (siyahla karıştırır; ton korunur). Zaten yeterliyse renkler değişmez.
 */
export function darkenForWhiteText<T extends readonly string[]>(colors: T, minRatio = 4.5): T {
  const parsed: Rgb[] = [];
  for (const color of colors) {
    const rgb = parseHex(color);
    if (!rgb) return colors;
    parsed.push(rgb);
  }
  for (let step = 0; step <= 90; step++) {
    const keep = 1 - step / 100;
    const mixed = parsed.map(([r, g, b]) => toHex([r * keep, g * keep, b * keep]));
    if (mixed.every((color) => contrastRatio(color, '#FFFFFF') >= minRatio)) {
      // Aynı uzunlukta bir dizi; çağıranın demet tipi (ör. LinearGradient renkleri) korunur.
      return mixed as readonly string[] as T;
    }
  }
  return colors;
}
