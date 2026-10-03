import { describe, expect, it } from 'vitest';

import { ReadingLevel } from '../src/generated/prisma/enums.js';
import { toApiLevel, withApiLevel } from '../src/lib/reading-level.js';

describe('reading level', () => {
  it('enum değerini API sayısına çevirir', () => {
    expect(toApiLevel(ReadingLevel.BASLANGIC)).toBe(1);
    expect(toApiLevel(ReadingLevel.ORTA)).toBe(2);
    expect(toApiLevel(ReadingLevel.ILERI)).toBe(3);
  });

  it('satırın yalnızca level alanını değiştirir', () => {
    expect(withApiLevel({ id: 'minik-serce', level: ReadingLevel.ORTA })).toEqual({
      id: 'minik-serce',
      level: 2,
    });
  });
});
