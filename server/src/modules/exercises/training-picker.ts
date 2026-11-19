import { ExerciseType, GradeBand } from '../../generated/prisma/enums.js';

/**
 * Günlük antrenmanın seçimi (A1a: basit kurallar). A4'teki uyarlanabilir planlayıcı yalnızca bu
 * fonksiyonu değiştirir. Saf ve belirlenimcidir: aynı girdi (aynı gün tohumu) aynı planı verir, bu
 * yüzden plan gün içinde değişmez. Girdiler bugünden önceki verilerdir.
 */

export type TrainingCandidate = {
  id: string;
  type: ExerciseType;
  gradeBand: GradeBand;
  textId: string | null;
  /** Tahmini süre (tam dakika) */
  minutes: number;
};

export type TrainingInput = {
  gradeBand: GradeBand;
  /** Onaylı örnekler (grup süzgeci burada da uygulanır). */
  candidates: readonly TrainingCandidate[];
  /** Uygulamanın oynatabildiği türler. */
  playableTypes: readonly ExerciseType[];
  /** Kilitli derslerin metinleri: bunlara dayanan örnek önerilmez. */
  lockedTextIds: ReadonlySet<string>;
  /** Bugünden önce bitirilen son egzersizin türü. */
  lastType: ExerciseType | null;
  /** Son anlama oranları (en fazla 5, okumalar ve egzersizler). */
  recentComprehension: readonly number[];
  /** Gün ve kullanıcıdan türetilen tohum. */
  seed: number;
};

export const TRAINING_MIN_MINUTES = 5;
export const TRAINING_MAX_MINUTES = 10;
export const TRAINING_MAX_ITEMS = 3;
/** Son anlama ortalaması bunun altındaysa E6 (hızlandırılmış okuma) önerilmez. */
export const E6_MIN_COMPREHENSION = 0.6;

/** Kurallara göre önerilebilir mi (tür ve grup kuralları). */
export function allowedType(
  type: ExerciseType,
  gradeBand: GradeBand,
  recentComprehension: readonly number[],
): boolean {
  // E6 G1'de kullanılmaz; anlama düşükse de önerilmez.
  if (type === ExerciseType.PIRIL_ISIGI) {
    if (gradeBand === GradeBand.G1) return false;
    if (recentComprehension.length > 0) {
      const average =
        recentComprehension.reduce((sum, value) => sum + value, 0) / recentComprehension.length;
      if (average < E6_MIN_COMPREHENSION) return false;
    }
  }
  // E11 yalnızca G1 (A4 ileride çok yavaş G2 okurlarına da verebilir).
  if (type === ExerciseType.HECE_TOPU && gradeBand !== GradeBand.G1) return false;
  return true;
}

/** Tohumlu sözde rastgele sayı üreteci (mulberry32). */
function random(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function shuffled<T>(values: readonly T[], next: () => number): T[] {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const other = Math.floor(next() * (index + 1));
    [result[index], result[other]] = [result[other] as T, result[index] as T];
  }
  return result;
}

/** Bir metinden tohum: kullanıcı ve gün (ör. "cm…|2026-11-17"). */
export function seedFrom(text: string): number {
  let hash = 2166136261;
  for (const char of text) {
    hash ^= char.charCodeAt(0);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/**
 * 1-3 örnek seçer: her tür en fazla bir kez (art arda aynı tür olmaz; ilk örnek dünkü son türle
 * aynı olmaz), toplam ≈ 5-10 dakika. Uygun başka tür yoksa son türün tekrarına izin verilir; hiç
 * uygun örnek yoksa boş döner.
 */
export function pickTraining(input: TrainingInput): TrainingCandidate[] {
  const next = random(input.seed);
  const usable = input.candidates.filter(
    (item) =>
      item.gradeBand === input.gradeBand &&
      input.playableTypes.includes(item.type) &&
      allowedType(item.type, input.gradeBand, input.recentComprehension) &&
      (item.textId === null || !input.lockedTextIds.has(item.textId)),
  );

  const byType = new Map<ExerciseType, TrainingCandidate[]>();
  for (const item of [...usable].sort((a, b) => a.id.localeCompare(b.id))) {
    byType.set(item.type, [...(byType.get(item.type) ?? []), item]);
  }
  let types = shuffled([...byType.keys()].sort(), next);
  // Dünkü son türle başlamasın: başka tür varsa o tür sona alınır.
  if (types.length > 1 && types[0] === input.lastType) {
    types = [...types.slice(1), types[0] as ExerciseType];
  }

  const picked: TrainingCandidate[] = [];
  let total = 0;
  for (const type of types) {
    if (picked.length >= TRAINING_MAX_ITEMS || total >= TRAINING_MIN_MINUTES) break;
    const options = byType.get(type) ?? [];
    const item = options[Math.floor(next() * options.length)];
    if (!item) continue;
    if (picked.length > 0 && total + item.minutes > TRAINING_MAX_MINUTES) continue;
    picked.push(item);
    total += item.minutes;
  }
  return picked;
}
