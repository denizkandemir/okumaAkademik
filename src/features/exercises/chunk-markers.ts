import type { CueLevel } from '@/features/exercises/types';

/** Cümle sonu: öbek nokta, ünlem, soru ya da üç noktayla biter (ardından kapanan tırnak olabilir). */
const SENTENCE_END = /[.!?…]["'”’»)]*$/;
/** "Yarım" ipucunda yalnızca bundan uzun cümlelerde öbek işareti gösterilir. */
export const LONG_SENTENCE_WORDS = 8;

const wordsIn = (chunk: string) => chunk.split(' ').length;

/**
 * Bir paragrafın öbeklerinden sonra "/" işareti olup olmadığı (öbek başına). Son öbekten sonra
 * işaret yoktur. `full`: her öbekten sonra; `half`: yalnızca uzun cümlelerin içinde (cümle
 * sonunda değil); `none`: hiç.
 */
export function chunkMarkers(chunks: readonly string[], cueLevel: CueLevel): boolean[] {
  if (cueLevel === 'none') return chunks.map(() => false);
  if (cueLevel === 'full') return chunks.map((_, index) => index < chunks.length - 1);

  // Öbekleri cümlelere grupla; uzun cümlenin içindeki öbek sınırları işaretlenir.
  const markers = chunks.map(() => false);
  let sentence: number[] = [];
  const close = () => {
    const words = sentence.reduce((sum, index) => sum + wordsIn(chunks[index] ?? ''), 0);
    if (words > LONG_SENTENCE_WORDS) {
      sentence.slice(0, -1).forEach((index) => {
        markers[index] = true;
      });
    }
    sentence = [];
  };
  chunks.forEach((chunk, index) => {
    sentence.push(index);
    if (SENTENCE_END.test(chunk)) close();
  });
  if (sentence.length > 0) close();
  return markers;
}
