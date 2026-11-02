import type { CityId } from '@/design/cities';

/**
 * Yolculuk haritasının düzeni (docs/tasarim, 01-06-yolculuk). Saf veri ve hesap; çizim yok.
 *
 * Harita ekran genişliğindedir, yüksekliği `MAP_ASPECT` × genişliktir. Şehrin 1024×1536 arka planı
 * `contentFit="cover"` ile ortalanır; bu oranda görüntünün ortadaki yaklaşık %42'lik dikey dilimi
 * görünür. Aşağıdaki konumlar o dilime bakılarak seçildi:
 * - düğümler boyalı kum yolunu / açık zemini izler,
 * - üstteki simge yapılar (Galata ve köprü, Kordon, Celsus Kütüphanesi, Kaleiçi limanı,
 *   peribacaları ve balonlar, Van Gölü ve dağlar) haritanın ilk ~%20'sinde kalır; düğümler onun
 *   altından başlar,
 * - bölüm kartı simge yapının olmadığı üst köşeye konur (`title`).
 *
 * Konumlar kesirdir: x genişliğin (0-1), y harita yüksekliğinin kesri; düğümler için merkez.
 */

/** Harita yüksekliği / genişlik. Panoda 1240/430 ≈ 2,9; 10 düğüm ve etiketlerine yer açmak için
 * biraz daha uzun. */
export const MAP_ASPECT = 3.6;

/** Bir şehirdeki ders sayısı (5. ve 10. sandık). */
export const NODES_PER_CITY = 10;

export type Point = { x: number; y: number };

export type MapLayout = {
  /** 10 dersin merkezleri, sırasıyla (1-10). */
  nodes: readonly Point[];
  /** İtalik yer notunun sol üst köşesi. */
  landmark: Point;
  /** Bölüm kartının köşesi: simge yapıyı örtmeyen taraf. */
  title: 'left' | 'right';
};

export const CITY_MAP_LAYOUTS: Record<CityId, MapLayout> = {
  // Galata ve köprü üstte; solda ve sağda deniz koyları, ortada kumsal.
  istanbul: {
    nodes: [
      { x: 0.5, y: 0.23 },
      { x: 0.66, y: 0.295 },
      { x: 0.48, y: 0.36 },
      { x: 0.34, y: 0.425 },
      { x: 0.56, y: 0.49 },
      { x: 0.68, y: 0.555 },
      { x: 0.5, y: 0.62 },
      { x: 0.34, y: 0.685 },
      { x: 0.5, y: 0.75 },
      { x: 0.62, y: 0.815 },
    ],
    landmark: { x: 0.72, y: 0.63 },
    title: 'left',
  },
  // Kordon ve palmiyeler üstte; altta solda ağaçlar.
  izmir: {
    nodes: [
      { x: 0.56, y: 0.27 },
      { x: 0.72, y: 0.33 },
      { x: 0.56, y: 0.39 },
      { x: 0.36, y: 0.45 },
      { x: 0.56, y: 0.51 },
      { x: 0.75, y: 0.57 },
      { x: 0.6, y: 0.63 },
      { x: 0.72, y: 0.69 },
      { x: 0.62, y: 0.75 },
      { x: 0.74, y: 0.81 },
    ],
    landmark: { x: 0.05, y: 0.3 },
    title: 'left',
  },
  // Celsus Kütüphanesi sol üstte (kart sağda); altta deniz.
  efes: {
    nodes: [
      { x: 0.5, y: 0.22 },
      { x: 0.64, y: 0.29 },
      { x: 0.5, y: 0.36 },
      { x: 0.36, y: 0.43 },
      { x: 0.52, y: 0.49 },
      { x: 0.68, y: 0.55 },
      { x: 0.56, y: 0.62 },
      { x: 0.39, y: 0.68 },
      { x: 0.5, y: 0.74 },
      { x: 0.64, y: 0.8 },
    ],
    landmark: { x: 0.05, y: 0.56 },
    title: 'right',
  },
  // Kaleiçi ve liman üstte, sol köşede eski evler (kart sağda); yanlarda ağaçlar.
  antalya: {
    nodes: [
      { x: 0.5, y: 0.29 },
      { x: 0.64, y: 0.35 },
      { x: 0.48, y: 0.41 },
      { x: 0.36, y: 0.47 },
      { x: 0.52, y: 0.53 },
      { x: 0.66, y: 0.59 },
      { x: 0.52, y: 0.65 },
      { x: 0.39, y: 0.71 },
      { x: 0.52, y: 0.77 },
      { x: 0.64, y: 0.83 },
    ],
    landmark: { x: 0.05, y: 0.31 },
    title: 'right',
  },
  // Peribacaları sol üstte, balon sağ üst kenarda (kart sağda, balonun solunda).
  kapadokya: {
    nodes: [
      { x: 0.5, y: 0.24 },
      { x: 0.64, y: 0.31 },
      { x: 0.5, y: 0.38 },
      { x: 0.39, y: 0.45 },
      { x: 0.56, y: 0.51 },
      { x: 0.68, y: 0.57 },
      { x: 0.56, y: 0.64 },
      { x: 0.43, y: 0.7 },
      { x: 0.56, y: 0.77 },
      { x: 0.66, y: 0.83 },
    ],
    landmark: { x: 0.05, y: 0.5 },
    title: 'right',
  },
  // Van Gölü ve karlı dağlar üstte; altta kayalar ve çiçekler.
  van: {
    nodes: [
      { x: 0.5, y: 0.31 },
      { x: 0.64, y: 0.37 },
      { x: 0.5, y: 0.43 },
      { x: 0.36, y: 0.49 },
      { x: 0.5, y: 0.55 },
      { x: 0.66, y: 0.61 },
      { x: 0.54, y: 0.67 },
      { x: 0.41, y: 0.73 },
      { x: 0.54, y: 0.79 },
      { x: 0.66, y: 0.85 },
    ],
    landmark: { x: 0.05, y: 0.36 },
    title: 'left',
  },
};

export type MapGeometry = {
  width: number;
  height: number;
  /** Düğüm merkezleri (px), sırasıyla. */
  points: Point[];
  /** Merkezlerden geçen tek yumuşak eğri (SVG `d`). */
  path: string;
};

/**
 * Kesirli konumları verilen genişlik için piksele çevirir ve yolu üretir. Eğri Catmull-Rom
 * eğrisinin kübik Bezier karşılığıdır: her düğümden geçer, köşe yapmaz.
 */
export function mapGeometry(layout: MapLayout, width: number): MapGeometry {
  const height = Math.round(width * MAP_ASPECT);
  const points = layout.nodes.map(({ x, y }) => ({ x: x * width, y: y * height }));
  return { width, height, points, path: smoothPath(points) };
}

/** Kesirli bir noktayı piksele çevirir. */
export function toPixels(point: Point, geometry: Pick<MapGeometry, 'width' | 'height'>): Point {
  return { x: point.x * geometry.width, y: point.y * geometry.height };
}

function smoothPath(points: Point[]): string {
  const [first] = points;
  if (!first) return '';
  const round = (value: number) => Math.round(value * 10) / 10;
  let d = `M${round(first.x)} ${round(first.y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i]!;
    const p1 = points[i]!;
    const p2 = points[i + 1]!;
    const p3 = points[i + 2] ?? p2;
    const c1 = { x: p1.x + (p2.x - p0.x) / 6, y: p1.y + (p2.y - p0.y) / 6 };
    const c2 = { x: p2.x - (p3.x - p1.x) / 6, y: p2.y - (p3.y - p1.y) / 6 };
    d += ` C${round(c1.x)} ${round(c1.y)} ${round(c2.x)} ${round(c2.y)} ${round(p2.x)} ${round(p2.y)}`;
  }
  return d;
}
