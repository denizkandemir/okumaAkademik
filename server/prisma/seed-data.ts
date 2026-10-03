import { ReadingLevel } from '../src/generated/prisma/enums.js';

/** Başlangıç metinleri. Sınıf aralıkları (minGrade-maxGrade) metnin zorluğuna göre seçildi. */
export type SeedText = {
  id: string;
  title: string;
  level: ReadingLevel;
  estimatedMinutes: number;
  minGrade: number;
  maxGrade: number;
  paragraphs: string[];
};

export const seedTexts: SeedText[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
];
