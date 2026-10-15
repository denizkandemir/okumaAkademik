import { City, LessonKind, ReadingLevel } from '../../src/generated/prisma/enums.js';
import { CITY_NAMES, toApiCity } from '../../src/lib/city.js';
import type { SeedChestLesson, SeedQuestion, SeedStoryLesson } from './types.js';

// TODO(P03): Bu dosyadaki yer tutucular yalnızca yolculuğu baştan sona oynanabilir kılmak içindir.
// P03'te her yer tutucu hikâye gerçek metin, soru ve kelime anlamlarıyla değiştirilecek; sandıkların
// özetleri yazılacak. İş bitince bu dosya silinmeli.

/** "İstanbul'da", "Efes'te" … (Türkçe ekler üretilmez, saklanır). */
const IN_CITY: Record<City, string> = {
  [City.ISTANBUL]: 'İstanbul’da',
  [City.IZMIR]: 'İzmir’de',
  [City.EFES]: 'Efes’te',
  [City.ANTALYA]: 'Antalya’da',
  [City.KAPADOKYA]: 'Kapadokya’da',
  [City.VAN]: 'Van’da',
};

function lessonId(city: City, position: number, slug: string) {
  return `${toApiCity(city)}-${String(position).padStart(2, '0')}-${slug}`;
}

/** Doğru şıkkı `shift`e göre farklı bir yere koyar; cevaplar hep aynı harfte olmasın. */
function question(
  prompt: string,
  correct: string,
  wrong: [string, string],
  shift: number,
  hint: string,
  explanation: string,
): SeedQuestion {
  const correctIndex = (shift % 3) as 0 | 1 | 2;
  const options = [...wrong];
  options.splice(correctIndex, 0, correct);
  return { prompt, options: options as [string, string, string], correctIndex, hint, explanation };
}

// TODO(P03): yer tutucu hikâye
export function placeholderStory(city: City, position: number): SeedStoryLesson {
  const name = CITY_NAMES[city];
  const inCity = IN_CITY[city];
  const otherCities = Object.values(CITY_NAMES).filter((other) => other !== name);
  const id = lessonId(city, position, 'hikaye');
  const early = city === City.ISTANBUL || city === City.IZMIR;

  return {
    id,
    position,
    kind: LessonKind.STORY,
    title: `${name} Hikâyesi ${position}`,
    summary: `Pırıl’ın ${inCity} geçen küçük bir günü (yer tutucu hikâye).`,
    text: {
      id,
      title: `${name} Hikâyesi ${position}`,
      level: early ? ReadingLevel.BASLANGIC : ReadingLevel.ORTA,
      estimatedMinutes: 2,
      minGrade: 1,
      maxGrade: 8,
      paragraphs: [
        `Pırıl ${inCity} yeni bir sabaha uyandı. Güneş parlıyor, kuşlar şarkı söylüyordu.`,
        `Bugün ${inCity} kısa bir gezinti yapacaktı. Yolda yeni arkadaşlarla tanıştı.`,
        'Akşam olunca yorgun ama mutluydu. “Yarın yine birlikte okuyalım!” dedi.',
      ],
    },
    questions: [
      question(
        'Pırıl hangi şehirdeydi?',
        name,
        [
          otherCities[position % otherCities.length] ?? 'Ankara',
          otherCities[(position + 2) % otherCities.length] ?? 'Bursa',
        ],
        position,
        'İpucu: Hikâyenin ilk cümlesinde şehrin adı geçiyor.',
        `Doğru! Pırıl ${inCity} uyandı.`,
      ),
      question(
        'Pırıl yolda kimlerle tanıştı?',
        'Yeni arkadaşlarla',
        ['Bir ejderhayla', 'Hiç kimseyle'],
        position + 1,
        'İpucu: İkinci paragrafın son cümlesine bak.',
        'Aferin! Pırıl yolda yeni arkadaşlarla tanıştı.',
      ),
      question(
        'Akşam olunca Pırıl nasıl hissediyordu?',
        'Yorgun ama mutlu',
        ['Çok kızgın', 'Korkmuş'],
        position + 2,
        'İpucu: Son paragrafın ilk cümlesi Pırıl’ın nasıl hissettiğini anlatıyor.',
        'Harika! Pırıl yorgundu ama çok mutluydu.',
      ),
    ],
    glossary: [{ word: 'gezinti', meaning: 'Keyif için yapılan kısa yürüyüş ya da yolculuk.' }],
  };
}

// TODO(P03): sandık özetleri
export function chest(city: City, position: number): SeedChestLesson {
  return {
    id: lessonId(city, position, 'sandik'),
    position,
    kind: LessonKind.CHEST,
    title: 'Hazine Sandığı',
    summary: 'Sandığı aç, içindeki lokumları topla!',
  };
}
