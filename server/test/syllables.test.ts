import { describe, expect, it } from 'vitest';

import { seedPlacementTexts, seedTexts } from '../prisma/seed-data/index.js';
import { syllableCount } from '../src/lib/readability.js';
import { syllabify, syllabifyParagraphs } from '../src/lib/syllables.js';

const split = (word: string) => syllabify(word).join('-');

describe('hece ayırıcı', () => {
  it('ünlüler arasındaki tek ünsüz sonraki heceye geçer', () => {
    expect(split('kapı')).toBe('ka-pı');
    expect(split('araba')).toBe('a-ra-ba');
    expect(split('karakacı')).toBe('ka-ra-ka-cı');
  });

  it('iki ünsüzden ikincisi, üç ünsüzden sonuncusu geçer', () => {
    expect(split('kardeş')).toBe('kar-deş');
    expect(split('Türkçe')).toBe('Türk-çe');
    expect(split('korktu')).toBe('kork-tu');
    expect(split('sevinçle')).toBe('se-vinç-le');
  });

  it('üç ünsüzün son ikisi başlangıç kümesiyse ikisi birlikte geçer', () => {
    expect(split('elektrik')).toBe('e-lek-trik');
    expect(split('kontrol')).toBe('kon-trol');
    expect(split('ekstra')).toBe('eks-tra');
    expect(split('İNGİLTERE')).toBe('İN-GİL-TE-RE');
    expect(split('KONTROL')).toBe('KON-TROL');
    // Küme değilse yalnız sonuncu geçer.
    expect(split('Türkçe')).toBe('Türk-çe');
    expect(split('üstte')).toBe('üst-te');
  });

  it('yan yana ünlüler ayrı hecedir', () => {
    expect(split('saat')).toBe('sa-at');
    expect(split('şiir')).toBe('şi-ir');
  });

  it('İ ve I Türkçe kurala göre ünlüdür; büyük harf korunur', () => {
    expect(split('İstanbul')).toBe('İs-tan-bul');
    expect(split('ILIK')).toBe('I-LIK');
    expect(split('ılık')).toBe('ı-lık');
    expect(split('İzmir')).toBe('İz-mir');
  });

  it('baştaki ünsüz kümesi ilk hecede kalır (alıntı kelimeler)', () => {
    expect(split('tren')).toBe('tren');
    expect(split('spor')).toBe('spor');
    expect(split('trenle')).toBe('tren-le');
    expect(split('sporcu')).toBe('spor-cu');
  });

  it('şapkalı ünlüler ünlü sayılır', () => {
    expect(split('kâğıt')).toBe('kâ-ğıt');
    expect(split('hâlâ')).toBe('hâ-lâ');
    expect(split('millî')).toBe('mil-lî');
  });

  it('kesme işareti ve noktalama bitişik kalır', () => {
    expect(split("İstanbul'da")).toBe("İs-tan-bul'-da");
    expect(split('kapı,')).toBe('ka-pı,');
    expect(split('“Geleceğiz!”')).toBe('“Ge-le-ce-ğiz!”');
    expect(syllabify('yavaş-yavaş')).toEqual(['ya', 'vaş-', 'ya', 'vaş']);
  });

  it('kesmeden sonra ünlüyle başlayan ekte kökün son ünsüzü eke geçer', () => {
    expect(split("Efes'e")).toBe("E-fe-s'e");
    expect(split("Van'a")).toBe("Va-n'a");
    expect(split("Van'ın")).toBe("Va-n'ın");
    expect(split("Türk'e")).toBe("Tür-k'e");
    expect(split('Efes’e,')).toBe('E-fe-s’e,');
    expect(split("İZMİR'E")).toBe("İZ-Mİ-R'E");
    // Ünsüzle başlayan ek ve ünlüyle biten kök bugünkü gibi.
    expect(split("Efes'te")).toBe("E-fes'-te");
    expect(split("İstanbul'da")).toBe("İs-tan-bul'-da");
    expect(split("Kapadokya'ya")).toBe("Ka-pa-dok-ya'-ya");
    expect(split("Ankara'ı")).toBe("An-ka-ra'-ı");
    // Kök ünlüsüz kalacaksa taşınmaz.
    expect(split("TBMM'e")).toBe("TBMM'e");
    for (const word of ["Efes'e", "Van'a", "Türk'e", "İZMİR'E", "TBMM'e"]) {
      expect(syllabify(word).join('')).toBe(word);
    }
  });

  it('ünlüsüz parça tek hece olarak kalır', () => {
    expect(syllabify('3')).toEqual(['3']);
    expect(syllabify('—')).toEqual(['—']);
  });

  it('bütün metinlerde heceler kelimeyi birebir verir ve sayı ünlü sayısıyla aynıdır', () => {
    for (const text of [...seedTexts, ...seedPlacementTexts]) {
      const words = syllabifyParagraphs(text.paragraphs);
      words.forEach((paragraph, index) => {
        expect(paragraph.map((syllables) => syllables.join('')).join(' ')).toBe(
          text.paragraphs[index],
        );
        for (const syllables of paragraph) {
          const word = syllables.join('');
          expect(syllables.length).toBe(Math.max(1, syllableCount(word)));
        }
      });
    }
  });
});
