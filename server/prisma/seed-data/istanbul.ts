import { City, LessonKind, ReadingLevel } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.ISTANBUL;

/** 1. durak — "Boğaz'ın Hikâyeleri" */
export const istanbul: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    {
      id: 'istanbul-02-bahcedeki-domatesler',
      position: 2,
      kind: LessonKind.STORY,
      title: 'Bahçedeki Domatesler',
      summary:
        'Elif ile dedesinin bahçeye diktiği fidelerin kıpkırmızı domateslere dönüşme hikâyesi.',
      text: {
        id: 'bahcedeki-domatesler',
        title: 'Bahçedeki Domatesler',
        level: ReadingLevel.BASLANGIC,
        estimatedMinutes: 2,
        minGrade: 1,
        maxGrade: 4,
        paragraphs: [
          'Elif ile dedesi baharda bahçeye domates fidesi diktiler.',
          'Elif her gün fidelere su verdi. Dedesi ona, bitkilerin güneşi ve suyu çok sevdiğini anlattı.',
          'Önce küçük sarı çiçekler açtı. Sonra çiçeklerin yerinde minik yeşil domatesler belirdi.',
          'Yaz gelince domatesler kıpkırmızı oldu. Elif ilk domatesi kopardığında çok heyecanlandı.',
          'O akşam annesi bahçenin domatesleriyle nefis bir salata yaptı. Elif, “Emeğimizin tadı başka!” dedi.',
        ],
      },
      questions: [
        {
          prompt: 'Elif ile dedesi bahçeye ne diktiler?',
          options: ['Domates fidesi', 'Elma ağacı', 'Çiçek tohumu'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin ilk cümlesine bir daha bak.',
          explanation: 'Doğru! Baharda bahçeye domates fidesi diktiler.',
        },
        {
          prompt: 'Minik yeşil domatesler nerede belirdi?',
          options: ['Yaprakların altında', 'Sarı çiçeklerin yerinde', 'Toprağın içinde'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta önce ne açtığı, sonra ne olduğu yazıyor.',
          explanation: 'Aferin! Sarı çiçeklerin yerinde minik domatesler belirdi.',
        },
        {
          prompt: 'Elif neden “Emeğimizin tadı başka!” dedi?',
          options: [
            'Salata çok tuzlu olduğu için',
            'Domatesleri marketten aldıkları için',
            'Domatesleri kendileri yetiştirdikleri için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Elif her gün fidelere ne yapmıştı? Emek, bir iş için harcanan çabadır.',
          explanation:
            'Harika! Domatesleri kendi emekleriyle yetiştirdikleri için tadı çok güzeldi.',
        },
      ],
      glossary: [
        { word: 'fidesi', meaning: 'Toprağa dikilmeye hazır, küçük bir bitki.' },
        { word: 'Emeğimizin', meaning: 'Bir iş için harcadığımız çabanın, uğraşımızın.' },
      ],
    },
    {
      id: 'istanbul-03-minik-serce',
      position: 3,
      kind: LessonKind.STORY,
      title: 'Minik Serçe',
      summary:
        'Rüzgârda yuvası düşen minik serçe Pıtır’ın, arkadaşlarıyla yeni bir yuva kurma hikâyesi.',
      text: {
        id: 'minik-serce',
        title: 'Minik Serçe',
        level: ReadingLevel.BASLANGIC,
        estimatedMinutes: 2,
        minGrade: 1,
        maxGrade: 4,
        paragraphs: [
          'Bahçedeki büyük ağacın dalında minik bir serçe yaşardı. Adı Pıtır’dı.',
          'Pıtır her sabah erkenden uyanır, şarkı söylerdi. Komşu kuşlar onun sesini çok severdi.',
          'Bir gün çok güçlü bir rüzgâr esti. Pıtır’ın yuvası yere düştü. Pıtır çok üzüldü.',
          'Arkadaşları hemen yardıma geldi. Kimi dal, kimi yaprak, kimi de yumuşak tüy getirdi.',
          'Akşam olmadan yeni yuva hazırdı. Pıtır o gece arkadaşları için en güzel şarkısını söyledi.',
        ],
      },
      questions: [
        {
          prompt: 'Pıtır her sabah ne yapardı?',
          options: ['Öğlene kadar uyurdu', 'Şarkı söylerdi', 'Yeni yuva arardı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Pıtır’ın sabahları erkenden uyanınca ne yaptığı yazıyor.',
          explanation: 'Doğru! Pıtır her sabah erkenden uyanıp şarkı söylerdi.',
        },
        {
          prompt: 'Rüzgâr esince Pıtır’ın yuvasına ne oldu?',
          options: ['Yere düştü', 'Daha da büyüdü', 'Ağaçta saklandı'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyede rüzgârın çok güçlü olduğu yazıyor. Böyle bir rüzgârda yuva ne olur?',
          explanation: 'Evet! Güçlü rüzgâr Pıtır’ın yuvasını yere düşürdü.',
        },
        {
          prompt: 'Arkadaşları Pıtır’a nasıl yardım etti?',
          options: [
            'Ona yeni bir ağaç buldular',
            'Ona yeni şarkılar öğrettiler',
            'Dal, yaprak ve tüy getirdiler',
          ],
          correctIndex: 2,
          hint: 'İpucu: Dördüncü paragrafta arkadaşlarının neler getirdiği yazıyor.',
          explanation: 'Harika! Arkadaşları dal, yaprak ve tüy getirip yuvayı birlikte kurdular.',
        },
      ],
      glossary: [
        { word: 'yuvası', meaning: 'Kuşların dallardan ve otlardan yaptığı küçük evi.' },
        { word: 'tüy', meaning: 'Kuşların vücudunu örten yumuşak ve hafif şey.' },
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
