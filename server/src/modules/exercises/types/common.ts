import { z } from 'zod';

import type { ExerciseType, GradeBand } from '../../../generated/prisma/enums.js';

/** Sorulacak soruların metindeki sıraları (1-3). */
export const questionPositionsSchema = (max: number) =>
  z
    .array(z.number().int().min(1).max(3))
    .min(1)
    .max(max)
    .refine((positions) => new Set(positions).size === positions.length, {
      error: 'Soru sırası tekrar ediyor.',
    });

/**
 * Tahmini süre için grubun sakin okuma hızı (dakikadaki kelime). Araştırmadaki sınıf aralıklarının
 * alt-orta kısmı (01-arastirma.md §4); yalnızca egzersizin kaç dakika süreceğini tahmin etmek için.
 */
export const CALM_WPM: Record<GradeBand, number> = { G1: 55, G2: 80, G3: 100, G4: 115 };

/** Bir egzersiz örneğinin tahmini süresi için gereken bilgiler. */
export type EstimateInput<P, D> = {
  params: P;
  data: D;
  gradeBand: GradeBand;
  /** Dayandığı metnin kelime sayısı (metinsizse 0). */
  wordCount: number;
};

/** Bitirme isteğinden (PATCH) sunucunun hesapladığı ölçüler. */
export type FinishMetrics = {
  wpmFirst: number | null;
  wpmLast: number | null;
  score: number | null;
  /** `details`'e eklenecek türe özel ayrıntılar (cevaplar ayrıca eklenir). */
  details: Record<string, unknown>;
};

/** Bitirme hesabının girdisi. `durationSeconds` zaten kırpılmıştır. */
export type FinishInput<P, R, D = unknown> = {
  params: P;
  result: R;
  /** Örneğin içeriği (`exercise_items.data`) */
  data: D;
  wordCount: number;
  durationSeconds: number;
  /** İlk denemelere göre anlama (0-1); sorusuz egzersizde boş. */
  comprehension: number | null;
};

/** Etkin ayar hesabının girdisi: örneğin ayarları ve çocuğun geçmişi. */
export type EffectiveParamsInput<P, D> = EstimateInput<P, D> & {
  /** Aynı türde en son biten oturumun ayrıntıları (`details`); yoksa boş. */
  lastDetails: Record<string, unknown> | null;
  /** En yeni seviye belirleme hızı (dakikadaki kelime); yoksa boş. */
  baselineWpm: number | null;
};

/** Değeri [min, max] aralığına sıkıştırır ve 2 ondalığa yuvarlar. */
export function clampRound(value: number, min: number, max: number): number {
  return Math.round(Math.min(max, Math.max(min, value)) * 100) / 100;
}

export type ExerciseTypeModule<P, D, R = unknown> = {
  type: ExerciseType;
  /** Katalog kodu, ör. "E1" */
  code: string;
  paramsSchema: z.ZodType<P>;
  dataSchema: z.ZodType<D>;
  /** Tahmini süre (tam dakika, en az 1). */
  minutes: (input: EstimateInput<P, D>) => number;
  /** Sorulacak soruların sıraları; sorusuz türde boş. */
  questionPositions: (data: D) => number[];
  /**
   * Oturum başlarken kullanılacak (etkin) ayarlar; yoksa örneğin kendi ayarları. Sonuç yine
   * `paramsSchema`'dan geçmelidir.
   */
  effectiveParams?: (input: EffectiveParamsInput<P, D>) => P;
  /** Bitirme gövdesi ve ölçü hesabı; yalnızca uygulamada oynatılabilen türlerde. */
  finish?: {
    resultSchema: z.ZodType<R>;
    metrics: (input: FinishInput<P, R, D>) => FinishMetrics;
  };
};

/** Dakikadaki kelime (1 ondalık); süre 0 ise boş. */
export function wordsPerMinute(wordCount: number, seconds: number): number | null {
  if (seconds <= 0 || wordCount <= 0) return null;
  return Math.round(((wordCount * 60) / seconds) * 10) / 10;
}

/** Okuma sürelerini toplamı `limit`'i aşmayacak biçimde orantılı küçültür (her biri ≥ 1 sn). */
export function fitDurations(seconds: number[], limit: number): number[] {
  const total = seconds.reduce((sum, value) => sum + value, 0);
  if (total <= limit) return seconds;
  return seconds.map((value) => Math.max(1, Math.floor((value * limit) / total)));
}

/** Tam dakikaya yukarı yuvarlanmış süre, en az 1. */
export function wholeMinutes(minutes: number): number {
  return Math.max(1, Math.ceil(minutes));
}
