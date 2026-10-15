import { City, LessonKind, ReadingLevel } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.EFES;

/** 3. durak — "Antik Kentin Sırları" */
export const efes: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    placeholderStory(city, 2), // TODO(P03)
    {
      id: 'efes-03-kayip-anahtar',
      position: 3,
      kind: LessonKind.STORY,
      title: 'Kayıp Anahtar',
      summary: 'Anahtarını kaybeden Kerem’in bir dedektif gibi düşünerek onu bulma hikâyesi.',
      text: {
        id: 'kayip-anahtar',
        title: 'Kayıp Anahtar',
        level: ReadingLevel.ORTA,
        estimatedMinutes: 3,
        minGrade: 2,
        maxGrade: 6,
        paragraphs: [
          'Kerem okuldan döndüğünde kapının önünde durdu ve çantasını karıştırdı. Anahtarı yoktu!',
          'Önce telaşlandı, sonra derin bir nefes aldı. “Bir dedektif gibi düşünmeliyim,” dedi kendi kendine.',
          'Gün boyunca neler yaptığını sırayla hatırlamaya çalıştı. Sabah anahtarı ceketinin cebine koymuştu. Teneffüste ceketini çıkarıp bankın üstüne bırakmıştı.',
          'Okula geri döndü. Hademe Ahmet Amca onu görünce gülümsedi ve cebinden parlak bir anahtar çıkardı: “Bunu bahçedeki bankın altında buldum.”',
          'Kerem teşekkür etti. O günden sonra anahtarını hep çantasının küçük gözüne koydu.',
        ],
      },
      questions: [
        {
          prompt: 'Kerem eve geldiğinde neyi bulamadı?',
          options: ['Çantasını', 'Anahtarını', 'Ceketini'],
          correctIndex: 1,
          hint: 'İpucu: İlk paragrafta Kerem çantasını karıştırınca neyin olmadığını fark ediyor.',
          explanation: 'Doğru! Kerem çantasında anahtarını bulamadı.',
        },
        {
          prompt: 'Kerem anahtarını bulmak için ne yaptı?',
          options: [
            'Gün boyunca yaptıklarını sırayla hatırladı',
            'Kapının önünde oturup bekledi',
            'Yeni bir anahtar yaptırdı',
          ],
          correctIndex: 0,
          hint: 'İpucu: Kerem “Bir dedektif gibi düşünmeliyim” dedikten sonra ne yaptı?',
          explanation: 'Aferin! Kerem gününü adım adım hatırlayıp anahtarın izini sürdü.',
        },
        {
          prompt: 'Kerem bu olaydan sonra ne yapmaya başladı?',
          options: [
            'Okula ceket götürmemeye',
            'Anahtarını hep aynı yere koymaya',
            'Kapıyı açık bırakmaya',
          ],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafta Kerem’in anahtarını artık nereye koyduğu yazıyor.',
          explanation: 'Harika! Kerem anahtarını hep çantasının küçük gözüne koymaya başladı.',
        },
      ],
      glossary: [
        { word: 'dedektif', meaning: 'İpuçlarını takip ederek gizemleri çözen kişi.' },
        { word: 'Hademe', meaning: 'Okulun temizliğine ve düzenine yardım eden görevli.' },
      ],
    },
    placeholderStory(city, 4), // TODO(P03)
    chest(city, 5),
    placeholderStory(city, 6), // TODO(P03)
    placeholderStory(city, 7), // TODO(P03)
    placeholderStory(city, 8), // TODO(P03)
    placeholderStory(city, 9), // TODO(P03)
    chest(city, 10),
  ],
};
