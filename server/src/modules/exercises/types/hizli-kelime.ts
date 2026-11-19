import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import { wholeMinutes, wordsPerMinute, type ExerciseTypeModule } from './common.js';

/**
 * E5 Hızlı kelime: metinden seçilen kelime kısa süre görünür, çocuk onu 3-4 benzer seçenek arasından
 * bulur; süre başarıyla kısalır. Ardından kelimelerin geldiği metin okunur.
 */
const paramsSchema = z.object({
  /** Başlangıçta kelimenin görünme süresi (ms) */
  flashMs: z.number().int().min(300).max(2000),
  /** En kısa görünme süresi (ms) */
  minFlashMs: z.number().int().min(150).max(1000),
});

const dataSchema = z.object({
  words: z
    .array(
      z.object({
        /** Metinde yazıldığı gibi */
        word: z.string().min(1),
        /** Hece sayısı */
        syllables: z.number().int().min(1),
        /** Görsel olarak benzer 2-3 çeldirici (aynı grubun başka metinlerinden) */
        distractors: z.array(z.string().min(1)).min(2).max(3),
      }),
    )
    .min(3)
    .max(10),
});

/** Bitirme gövdesi: her kartın sonucu (gösterim sırasıyla) ve metnin okuma süresi. */
const resultSchema = z.object({
  cards: z
    .array(
      z.object({
        word: z.string().min(1).max(60),
        correct: z.boolean(),
        /** Bu kartta kelimenin görünme süresi (ms) */
        flashMs: z.number().int().min(0).max(5000),
      }),
    )
    .min(1)
    .max(10),
  readSeconds: z.number().int().min(1),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;
type Result = z.infer<typeof resultSchema>;

export const hizliKelime: ExerciseTypeModule<Params, Data, Result> = {
  type: ExerciseType.HIZLI_KELIME,
  code: 'E5',
  paramsSchema,
  dataSchema,
  // Kartlar 1-2 dakika; ardından metin okunur (okuma ayrı sayılmaz).
  minutes: () => wholeMinutes(2),
  questionPositions: () => [],
  finish: {
    resultSchema,
    metrics: ({ params, data, result, wordCount, durationSeconds }) => {
      // Yalnız örnekteki kelimeler sayılır; her kelime bir kez (ilk kartı), örnekteki sırayla.
      const cards = data.words.flatMap(({ word }) => {
        const card = result.cards.find((entry) => entry.word === word);
        return card
          ? [
              {
                word,
                correct: card.correct,
                flashMs: Math.min(Math.max(card.flashMs, params.minFlashMs), params.flashMs),
              },
            ]
          : [];
      });
      const wordsCorrect = cards.filter((card) => card.correct).length;
      const readSeconds = Math.max(1, Math.min(result.readSeconds, durationSeconds));
      const wpm = wordsPerMinute(wordCount, readSeconds);
      return {
        wpmFirst: wpm,
        wpmLast: wpm,
        // Doğru tanınan kartların yüzdesi
        score: cards.length > 0 ? Math.round((wordsCorrect / cards.length) * 100) : null,
        details: {
          cards,
          wordsTotal: cards.length,
          wordsCorrect,
          readSeconds,
          lastFlashMs: cards.at(-1)?.flashMs ?? params.flashMs,
        },
      };
    },
  },
};
