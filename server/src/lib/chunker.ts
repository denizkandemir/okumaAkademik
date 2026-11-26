/**
 * Belirlenimci Türkçe öbekleyici (E4 "Öbek öbek oku"). A3'te yapay zekâ öbekleriyle değiştirilecek.
 *
 * Kurallar:
 * - Noktalamadan (virgül, nokta, ünlem, soru, iki nokta, noktalı virgül, üç nokta) sonra bölünür.
 * - Sık bağlaçlardan önce bölünür (ve, ama, çünkü, fakat, ile, için, gibi); bağlaç kendisi
 *   noktalamayla bitiyorsa (ör. "kedi gibi.") bölünmez, tek kelimelik öbek kalmasın.
 * - Hiçbir öbek 4 kelimeden uzun değildir: uzun parçalar eşite yakın bölünür (5 → 3 + 2).
 *
 * Öbekler tek boşlukla birleşince paragrafın aynısıdır (`chunks.join(' ') === paragraph`).
 */

const LOCALE = 'tr-TR';
export const MAX_CHUNK_WORDS = 4;
const CONJUNCTIONS = new Set(['ve', 'ama', 'çünkü', 'fakat', 'ile', 'için', 'gibi']);
/** Kelime sonundaki noktalama; ardından kapanan tırnak ya da parantez gelebilir. */
const ENDS_WITH_PUNCTUATION = /[,.;:!?…]["'”’»)]*$/;
/** Kelimenin başındaki ve sonundaki noktalama/tırnak (bağlaç karşılaştırması için). */
const EDGE_PUNCTUATION = /^[^\p{L}]+|[^\p{L}]+$/gu;

function bare(word: string): string {
  return word.replace(EDGE_PUNCTUATION, '').toLocaleLowerCase(LOCALE);
}

/** `words`'ü en fazla `MAX_CHUNK_WORDS` kelimelik, boyları eşite yakın parçalara böler. */
function balance(words: string[]): string[][] {
  const parts = Math.ceil(words.length / MAX_CHUNK_WORDS);
  const result: string[][] = [];
  let start = 0;
  for (let part = 0; part < parts; part++) {
    const size = Math.ceil((words.length - start) / (parts - part));
    result.push(words.slice(start, start + size));
    start += size;
  }
  return result;
}

/** Bir paragrafı anlamlı öbeklere ayırır. */
export function chunkParagraph(paragraph: string): string[] {
  const words = paragraph.split(' ');
  const segments: string[][] = [];
  let current: string[] = [];

  words.forEach((word) => {
    const breakBefore =
      current.length > 0 && CONJUNCTIONS.has(bare(word)) && !ENDS_WITH_PUNCTUATION.test(word);
    if (breakBefore) {
      segments.push(current);
      current = [];
    }
    current.push(word);
    if (ENDS_WITH_PUNCTUATION.test(word)) {
      segments.push(current);
      current = [];
    }
  });
  if (current.length > 0) segments.push(current);

  return segments.flatMap(balance).map((chunk) => chunk.join(' '));
}

/** Paragrafların öbekleri, paragraf sırasıyla. */
export function chunkParagraphs(paragraphs: readonly string[]): string[][] {
  return paragraphs.map(chunkParagraph);
}
