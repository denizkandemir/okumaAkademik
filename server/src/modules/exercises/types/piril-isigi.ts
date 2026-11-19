import { z } from 'zod';

import { ExerciseType } from '../../../generated/prisma/enums.js';
import {
  CALM_WPM,
  questionPositionsSchema,
  wholeMinutes,
  type ExerciseTypeModule,
} from './common.js';

/**
 * E6 Pırıl'ın ışığı (okuma temposu): çocuk ilk bölümü kendi hızında okur; sonra yumuşak bir ışık
 * okunmuş satırları arkadan soldurur (temel hız × `speedFactor`). Sonunda sorular. (Ekranı A1a-2.)
 */
const paramsSchema = z.object({
  /** Temel hıza göre çarpan (1,05-1,20) */
  speedFactor: z.number().min(1.05).max(1.2),
  /** Temel hızın ölçüldüğü ilk bölümün kelime sayısı */
  segmentWords: z.number().int().min(15).max(80),
  /** Soldurma birimi */
  fadeUnit: z.enum(['line', 'word']),
});

const dataSchema = z.object({ questionPositions: questionPositionsSchema(3) });

type Params = z.infer<typeof paramsSchema>;
type Data = z.infer<typeof dataSchema>;

export const pirilIsigi: ExerciseTypeModule<Params, Data> = {
  type: ExerciseType.PIRIL_ISIGI,
  code: 'E6',
  paramsSchema,
  dataSchema,
  minutes: ({ params, gradeBand, wordCount }) =>
    wholeMinutes(wordCount / (CALM_WPM[gradeBand] * params.speedFactor) + 1),
  questionPositions: (data) => data.questionPositions,
};
