/**
 * Belirlenimci Türkçe hece ayırıcı (E11 "Hece hece oku"). Uygulama hiçbir bölme yapmaz; heceler
 * egzersiz verisinde (`exercise_items.data`) kelime başına saklanır.
 *
 * Kurallar:
 * - Her hecede bir ünlü vardır (`readability.ts` ile aynı ünlüler, şapkalılar dahil).
 * - İki ünlü arasında tek ünsüz sonraki heceye geçer ("ka-pı"); iki ünsüzde ilki kalır, ikincisi
 *   geçer ("kar-deş"); üç ve fazlasında yalnız sonuncusu geçer ("Türk-çe", "kork-tu"). Son ikisi
 *   bir başlangıç kümesiyse (tr, pr, st…) ikisi birlikte geçer ("e-lek-trik", "kon-trol").
 * - İlk ünlüden önceki ünsüzler ilk heceye ("tren", "spor"), son ünlüden sonrakiler son heceye.
 * - Kesme işareti ve kısa çizgi sert sınırdır, önceki parçada kalır ("İs-tan-bul'-da"); diğer
 *   noktalama (tırnak, virgül, nokta) bitişik kalır. Kesmeden sonraki ek ünlüyle başlıyorsa hece
 *   söyleyişe göre ayrılır: kökün son ünsüzü kesmeyle birlikte eke geçer ("E-fe-s'e", "Va-n'a").
 * - Harfler `tr-TR` ile küçültülerek sınıflandırılır (İ → i, I → ı).
 *
 * Hecelerin birleşimi kelimenin kendisidir (hiçbir karakter eklenmez ya da silinmez).
 */

const LOCALE = 'tr-TR';
const VOWEL = /^[aeıioöuüâîû]$/;
const LETTER = /^\p{L}$/u;
/** Kelimeyi parçalara ayıran işaretler; işaret önceki parçada kalır. */
const HARD_BREAK = /^['’-]$/;
/** Kesme işaretleri: ünlüyle başlayan ekte kökün son ünsüzü eke geçer. */
const APOSTROPHE = /^['’]$/;
/** Üç ve fazla ünsüzde birlikte sonraki heceye geçen başlangıç kümeleri. */
const ONSET_CLUSTERS = new Set([
  'tr',
  'pr',
  'br',
  'kr',
  'gr',
  'dr',
  'fr',
  'pl',
  'bl',
  'kl',
  'gl',
  'fl',
  'st',
  'sp',
  'sk',
]);

function isVowel(char: string): boolean {
  return VOWEL.test(char.toLocaleLowerCase(LOCALE));
}

function isConsonant(char: string): boolean {
  return LETTER.test(char) && !isVowel(char);
}

/** Sert sınırı olmayan bir parçayı hecelere ayırır. */
function splitPart(chars: string[]): string[] {
  const vowels = chars.flatMap((char, index) => (isVowel(char) ? [index] : []));
  if (vowels.length < 2) return [chars.join('')];

  const cuts: number[] = [];
  for (let v = 1; v < vowels.length; v++) {
    const from = vowels[v - 1] as number;
    const to = vowels[v] as number;
    const consonants: number[] = [];
    for (let index = from + 1; index < to; index++) {
      if (isConsonant(chars[index] as string)) consonants.push(index);
    }
    // 0 ünsüz: ikinci ünlüden önce; 1: ünsüzden önce; 2: ikinciden önce; 3+: sonuncudan önce,
    // son ikisi başlangıç kümesiyse sondan ikinciden önce.
    const count = consonants.length;
    const lastTwo = consonants
      .slice(-2)
      .map((index) => chars[index] as string)
      .join('')
      .toLocaleLowerCase(LOCALE);
    const cut =
      count === 0
        ? to
        : count === 1
          ? (consonants[0] as number)
          : count === 2
            ? (consonants[1] as number)
            : (consonants[ONSET_CLUSTERS.has(lastTwo) ? count - 2 : count - 1] as number);
    cuts.push(cut);
  }

  const syllables: string[] = [];
  let start = 0;
  for (const cut of cuts) {
    syllables.push(chars.slice(start, cut).join(''));
    start = cut;
  }
  syllables.push(chars.slice(start).join(''));
  return syllables;
}

/**
 * Kesmeden sonra ünlüyle başlayan ek: önceki hecenin kesmeden önceki son ünsüzü, kesmeyle
 * birlikte ekin ilk hecesine geçer ("Van'" + "a" → "Va" + "n'a"). Önceki hece ünlüsüz kalacaksa
 * (ör. "TBMM'e") bir şey taşınmaz.
 */
function moveConsonantToSuffix(syllables: string[], pieces: string[]): void {
  const previous = Array.from(syllables.at(-1) ?? '');
  const suffix = pieces[0];
  const suffixFirst = Array.from(suffix ?? '')[0];
  const apostrophe = previous.at(-1);
  const consonant = previous.at(-2);
  const rest = previous.slice(0, -2);
  if (
    suffix === undefined ||
    suffixFirst === undefined ||
    !isVowel(suffixFirst) ||
    apostrophe === undefined ||
    !APOSTROPHE.test(apostrophe) ||
    consonant === undefined ||
    !isConsonant(consonant) ||
    !rest.some(isVowel)
  ) {
    return;
  }
  syllables[syllables.length - 1] = rest.join('');
  pieces[0] = `${consonant}${apostrophe}${suffix}`;
}

/** Bir kelimeyi (boşluksuz parça; noktalama bitişik olabilir) hecelerine ayırır. */
export function syllabify(word: string): string[] {
  const chars = Array.from(word);
  // Sert sınırlarda parçalara ayır; işaret önceki parçada kalır.
  const parts: string[][] = [[]];
  for (const char of chars) {
    (parts[parts.length - 1] as string[]).push(char);
    if (HARD_BREAK.test(char)) parts.push([]);
  }

  const syllables: string[] = [];
  for (const part of parts) {
    if (part.length === 0) continue;
    const pieces = splitPart(part);
    moveConsonantToSuffix(syllables, pieces);
    // Ünlüsü olmayan parça (ör. "TBMM'", tek başına "-") komşu heceye eklenir.
    if (!part.some(isVowel) && syllables.length > 0) {
      syllables[syllables.length - 1] += pieces.join('');
    } else {
      syllables.push(...pieces);
    }
  }
  // Ünlüsüz bir başlangıç parçası sonraki heceyle birleşir (ör. "d'" yoksa tek hece kalır).
  if (syllables.length > 1 && !Array.from(syllables[0] as string).some(isVowel)) {
    const [first, second, ...rest] = syllables;
    return [`${first}${second}`, ...rest];
  }
  return syllables;
}

/** Paragrafları kelimelere (boşluklardan) ve her kelimeyi hecelere ayırır: paragraf → kelime → hece. */
export function syllabifyParagraphs(paragraphs: readonly string[]): string[][][] {
  return paragraphs.map((paragraph) => paragraph.split(' ').filter(Boolean).map(syllabify));
}

/** Kelimenin hece sayısı (ünlü sayısı; `readability.ts` ile aynı). */
export function syllableCountOf(word: string): number {
  return Array.from(word).filter(isVowel).length;
}
