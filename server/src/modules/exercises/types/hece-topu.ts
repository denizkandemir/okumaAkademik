import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import { questionPositionsSchema, wholeMinutes, type ExerciseTypeModule } from './common.js';

/**
 * E11 Hece hece oku (zıplayan top): heceleri belli metinde küçük bir top heceden heceye zıplar,
 * çocuk sesli okur. Hız çocuğun kendi temposudur. Yalnızca G1. (Ekranı A1a-2.)
 */
const paramsSchema = z.object({
  /** Hece ayrımı biçimi: ince boşluk, renk ya da ikisi */
  marker: z.enum(['gap', 'color', 'both']),
  /** Zıplayan işaret: top ya da Pırıl'ın patisi */
  pointer: z.enum(['ball', 'paw']),
});

/** Bir kelimenin heceleri (birleşince kelimenin aynısı). */
const wordSchema = z.array(z.string().min(1)).min(1);

const dataSchema = z.object({
  /** Paragraf → kelime → hece; uygulama hiçbir bölme yapmaz. */
  words: z.array(z.array(wordSchema).min(1)).min(1),
  questionPositions: questionPositionsSchema(2),
});

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;

/** Hız ölçümü yokken G1 için sakin hece hızı (hece/saniye). */
export const CALM_SYLLABLES_PER_SECOND = 1.5;

export const heceTopu: ExerciseTypeModule<Params, Data> = {
  type: ExerciseType.HECE_TOPU,
  code: 'E11',
  paramsSchema,
  dataSchema,
  minutes: ({ data }) => {
    const syllables = data.words.flat().reduce((sum, word) => sum + word.length, 0);
    return wholeMinutes(syllables / CALM_SYLLABLES_PER_SECOND / 60 + 1);
  },
  questionPositions: (data) => data.questionPositions,
};
