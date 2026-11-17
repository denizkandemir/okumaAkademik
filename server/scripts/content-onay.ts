/**
 * Öğretmen onay belgesini seed verisinden üretir: docs/icerik/onay/<şehir>.md
 *
 * Kullanım (server/ içinde): npm run content:onay -- --city=izmir
 *
 * Veritabanına bağlanmaz. Şehrin bütün sürümleri yazılmış ve scripts/onay-notlari/<şehir>.ts
 * dosyası hazır olmalı; her soru için kanıt ister, alıntı metinde birebir geçmezse durur.
 * A3'teki etkileşimli `content:review` ile ilgisi yoktur.
 */
import { writeFileSync } from 'node:fs';
import { parseArgs } from 'node:util';
import { seedCities, type SeedStoryLesson } from '../prisma/seed-data/index.js';
import {
  GradeBand,
  LessonKind,
  type CognitiveLevel,
  type QuestionType,
  type TextTheme,
} from '../src/generated/prisma/enums.js';
import { CITY_NAMES, toApiCity } from '../src/lib/city.js';
import { ATESMAN_TARGET } from '../src/lib/grade-band.js';
import { READABILITY_BAND_LABELS, readabilityBand } from '../src/lib/readability.js';
import { efesNotes } from './onay-notlari/efes.js';
import { istanbulNotes } from './onay-notlari/istanbul.js';
import { izmirNotes } from './onay-notlari/izmir.js';
import type { CityNotes, Evidence } from './onay-notlari/types.js';

const NOTES: Record<string, CityNotes> = {
  istanbul: istanbulNotes,
  izmir: izmirNotes,
  efes: efesNotes,
};

const TYPE_LABELS: Record<QuestionType, string> = {
  BILGI: 'Bilgi (Q1)',
  SIRALAMA: 'Sıralama (Q2)',
  SOZCUK_ANLAMI: 'Sözcük anlamı (Q3)',
  NEDEN_SONUC: 'Neden-sonuç (Q4)',
  DUYGU_KARAKTER: 'Duygu ve karakter (Q5)',
  ANA_FIKIR: 'Ana fikir (Q6)',
  YARDIMCI_FIKIR: 'Yardımcı fikir (Q7)',
  BASLIK: 'Başlık (Q8)',
  CUMLEDE_ANLAM: 'Cümlede anlam (Q9)',
  PARAGRAF_YAPISI: 'Paragraf yapısı (Q10)',
  SOZEL_MANTIK: 'Sözel mantık (Q11)',
  GORSEL_OKUMA: 'Görsel okuma (Q12)',
  ONCULLU_YORUM: 'Öncüllü yorum (Q13)',
};

const LEVEL_LABELS: Record<CognitiveLevel, string> = {
  HATIRLAMA: 'Hatırlama',
  ANLAMA: 'Anlama',
  CIKARIM: 'Çıkarım',
  DEGERLENDIRME: 'Değerlendirme',
};

const THEME_LABELS: Record<TextTheme, string> = {
  ARKADASLIK: 'Arkadaşlık',
  MERAK: 'Merak',
  KESIF: 'Keşif',
  PAYLASMAK: 'Paylaşmak',
  CESARET: 'Cesaret',
  YARDIMLASMA: 'Yardımlaşma',
  SABIR: 'Sabır',
  DOGA: 'Doğa',
  AILE: 'Aile',
  HATIRALAR: 'Hatıralar',
  SORUMLULUK: 'Sorumluluk',
  IYILIK: 'İyilik',
};

const BANDS = [GradeBand.G1, GradeBand.G3, GradeBand.G4];
const GRADE_LABELS = { G1: '1-2', G2: '3-4', G3: '5-6', G4: '7-8' };
const LETTERS = 'ABCD';

const decimal = (value: number) => String(value).replace('.', ',');
const levelLabel = (score: number) => READABILITY_BAND_LABELS[readabilityBand(score)];

function renderEvidence(evidence: Evidence, fullText: string, where: string) {
  if ('reason' in evidence) return evidence.reason;
  if (!fullText.includes(evidence.quote)) {
    throw new Error(`${where}: alıntı metinde yok: ${evidence.quote}`);
  }
  return `*${evidence.quote}*`;
}

function renderVersion(story: SeedStoryLesson, band: GradeBand, notes: CityNotes) {
  const version = story.versions.find((entry) => entry.gradeBand === band);
  if (!version) throw new Error(`${story.id}: ${band} sürümü yok`);
  const { text, questions, glossary } = version;
  const score = text.atesmanScore ?? 0;
  const target = ATESMAN_TARGET[band];
  const evidence = notes.evidence[text.id];
  if (evidence?.length !== questions.length) throw new Error(`${text.id}: kanıt sayısı yanlış`);
  const fullText = text.paragraphs.join('\n');

  const questionBlocks = questions.map((question, index) => {
    const options = question.options
      .map((option, optionIndex) => {
        const mark = optionIndex === question.correctIndex ? ' ✔' : '';
        return `- ${LETTERS[optionIndex]}) ${option}${mark}`;
      })
      .join('\n');
    const proof = renderEvidence(evidence[index]!, fullText, `${text.id} soru ${index + 1}`);
    return `**Soru ${index + 1}.** ${question.prompt}

${options}

- Doğru cevap: **${LETTERS[question.correctIndex]}**
- Kanıt: ${proof}
- Soru türü: ${TYPE_LABELS[question.type]} · Bilişsel düzey: ${LEVEL_LABELS[question.cognitiveLevel]}
- İpucu (yanlış cevaptan sonra): ${question.hint.replace(/^İpucu: /, '')}
- Açıklama (doğru cevaptan sonra): ${question.explanation}
`;
  });

  return `### ${band} · ${GRADE_LABELS[band]}. sınıf: ${story.title}

${text.wordCount} kelime · ${text.sentenceCount} cümle · ort. cümle ${decimal(text.avgSentenceLength)} kelime · **Ateşman ${decimal(score)}** (${levelLabel(score).toLocaleLowerCase('tr-TR')}; hedef ${target.min}-${target.max})

${text.paragraphs.map((paragraph) => `> ${paragraph}`).join('\n>\n')}

${questionBlocks.join('\n')}
**Kelime anlamları:**

${glossary.map(({ word, meaning }) => `- **${word}:** ${meaning}`).join('\n')}

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:
`;
}

function renderDocument(cityId: string) {
  const notes = NOTES[cityId];
  const seedCity = seedCities.find(({ city }) => toApiCity(city) === cityId);
  if (!notes || !seedCity) {
    throw new Error(`Bilinmeyen şehir: ${cityId}. Hazır olanlar: ${Object.keys(NOTES).join(', ')}`);
  }
  const cityName = CITY_NAMES[seedCity.city];
  const stories = seedCity.lessons.filter(
    (lesson): lesson is SeedStoryLesson => lesson.kind === LessonKind.STORY,
  );
  const versions = stories.flatMap((story) =>
    story.versions.map((version) => ({ story, ...version })),
  );

  const typeRows = (Object.keys(TYPE_LABELS) as QuestionType[]).flatMap((type) => {
    const counts = BANDS.map(
      (band) =>
        versions
          .filter((version) => version.gradeBand === band)
          .flatMap((version) => version.questions)
          .filter((question) => question.type === type).length,
    );
    return counts.some(Boolean) ? [`| ${TYPE_LABELS[type]} | ${counts.join(' | ')} |`] : [];
  });
  const totals = BANDS.map(
    (band) =>
      versions
        .filter((version) => version.gradeBand === band)
        .flatMap((version) => version.questions).length,
  );

  const textRows = versions.map(({ story, gradeBand, text }) => {
    const score = text.atesmanScore ?? 0;
    return `| ${story.position} | ${story.title} | ${gradeBand} | ${text.wordCount} | ${text.sentenceCount} | ${decimal(text.avgSentenceLength)} | ${decimal(score)} | ${levelLabel(score)} |`;
  });

  const inTarget = versions.filter(({ gradeBand, text }) => {
    const target = ATESMAN_TARGET[gradeBand];
    const score = text.atesmanScore ?? 0;
    return score >= target.min && score <= target.max;
  });
  const g2Target = ATESMAN_TARGET.G2;
  const g2Outside = stories.filter(({ text }) => {
    const score = text.atesmanScore ?? 0;
    return score < g2Target.min || score > g2Target.max;
  });

  const today = new Date().toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const lessonBlocks = stories.map(
    (story) => `## ${story.position}. ders: ${story.title}

Tema: ${THEME_LABELS[story.text.theme]} · Ders özeti (bütün sürümlerde aynı): ${story.summary}

${BANDS.map((band) => renderVersion(story, band, notes)).join('\n')}`,
  );

  return `# ${cityName} hikâyeleri, sınıf grubu sürümleri: öğretmen onayı

**Durum:** taslak, onay bekliyor · **Hazırlayan:** yapay zekâ destekli taslak (A3s) · **Tarih:** ${today}

Bu belge, ${cityName} durağındaki ${stories.length} hikâyenin yeni sürümlerini gözden geçirmeniz için hazırlandı. Şimdiye kadar her hikâyenin tek metni vardı (3-4. sınıf düzeyi, G2). Artık her çocuk aynı hikâyeyi kendi düzeyinde okuyacak: **G1** (1-2. sınıf), **G3** (5-6. sınıf), **G4** (7-8. sınıf). Hikâye, kahramanlar ve olaylar aynı kalır; değişen uzunluk, cümle yapısı, sözcükler ve sorulardır. G2 metinleri ve soruları değiştirilmedi.

## Nasıl değerlendirebilirsiniz

Her metin için şunlara bakmanızı rica ederiz:

1. **Dil ve içerik:** Metin sınıf düzeyine uygun mu? Anlaşılmayacak kelime ya da yapı var mı?
2. **Sorular:** Soru açık mı? Doğru cevap metinden tek ve kesin çıkıyor mu? Yanlış şıklar makul ama açıkça yanlış mı?
3. **Soru türü ve bilişsel düzey:** Etiket soruya uyuyor mu?
4. **İpucu ve açıklama:** Yanlış cevapta gösterilen ipucu cevabı söylemeden yol gösteriyor mu?
5. **Bilgiler:** Şehirle ilgili bilgiler (yerler, tarih) doğru mu?

Her sorunun altındaki **Kanıt** satırı doğru cevabın dayanağını gösterir: *italik* yazı metinden birebir alıntıdır, düz yazı ise (ana fikir, başlık gibi türlerde) kısa gerekçedir.

Düzeltmeleri doğrudan bu belgeye not edebilir ya da her metnin altındaki **Onay** satırını doldurabilirsiniz.

## Ölçütler

| Sınıf grubu | Kelime | Hedef Ateşman | Şık sayısı | Soru türleri |
|---|---|---|---|---|
| G1 (1-2. sınıf) | 60-120 | ${ATESMAN_TARGET.G1.min}-${ATESMAN_TARGET.G1.max} | 3 | Bilgi, neden-sonuç, duygu ve karakter, sözcük anlamı; hikâye başına en çok 1 bilgi sorusu |
| G3 (5-6. sınıf) | 180-280 | ${ATESMAN_TARGET.G3.min}-${ATESMAN_TARGET.G3.max} | 4 | Hikâye başına en çok 1 bilgi sorusu; en az 1 ana fikir, başlık, yardımcı fikir, cümlede anlam ya da çıkarım gerektiren neden-sonuç |
| G4 (7-8. sınıf) | 250-380 | ${ATESMAN_TARGET.G4.min}-${ATESMAN_TARGET.G4.max} | 4 | Bilgi sorusu yok; en az 1 ana fikir, yardımcı fikir ya da başlık |

Ateşman (1997) puanı: \`198,825 − 40,175 × (hece / kelime) − 2,610 × (kelime / cümle)\`. Puan yükseldikçe metin kolaylaşır: 90-100 çok kolay, 70-89 kolay, 50-69 orta güçlükte, 30-49 zor, 1-29 çok zor. Puanlar uygulamanın okunabilirlik aracıyla hesaplandı; ${versions.length} metnin ${inTarget.length === versions.length ? 'hepsi' : inTarget.length + ' tanesi'} grubunun hedef aralığında.

## Özet

### Soru türü sayıları

| Soru türü | G1 | G3 | G4 |
|---|---|---|---|
${typeRows.join('\n')}
| **Toplam** | ${totals.join(' | ')} |

### Metinler

| Ders | Hikâye | Grup | Kelime | Cümle | Ort. cümle | Ateşman | Düzey |
|---|---|---|---|---|---|---|---|
${textRows.join('\n')}

### Hedef aralığın dışında kalan G2 metinleri

G2 hedefi ${g2Target.min}-${g2Target.max}. Bu metinler değiştirilmedi (çocukların bu sorularda cevap kayıtları var); yalnızca bilginize sunuluyor.

${
  g2Outside.length > 0
    ? g2Outside
        .map(
          ({ position, title, text }) =>
            `- ${position}. ders, ${title}: Ateşman ${decimal(text.atesmanScore ?? 0)}`,
        )
        .join('\n')
    : 'Dışarıda kalan metin yok.'
}

### Özellikle görüşünüzü istediğimiz noktalar

${notes.reviewPoints.map((point) => `- ${point}`).join('\n')}

${lessonBlocks.join('\n')}
## Onaydan sonra

Düzeltmeler \`server/prisma/seed-data/${cityId}.ts\` dosyasına işlenir ve bu belge de güncellenir (Ateşman puanları yeniden hesaplanır). Testler (\`server/test/seed-data.test.ts\`) uzunluk, şık sayısı, soru türleri ve Ateşman aralığını her değişiklikte denetler.
`;
}

const { values } = parseArgs({ options: { city: { type: 'string' } } });
if (!values.city) throw new Error('Kullanım: npm run content:onay -- --city=izmir');

const target = new URL(`../../docs/icerik/onay/${values.city}.md`, import.meta.url);
const document = renderDocument(values.city);
writeFileSync(target, document);
console.log(`Yazıldı: docs/icerik/onay/${values.city}.md`);
