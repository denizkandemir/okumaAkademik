import { City, LessonKind, ReadingLevel } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.ANTALYA;

/** 4. durak — "Portakal Kokulu Sahil" */
export const antalya: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    placeholderStory(city, 2), // TODO(P03)
    placeholderStory(city, 3), // TODO(P03)
    placeholderStory(city, 4), // TODO(P03): "Portakal Bahçesi"
    chest(city, 5),
    placeholderStory(city, 6), // TODO(P03)
    {
      id: 'antalya-07-deniz-feneri',
      position: 7,
      kind: LessonKind.STORY,
      title: 'Deniz Feneri Bekçisi',
      summary:
        'Fırtınalı bir gecede elektrikler kesilince fenerin ışığını yeniden yakan Hasan Kaptan’ın hikâyesi.',
      text: {
        id: 'deniz-feneri',
        title: 'Deniz Feneri Bekçisi',
        level: ReadingLevel.ORTA,
        estimatedMinutes: 4,
        minGrade: 3,
        maxGrade: 8,
        paragraphs: [
          'Küçük bir adanın ucunda beyaz bir deniz feneri vardı. Feneri yıllardır Hasan Kaptan beklerdi.',
          'Her akşam güneş batarken Hasan Kaptan yüz yirmi basamağı tek tek çıkar, fenerin lambasını yakardı. Lambanın ışığı, karanlıkta yolunu arayan gemilere yol gösterirdi.',
          'Bir kış gecesi fırtına çıktı ve elektrikler kesildi. Uzaktan bir balıkçı teknesinin kornası duyuluyordu.',
          'Hasan Kaptan hiç vakit kaybetmeden eski gaz lambasını hazırladı. Lambayı fenerin tepesine taşıdı ve aynaların önüne yerleştirdi.',
          'Işık yeniden denize yayıldı. Balıkçı teknesi kayalıklara çarpmadan limana sığındı. Ertesi sabah balıkçılar, Hasan Kaptan’a sıcak bir çorba ve kocaman bir teşekkürle geldiler.',
        ],
      },
      questions: [
        {
          prompt: 'Hasan Kaptan her akşam ne yapardı?',
          options: ['Balığa çıkardı', 'Fenerin lambasını yakardı', 'Gemileri boyardı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta güneş batarken ne yaptığı yazıyor.',
          explanation: 'Doğru! Her akşam basamakları çıkıp fenerin lambasını yakardı.',
        },
        {
          prompt: 'Elektrikler kesilince Hasan Kaptan ne yaptı?',
          options: [
            'Gaz lambasını fenerin tepesine taşıdı',
            'Evine gidip sabahı bekledi',
            'Balıkçılara el salladı',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta Hasan Kaptan vakit kaybetmeden bir şey hazırlıyor.',
          explanation: 'Aferin! Gaz lambasını aynaların önüne koyup ışığı yeniden yaktı.',
        },
        {
          prompt: 'Balıkçılar ertesi sabah neden geldiler?',
          options: [
            'Feneri gezmek için',
            'Fırtınayı anlatmak için',
            'Hasan Kaptan’a teşekkür etmek için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta balıkçıların ne getirdiğine bak.',
          explanation: 'Harika! Hasan Kaptan yollarını aydınlattığı için teşekküre geldiler.',
        },
      ],
      glossary: [
        { word: 'kayalıklara', meaning: 'Denizde ya da kıyıda bulunan sert, taşlık yerlere.' },
        { word: 'limana', meaning: 'Gemilerin güvenle durduğu kıyı yerine.' },
      ],
    },
    placeholderStory(city, 8), // TODO(P03)
    placeholderStory(city, 9), // TODO(P03)
    chest(city, 10),
  ],
};
