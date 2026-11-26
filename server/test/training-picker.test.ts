import { describe, expect, it } from 'vitest';

import { ExerciseType, GradeBand } from '../src/generated/prisma/enums.js';
import {
  pickTraining,
  TRAINING_MAX_ITEMS,
  TRAINING_MAX_MINUTES,
  type TrainingCandidate,
  type TrainingInput,
} from '../src/modules/exercises/training-picker.js';

const ALL_TYPES = [
  ExerciseType.TEKRARLI_OKUMA,
  ExerciseType.OBEK_OKUMA,
  ExerciseType.HIZLI_KELIME,
  ExerciseType.PIRIL_ISIGI,
  ExerciseType.HECE_TOPU,
];

/** Her grupta her türden iki örnek (3 dakikalık). */
function candidates(): TrainingCandidate[] {
  return [GradeBand.G1, GradeBand.G2, GradeBand.G3, GradeBand.G4].flatMap((gradeBand) =>
    ALL_TYPES.flatMap((type) =>
      [1, 2].map((n) => ({
        id: `${type}-${gradeBand}-${n}`,
        type,
        gradeBand,
        textId: `metin-${n}`,
        minutes: 3,
      })),
    ),
  );
}

function input(overrides: Partial<TrainingInput> = {}): TrainingInput {
  return {
    gradeBand: GradeBand.G2,
    candidates: candidates(),
    playableTypes: ALL_TYPES,
    lockedTextIds: new Set(),
    lastType: null,
    recentComprehension: [],
    seed: 1,
    ...overrides,
  };
}

/** Birçok gün tohumu için seçilen türler. */
function typesOverDays(overrides: Partial<TrainingInput>): Set<ExerciseType> {
  const types = new Set<ExerciseType>();
  for (let seed = 0; seed < 200; seed++) {
    for (const item of pickTraining(input({ ...overrides, seed }))) types.add(item.type);
  }
  return types;
}

describe('günlük antrenman seçici', () => {
  it('G1 hiçbir zaman E6 almaz; E11 yalnızca G1’de çıkar', () => {
    const g1 = typesOverDays({ gradeBand: GradeBand.G1 });
    expect(g1.has(ExerciseType.PIRIL_ISIGI)).toBe(false);
    expect(g1.has(ExerciseType.HECE_TOPU)).toBe(true);
    for (const gradeBand of [GradeBand.G2, GradeBand.G3, GradeBand.G4]) {
      const types = typesOverDays({ gradeBand });
      expect(types.has(ExerciseType.HECE_TOPU)).toBe(false);
      expect(types.has(ExerciseType.PIRIL_ISIGI)).toBe(true);
    }
  });

  it('son 5 anlama ortalaması 0,6’nın altındaysa E6 önerilmez', () => {
    expect(
      typesOverDays({ recentComprehension: [0.33, 0.67, 0.5, 0.67, 0.67] }).has(
        ExerciseType.PIRIL_ISIGI,
      ),
    ).toBe(false);
    expect(
      typesOverDays({ recentComprehension: [0.67, 0.67, 0.5, 0.67, 0.67] }).has(
        ExerciseType.PIRIL_ISIGI,
      ),
    ).toBe(true);
  });

  it('art arda aynı tür gelmez; ilk egzersiz dünkü son türle aynı değildir', () => {
    for (let seed = 0; seed < 200; seed++) {
      const lastType = ALL_TYPES[seed % ALL_TYPES.length] as ExerciseType;
      const plan = pickTraining(input({ seed, lastType }));
      expect(plan[0]?.type).not.toBe(lastType);
      plan.forEach((item, index) => {
        if (index > 0) expect(item.type).not.toBe(plan[index - 1]?.type);
      });
    }
  });

  it('1-3 örnek, toplam ≈ 5-10 dakika', () => {
    for (let seed = 0; seed < 200; seed++) {
      const plan = pickTraining(input({ seed }));
      const total = plan.reduce((sum, item) => sum + item.minutes, 0);
      expect(plan.length).toBeGreaterThanOrEqual(1);
      expect(plan.length).toBeLessThanOrEqual(TRAINING_MAX_ITEMS);
      expect(total).toBeGreaterThanOrEqual(5);
      expect(total).toBeLessThanOrEqual(TRAINING_MAX_MINUTES);
    }
  });

  it('aynı gün tohumu aynı planı verir', () => {
    expect(pickTraining(input({ seed: 42 }))).toEqual(pickTraining(input({ seed: 42 })));
  });

  it('yalnızca oynatılabilen türler, kullanıcının grubu ve kilitsiz metinler', () => {
    const plan = pickTraining(
      input({
        playableTypes: [ExerciseType.TEKRARLI_OKUMA, ExerciseType.OBEK_OKUMA],
        lockedTextIds: new Set(['metin-2']),
      }),
    );
    expect(plan.length).toBeGreaterThan(0);
    for (const item of plan) {
      expect([ExerciseType.TEKRARLI_OKUMA, ExerciseType.OBEK_OKUMA]).toContain(item.type);
      expect(item.gradeBand).toBe(GradeBand.G2);
      expect(item.textId).toBe('metin-1');
    }
  });

  it('uygun örnek yoksa boş; tek uygun tür dünkünün aynısıysa yine verilir', () => {
    expect(pickTraining(input({ candidates: [] }))).toEqual([]);
    const plan = pickTraining(
      input({
        playableTypes: [ExerciseType.TEKRARLI_OKUMA],
        lastType: ExerciseType.TEKRARLI_OKUMA,
      }),
    );
    expect(plan.map((item) => item.type)).toEqual([ExerciseType.TEKRARLI_OKUMA]);
  });
});
