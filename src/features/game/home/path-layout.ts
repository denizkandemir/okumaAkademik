/**
 * Ders yolunun geometrisi (AnaSayfa.dc.html): düğümler dikey bir zikzakta, aralarında yumuşak
 * kübik eğriler. Tüm ölçüler 390 dp genişliğe göre; daha dar ekranlarda yatay salınım küçülür.
 */

export const NODE_SIZE = 72;
export const CURRENT_NODE_SIZE = 80;
/** İki düğüm merkezi arasındaki dikey uzaklık. */
export const NODE_GAP = 92;
/** İlk düğüm merkezinin yol alanının üstünden uzaklığı (tasarımda 40). */
const FIRST_NODE_Y = 40;
/** Düğümlerin merkezden en fazla yatay sapması (390 dp'de). */
const AMPLITUDE = 60;
/** Son düğümden sonra yolun aşağı doğru uzayan kısmı. */
const TAIL = NODE_GAP / 2;

export type Point = { x: number; y: number };

/** `count` düğümün merkezleri; `width` yol alanının genişliği. */
export function nodeCenters(count: number, width: number): Point[] {
  const amplitude = AMPLITUDE * Math.min(1, width / 390);
  return Array.from({ length: count }, (_, index) => ({
    x: width / 2 + amplitude * Math.sin((index * Math.PI) / 2.5),
    y: FIRST_NODE_Y + index * NODE_GAP,
  }));
}

/** Son düğümün altında yıldızlar ve kuyruk için bırakılan boşlukla yol alanının yüksekliği. */
export function pathHeight(count: number): number {
  return FIRST_NODE_Y + Math.max(0, count - 1) * NODE_GAP + CURRENT_NODE_SIZE / 2 + TAIL + 24;
}

function segment(from: Point, to: Point): string {
  const bend = (to.y - from.y) / 2;
  return `C ${from.x} ${from.y + bend}, ${to.x} ${to.y - bend}, ${to.x} ${to.y}`;
}

/** `from`. düğümden `to`. düğüme kadar eğri (SVG `d`); `tail` ise sondan aşağı uzar. */
export function curveBetween(points: Point[], from: number, to: number, tail = false): string {
  const start = points[from];
  if (!start) return '';
  let d = `M ${start.x} ${start.y}`;
  for (let index = from; index < to; index++) {
    const a = points[index];
    const b = points[index + 1];
    if (a && b) d += ` ${segment(a, b)}`;
  }
  const last = points[to];
  if (tail && last) d += ` ${segment(last, { x: last.x, y: last.y + TAIL })}`;
  return d;
}
