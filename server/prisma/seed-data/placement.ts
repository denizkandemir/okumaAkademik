import {
  CognitiveLevel,
  GradeBand,
  QuestionType,
  ReadingLevel,
  TextTheme,
} from '../../src/generated/prisma/enums.js';
import { textMetrics } from '../../src/lib/readability.js';
import { readingMinutes } from './build.js';
import type { SeedQuestion, SeedText } from './types.js';

/**
 * Seviye belirleme okuması ("Pırıl seni tanımak istiyor!"): her sınıf grubu için sırayla okunan 2
 * kısa metin (60-120 kelime) ve her birine 3 etiketli soru. Ateşman puanı grubun hedef aralığında
 * olmalı (ATESMAN_TARGET, test/seed-data.test.ts). G1-G2'de 3, G3-G4'te 4 şık.
 * Taslaktır; öğretmen onayı için okunabilir hâli docs/icerik/onay/seviye-belirleme.md.
 */

export type SeedPlacement = {
  gradeBand: GradeBand;
  /** Okuma sırası (1-2) */
  position: number;
  text: SeedText;
  questions: SeedQuestion[];
};

/** Sınıf grubunun en küçük ve en büyük sınıfı (src/lib/grade-band.ts ile aynı eşleme). */
const GRADES: Record<GradeBand, [number, number]> = {
  G1: [1, 2],
  G2: [3, 4],
  G3: [5, 6],
  G4: [7, 8],
};

function placement(
  gradeBand: GradeBand,
  position: number,
  input: {
    slug: string;
    title: string;
    level: ReadingLevel;
    theme: TextTheme;
    paragraphs: string[];
    questions: SeedQuestion[];
  },
): SeedPlacement {
  const [minGrade, maxGrade] = GRADES[gradeBand];
  return {
    gradeBand,
    position,
    text: {
      id: `seviye-${gradeBand.toLowerCase()}-${input.slug}`,
      title: input.title,
      level: input.level,
      estimatedMinutes: readingMinutes(input.paragraphs),
      theme: input.theme,
      minGrade,
      maxGrade,
      paragraphs: input.paragraphs,
      ...textMetrics(input.paragraphs),
    },
    questions: input.questions,
  };
}

export const placementReadings: SeedPlacement[] = [
  placement(GradeBand.G1, 1, {
    slug: 'kayip-eldiven',
    title: 'Kayıp Eldiven',
    level: ReadingLevel.BASLANGIC,
    theme: TextTheme.YARDIMLASMA,
    paragraphs: [
      'Kar yağıyordu. Hava çok soğuktu. Ece okula gidiyordu. Yolda kırmızı bir eldiven gördü. Eldiven karın üstünde duruyordu.',
      'Ece eldiveni aldı. “Bu kimin acaba?” dedi. Sonra küçük bir çocuk gördü. Çocuğun bir eli çok üşümüştü.',
      'Ece eldiveni çocuğa verdi. Çocuk çok sevindi. “Teşekkür ederim!” dedi. İkisi okula birlikte yürüdü.',
      'Akşam Ece annesine olanları anlattı. Annesi gülümsedi. “Bugün iyi bir iş yaptın,” dedi.',
    ],
    questions: [
      {
        type: QuestionType.BILGI,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Ece yolda ne buldu?',
        options: ['Kırmızı bir eldiven', 'Mavi bir şapka', 'Sarı bir top'],
        correctIndex: 0,
        hint: 'İpucu: Ece okula giderken karın üstünde bir şey gördü.',
        explanation: 'Doğru! Ece karın üstünde kırmızı bir eldiven buldu.',
      },
      {
        type: QuestionType.NEDEN_SONUC,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Ece eldiveni neden çocuğa verdi?',
        options: ['Eldiven ona küçük geldi.', 'Çocuğun eli üşümüştü.', 'Annesi öyle istedi.'],
        correctIndex: 1,
        hint: 'İpucu: Ece çocuğu görünce çocuğun elinde neyi fark etti?',
        explanation: 'Harika! Çocuğun eli üşümüştü, Ece de ona eldiveni verdi.',
      },
      {
        type: QuestionType.ANA_FIKIR,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Bu hikâye bize ne anlatıyor?',
        options: ['Kışın kar yağar.', 'Okula erken gitmeliyiz.', 'Yardım etmek bizi mutlu eder.'],
        correctIndex: 2,
        hint: 'İpucu: Hikâyenin sonunda Ece ve çocuk nasıl hissetti?',
        explanation: 'Çok güzel! Ece yardım etti, hem çocuk hem Ece mutlu oldu.',
      },
    ],
  }),
  placement(GradeBand.G1, 2, {
    slug: 'tosbik-nerede',
    title: 'Tosbik Nerede?',
    level: ReadingLevel.BASLANGIC,
    theme: TextTheme.SABIR,
    paragraphs: [
      'Deniz’in bir kaplumbağası var. Adı Tosbik. Tosbik çok yavaş yürür. Deniz onu bahçeye çıkardı.',
      'Tosbik çimenlerin arasında kayboldu. Deniz her yere baktı. Ağacın altına baktı. Çiçeklerin yanına baktı. Ama Tosbik yoktu.',
      'Deniz biraz bekledi. Sonra bir marul yaprağı getirdi. Yaprağı yere koydu. Az sonra Tosbik yavaş yavaş geldi.',
      'Deniz güldü. “Sen marulu çok seviyorsun!” dedi. Artık ne yapacağını biliyor. Tosbik kaybolursa marul getirecek.',
    ],
    questions: [
      {
        type: QuestionType.SIRALAMA,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Deniz marul yaprağını ne zaman getirdi?',
        options: ['Tosbik’i bulamayınca', 'Bahçeye çıkmadan önce', 'Tosbik uyuyunca'],
        correctIndex: 0,
        hint: 'İpucu: Deniz önce her yere baktı. Sonra ne yaptı?',
        explanation: 'Doğru! Deniz, Tosbik’i bulamayınca marul getirdi.',
      },
      {
        type: QuestionType.SOZCUK_ANLAMI,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: '“Tosbik çimenlerin arasında kayboldu.” Burada “kayboldu” ne demek?',
        options: ['Uyudu', 'Görünmez oldu, bulunamadı', 'Hızlı koştu'],
        correctIndex: 1,
        hint: 'İpucu: Deniz her yere baktı ama Tosbik’i görebildi mi?',
        explanation: 'Harika! Kaybolmak, bir yerde bulunamamak demek.',
      },
      {
        type: QuestionType.DUYGU_KARAKTER,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Tosbik gelince Deniz nasıl hissetti?',
        options: ['Kızgın', 'Üzgün', 'Sevinçli'],
        correctIndex: 2,
        hint: 'İpucu: Tosbik gelince Deniz ne yaptı? Son bölüme bak.',
        explanation: 'Çok güzel! Deniz güldü; çünkü sevinmişti.',
      },
    ],
  }),
  placement(GradeBand.G2, 1, {
    slug: 'kutuphanede-bir-gun',
    title: 'Kütüphanede Bir Gün',
    level: ReadingLevel.BASLANGIC,
    theme: TextTheme.MERAK,
    paragraphs: [
      'Cumartesi sabahı Ali, babasıyla birlikte mahalledeki kütüphaneye gitti. Raflarda yüzlerce renkli kitap vardı.',
      'Ali önce dinozorlarla ilgili bir kitap seçti. Kitapta kocaman resimler ve ilginç bilgiler vardı. Bazı dinozorların bir otobüs kadar uzun olduğunu öğrendi. En çok da uzun boyunlu olanları sevdi.',
      'Kütüphaneci Ali’ye yaklaştı. “Kitapları eve de götürebilirsin,” dedi. Bunun için bir kütüphane kartı gerekiyordu. Babası formu doldurdu ve Ali’nin kartı hemen hazırlandı.',
      'O akşam Ali kitabını yatağında okudu. Uyumadan önce kendine bir söz verdi: Her hafta yeni bir kitap alacaktı.',
    ],
    questions: [
      {
        type: QuestionType.BILGI,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Ali kütüphaneye kiminle gitti?',
        options: ['Annesiyle', 'Babasıyla', 'Arkadaşıyla'],
        correctIndex: 1,
        hint: 'İpucu: Cevap hikâyenin ilk cümlesinde.',
        explanation: 'Doğru! Ali kütüphaneye babasıyla gitti.',
      },
      {
        type: QuestionType.NEDEN_SONUC,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Babası neden form doldurdu?',
        options: [
          'Kütüphaneden kitap satın almak için',
          'Kütüphanecinin adını öğrenmek için',
          'Ali kitapları eve götürebilsin diye',
        ],
        correctIndex: 2,
        hint: 'İpucu: Kütüphaneci Ali’ye ne söyledi? Bunun için ne gerekiyordu?',
        explanation: 'Harika! Kitapları eve götürmek için kütüphane kartı gerekiyordu.',
      },
      {
        type: QuestionType.ANA_FIKIR,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Bu hikâyenin ana fikri hangisi?',
        options: [
          'Kitaplar yeni şeyler öğrenmemizi sağlar.',
          'Dinozorlar çok büyük hayvanlardı.',
          'Cumartesi günleri okul yoktur.',
        ],
        correctIndex: 0,
        hint: 'İpucu: Ali kitap okuyunca ne oldu? Sonunda kendine ne söz verdi?',
        explanation: 'Çok güzel! Ali kitapla yeni şeyler öğrendi ve okumayı sevdi.',
      },
    ],
  }),
  placement(GradeBand.G2, 2, {
    slug: 'balkondaki-feslegen',
    title: 'Balkondaki Fesleğen',
    level: ReadingLevel.BASLANGIC,
    theme: TextTheme.SORUMLULUK,
    paragraphs: [
      'Zeynep’in annesi ona küçük bir saksı fesleğen hediye etti. “Artık bu bitki senin,” dedi. “Ona iyi bakmalısın.”',
      'Zeynep ilk günler fesleğeni her sabah suladı. Ama sonra okul, oyun ve ödevler arasında onu unuttu. Bir hafta sonra fesleğenin yaprakları sararmış, boynunu bükmüştü.',
      'Zeynep çok üzüldü. Hemen saksıyı güneş alan bir köşeye taşıdı ve toprağını suladı. Buzdolabının kapağına da “Fesleğeni sula!” yazan bir not yapıştırdı.',
      'Birkaç gün sonra fesleğen yeniden dikleşti. Mutfağa güzel bir koku yayıldı. Zeynep bitkiye gülümsedi: “Bir daha seni unutmayacağım.”',
    ],
    questions: [
      {
        type: QuestionType.SIRALAMA,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Zeynep fesleğenin solduğunu görünce önce ne yaptı?',
        options: [
          'Annesinden yeni bir saksı istedi.',
          'Saksıyı güneş alan bir köşeye taşıdı.',
          'Sararan yaprakları kopardı.',
        ],
        correctIndex: 1,
        hint: 'İpucu: Üçüncü bölümde Zeynep’in “hemen” yaptığı şeye bak.',
        explanation: 'Doğru! Zeynep hemen saksıyı güneşli bir köşeye taşıdı.',
      },
      {
        type: QuestionType.CUMLEDE_ANLAM,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: '“Fesleğen boynunu bükmüştü.” sözüyle ne anlatılıyor?',
        options: ['Bitki çok büyümüştü.', 'Bitki çiçek açmıştı.', 'Bitki solmuş ve eğilmişti.'],
        correctIndex: 2,
        hint: 'İpucu: Aynı cümlede yaprakların ne olduğu yazıyor.',
        explanation: 'Harika! Boynunu bükmek burada solup eğilmek demek.',
      },
      {
        type: QuestionType.DUYGU_KARAKTER,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Hikâyenin sonunda Zeynep için ne söyleyebiliriz?',
        options: [
          'Hatasından ders çıkardı.',
          'Bitkileri hiç sevmiyor.',
          'Sözünü tutmayı bilmiyor.',
        ],
        correctIndex: 0,
        hint: 'İpucu: Zeynep buzdolabına neden not yapıştırdı? Son cümlede ne dedi?',
        explanation: 'Çok güzel! Zeynep hatasını anladı ve bir daha unutmamak için önlem aldı.',
      },
    ],
  }),
  placement(GradeBand.G3, 1, {
    slug: 'leyleklerin-yolculugu',
    title: 'Leyleklerin Yolculuğu',
    level: ReadingLevel.ORTA,
    theme: TextTheme.DOGA,
    paragraphs: [
      'Her sonbahar leylekler uzun bir yolculuğa çıkar. Türkiye’den Afrika’ya kadar binlerce kilometre uçarlar. Kuşların mevsime göre yer değiştirmesine göç denir.',
      'Leylekler bu uzun yolda kanatlarını çok az çırparak uçar. Güneşin ısıttığı havanın yükseldiği yerleri bulurlar. Sıcak hava onları yukarı taşır, onlar da süzülerek ilerler. Böylece enerjilerini boşa harcamazlar.',
      'Göç sırasında leylekler kalabalık sürüler oluşturur. Bazı günlerde gökyüzünde binlerce leylek birden görülebilir. İstanbul’un tepeleri, bu yolculuğu izlemek için en güzel yerlerden biridir.',
      'İlkbahar gelince leylekler çoğunlukla aynı yuvalarına döner. Köylerde bacaların üstündeki yuvalarda leylekleri gören insanlar, baharın geldiğini anlar.',
    ],
    questions: [
      {
        type: QuestionType.BILGI,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Leylekler sonbaharda nereye göç eder?',
        options: ['Avrupa’ya', 'Afrika’ya', 'Kutuplara', 'Asya’nın kuzeyine'],
        correctIndex: 1,
        hint: 'İpucu: Cevap ilk paragrafın ikinci cümlesinde.',
        explanation: 'Doğru! Leylekler Türkiye’den Afrika’ya kadar uçar.',
      },
      {
        type: QuestionType.NEDEN_SONUC,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Leylekler sıcak havanın yükseldiği yerleri neden arar?',
        options: [
          'Yiyecek bulmak için',
          'Yağmurdan korunmak için',
          'Az kanat çırpıp enerjilerini korumak için',
          'Yuvalarını orada yapmak için',
        ],
        correctIndex: 2,
        hint: 'İpucu: İkinci paragraf sıcak havanın leyleklere nasıl yardım ettiğini anlatıyor.',
        explanation: 'Harika! Sıcak hava onları taşır, böylece enerjilerini boşa harcamazlar.',
      },
      {
        type: QuestionType.BASLIK,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Bu metne en uygun başlık hangisi olur?',
        options: [
          'Leyleklerin Uzun Yolculuğu',
          'İstanbul’un Tepeleri',
          'Köydeki Bacalar',
          'Afrika’nın Hayvanları',
        ],
        correctIndex: 0,
        hint: 'İpucu: Metnin her paragrafı aynı konuyu anlatıyor. O konu ne?',
        explanation: 'Çok güzel! Metnin tamamı leylek göçünü anlatıyor.',
      },
    ],
  }),
  placement(GradeBand.G3, 2, {
    slug: 'takim-kaptani',
    title: 'Takım Kaptanı',
    level: ReadingLevel.ORTA,
    theme: TextTheme.ARKADASLIK,
    paragraphs: [
      'Okulun voleybol takımı, ilçe turnuvasının finaline kalmıştı. Takım kaptanı Nehir, maçtan önceki gece heyecandan uyuyamadı.',
      'Maç başladığında rakip takım ilk seti kolayca kazandı. Nehir’in arkadaşları omuzlarını düşürmüş, birbirlerine kızmaya başlamışlardı. Nehir mola sırasında herkesi bir araya topladı. “Hata yapan arkadaşımızı suçlamak yerine ona destek olalım,” dedi.',
      'İkinci sette takım daha sakin oynadı. Oyuncular birbirini cesaretlendirdi. Toplar daha isabetli gitti. Maçı az farkla kaybettiler ama tribündeki öğretmenleri onları ayakta alkışladı.',
      'Eve dönerken Nehir kendini üzgün değil, gururlu hissediyordu.',
    ],
    questions: [
      {
        type: QuestionType.BILGI,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Takım hangi turnuvanın finalinde oynadı?',
        options: ['İl turnuvası', 'Okul turnuvası', 'Ülke turnuvası', 'İlçe turnuvası'],
        correctIndex: 3,
        hint: 'İpucu: Cevap metnin ilk cümlesinde.',
        explanation: 'Doğru! Takım ilçe turnuvasının finaline kalmıştı.',
      },
      {
        type: QuestionType.CUMLEDE_ANLAM,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: '“Arkadaşları omuzlarını düşürmüştü.” sözüyle anlatılan nedir?',
        options: [
          'Yorulup yere oturdukları',
          'Morallerinin bozulduğu',
          'Sakatlandıkları',
          'Isınma hareketi yaptıkları',
        ],
        correctIndex: 1,
        hint: 'İpucu: Takım ilk seti kaybetmişti. Oyuncular nasıl hissediyordu?',
        explanation: 'Harika! Omuz düşürmek, morali bozulmak ve umudunu kaybetmek demek.',
      },
      {
        type: QuestionType.ANA_FIKIR,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Bu hikâyenin ana fikri hangisidir?',
        options: [
          'Kazanmak her şeydir.',
          'Voleybol zor bir spordur.',
          'Birbirine destek olmak, sonuçtan daha değerlidir.',
          'Maçtan önce iyi uyumak gerekir.',
        ],
        correctIndex: 2,
        hint: 'İpucu: Takım kaybetti ama Nehir neden gururluydu?',
        explanation: 'Çok güzel! Takım birbirine destek oldu; Nehir bu yüzden gururluydu.',
      },
    ],
  }),
  placement(GradeBand.G4, 1, {
    slug: 'plastik-ve-deniz',
    title: 'Plastik ve Deniz',
    level: ReadingLevel.ILERI,
    theme: TextTheme.DOGA,
    paragraphs: [
      'Her yıl milyonlarca ton plastik atık, akarsular ve rüzgâr aracılığıyla denizlere ulaşıyor. Güneş ışığı ve dalgalar bu atıkları zamanla gözle zor görülen küçük parçalara ayırıyor. Bilim insanları bu parçalara mikroplastik adını veriyor.',
      'Mikroplastikler balıkların ve midyelerin vücuduna girebiliyor. Bu canlılar besin zinciri yoluyla sofralarımıza kadar geldiğinden sorun yalnızca denizlerle sınırlı kalmıyor. Ayrıca kıyıya vuran plastik poşetler, onları yiyecek sanan deniz kaplumbağalarının ölümüne yol açabiliyor.',
      'Bu sorunu çözmek için yalnızca büyük fabrikaların değişmesini beklemek yetmez. Bez çanta kullanmak, pet şişe yerine matara taşımak ve atıkları ayrıştırmak küçük alışkanlıklardır. Ancak milyonlarca insan bunları uyguladığında büyük bir fark yaratabilir.',
    ],
    questions: [
      {
        type: QuestionType.SOZCUK_ANLAMI,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Metinde “mikroplastik” ne anlama geliyor?',
        options: [
          'Plastikten yapılmış balık ağları',
          'Plastiğin parçalanmasıyla oluşan çok küçük parçalar',
          'Denizde yaşayan küçük canlılar',
          'Geri dönüştürülmüş plastik şişeler',
        ],
        correctIndex: 1,
        hint: 'İpucu: İlk paragrafta güneş ve dalgaların atıklara ne yaptığını oku.',
        explanation: 'Doğru! Mikroplastik, plastiğin parçalanmasıyla oluşan minik parçalardır.',
      },
      {
        type: QuestionType.NEDEN_SONUC,
        cognitiveLevel: CognitiveLevel.CIKARIM,
        prompt: 'Metne göre mikroplastik sorunu neden yalnızca denizlerle sınırlı değildir?',
        options: [
          'Rüzgâr plastikleri şehirlere geri taşıdığı için',
          'Fabrikalar denizlerin yanında kurulduğu için',
          'Plastik yutan deniz canlıları besin olarak sofralarımıza geldiği için',
          'Mikroplastikler deniz suyunu ısıttığı için',
        ],
        correctIndex: 2,
        hint: 'İpucu: İkinci paragrafta “besin zinciri” geçen cümleye bak.',
        explanation: 'Harika! Mikroplastik yutan balıklar ve midyeler sofralarımıza kadar gelir.',
      },
      {
        type: QuestionType.ANA_FIKIR,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Yazarın asıl vurgulamak istediği düşünce hangisidir?',
        options: [
          'Deniz kaplumbağaları poşetleri yiyecek sanır.',
          'Fabrikalar plastik üretimini hemen durdurmalıdır.',
          'Mikroplastikleri yalnızca bilim insanları inceleyebilir.',
          'Plastik kirliliğini azaltmada herkesin küçük alışkanlıkları önemlidir.',
        ],
        correctIndex: 3,
        hint: 'İpucu: Son paragraf, sorunun çözümü için ne söylüyor?',
        explanation:
          'Çok güzel! Yazar, herkesin küçük adımlarının büyük fark yaratacağını söylüyor.',
      },
    ],
  }),
  placement(GradeBand.G4, 2, {
    slug: 'dedemin-saati',
    title: 'Dedemin Saati',
    level: ReadingLevel.ILERI,
    theme: TextTheme.HATIRALAR,
    paragraphs: [
      'Dedemden bana kalan en değerli eşya, cebinde taşıdığı eski bir köstekli saatti. Saat yıllardır çalışmıyordu; camı çizilmiş, zinciri kararmıştı. Yine de her baktığımda dedemin sıcak sesi kulaklarımda çınlıyordu.',
      'Bir gün saati tamir ettirmeye karar verdim. Çarşının en eski saatçisi, saati büyüteçle uzun uzun inceledikten sonra başını salladı. “Bu saatin parçaları artık üretilmiyor,” dedi, “ama sabredersen bulmaya çalışırım.”',
      'Üç hafta sonra dükkâna döndüğümde saatin tik takları beni karşıladı. Saatçiye teşekkür edip saati dikkatle cebime yerleştirdim. O an anladım ki bazı eşyaların değeri, fiyatlarından değil taşıdıkları anılardan gelir.',
    ],
    questions: [
      {
        type: QuestionType.CUMLEDE_ANLAM,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt:
          '“Dedemin sıcak sesi kulaklarımda çınlıyordu.” cümlesiyle anlatılmak istenen nedir?',
        options: [
          'Saat, anlatıcıya dedesini hatırlatıyordu.',
          'Saat çok yüksek sesle çalıyordu.',
          'Anlatıcının kulağı ağrıyordu.',
          'Dedesi ona telefonla sesleniyordu.',
        ],
        correctIndex: 0,
        hint: 'İpucu: Saat çalışmıyordu. Peki anlatıcı saate bakınca kimi düşünüyordu?',
        explanation: 'Doğru! Saate bakınca dedesini hatırlıyor, sesini duyar gibi oluyordu.',
      },
      {
        type: QuestionType.BILGI,
        cognitiveLevel: CognitiveLevel.HATIRLAMA,
        prompt: 'Anlatıcı, saati kaç hafta sonra tamir edilmiş olarak buldu?',
        options: ['Bir', 'İki', 'Üç', 'Dört'],
        correctIndex: 2,
        hint: 'İpucu: Son paragrafın ilk cümlesine bak.',
        explanation: 'Harika! Üç hafta sonra saatin tik takları onu karşıladı.',
      },
      {
        type: QuestionType.ANA_FIKIR,
        cognitiveLevel: CognitiveLevel.ANLAMA,
        prompt: 'Bu metinden çıkarılabilecek en doğru yargı hangisidir?',
        options: [
          'Eski eşyalar atılmalıdır.',
          'Saat tamiri çok pahalıdır.',
          'Saatçiler sabırsız insanlardır.',
          'Eşyaların asıl değeri taşıdıkları anılardadır.',
        ],
        correctIndex: 3,
        hint: 'İpucu: Anlatıcı son cümlede neyi anladığını söylüyor.',
        explanation: 'Çok güzel! Saatin değeri, dedesinin anılarını taşımasından geliyor.',
      },
    ],
  }),
];
