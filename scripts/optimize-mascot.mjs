/**
 * assets/mascot/*.png → assets/mascot/optimized/*.webp (768×768, kalite 85, saydamlık korunur).
 *
 * WASM tabanlı wasm-vips kullanılır; yerel (.node) ikili dosya gerektirmez. Kaynak PNG'ler
 * değiştirilmez, uygulama yalnızca optimized/ klasöründeki dosyaları kullanır.
 *
 * Kullanım: npm run mascot:optimize
 */
import { mkdir, readdir, readFile, stat, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Vips from 'wasm-vips';

const SIZE = 768;
const QUALITY = 85;
const MAX_BYTES = 150 * 1024;

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const sourceDir = path.join(root, 'assets', 'mascot');
const outputDir = path.join(sourceDir, 'optimized');

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const vips = await Vips();
await mkdir(outputDir, { recursive: true });

const files = (await readdir(sourceDir))
  .filter((name) => name.toLowerCase().endsWith('.png'))
  .sort();
if (files.length === 0) {
  console.error(`PNG bulunamadı: ${sourceDir}`);
  process.exit(1);
}

let totalBefore = 0;
let totalAfter = 0;
const tooLarge = [];

for (const name of files) {
  const input = await readFile(path.join(sourceDir, name));
  // thumbnail: Lanczos ile küçültür, saydam kenarlarda koyu hale oluşmasın diye alfa çarpımlı çalışır.
  const image = vips.Image.thumbnailBuffer(input, SIZE, { height: SIZE });
  const output = image.webpsaveBuffer({
    Q: QUALITY,
    alpha_q: 100,
    effort: 6,
    smart_subsample: true,
  });
  image.delete();

  const outName = `${path.parse(name).name}.webp`;
  await writeFile(path.join(outputDir, outName), output);

  const before = (await stat(path.join(sourceDir, name))).size;
  totalBefore += before;
  totalAfter += output.byteLength;
  if (output.byteLength > MAX_BYTES) tooLarge.push(outName);
  console.log(
    `${outName.padEnd(38)} ${kb(before).padStart(10)} → ${kb(output.byteLength).padStart(9)}`,
  );
}

console.log('-'.repeat(62));
console.log(
  `${`${files.length} dosya`.padEnd(38)} ${kb(totalBefore).padStart(10)} → ${kb(totalAfter).padStart(9)}`,
);

vips.shutdown();

if (tooLarge.length > 0) {
  console.warn(`Uyarı: ${kb(MAX_BYTES)} sınırını aşan dosyalar: ${tooLarge.join(', ')}`);
  process.exitCode = 1;
}
