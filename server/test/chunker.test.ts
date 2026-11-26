import { describe, expect, it } from 'vitest';

import { seedPlacementTexts, seedTexts } from '../prisma/seed-data/index.js';
import { chunkParagraph, MAX_CHUNK_WORDS } from '../src/lib/chunker.js';

const wordsOf = (chunk: string) => chunk.split(' ').length;

describe('öbekleyici', () => {
  it('noktalamadan sonra böler', () => {
    expect(chunkParagraph('Minik serçe uyandı. Güneş doğdu, kuşlar öttü.')).toEqual([
      'Minik serçe uyandı.',
      'Güneş doğdu,',
      'kuşlar öttü.',
    ]);
  });

  it('bağlaçlardan önce böler', () => {
    expect(chunkParagraph('Pırıl koştu ve kapıyı açtı.')).toEqual([
      'Pırıl koştu',
      've kapıyı açtı.',
    ]);
    expect(chunkParagraph('Yoruldu ama hiç durmadı.')).toEqual(['Yoruldu', 'ama hiç durmadı.']);
    expect(chunkParagraph('Bir kuş gibi uçtu.')).toEqual(['Bir kuş', 'gibi uçtu.']);
  });

  it('noktalamayla biten bağlaçtan önce bölmez', () => {
    expect(chunkParagraph('Uçtu bir kuş gibi.')).toEqual(['Uçtu bir kuş gibi.']);
  });

  it('uzun parçaları eşite yakın böler', () => {
    expect(chunkParagraph('bir iki üç dört beş')).toEqual(['bir iki üç', 'dört beş']);
    expect(chunkParagraph('bir iki üç dört beş altı yedi sekiz dokuz.')).toEqual([
      'bir iki üç',
      'dört beş altı',
      'yedi sekiz dokuz.',
    ]);
  });

  it('bütün metinlerde öbekler en fazla 4 kelime ve birleşince paragrafın aynısı', () => {
    for (const text of [...seedTexts, ...seedPlacementTexts]) {
      for (const paragraph of text.paragraphs) {
        const chunks = chunkParagraph(paragraph);
        expect(chunks.join(' ')).toBe(paragraph);
        for (const chunk of chunks) {
          expect(wordsOf(chunk)).toBeLessThanOrEqual(MAX_CHUNK_WORDS);
          expect(chunk.length).toBeGreaterThan(0);
        }
      }
    }
  });
});
