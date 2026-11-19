import { ExerciseType } from '../../../generated/prisma/enums.js';
import type { ExerciseTypeModule } from './common.js';
import { heceTopu } from './hece-topu.js';
import { hizliKelime } from './hizli-kelime.js';
import { obekOkuma } from './obek-okuma.js';
import { pirilIsigi } from './piril-isigi.js';
import { tekrarliOkuma } from './tekrarli-okuma.js';

export type { ExerciseTypeModule, FinishMetrics } from './common.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- tür başına farklı ayar ve veri
type AnyExerciseModule = ExerciseTypeModule<any, any, any>;

/** İçeriği tanımlanmış egzersiz türleri. Diğerleri (E2, E3, E7-E10) sonraki aşamalarda gelir. */
export const EXERCISE_MODULES: Partial<Record<ExerciseType, AnyExerciseModule>> = {
  [ExerciseType.TEKRARLI_OKUMA]: tekrarliOkuma,
  [ExerciseType.OBEK_OKUMA]: obekOkuma,
  [ExerciseType.HIZLI_KELIME]: hizliKelime,
  [ExerciseType.PIRIL_ISIGI]: pirilIsigi,
  [ExerciseType.HECE_TOPU]: heceTopu,
};

/** Uygulamanın şu an oynatabildiği türler; günlük antrenman yalnızca bunları önerir. */
export const PLAYABLE_TYPES: readonly ExerciseType[] = [
  ExerciseType.TEKRARLI_OKUMA,
  ExerciseType.OBEK_OKUMA,
  ExerciseType.HIZLI_KELIME,
  ExerciseType.PIRIL_ISIGI,
  ExerciseType.HECE_TOPU,
];

/** Türün modülü; tanımlı değilse hata (veritabanında yalnızca tanımlı türlerin örneği olur). */
export function exerciseModule(type: ExerciseType): AnyExerciseModule {
  const module = EXERCISE_MODULES[type];
  if (!module) throw new Error(`Egzersiz türü tanımlı değil: ${type}`);
  return module;
}
