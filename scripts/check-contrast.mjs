/**
 * Tasarım renklerinin kontrastını denetler (src/design/tokens.ts). Bir çift eşiğin altındaysa
 * sıfırdan farklı çıkış koduyla biter.
 *
 * - Metin: en az 4,5:1
 * - Büyük metin (≥ 18 kalın ya da ≥ 24) ve ikon: en az 3:1
 *
 * Çiftler aşağıda token adlarıyla listelenir; arayüzde metin ya da ikon olarak kullanılan her
 * renk, üstünde durduğu her zeminle birlikte burada olmalı.
 *
 * Kullanım: npm run design:contrast
 * (TS dosyalarını okumak için Node 22'de --experimental-strip-types gerekir; script bunu verir.)
 */
import { CONTRAST_MIN, contrastRatio } from '../src/design/contrast.ts';
import { colors } from '../src/design/tokens.ts';

/** Metnin durduğu genel zeminler. */
const SURFACES = ['background', 'surface', 'surfaceRaised', 'chapterBar'];

/** [ön plan, zemin, tür] — tür: text | large | icon */
const PAIRS = [
  // Genel metin
  ...SURFACES.flatMap((bg) => [
    ['text', bg, 'text'],
    ['textMuted', bg, 'text'],
    ['eyebrow', bg, 'text'],
    ['formLabel', bg, 'text'],
    ['accent', bg, 'text'],
    ['danger', bg, 'text'],
    ['readingText', bg, 'text'],
    ['resultNumber', bg, 'large'],
  ]),
  ['rewardRow.icon', 'surfaceRaised', 'icon'],
  ['iconButton.icon', 'iconButton.face', 'icon'],
  ['text', 'chip', 'text'],
  ['text', 'option.badge', 'text'],
  ['text', 'closeButton', 'icon'],
  ['landmark', 'background', 'text'],

  // Düğmeler
  ['primary.text', 'primary.face', 'text'],
  ['secondary.text', 'secondary.face', 'text'],

  // Alt çubuk
  ['tab.active', 'tab.pill', 'text'],
  ['tab.active', 'surface', 'text'],
  ['tab.inactive', 'surface', 'text'],

  // Üst çubuk
  ['avatar.text', 'avatar.background', 'text'],

  // Seçenekler (metin her durumda ana metin rengi)
  ['text', 'option.default.background', 'text'],
  ['text', 'option.selected.background', 'text'],
  ['text', 'option.correct.background', 'text'],
  ['text', 'option.wrong.background', 'text'],

  // Geri bildirim, tema etiketi, bildirim
  ['feedback.wrong.text', 'feedback.wrong.background', 'text'],
  ['feedback.right.text', 'feedback.right.background', 'text'],
  ['themeTag.text', 'themeTag.background', 'text'],
  ['notification.text', 'notification.background', 'text'],

  // Metin alanı ve onay kutusu
  ['input.text', 'input.background', 'text'],
  ['input.placeholder', 'input.background', 'text'],
  ['toggle.check', 'toggle.on', 'icon'],
  ['toggle.border', 'surfaceRaised', 'icon'],
  ['toggle.on', 'background', 'icon'],

  // Harita düğümleri (ikon düğüm zemininde)
  ['node.done.icon', 'node.done.fill', 'icon'],
  ['node.current.icon', 'node.current.fill', 'icon'],
  ['node.locked.icon', 'node.locked.fill', 'icon'],
  ['node.chest.icon', 'node.chest.fill', 'icon'],
  ['node.medal.icon', 'node.medal.fill', 'icon'],

  // Ödüller ve sertifika
  ['medal.text', 'medal.face', 'text'],
  ['certificate.name', 'certificate.background', 'large'],
  ['star.stroke', 'background', 'icon'],
  ['accent', 'bubble.background', 'text'],
];

function resolve(name) {
  const value = name.split('.').reduce((node, key) => node?.[key], colors);
  if (typeof value !== 'string') throw new Error(`Bilinmeyen renk token'ı: ${name}`);
  return value;
}

const problems = [];
for (const [fg, bg, kind] of PAIRS) {
  const ratio = contrastRatio(resolve(fg), resolve(bg));
  const min = CONTRAST_MIN[kind];
  const line = `${ratio.toFixed(2).padStart(5)}:1  ${kind.padEnd(5)}  ${fg} / ${bg}`;
  if (ratio < min) problems.push(`${line}  (en az ${min}:1)`);
  else console.log(`  ok  ${line}`);
}

if (problems.length > 0) {
  console.error(`\n${problems.length} çift eşiğin altında:`);
  for (const problem of problems) console.error(`  ✗ ${problem}`);
  process.exitCode = 1;
} else {
  console.log(`\n${PAIRS.length} çiftin hepsi eşiği geçiyor.`);
}
