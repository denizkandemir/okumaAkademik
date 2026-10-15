import { City, LessonKind, ReadingLevel } from '../../src/generated/prisma/enums.js';
import { chest, placeholderStory } from './placeholder.js';
import type { SeedCity } from './types.js';

const city = City.KAPADOKYA;

/** 5. durak — "Balonlar Yükselirken" */
export const kapadokya: SeedCity = {
  city,
  lessons: [
    placeholderStory(city, 1), // TODO(P03)
    placeholderStory(city, 2), // TODO(P03): "Uçan Balon"
    placeholderStory(city, 3), // TODO(P03)
    placeholderStory(city, 4), // TODO(P03)
    chest(city, 5),
    placeholderStory(city, 6), // TODO(P03)
    {
      id: 'kapadokya-07-gokyuzundeki-haritalar',
      position: 7,
      kind: LessonKind.STORY,
      title: 'Gökyüzündeki Haritalar',
      summary:
        'Pusula ve uydu yokken insanların yıldızlara bakarak yollarını nasıl bulduğunu anlatan hikâye.',
      text: {
        id: 'gokyuzundeki-haritalar',
        title: 'Gökyüzündeki Haritalar',
        level: ReadingLevel.ILERI,
        estimatedMinutes: 5,
        minGrade: 4,
        maxGrade: 8,
        paragraphs: [
          'Pusulanın ve uyduların olmadığı zamanlarda insanlar yönlerini nasıl bulurdu? Cevap, başımızın üstünde parıldıyordu: yıldızlar.',
          'Eski denizciler geceleri gökyüzünü dikkatle incelerdi. Kuzey Yıldızı, gökyüzünde neredeyse hiç yer değiştirmediği için onlara kuzeyi gösterirdi.',
          'Yıldızların bir araya gelerek oluşturduğu şekillere takımyıldız denir. Büyük Ayı takımyıldızındaki parlak yedi yıldız, bir kepçeye benzer. Kepçenin ucundaki iki yıldızdan çizilen hayalî bir çizgi, Kuzey Yıldızı’na ulaşır.',
          'Gezginler yalnızca yön bulmak için değil, mevsimleri anlamak için de yıldızlardan yararlanırdı. Bazı yıldızların gökyüzünde görünmeye başlaması, ekim ya da hasat zamanının yaklaştığını haber verirdi.',
          'Bugün telefonlarımızdaki haritalar işimizi kolaylaştırıyor. Yine de açık bir gecede gökyüzüne baktığında, binlerce yıl önce insanlara yol gösteren aynı yıldızları gördüğünü unutma.',
        ],
      },
      questions: [
        {
          prompt: 'Eski denizciler kuzeyi hangi yıldızla bulurdu?',
          options: ['Çoban Yıldızı', 'Kuzey Yıldızı', 'Akşam Yıldızı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta neredeyse hiç yer değiştirmeyen yıldızın adı geçiyor.',
          explanation:
            'Doğru! Kuzey Yıldızı yer değiştirmediği için denizcilere kuzeyi gösterirdi.',
        },
        {
          prompt: '“Takımyıldız” ne demektir?',
          options: [
            'Yıldızların bir araya gelerek oluşturduğu şekil',
            'Çok parlak tek bir yıldız',
            'Gökyüzündeki bir gezegen',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafın ilk cümlesi bu kelimeyi anlatıyor.',
          explanation: 'Aferin! Takımyıldız, yıldızların birlikte oluşturduğu şekildir.',
        },
        {
          prompt: 'Gezginler yön bulmak dışında yıldızlardan ne için yararlanırdı?',
          options: ['Saat yapmak için', 'Yağmur yağdırmak için', 'Mevsimleri anlamak için'],
          correctIndex: 2,
          hint: 'İpucu: Dördüncü paragrafta yön bulmanın dışında bir şey daha sayılıyor.',
          explanation: 'Harika! Bazı yıldızlar ekim ve hasat zamanının geldiğini haber verirdi.',
        },
      ],
      glossary: [
        { word: 'Pusulanın', meaning: 'İğnesi hep kuzeyi gösteren, yön bulmaya yarayan aletin.' },
        { word: 'takımyıldız', meaning: 'Gökyüzünde bir şekle benzeyen yıldız topluluğu.' },
        { word: 'hasat', meaning: 'Olgunlaşan ürünlerin tarladan toplanması.' },
      ],
    },
    placeholderStory(city, 8), // TODO(P03)
    placeholderStory(city, 9), // TODO(P03)
    chest(city, 10),
  ],
};
