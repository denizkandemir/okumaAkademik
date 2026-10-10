/**
 * Maskot görsellerini denetler. Bir sorun bulursa sıfırdan farklı çıkış koduyla biter.
 *
 * 1. mascot-assets.ts'teki her require() var olan bir optimized/ dosyasını göstermeli.
 * 2. optimized/ içindeki her WebP'nin aynı adlı bir kaynak PNG'si olmalı (eski dosya kalmamalı).
 * 3. Her kaynak PNG'nin bir WebP'si olmalı (optimize edilmeyi unutulmuş dosya kalmamalı).
 * 4. Her WebP çözülebilmeli, 768×768 olmalı ve alfa kanalında görünür piksel bulunmalı.
 *
 * Kullanım: npm run mascot:check
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vips from 'wasm-vips';

const SIZE = 768;
/** Bu değerin üzerindeki alfa "görünür" sayılır. */
const VISIBLE_ALPHA = 16;
/** Görünür piksellerin en az bu oranda olması beklenir (kedi tuvalin büyük kısmını kaplar). */
const MIN_VISIBLE_RATIO = 0.05;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'assets', 'mascot');
const optimizedDir = path.join(sourceDir, 'optimized');
const assetsFile = path.join(root, 'src', 'features', 'mascot', 'mascot-assets.ts');

const problems = [];
const baseName = (file) => path.parse(file).name;

const sources = (await readdir(sourceDir)).filter((name) => name.toLowerCase().endsWith('.png'));
const optimized = (await readdir(optimizedDir)).filter((name) => name !== '.DS_Store');
const sourceNames = new Set(sources.map(baseName));
const optimizedNames = new Set(optimized.map(baseName));

const referenced = [
  ...(await readFile(assetsFile, 'utf8')).matchAll(
    /require\(\s*['"]@\/assets\/mascot\/optimized\/([^'"]+)['"]\s*\)/g,
  ),
].map((match) => match[1]);
if (referenced.length === 0)
  problems.push('mascot-assets.ts içinde hiç optimized/ require() bulunamadı.');

for (const file of referenced) {
  if (!optimized.includes(file))
    problems.push(`mascot-assets.ts eksik dosyayı gösteriyor: ${file}`);
}
for (const file of optimized) {
  if (!file.endsWith('.webp')) problems.push(`optimized/ içinde WebP olmayan dosya: ${file}`);
  if (!sourceNames.has(baseName(file)))
    problems.push(`Kaynak PNG'si olmayan WebP (eski dosya?): ${file}`);
}
for (const file of sources) {
  if (!optimizedNames.has(baseName(file))) {
    problems.push(`WebP'si olmayan kaynak PNG (npm run mascot:optimize): ${file}`);
  }
}
const unused = optimized.filter((file) => !referenced.includes(file));
for (const file of unused) problems.push(`mascot-assets.ts'te kullanılmayan WebP: ${file}`);

const vips = await Vips();
console.log('Dosya'.padEnd(36), 'Boyut'.padEnd(9), 'Kanal', 'Görünür piksel');
for (const file of optimized.filter((name) => name.endsWith('.webp')).sort()) {
  let line;
  try {
    const image = vips.Image.newFromBuffer(await readFile(path.join(optimizedDir, file)));
    const { width, height, bands } = image;
    const pixels = image.writeToMemory();
    image.delete();
    let visible = 0;
    if (bands === 4) {
      for (let i = 3; i < pixels.length; i += 4) if (pixels[i] > VISIBLE_ALPHA) visible += 1;
    }
    const ratio = visible / (width * height);
    line = `${`${width}x${height}`.padEnd(9)} ${String(bands).padEnd(5)} %${(ratio * 100).toFixed(1)}`;
    if (width !== SIZE || height !== SIZE)
      problems.push(`${file}: ${width}x${height}, ${SIZE}x${SIZE} bekleniyordu`);
    if (bands !== 4) problems.push(`${file}: alfa kanalı yok (${bands} kanal)`);
    else if (ratio < MIN_VISIBLE_RATIO)
      problems.push(`${file}: neredeyse tamamen saydam (%${(ratio * 100).toFixed(1)})`);
  } catch (error) {
    line = 'ÇÖZÜLEMEDİ';
    problems.push(`${file}: çözülemedi (${error?.message ?? error})`);
  }
  console.log(file.padEnd(36), line);
}
vips.shutdown();

console.log(
  `\n${sources.length} kaynak PNG, ${optimized.length} WebP, mascot-assets.ts'te ${referenced.length} require().`,
);
if (problems.length > 0) {
  console.error(`\n${problems.length} sorun bulundu:\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Tüm maskot görselleri tutarlı.');
