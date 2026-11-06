import {
  City,
  CognitiveLevel,
  QuestionType,
  ReadingLevel,
  TextTheme,
} from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.ANTALYA;
const level = ReadingLevel.ORTA;

/** 4. durak — "Portakal Kokulu Sahil" */
export const antalya: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'kaleicinde-ipucu-avi',
      theme: TextTheme.KESIF,
      title: 'Kaleiçi’nde İpucu Avı',
      summary:
        'Kaan’ın babaannesinin hazırladığı ipuçlarını izleyerek Kaleiçi’ni keşfettiği hazine avı.',
      level,
      paragraphs: [
        'Kaan, yaz tatilinde Antalya’daki babaannesine gelmişti. Babaannesi ona bir sürpriz hazırlamıştı: Kaleiçi’nde bir ipucu avı! Kaan’ın eline küçük bir kâğıt verdi.',
        'İlk ipucunda şöyle yazıyordu: “Üç kemerli, çok eski bir kapı. Bir imparator geçsin diye yapıldı.” Kaan ve babaannesi Hadrian Kapısı’na yürüdüler. Babaannesi, kapının yaklaşık iki bin yıl önce yapıldığını anlattı.',
        'Kapının yanında ikinci kâğıt vardı: “Sokağa doğru taşan ahşap pencereleri bul.” Kaan dar sokaklarda başını kaldırıp baktı. Eski evlerin üst katları sokağa doğru çıkıntı yapıyordu. “Bunlara cumba denir,” dedi babaannesi.',
        'Son ipucu onları eski limana götürdü. Mavi denizde beyaz tekneler sallanıyordu. Bir bankın altında küçük bir kutu buldular. İçinde Kaan’ın en sevdiği kitap vardı!',
        'Kaan babaannesine sarıldı. “Bu, hayatımın en güzel oyunuydu,” dedi. Kaleiçi’nin her köşesi artık ona bir hikâye anlatıyordu.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Kaan ipucu avının sonunda ne buldu?',
          options: ['En sevdiği kitabı', 'Oyuncak bir tekneyi', 'Eski bir haritayı'],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta kutunun içinden ne çıktığını oku.',
          explanation: 'Doğru! Kutunun içinden Kaan’ın en sevdiği kitap çıktı.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Babaannesine göre “cumba” nedir?',
          options: [
            'Üç kemerli eski bir kapı',
            'Eski evlerde sokağa taşan pencereli bölüm',
            'Limandaki küçük bir tekne',
          ],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta ikinci ipucunu ve babaannenin açıklamasını oku.',
          explanation: 'Aferin! Cumba, eski evlerde sokağa doğru taşan pencereli bölümdür.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Kaan oyun bitince ne hissetti?',
          options: ['Çok sıkıldı', 'Babaannesine kızdı', 'Çok mutlu oldu ve babaannesine sarıldı'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Kaan’ın ne yaptığına ve ne dediğine bak.',
          explanation: 'Harika! Kaan bu oyunu hayatının en güzel oyunu olarak gördü.',
        },
      ],
      glossary: [
        { word: 'imparator', meaning: 'Çok büyük bir ülkeyi yöneten hükümdar.' },
        { word: 'çıkıntı', meaning: 'Bir yüzeyden dışarı doğru taşan kısım.' },
        { word: 'cumba', meaning: 'Eski evlerde sokağa doğru taşan, pencereli bölüm.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Kaan yazın Antalya’ya gitti. Babaannesi orada yaşıyordu. Babaannesi ona bir oyun hazırladı. Bu oyun bir ipucu avıydı! Kaan’a küçük bir kâğıt verdi.',
            'Kâğıtta şöyle yazıyordu: “Üç kemerli, çok eski bir kapı bul.” İkisi Hadrian Kapısı’na yürüdü. Kapı yaklaşık iki bin yıl önce yapılmıştı.',
            'Kapının yanında yeni bir kâğıt vardı. “Sokağa taşan pencereleri bul,” diyordu. Kaan dar sokaklarda başını kaldırdı. “Bunlara cumba denir,” dedi babaannesi.',
            'Son kâğıt onları eski limana götürdü. Bir bankın altında küçük bir kutu vardı. İçinde Kaan’ın en sevdiği kitap duruyordu! Kaan babaannesine sarıldı. “Bu en güzel oyundu,” dedi.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Küçük kutunun içinden ne çıktı?',
              options: ['Oyuncak bir tekne', 'Eski bir harita', 'En sevdiği kitap'],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta kutunun içinde ne durduğunu oku.',
              explanation: 'Doğru! Kutunun içinden Kaan’ın en sevdiği kitap çıktı.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Hikâyedeki “cumba” nedir?',
              options: [
                'Sokağa taşan pencereli bölüm',
                'Üç kemerli eski kapı',
                'Limandaki küçük tekne',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta Kaan’ın ne aradığını oku.',
              explanation: 'Aferin! Cumba, eski evlerde sokağa taşan pencereli bölümdür.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Kaan oyunun sonunda nasıl hissetti?',
              options: ['Çok sıkıldı', 'Çok mutlu oldu', 'Babaannesine kızdı'],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafta Kaan’ın ne yaptığına ve ne dediğine bak.',
              explanation: 'Harika! Kaan babaannesine sarıldı ve bu oyunu çok sevdiğini söyledi.',
            },
          ],
          glossary: [
            { word: 'ipucu', meaning: 'Bir şeyi bulmaya yardım eden küçük bilgi.' },
            { word: 'kemerli', meaning: 'Üstü yay gibi kıvrık olan.' },
            { word: 'cumba', meaning: 'Eski evlerde sokağa doğru taşan, pencereli bölüm.' },
          ],
        },
        G3: {
          paragraphs: [
            'Kaan, yaz tatilini geçirmek için Antalya’daki babaannesine gelmişti. Babaannesi ona bir sürpriz hazırlamıştı: Kaleiçi’nde bir ipucu avı! Kaan’ın eline küçük bir kâğıt verdi ve “Her ipucu seni bir sonrakine götürecek,” dedi. Kaan böyle bir oyunu daha önce hiç oynamamıştı.',
            'İlk kâğıtta şöyle yazıyordu: “Üç kemerli, çok eski bir kapı. Bir imparator geçsin diye yapıldı.” Kaan biraz düşündü, sonra babaannesiyle birlikte Hadrian Kapısı’na yürüdü. Babaannesi, kapının yaklaşık iki bin yıl önce yapıldığını anlattı. Kaan elini eski taşlara değdirdi ve kapının bunca yıl ayakta kalabilmesine şaştı.',
            'Kapının yanında ikinci kâğıt vardı: “Sokağa doğru taşan ahşap pencereleri bul.” Kaan dar sokaklarda başını kaldırıp baktı. Eski evlerin üst katları sokağa doğru çıkıntı yapıyordu. “Bunlara cumba denir,” dedi babaannesi. Kaan, karşılıklı cumbaların birbirine ne kadar yakın durduğunu görünce komşuların pencereden sohbet ettiğini hayal etti.',
            'Son ipucu onları eski limana götürdü. Mavi denizde beyaz tekneler sallanıyordu. Kaan çevredeki bankları tek tek kontrol etti ve birinin altında küçük bir kutu buldu. Kutuyu heyecanla açtı. İçinde en sevdiği kitap vardı!',
            'Kaan babaannesine sarıldı. “Bu, hayatımın en güzel oyunuydu,” dedi. Eve dönerken aynı sokaklardan geçtiler ama Kaan artık onları başka gözle görüyordu. Kaleiçi’nin her köşesi ona bir hikâye anlatıyordu.',
          ],
          questions: [
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Kaan artık onları başka gözle görüyordu.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Kaan’ın gözlük takmaya başladığı',
                'Sokakların yeniden boyandığı',
                'Akşam olduğu için sokakların karardığı',
                'Kaan’ın sokakları oyun sayesinde daha iyi tanıdığı',
              ],
              correctIndex: 3,
              hint: 'İpucu: Son paragrafın son cümlesinde Kaleiçi’nin ona ne yaptığını oku.',
              explanation:
                'Çok güzel! Oyun sayesinde Kaan, sıradan sokaklardaki hikâyeleri fark etmeye başladı.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Babaannesine göre Hadrian Kapısı ne zaman yapılmıştı?',
              options: [
                'Yaklaşık iki yüz yıl önce',
                'Yaklaşık beş yüz yıl önce',
                'Yaklaşık iki bin yıl önce',
                'Yaklaşık beş bin yıl önce',
              ],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafta babaannenin anlattıklarını oku.',
              explanation: 'Doğru! Hadrian Kapısı yaklaşık iki bin yıl önce yapılmıştır.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'Oyun oynayarak gezmek, bir yeri daha iyi tanımayı sağlar.',
                'Tatilde kitap okumak gereksizdir.',
                'Eski limanlarda her zaman kutu bulunur.',
                'Eski evlerde yaşamak zordur.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Kaan’ın gezinin başındaki ve sonundaki hâlini karşılaştır.',
              explanation:
                'Aferin! Kaan, ipuçlarını izleyerek Kaleiçi’ni çok daha yakından tanıdı.',
            },
          ],
          glossary: [
            { word: 'imparator', meaning: 'Çok büyük bir ülkeyi yöneten hükümdar.' },
            { word: 'ahşap', meaning: 'Tahtadan yapılmış.' },
            { word: 'çıkıntı', meaning: 'Bir yüzeyden dışarı doğru taşan kısım.' },
            { word: 'cumba', meaning: 'Eski evlerde sokağa doğru taşan, pencereli bölüm.' },
          ],
        },
        G4: {
          paragraphs: [
            'Kaan, yaz tatilini Antalya’daki babaannesinin yanında geçireceğini öğrendiğinde pek heyecanlanmamıştı; günlerin sıcak ve sıkıcı geçeceğini sanıyordu. Oysa babaannesi ona hiç beklemediği bir sürpriz hazırlamıştı: Kaleiçi’nde bir ipucu avı! Yaşlı kadın, torununun eline özenle katlanmış küçük bir kâğıt tutuşturdu ve gülümseyerek “Her ipucu seni bir sonrakine götürecek, yeter ki çevrene dikkatle bak,” dedi.',
            'İlk kâğıtta şöyle yazıyordu: “Üç kemerli, çok eski bir kapı. Bir imparator geçsin diye yapıldı.” Kaan kısa bir süre düşündü ve babaannesiyle birlikte Hadrian Kapısı’nın yolunu tuttu. Babaannesi, kapının yaklaşık iki bin yıl önce yapıldığını anlatırken Kaan başını kaldırıp kemerlere baktı. Yüzyıllar boyunca sayısız insan bu kemerlerin altından geçmişti; şimdi sıra ondaydı. Kaan bu düşünceyle kemerin altından yavaşça geçti.',
            'Kapının yanındaki ikinci kâğıt, onları bu kez geçmişin daha sıcak bir yüzüne götürdü: “Sokağa doğru taşan ahşap pencereleri bul.” Kaan dar sokaklarda yürürken eski evlerin üst katlarının sokağa doğru çıkıntı yaptığını fark etti. “Bunlara cumba denir,” dedi babaannesi. Karşılıklı cumbalar birbirine öylesine yaklaşmıştı ki evler, sokağın üstünden fısıldaşıyor gibiydi.',
            'Son ipucu onları eski limana ulaştırdı. Masmavi denizde beyaz tekneler ağır ağır sallanıyor, rıhtımdan gelen sesler dalgaların sesine karışıyordu. Kaan çevredeki bankları tek tek inceledi ve sonunda birinin altında küçük bir kutu buldu. Kapağını açtığında gözlerine inanamadı: İçinde en sevdiği kitap duruyordu! Demek babaannesi, onun neyi sevdiğini hiç unutmamıştı.',
            'Kaan babaannesine sarılıp “Bu, hayatımın en güzel oyunuydu,” dedi. Eve dönerken aynı sokaklardan geçtiler, ancak Kaan’ın gördüğü sokaklar artık sabahkilerle aynı değildi. Bir kapı, bir pencere ya da bir liman, ona yalnızca eski bir yer gibi görünmüyordu. Kaleiçi’nin her köşesi, dinlemeyi bilene bir hikâye anlatıyordu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde asıl vurgulanan düşünce aşağıdakilerden hangisidir?',
              options: [
                'Eski binalar yeni binalardan daha sağlamdır.',
                'Dikkatle bakan biri için tarihî bir yerin her köşesi anlamlıdır.',
                'Yaz tatilleri en iyi deniz kenarında geçirilir.',
                'İpucu avı yalnızca küçük çocuklara uygun bir oyundur.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Babaannenin ilk sözünü ve metnin son cümlesini birlikte düşün.',
              explanation:
                'Aferin! Dikkatle bakmayı öğrenen Kaan, Kaleiçi’nin her köşesinde bir hikâye buldu.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…evler, sokağın üstünden fısıldaşıyor gibiydi.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Cumbaların karşılıklı olarak birbirine çok yakın durduğu',
                'Evlerde oturanların çok sessiz konuştuğu',
                'Sokaktan rüzgârın sesinin geldiği',
                'Evlerin çok eskidiği',
              ],
              correctIndex: 0,
              hint: 'İpucu: Aynı cümlenin başında cumbalar için ne söylendiğine bak.',
              explanation:
                'Çok güzel! Cumbalar o kadar yakındı ki evler konuşuyormuş gibi görünüyordu.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Kaan, tatilin sıkıcı geçeceğini sanıyordu. II. Kutu, Hadrian Kapısı’nın yanında bulundu. III. Babaanne, Kaan’ın neyi sevdiğini biliyordu.',
              options: ['Yalnız I', 'I ve II', 'I ve III', 'II ve III'],
              correctIndex: 2,
              hint: 'İpucu: Her yargıyı tek tek ele al; kutunun nerede bulunduğuna dördüncü paragrafta bak.',
              explanation:
                'Harika! Kutu limandaki bir bankın altındaydı, bu yüzden II. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'özenle', meaning: 'Dikkat ve titizlikle.' },
            { word: 'tutuşturdu', meaning: 'Eline verdi.' },
            { word: 'sayısız', meaning: 'Sayılamayacak kadar çok.' },
            { word: 'rıhtımdan', meaning: 'Gemilerin yanaştığı, kıyıdaki taş yerden.' },
          ],
        },
      },
    }),
    story(city, {
      position: 2,
      slug: 'guletle-mavi-yolculuk',
      theme: TextTheme.KESIF,
      title: 'Guletle Mavi Yolculuk',
      summary:
        'Ela’nın guletle Akdeniz’e açılıp kaptandan denizci düğümü atmayı öğrendiği yolculuk.',
      level,
      paragraphs: [
        'Ela ailesiyle Antalya’nın eski limanından bir gulete bindi. Gulet, tahtadan yapılmış, iki direkli güzel bir tekneydi. Beyaz yelkenleri katlanmış, direklere bağlanmıştı.',
        'Kaptan Rıza, güler yüzlü bir adamdı. Tekne denize açılınca Ela’ya, “Bir denizci olmak ister misin?” diye sordu. Ela heyecanla başını salladı.',
        'Kaptan ona ipi direğe bağlamayı gösterdi. “Bu bir denizci düğümü. Ne kadar çekersen o kadar sıkılaşır,” dedi. Ela birkaç kez denedi. Dördüncü denemede düğümü doğru attı.',
        'Öğleden sonra gulet sakin bir koyda durdu. Su o kadar berraktı ki dipteki taşlar ve küçük balıklar görünüyordu. Ela can yeleğini giyip babasıyla birlikte denize girdi.',
        'Akşam limana dönerken Kaptan Rıza, Ela’nın attığı düğümü herkese gösterdi. “Bugün teknemizde yeni bir denizci var!” dedi. Ela’nın yüzü kıvançla parladı.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Kaptan Rıza Ela’ya ne öğretti?',
          options: ['Yüzmeyi', 'Denizci düğümü atmayı', 'Balık tutmayı'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta kaptanın Ela’ya gösterdiği şeyi oku.',
          explanation: 'Doğru! Kaptan Ela’ya denizci düğümü atmayı öğretti.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Ela dipteki taşları neden görebiliyordu?',
          options: [
            'Su çok berrak olduğu için',
            'Gece olduğu için',
            'Dalgalar çok büyük olduğu için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta suyun nasıl olduğu yazıyor.',
          explanation: 'Aferin! Su o kadar berraktı ki dibi bile görünüyordu.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Kaptan “Yeni bir denizci var!” deyince Ela nasıl hissetti?',
          options: ['Utanıp ağladı', 'Korktu', 'Gururlandı ve sevindi'],
          correctIndex: 2,
          hint: 'İpucu: Son cümlede Ela’nın yüzünün nasıl parladığına bak.',
          explanation: 'Harika! Ela emek verip öğrendiği için gurur ve sevinç duydu.',
        },
      ],
      glossary: [
        { word: 'koyda', meaning: 'Denizin karaya girdiği küçük, sakin bölümde.' },
        { word: 'berraktı', meaning: 'Tertemiz ve içi görünecek kadar açıktı.' },
        { word: 'kıvançla', meaning: 'Gurur ve sevinçle.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Ela ailesiyle Antalya’nın eski limanına gitti. Orada bir gulete bindiler. Gulet, tahtadan yapılmış güzel bir tekneydi.',
            'Kaptan Rıza çok güler yüzlüydü. “Denizci olmak ister misin?” diye sordu. Ela hemen başını salladı. Kaptan ipi direğe bağlamayı gösterdi. Ela birkaç kez denedi. Dördüncü denemede düğümü doğru attı.',
            'Öğleden sonra tekne sakin bir koyda durdu. Su çok berraktı. Dipteki taşlar ve balıklar görünüyordu. Ela can yeleğini giydi. Babasıyla birlikte denize girdi.',
            'Akşam limana dönüyorlardı. Kaptan, Ela’nın düğümünü herkese gösterdi. “Teknemizde yeni bir denizci var!” dedi. Ela çok gururlandı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dipteki taşlar neden görünüyordu?',
              options: [
                'Gece olduğu için',
                'Su çok berrak olduğu için',
                'Dalgalar büyük olduğu için',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafta suyun nasıl olduğuna bak.',
              explanation: 'Aferin! Su berrak olunca dibi de görünür.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Ela düğümü kaçıncı denemede doğru attı?',
              options: ['İkinci', 'Üçüncü', 'Dördüncü'],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafın son cümlesini oku.',
              explanation: 'Doğru! Ela düğümü dördüncü denemede doğru attı.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Kaptan düğümü herkese gösterince Ela nasıl hissetti?',
              options: ['Gururlandı', 'Korktu', 'Üzüldü'],
              correctIndex: 0,
              hint: 'İpucu: Son cümleyi oku.',
              explanation: 'Harika! Ela emek verip öğrendiği için gururlandı.',
            },
          ],
          glossary: [
            { word: 'gulete', meaning: 'Tahtadan yapılmış, direkli tekneye.' },
            { word: 'direğe', meaning: 'Teknede yelkeni taşıyan uzun, dik çubuğa.' },
            { word: 'koyda', meaning: 'Denizin karaya girdiği sakin yerde.' },
            { word: 'berraktı', meaning: 'Tertemiz ve içi görünecek kadar açıktı.' },
          ],
        },
        G3: {
          paragraphs: [
            'Ela ailesiyle Antalya’nın eski limanına gelmişti. Bugün ilk kez bir gulete binecekti. Gulet, tahtadan yapılmış, iki direkli güzel bir tekneydi. Beyaz yelkenleri katlanmış, direklere bağlanmıştı. Ela güverteye adımını atınca tahtaların ayağının altında hafifçe gıcırdadığını duydu.',
            'Kaptan Rıza, güler yüzlü bir adamdı. Tekne denize açılınca Ela’nın yanına geldi ve “Bir denizci olmak ister misin?” diye sordu. Ela heyecanla başını salladı. Kaptan, her denizcinin önce ipi tanıması gerektiğini söyledi.',
            'Sonra ipi direğe bağlamayı gösterdi. “Bu bir denizci düğümü. Ne kadar çekersen o kadar sıkılaşır,” dedi. Ela denedi ama ip elinden kayıp çözüldü. İkinci ve üçüncü denemede de olmadı. Yine de vazgeçmedi; kaptanın ellerini dikkatle izledi ve dördüncü denemede düğümü doğru attı.',
            'Öğleden sonra gulet sakin bir koyda durdu. Su o kadar berraktı ki dipteki taşlar ve küçük balıklar görünüyordu. Ela can yeleğini giyip babasıyla birlikte denize girdi. Suyun üstünde uzanıp gökyüzüne baktı ve kendini çok huzurlu hissetti.',
            'Akşam limana dönerken Kaptan Rıza, Ela’nın attığı düğümü herkese gösterdi. “Bugün teknemizde yeni bir denizci var!” dedi. Ela’nın yüzü kıvançla parladı. Düğüm küçüktü ama ona göre o günün en büyük başarısıydı, çünkü onu kendi emeğiyle öğrenmişti.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Ela’nın sonunda düğümü doğru atabilmesinin asıl nedeni nedir?',
              options: [
                'İpin çok kısa olması',
                'Kaptanın düğümü onun yerine atması',
                'Vazgeçmeyip dikkatle izlemesi',
                'Denizin sakin olması',
              ],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafın son cümlesini oku.',
              explanation: 'Aferin! Ela vazgeçmedi, kaptanı dikkatle izledi ve başardı.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne aşağıdakilerden hangisi başlık olarak da uygun olurdu?',
              options: [
                'Emekle Öğrenilen Düğüm',
                'Akdeniz’in Balıkları',
                'Kaptanın Kayıp İpi',
                'Limanda Bir Akşam Yemeği',
              ],
              correctIndex: 0,
              hint: 'İpucu: Metnin baştan sona en çok anlattığı olayı düşün.',
              explanation: 'Çok güzel! Bu başlık, Ela’nın emek vererek öğrendiği düğümü anlatıyor.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Ela’nın yüzü kıvançla parladı.” cümlesindeki “kıvançla” sözcüğü ne anlama gelir?',
              options: ['Üzüntüyle', 'Öfkeyle', 'Utançla', 'Gurur ve sevinçle'],
              correctIndex: 3,
              hint: 'İpucu: Kaptan Ela’yı herkesin önünde övüyor. Bunu duyan biri ne hisseder?',
              explanation: 'Harika! Kıvanç, başarıdan duyulan gurur ve sevinçtir.',
            },
          ],
          glossary: [
            { word: 'güverteye', meaning: 'Teknenin üstündeki, üzerinde yürünen düz bölüme.' },
            { word: 'gıcırdadığını', meaning: 'İnce, cızırtılı bir ses çıkardığını.' },
            { word: 'koyda', meaning: 'Denizin karaya girdiği küçük, sakin bölümde.' },
            { word: 'emeğiyle', meaning: 'Harcadığı çabayla.' },
          ],
        },
        G4: {
          paragraphs: [
            'Ela, ailesiyle birlikte Antalya’nın eski limanına geldiğinde gözleri önce rıhtımda bekleyen gulete takıldı. Tahtadan yapılmış, iki direkli bu zarif tekne, yanındaki yeni teknelerin arasında geçmişten gelmiş bir misafir gibi duruyordu. Beyaz yelkenleri katlanıp direklere bağlanmıştı. Ela güverteye adım attığında, ayağının altında hafifçe gıcırdayan tahtalar ona macera dolu bir günün başladığını haber veriyordu.',
            'Kaptan Rıza, yüzündeki çizgilerde denizde geçen uzun bir ömrün izini taşıyan, güler yüzlü bir adamdı. Tekne limandan uzaklaşınca Ela’ya dönüp “Bir denizci olmak ister misin?” diye sordu. Ela heyecanla başını salladı; ama o sırada denizciliğin bir ip parçasıyla başlayacağını aklına bile getirmiyordu. Kaptan ona gülerek küçük bir ip uzattı ve önce onu tanımasını istedi.',
            'Kaptan, ipi direğe bağlamayı gösterdi. “Bu bir denizci düğümü. Ne kadar çekersen o kadar sıkılaşır,” dedi. Kaptanın parmaklarında kolay görünen iş, Ela’nın elinde bir bilmeceye dönüştü. İlk denemede ip elinden kaydı, ikincide düğüm kendiliğinden çözüldü, üçüncüde ise ip birbirine dolaştı. Ela sabırsızlanmaya başlasa da vazgeçmedi. Kaptanın ellerini bir kez daha dikkatle izledi ve dördüncü denemede düğümü doğru attı.',
            'Öğleden sonra gulet sakin bir koyda demir attı. Su öylesine berraktı ki dipteki taşlar ve küçük balıklar, camın ardındaymış gibi görünüyordu. Ela can yeleğini giyip babasıyla birlikte denize girdi. Dalgaların arasında sırtüstü uzanırken sabahki heyecanın yerini tatlı bir huzur almıştı. O an kıyıdaki kalabalık ona çok uzak geliyordu.',
            'Akşam limana dönerken güneş denizi turuncuya boyuyordu. Kaptan Rıza, Ela’nın attığı düğümü herkese gösterip “Bugün teknemizde yeni bir denizci var!” dedi. Ela’nın yüzü kıvançla parladı. Belki o düğüm, denizde geçen uzun bir ömrün yanında çok küçük bir şeydi; fakat Ela için emekle kazanılmış ilk madalyaydı.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en kapsamlı düşünce aşağıdakilerden hangisidir?',
              options: [
                'Denizcilik yalnızca yetişkinlerin yapabileceği bir iştir.',
                'Eski tekneler yeni teknelerden daha hızlıdır.',
                'Sabırla kazanılan başarı, küçük de olsa insanı gururlandırır.',
                'İyi bir tatil için mutlaka denize girmek gerekir.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafın son cümlesinde düğümün Ela için ne anlama geldiğini düşün.',
              explanation:
                'Aferin! Ela’nın düğümü küçüktü ama emekle kazanıldığı için çok değerliydi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Kaptanın parmaklarında kolay görünen iş, Ela’nın elinde bir bilmeceye dönüştü.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Düğüm atmanın göründüğü kadar kolay olmadığı',
                'Kaptanın Ela’ya bir bilmece sorduğu',
                'Ela’nın bilmeceleri çok sevdiği',
                'Kaptanın düğümü yanlış gösterdiği',
              ],
              correctIndex: 0,
              hint: 'İpucu: Bu cümleden sonra Ela’nın denemelerinde neler olduğunu oku.',
              explanation: 'Çok güzel! Kaptana kolay gelen düğüm, Ela’yı üç denemede de zorladı.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Kaptana göre denizci düğümü “ne kadar çekersen o kadar sıkılaşır”. Buna göre bir düğüm çekilince gevşiyorsa aşağıdakilerden hangisi söylenebilir?',
              options: [
                'Düğüm doğru atılmıştır.',
                'Bu, denizci düğümü gibi atılmamıştır.',
                'İp çok uzundur.',
                'Düğümü kaptan atmıştır.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragraftaki kuralı bu duruma uygula.',
              explanation:
                'Harika! Çekildikçe sıkılaşmayan bir düğüm, kaptanın anlattığı düğüm olamaz.',
            },
          ],
          glossary: [
            { word: 'zarif', meaning: 'İnce ve güzel görünüşlü.' },
            { word: 'ömrün', meaning: 'Yaşanan hayatın.' },
            { word: 'demir attı', meaning: 'Durmak için teknenin demirini denize indirdi.' },
            { word: 'kıvançla', meaning: 'Gurur ve sevinçle.' },
          ],
        },
      },
    }),
    story(city, {
      position: 3,
      slug: 'denize-dokulen-selale',
      theme: TextTheme.DOGA,
      title: 'Denize Dökülen Şelale',
      summary:
        'Efe’nin Düden Şelalesi’nin arkasındaki mağaraya girip denize dökülen şelaleyi gördüğü gezi.',
      level,
      paragraphs: [
        'Efe ile annesi, Antalya’daki Düden Şelalesi’ni görmeye gittiler. Önce şehrin içindeki büyük bir parka, Yukarı Düden’e geldiler. Uzaktan güçlü bir su sesi duyuluyordu.',
        'Şelalenin önüne gelince Efe gözlerine inanamadı. Su, kayalardan beyaz köpükler hâlinde aşağı dökülüyordu. Havada minicik su damlaları uçuşuyor, yüzlerini serinletiyordu.',
        'Annesi onu şelalenin arkasındaki küçük mağaraya götürdü. Mağaranın içinden bakınca su, bir perde gibi önlerinden akıyordu. Efe, “Şelalenin arkasına geçtik!” diye bağırdı ama sesi suyun gürültüsünde kayboldu.',
        'Ertesi gün tekneyle Aşağı Düden’e gittiler. Bu şelale, yüksek kayalıklardan doğrudan denize dökülüyordu. Güneş ışığı suya vurunca küçük bir gökkuşağı belirdi.',
        'Efe fotoğraf çekmeyi bile unuttu. Gözlerini kapatıp suyun sesini dinledi. “Bazı güzellikler fotoğrafa sığmıyor,” diye düşündü.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Aşağı Düden Şelalesi nereye dökülüyordu?',
          options: ['Bir göle', 'Denize', 'Bir nehre'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafın ikinci cümlesine bak.',
          explanation: 'Doğru! Aşağı Düden Şelalesi yüksek kayalıklardan denize dökülür.',
        },
        {
          type: QuestionType.CUMLEDE_ANLAM,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: '“Su, bir perde gibi önlerinden akıyordu.” Bu cümle ne anlatıyor?',
          options: [
            'Su, önlerinde perde gibi bir duvar oluşturuyordu',
            'Mağaraya gerçek bir perde asılmıştı',
            'Su hiç akmıyordu',
          ],
          correctIndex: 0,
          hint: 'İpucu: Efe ile annesi şelalenin arkasındaydı. Önlerinden dökülen su neye benziyordu?',
          explanation: 'Aferin! Dökülen su, önlerinde bir perde gibi duruyordu.',
        },
        {
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Efe şelaleyi izlerken ne düşündü?',
          options: [
            'Hemen eve dönmek istediğini',
            'Şelalenin çok küçük olduğunu',
            'Bazı güzelliklerin fotoğrafa sığmadığını',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Efe’nin aklından geçenleri oku.',
          explanation: 'Harika! Bazı anları en iyi, durup dinleyerek yaşarız.',
        },
      ],
      glossary: [
        { word: 'köpükler', meaning: 'Su çalkalanınca oluşan beyaz, hafif kabarcıklar.' },
        { word: 'mağaraya', meaning: 'Kayaların içindeki doğal oyuğa.' },
        { word: 'doğrudan', meaning: 'Başka bir yere uğramadan, dosdoğru.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Efe ile annesi Antalya’ya geldi. Düden Şelalesi’ne gittiler. Önce büyük bir parka girdiler. Uzaktan güçlü bir su sesi geldi.',
            'Su, kayadan bembeyaz akıyordu. Efe çok şaşırdı. Minik damlalar yüzlerini serinletti. Annesi onu küçük bir mağaraya götürdü. Mağara şelalenin arkasındaydı. Su, önlerinden bir perde gibi aktı.',
            'Ertesi gün tekneye bindiler. Bu kez başka bir şelale gördüler. Bu şelale denize dökülüyordu. Güneş suya vurdu. Küçük bir gökkuşağı belirdi.',
            'Efe fotoğraf çekmeyi unuttu. Gözlerini kapattı ve suyun sesini dinledi. “Bazı güzellikler fotoğrafa sığmıyor,” diye düşündü.',
          ],
          questions: [
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Minik damlalar yüzlerini serinletti.” Burada “serinletti” ne demek?',
              options: ['Ferahlattı', 'Çok ısıttı', 'Kuruttu'],
              correctIndex: 0,
              hint: 'İpucu: Sıcak bir günde yüzüne su damlası değse ne hissedersin?',
              explanation: 'Aferin! Serinletmek, sıcağı azaltıp ferahlatmaktır.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Küçük mağara neredeydi?',
              options: ['Parkın girişinde', 'Şelalenin arkasında', 'Denizin dibinde'],
              correctIndex: 1,
              hint: 'İpucu: İkinci paragrafta mağaranın nerede olduğunu oku.',
              explanation: 'Doğru! Mağara şelalenin arkasındaydı.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Efe neden fotoğraf çekmeyi unuttu?',
              options: [
                'Telefonu bozulduğu için',
                'Hava karardığı için',
                'Şelalenin güzelliğine daldığı için',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta Efe’nin ne yaptığını ve ne düşündüğünü oku.',
              explanation: 'Harika! Efe suyun sesini dinlemeye öyle daldı ki fotoğrafı unuttu.',
            },
          ],
          glossary: [
            { word: 'perde', meaning: 'Bir yeri kapatan, asılı bez.' },
            { word: 'mağaraya', meaning: 'Kayaların içindeki doğal oyuğa.' },
            { word: 'belirdi', meaning: 'Görünmeye başladı.' },
          ],
        },
        G3: {
          paragraphs: [
            'Efe ile annesi, Antalya’daki Düden Şelalesi’ni görmeye gittiler. Önce şehrin içindeki büyük bir parka, Yukarı Düden’e geldiler. Ağaçların arasında yürürken uzaktan güçlü bir su sesi duyuluyordu. Efe, ses yaklaştıkça adımlarını hızlandırdı. Annesi de ona yetişmeye çalıştı.',
            'Şelalenin önüne gelince gözlerine inanamadı. Su, kayalardan beyaz köpükler hâlinde aşağı dökülüyordu. Havada minicik su damlaları uçuşuyor, sıcak günde yüzlerini serinletiyordu. Daha önce şelaleyi yalnızca resimlerde görmüştü. Bir süre hiç konuşmadan bu görüntüyü izledi. Su sesi çok güçlüydü.',
            'Annesi onu şelalenin arkasındaki küçük mağaraya götürdü. Mağaranın içinden bakınca su, bir perde gibi önlerinden akıyordu. Efe, “Şelalenin arkasına geçtik!” diye bağırdı ama sesi suyun gürültüsünde kayboldu. Annesi söylediklerini duymadı, yine de onun sevincini yüzünden anladı ve gülümsedi.',
            'Ertesi gün tekneyle Aşağı Düden’e gittiler. Bu şelale, yüksek kayalıklardan doğrudan denize dökülüyordu. Efe, tatlı suyun tuzlu denizle buluştuğu yeri ilk kez görüyordu. Güneş ışığı suya vurunca küçük bir gökkuşağı belirdi. Teknedekiler hep birlikte telefonlarına sarıldı.',
            'Efe ise fotoğraf çekmeyi bile unuttu. Gözlerini kapatıp suyun sesini dinledi, yüzüne değen damlaları hissetti. Fotoğraf görüntüyü saklayabilirdi ama sesi, serinliği ve o anki sevinci saklayamazdı. “Bazı güzellikler fotoğrafa sığmıyor,” diye düşündü. O anı hiç unutmadı.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Aşağı Düden Şelalesi’nin suyu nereye dökülüyordu?',
              options: ['Denize', 'Bir göle', 'Bir parka', 'Bir mağaraya'],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafın ikinci cümlesine bak.',
              explanation: 'Doğru! Aşağı Düden Şelalesi yüksek kayalıklardan denize dökülür.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Annesi, Efe’nin söylediklerini neden duymadı?',
              options: [
                'Çok uzakta olduğu için',
                'Suyun gürültüsü çok fazla olduğu için',
                'Efe fısıldadığı için',
                'Başka biriyle konuştuğu için',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafta Efe’nin sesine ne olduğunu oku.',
              explanation: 'Aferin! Şelalenin gürültüsü Efe’nin sesini bastırdı.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Bazı güzellikler fotoğrafa sığmıyor.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Fotoğrafların çok küçük olduğu',
                'Şelalenin fotoğrafının çekilmesinin yasak olduğu',
                'Bazı anların ancak yaşanarak tam hissedilebileceği',
                'Efe’nin fotoğraf çekmeyi bilmediği',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta fotoğrafın neleri saklayamadığına bak.',
              explanation: 'Harika! Ses, serinlik ve sevinç ancak o anı yaşayınca hissedilir.',
            },
          ],
          glossary: [
            { word: 'köpükler', meaning: 'Su çalkalanınca oluşan beyaz, hafif kabarcıklar.' },
            { word: 'kayalıklardan', meaning: 'Sert, taşlık yerlerden.' },
            { word: 'doğrudan', meaning: 'Başka bir yere uğramadan, dosdoğru.' },
            { word: 'tatlı suyun', meaning: 'Tuzlu olmayan, nehir ya da göl suyunun.' },
          ],
        },
        G4: {
          paragraphs: [
            'Efe ile annesi, Antalya’ya gelir gelmez Düden Şelalesi’ni görmeye karar verdiler. Önce şehrin içinde kalan ve büyük bir parka dönüşmüş olan Yukarı Düden’e gittiler. Yemyeşil ağaçların gölgesinde ilerlerken uzaktan gelen güçlü su sesi, onları neyin beklediğini haber veriyordu. Efe o sesi duydukça sabrı tükeniyor, adımları kendiliğinden hızlanıyordu.',
            'Şelalenin karşısına geçtiğinde gözlerine inanamadı. Su, kayaların üzerinden beyaz köpükler hâlinde aşağıya dökülürken havaya minicik damlalar saçıyor, bu damlalar sıcak yaz gününde yüzlerini serinletiyordu. Efe bir süre hiç konuşmadan öylece durdu. Resimlerde gördüğü şelalelerin sessiz olduğunu o an fark etti; gerçeği ise insanın bütün bedeniyle duyabileceği kadar canlıydı.',
            'Annesi onu şelalenin arkasındaki küçük mağaraya götürdü. İçeriden bakıldığında su, önlerinden bir perde gibi akıyor, dünya o perdenin ardında bulanıklaşıyordu. Efe heyecanla “Şelalenin arkasına geçtik!” diye bağırdı ama sesi suyun gürültüsünde kaybolup gitti. Annesi tek kelime duymamıştı; yine de Efe’nin ne söylediğini parlayan gözlerinden anladı. İkisi de gülerek bir süre daha orada kalıp suyu izledi.',
            'Ertesi gün bir tekneye binip aynı suyun yolculuğunun son durağına, Aşağı Düden’e gittiler. Tekne yavaşça şelaleye yaklaştı. Burada şelale, yüksek kayalıklardan doğrudan denize dökülüyordu. Tatlı su ile tuzlu deniz, beyaz bir köpük şeridinde buluşuyordu. Güneş ışığı suya vurunca havada küçük bir gökkuşağı belirdi ve teknedeki herkes aynı anda telefonuna sarıldı.',
            'Efe ise fotoğraf çekmeyi bile unutmuştu. Gözlerini kapatıp suyun sesini dinledi, yüzüne değen damlaların serinliğini hissetti. Bir fotoğraf, önündeki manzaranın rengini saklayabilirdi belki; ama o sesi, o serinliği ve içindeki sevinci hiçbir kareye sığdıramazdı. “Bazı güzellikler fotoğrafa sığmıyor,” diye düşündü. Dönüş yolunda annesi telefonundaki kareleri gösterdiğinde gülümsedi: Görüntüler güzeldi, fakat şelalenin kendisi kadar canlı değildi.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Aşağıdakilerden hangisi metinden çıkarılabilecek yardımcı düşüncelerden biridir?',
              options: [
                'Bir yeri görmek, onun resmine bakmaktan farklı bir deneyimdir.',
                'Şelaleler yalnızca yaz aylarında görülebilir.',
                'Telefonla fotoğraf çekmek zararlıdır.',
                'Tekneyle gezmek yürümekten daha eğlencelidir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafta Efe’nin resimlerle gerçek şelale arasında fark ettiği şeyi oku.',
              explanation:
                'Aferin! Efe, gerçek şelalenin resimlerdekinden çok daha canlı olduğunu gördü.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Son paragrafın sonuna aşağıdaki cümlelerden hangisi getirilirse anlam akışı bozulmaz?',
              options: [
                'Bu yüzden hemen o kareleri çoğaltmak istedi.',
                'Onun için asıl değerli olan, o anı yaşamaktı.',
                'Teknenin yakıtını ölçmek için bir araç aldı.',
                'Ertesi sabah okul servisini kaçırdı.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragraf Efe’nin fotoğraflar hakkındaki düşüncesini anlatıyor. Onu sürdüren cümleyi seç.',
              explanation:
                'Çok güzel! Bu cümle, Efe’nin fotoğraf hakkındaki düşüncesini doğal olarak sürdürüyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…gerçeği ise insanın bütün bedeniyle duyabileceği kadar canlıydı.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Şelalenin çok tehlikeli olduğu',
                'Şelalenin sesinin kulakları acıttığı',
                'Efe’nin suya düştüğü',
                'Şelalenin görüntüsünün yanı sıra sesiyle ve serinliğiyle de hissedildiği',
              ],
              correctIndex: 3,
              hint: 'İpucu: İkinci paragrafta Efe’nin şelalenin önünde neler hissettiğine bak.',
              explanation:
                'Harika! Şelale yalnızca görülmüyor, sesi ve damlalarıyla da hissediliyordu.',
            },
          ],
          glossary: [
            { word: 'bulanıklaşıyordu', meaning: 'Net görünmez oluyordu.' },
            { word: 'kayalıklardan', meaning: 'Sert, taşlık yerlerden.' },
            { word: 'manzaranın', meaning: 'Bakınca görülen doğa görüntüsünün.' },
            { word: 'kareye', meaning: 'Tek bir fotoğrafa.' },
          ],
        },
      },
    }),
    story(city, {
      position: 4,
      slug: 'portakal-bahcesi',
      theme: TextTheme.PAYLASMAK,
      title: 'Portakal Bahçesi',
      summary:
        'Melis’in dedesinin bahçesinde portakal toplayıp çiçeğin meyveye dönüşmesini öğrendiği kış günü.',
      level,
      paragraphs: [
        'Melis’in dedesinin Antalya’da büyük bir portakal bahçesi vardı. Melis kış tatilinde dedesine gitti. Ağaçlar turuncu portakallarla doluydu.',
        'Dedesi ona küçük bir sepet verdi. “Portakalı koparırken dalı kırmadan, yavaşça çevir,” dedi. Melis ilk portakalı dikkatle kopardı. Kabuğunu soyunca etrafa mis gibi bir koku yayıldı.',
        'Melis, “Dede, bu portakallar nereden çıkıyor?” diye sordu. Dedesi gülümsedi. “İlkbaharda ağaçlar beyaz çiçek açar. Bu çiçeklere portakal çiçeği denir. Çiçekler zamanla küçük yeşil meyvelere dönüşür. Güneş ve su onları aylarca büyütür,” dedi.',
        'Öğleden sonra birlikte taze portakal suyu sıktılar. Melis bir bardak içti. Hiç bu kadar lezzetli bir portakal suyu içmemişti.',
        'Akşam Melis sepetteki portakalları komşulara dağıttı. Komşular ona teşekkür etti. Melis, “Dede, paylaşınca portakallar daha da tatlı oluyor,” dedi. Dedesi onu kucakladı.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'İlkbaharda portakal ağaçları ne açar?',
          options: ['Pembe yapraklar', 'Beyaz çiçekler', 'Sarı tohumlar'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta dedesinin anlattıklarını oku.',
          explanation: 'Doğru! İlkbaharda portakal ağaçları beyaz çiçek açar.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Dedesi Melis’e neden dalı kırmadan koparmasını söyledi?',
          options: [
            'Ağaç zarar görmesin ve yeniden meyve versin diye',
            'Sepet çabuk dolmasın diye',
            'Portakallar ekşi olmasın diye',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dallar kırılırsa ağaç ilkbaharda nerede çiçek açar?',
          explanation: 'Aferin! Dallar sağlam kalırsa ağaç her yıl yeniden meyve verir.',
        },
        {
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Melis hikâyenin sonunda ne fark etti?',
          options: [
            'Portakalların çok ağır olduğunu',
            'Komşuların portakal sevmediğini',
            'Paylaşmanın insanı daha mutlu ettiğini',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Melis’in dedesine söylediği söze bak.',
          explanation: 'Harika! Sevdiğimiz şeyleri paylaşınca mutluluğumuz da büyür.',
        },
      ],
      glossary: [
        { word: 'sepet', meaning: 'Saz ya da ince dallardan örülmüş, saplı kap.' },
        { word: 'Kabuğunu', meaning: 'Meyvenin dışını saran katmanı.' },
        { word: 'dönüşür', meaning: 'Başka bir şey hâline gelir.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Melis’in dedesinin bir bahçesi vardı. Bahçe Antalya’daydı. Melis kışın dedesine gitti. Ağaçlar portakal doluydu. Bu çok güzeldi.',
            'Dedesi ona küçük bir sepet verdi. “Portakalı yavaşça çevir, dalı kırma,” dedi. Melis ilk portakalı dikkatle kopardı. Kabuğunu soyunca mis gibi koktu.',
            '“Dede, portakallar nereden çıkıyor?” diye sordu Melis. Dedesi gülümsedi. “İlkbaharda ağaçlar beyaz çiçek açar. Çiçekler küçük yeşil meyveler olur. Güneş ve su onları büyütür,” dedi.',
            'Akşam Melis portakalları komşulara dağıttı. Komşular ona teşekkür etti. “Paylaşınca portakallar daha tatlı oluyor,” dedi Melis. Dedesi onu kucakladı. Melis çok mutlu oldu.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Portakal ağaçları ilkbaharda ne açar?',
              options: ['Beyaz çiçek', 'Pembe yaprak', 'Sarı tohum'],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta dedenin anlattıklarını oku.',
              explanation: 'Doğru! Portakal ağaçları ilkbaharda beyaz çiçek açar.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dedesi portakalın neden yavaşça çevrilmesini istedi?',
              options: [
                'Portakal yere düşsün diye',
                'Dal kırılmasın diye',
                'Sepet çabuk dolsun diye',
              ],
              correctIndex: 1,
              hint: 'İpucu: İkinci paragrafta dedenin sözünü oku.',
              explanation: 'Aferin! Portakal yavaşça çevrilince dal kırılmaz.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Melis’in son sözü neyi gösteriyor?',
              options: [
                'Portakalları sevmediğini',
                'Komşulara kızdığını',
                'Paylaşmaktan mutlu olduğunu',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta Melis’in ne söylediğini oku.',
              explanation: 'Harika! Melis paylaşınca çok mutlu oldu.',
            },
          ],
          glossary: [
            { word: 'sepet', meaning: 'Saz ya da ince dallardan örülmüş, saplı kap.' },
            { word: 'Kabuğunu', meaning: 'Meyvenin dışını saran katmanı.' },
            { word: 'kucakladı', meaning: 'Kollarıyla sarıldı.' },
          ],
        },
        G3: {
          paragraphs: [
            'Melis’in dedesinin Antalya’da büyük bir portakal bahçesi vardı. Melis kış tatilinde dedesine gitti. Bahçeye girince şaşırdı, çünkü ağaçlar turuncu portakallarla doluydu. Soğuk bir mevsimde bu kadar parlak bir renk görmeyi beklemiyordu.',
            'Dedesi ona küçük bir sepet verdi. “Portakalı koparırken dalı kırmadan, yavaşça çevir. Dal sağlam kalırsa ağaç gelecek yıl da meyve verir,” dedi. Melis ilk portakalı büyük bir dikkatle kopardı. Kabuğunu soyunca etrafa mis gibi bir koku yayıldı.',
            'Melis, “Dede, bu portakallar nereden çıkıyor?” diye sordu. Dedesi gülümsedi. “İlkbaharda ağaçlar beyaz çiçek açar. Bu çiçeklere portakal çiçeği denir. Çiçekler zamanla küçük yeşil meyvelere dönüşür. Güneş ve su onları aylarca büyütür,” dedi. Melis elindeki portakala yeniden baktı. Demek bu meyve, aylar süren uzun bir yolculuktan sonra sepetine girmişti.',
            'Öğleden sonra birlikte taze portakal suyu sıktılar ve Melis bir bardak içti; kendi topladığı portakalların suyu ona her zamankinden lezzetli geldi.',
            'Akşam Melis sepetteki portakalları komşulara dağıttı. Yaşlı bir komşu, bu kokunun ona çocukluğunu hatırlattığını söyledi. Melis buna çok sevindi ve eve dönerken “Dede, paylaşınca portakallar daha da tatlı oluyor,” dedi. Dedesi onu kucakladı ve “Bir meyveyi en tatlı yapan şey de budur,” diye karşılık verdi.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Aşağıdakilerden hangisi bu metnin ana fikridir?',
              options: [
                'Portakal suyu sabahları içilmelidir.',
                'Paylaşmak, sahip olduklarımızı daha değerli kılar.',
                'Kışın bahçede çalışmak çok zordur.',
                'Portakal ağaçları yalnızca Antalya’da yetişir.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafta Melis’in dedesine söylediği söze bak.',
              explanation: 'Aferin! Melis, paylaşınca sevincinin arttığını fark etti.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dede, Melis’ten dalı kırmamasını neden istedi?',
              options: [
                'Ağaç gelecek yıl da meyve versin diye',
                'Sepet çabuk dolmasın diye',
                'Portakallar ekşi olmasın diye',
                'Melis yorulmasın diye',
              ],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafta dedenin sözlerini oku.',
              explanation: 'Doğru! Dal sağlam kalırsa ağaç gelecek yıl da meyve verir.',
            },
            {
              type: QuestionType.SIRALAMA,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dedenin anlattığına göre portakalın oluşum sırası hangisidir?',
              options: [
                'Küçük yeşil meyve, beyaz çiçek, portakal',
                'Portakal, beyaz çiçek, küçük yeşil meyve',
                'Küçük yeşil meyve, portakal, beyaz çiçek',
                'Beyaz çiçek, küçük yeşil meyve, portakal',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü paragrafta dedenin anlatımını baştan sona izle.',
              explanation:
                'Harika! Önce çiçek açar, çiçek yeşil meyveye dönüşür, meyve büyüyüp portakal olur.',
            },
          ],
          glossary: [
            { word: 'mevsimde', meaning: 'Yılın dört bölümünden birinde.' },
            { word: 'sepet', meaning: 'Saz ya da ince dallardan örülmüş, saplı kap.' },
            { word: 'dönüşür', meaning: 'Başka bir şey hâline gelir.' },
          ],
        },
        G4: {
          paragraphs: [
            'Melis’in dedesinin Antalya’da büyük bir portakal bahçesi vardı. Melis kış tatilinde dedesinin yanına gittiğinde hiç beklemediği bir görüntüyle karşılaştı: Kış güneşinin altında ağaçlar, dallarına asılmış yüzlerce küçük fener gibi turuncu portakallarla doluydu. Kışı gri bir mevsim sanan Melis için bu, küçük bir mucizeydi. Ağaçların arasında yürürken havaya karışan tatlı kokuyu içine çekti ve bu bahçede geçireceği günleri sevinçle düşündü.',
            'Dedesi ona küçük bir sepet uzattı. “Portakalı koparırken dalı kırmadan, yavaşça çevir. Bugün kıracağın dal, gelecek yıl meyve veremez,” dedi. Melis, ilk portakalı bir hazineyi yerinden alır gibi dikkatle kopardı. Kabuğunu soyunca havaya yayılan keskin ve mis gibi koku, ellerine sinip saatlerce oradan gitmedi.',
            'Melis, “Dede, bu portakallar nereden çıkıyor?” diye sordu. Dedesi gülümseyerek anlatmaya başladı. “İlkbaharda ağaçlar beyaz çiçek açar. Bu çiçeklere portakal çiçeği denir. Çiçekler zamanla küçük yeşil meyvelere dönüşür. Güneş ve su onları aylarca büyütür.” Melis elindeki meyveye artık başka bir gözle bakıyordu. Manavda gördüğü portakallar ona hep hazırmış gibi gelirdi; oysa her birinin ardında aylarca süren bir sabır vardı.',
            'Öğleden sonra birlikte taze portakal suyu sıktılar. Melis bardağını ağır ağır içti. Daha önce içtiği portakal sularının hiçbiri bu kadar lezzetli gelmemişti. Belki portakal farklı değildi; değişen, onu kendi eliyle toplamış olmasıydı. Emek, tadı da değiştiren gizli bir malzeme gibiydi.',
            'Akşam üstü Melis, sepetteki portakalları komşularına dağıttı. Yaşlı bir komşu, kokuyu içine çekip çocukluğunu anımsadığını söyledi; komşunun küçük torunu ise sevinçle havaya zıpladı. Melis’in içinde, sepet boşaldıkça bir şeyler doluyordu. Eve dönerken “Dede, paylaşınca portakallar daha da tatlı oluyor,” dedi. Dedesi onu kucakladı; bu sözü yıllardır bekliyormuş gibi gülümsedi.',
          ],
          questions: [
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Bu metnin içeriğine göre aşağıdakilerden hangisi başlık olarak da kullanılabilir?',
              options: [
                'Portakal Suyu Nasıl Sıkılır?',
                'Gri Bir Kış Günü',
                'Boşalan Sepet, Dolan Kalp',
                'Komşuların Bahçesi',
              ],
              correctIndex: 2,
              hint: 'İpucu: Metnin vardığı sonucu ve son paragrafı düşün.',
              explanation: 'Aferin! Bu başlık, Melis’in paylaştıkça artan sevincini anlatıyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Melis’in içinde, sepet boşaldıkça bir şeyler doluyordu.” cümlesi neyi anlatıyor?',
              options: [
                'Melis’in çok acıktığını',
                'Paylaştıkça Melis’in sevincinin arttığını',
                'Sepetin yeniden portakalla dolduğunu',
                'Melis’in sepeti taşımaktan yorulduğunu',
              ],
              correctIndex: 1,
              hint: 'İpucu: Komşular portakalları alınca neler oluyor? Melis eve dönerken ne diyor?',
              explanation: 'Çok güzel! Sepet boşaldı ama Melis’in sevinci büyüdü.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Dede “Bugün kıracağın dal, gelecek yıl meyve veremez.” diyor. Bir ağaçta çok sayıda dal kırılırsa buna göre aşağıdakilerden hangisi söylenebilir?',
              options: [
                'Ağaç daha çok çiçek açar.',
                'Portakallar daha tatlı olur.',
                'Portakallar daha erken olgunlaşır.',
                'Gelecek yıl o ağaçtan daha az portakal toplanır.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dedenin kuralını bir dal için değil, birçok dal için düşün.',
              explanation:
                'Harika! Kırılan her dal gelecek yıl meyve veremeyeceği için ürün azalır.',
            },
          ],
          glossary: [
            { word: 'mucizeydi', meaning: 'Çok şaşırtıcı ve harika bir olaydı.' },
            { word: 'keskin', meaning: 'Güçlü ve hemen hissedilen.' },
            { word: 'sinip', meaning: 'İçine işleyip.' },
            { word: 'anımsadığını', meaning: 'Hatırladığını.' },
          ],
        },
      },
    }),
    chest(city, 5, 'Portakal kokulu bir sandık! Kapağını aç, lokumlar güneş gibi parlasın.'),
    story(city, {
      position: 6,
      slug: 'ay-isiginda-yolculuk',
      theme: TextTheme.DOGA,
      title: 'Ay Işığında Yolculuk',
      summary:
        'Can’ın bir yaz gecesi deniz kaplumbağası yavrularının ay ışığında denize ulaşmasını izlediği gece.',
      level,
      paragraphs: [
        'Bir yaz gecesi Can, ablası ve annesiyle Antalya’da bir kumsala gitti. Kumsalda gönüllüler bekliyordu. Bu gece deniz kaplumbağası yavruları yumurtadan çıkacaktı.',
        'Gönüllü Ayşe Hanım çocuklara yaklaştı. “Bir anne kaplumbağa, yumurtalarını yazın bu kumsala bıraktı. Yavrular denizi ay ışığının parıltısından bulur. Fenerler onların yolunu şaşırtır. O yüzden bütün ışıkları kapatalım,” dedi.',
        'Herkes fenerlerini söndürdü. Kumun içinden önce minik bir kafa çıktı, sonra bir tane daha. Az sonra onlarca yavru, küçük yüzgeçleriyle kumda ilerlemeye başladı.',
        'Can nefesini tutup onları izledi. Bir yavru yolunu kaybeder gibi oldu, ama sonra denize döndü ve dalgalara karıştı. Can sevinçle ablasının elini sıktı.',
        'Dönerken Can, Ayşe Hanım’a sordu: “Ben de onlara yardım edebilir miyim?” Ayşe Hanım gülümsedi. “Kumsalı temiz tut, yuvalara dokunma ve geceleri kumsala ışık tutma,” dedi.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Kaplumbağa yavruları denizi neyle bulur?',
          options: ['Ay ışığının parıltısıyla', 'Annelerinin sesiyle', 'Fenerlerin ışığıyla'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta Ayşe Hanım’ın anlattıklarını oku.',
          explanation: 'Doğru! Yavrular denizi ay ışığının parıltısından bulur.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Işıklar kapatılmasaydı ne olabilirdi?',
          options: [
            'Yavrular daha hızlı yürürdü',
            'Yavrular yolunu şaşırabilirdi',
            'Hiçbir şey değişmezdi',
          ],
          correctIndex: 1,
          hint: 'İpucu: Ayşe Hanım fenerlerin yavrulara ne yaptığını söylüyor?',
          explanation:
            'Aferin! Işıklar yavruların yolunu şaşırtıp onları denizden uzaklaştırabilir.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
          prompt: 'Can kaplumbağalara nasıl yardım edebilir?',
          options: [
            'Yavruları eve götürerek',
            'Yuvaları kazıp içine bakarak',
            'Kumsalı temiz tutup yuvalara dokunmayarak',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Ayşe Hanım’ın Can’a söylediklerini oku.',
          explanation:
            'Harika! Doğayı korumak için büyük işler gerekmez; küçük özenler de çok değerlidir.',
        },
      ],
      glossary: [
        { word: 'gönüllüler', meaning: 'Bir işi para almadan, isteyerek yapan kişiler.' },
        { word: 'parıltısından', meaning: 'Hafif hafif parlayan ışığından.' },
        { word: 'yüzgeçleriyle', meaning: 'Suda yüzmeye yarayan yassı kollarıyla.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Bir yaz gecesi Can bir kumsala gitti. Yanında ablası ve annesi vardı. Kumsalda gönüllüler bekliyordu. Bu gece kaplumbağa yavruları yumurtadan çıkacaktı.',
            'Gönüllü Ayşe Hanım yanlarına geldi. “Yavrular denizi ay ışığından bulur. Fenerler yollarını şaşırtır. Işıkları kapatalım,” dedi. Herkes fenerini söndürdü.',
            'Kumdan minik bir kafa çıktı. Sonra bir tane daha çıktı. Az sonra onlarca yavru denize yürüdü. Bir yavru yolunu kaybeder gibi oldu. Sonra denize döndü ve dalgalara karıştı. Can çok sevindi.',
            '“Ben de yardım edebilir miyim?” diye sordu Can. “Kumsalı temiz tut, yuvalara dokunma,” dedi Ayşe Hanım. Can gülümsedi.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Herkes fenerini neden söndürdü?',
              options: [
                'Yavrular yolunu şaşırmasın diye',
                'Fenerin pili bitmesin diye',
                'Uyku vakti geldiği için',
              ],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafta Ayşe Hanım’ın sözlerini oku.',
              explanation: 'Aferin! Fenerlerin ışığı yavruların yolunu şaşırtır.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Yavru denize ulaşınca Can nasıl hissetti?',
              options: ['Korktu', 'Sevindi', 'Üzüldü'],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafın son cümlesine bak.',
              explanation: 'Harika! Can, yavrunun denize kavuşmasına çok sevindi.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Hikâyedeki “gönüllüler” kimlerdir?',
              options: [
                'Kumsaldaki kaplumbağalar',
                'Can’ın sınıf arkadaşları',
                'Bir işi isteyerek yapan kişiler',
              ],
              correctIndex: 2,
              hint: 'İpucu: Ayşe Hanım da onlardan biri. Kumsalda ne yapıyor?',
              explanation: 'Çok güzel! Gönüllüler, bir işi isteyerek yapan kişilerdir.',
            },
          ],
          glossary: [
            { word: 'yavruları', meaning: 'Hayvanların küçük çocukları.' },
            { word: 'söndürdü', meaning: 'Işığını kapattı.' },
            { word: 'yuvalara', meaning: 'Kaplumbağaların yumurtalarını bıraktığı yerlere.' },
          ],
        },
        G3: {
          paragraphs: [
            'Bir yaz gecesi Can, ablası ve annesiyle Antalya’da bir kumsala gitti. Kumsalda gönüllüler bekliyordu. Bu gece deniz kaplumbağası yavruları yumurtadan çıkacaktı. Can daha önce böyle bir şeyi yalnızca belgesellerde görmüştü. O yüzden yürürken kalbi hızlı hızlı çarpıyordu.',
            'Gönüllü Ayşe Hanım çocuklara yaklaştı. “Bir anne kaplumbağa, yumurtalarını yazın bu kumsala bıraktı. Yavrular denizi ay ışığının parıltısından bulur. Fenerler onların yolunu şaşırtır. O yüzden bütün ışıkları kapatalım,” dedi. Can, küçücük bir lambanın bile bu kadar önemli olabileceğini hiç düşünmemişti.',
            'Herkes fenerlerini söndürdü. Karanlıkta yalnızca dalgaların sesi duyuluyordu. Kumun içinden önce minik bir kafa çıktı, sonra bir tane daha. Az sonra onlarca yavru, küçük yüzgeçleriyle kumda ilerlemeye başladı. Yavrular küçüktü ama çok kararlı görünüyordu.',
            'Can nefesini tutup onları izledi. Bir yavru yolunu kaybeder gibi oldu ve biraz geri döndü. Can ona yardım etmek istedi, ama Ayşe Hanım başını iki yana salladı. Yavrunun yolu kendisinin bulması gerekiyordu. Çok geçmeden yavru denize döndü ve dalgalara karıştı. Can sevinçle ablasının elini sıktı.',
            'Dönerken Can, Ayşe Hanım’a sordu: “Ben de onlara yardım edebilir miyim?” Ayşe Hanım gülümsedi. “Kumsalı temiz tut, yuvalara dokunma ve geceleri kumsala ışık tutma,” dedi. Can, doğaya yardım etmenin bazen hiçbir şey yapmadan beklemek olduğunu o gece öğrendi.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Ayşe Hanım, Can’ın yavruya yardım etmesini neden istemedi?',
              options: [
                'Yavru Can’dan korktuğu için',
                'Yavrunun yolu kendisinin bulması gerektiği için',
                'Gece çok soğuk olduğu için',
                'Fenerler kapalı olduğu için',
              ],
              correctIndex: 1,
              hint: 'İpucu: Dördüncü paragrafta Ayşe Hanım’ın başını salladığı yerden sonraki cümleyi oku.',
              explanation: 'Aferin! Yavru, denize giden yolu kendi başına bulmalıydı.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Doğaya yardım etmek bazen ona karışmadan beklemektir.',
                'Deniz kaplumbağaları her gece kumsala çıkar.',
                'Geceleri kumsala gitmek sakıncalıdır.',
                'Belgesel izlemek doğayı görmekten daha iyidir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafın son cümlesinde Can’ın ne öğrendiğini oku.',
              explanation:
                'Çok güzel! Can, doğaya bazen hiçbir şey yapmadan yardım edilebileceğini öğrendi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Yavrular küçüktü ama çok kararlı görünüyordu.” cümlesinden ne anlaşılır?',
              options: [
                'Yavruların hızla büyüdüğü',
                'Yavruların kumda durup dinlendiği',
                'Yavruların birbirini beklediği',
                'Yavruların küçüklüklerine rağmen yollarına devam ettiği',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü paragrafta yavruların kumda ne yaptığını oku.',
              explanation: 'Harika! Yavrular minicik oldukları hâlde kumda ilerlemeyi sürdürdü.',
            },
          ],
          glossary: [
            { word: 'gönüllüler', meaning: 'Bir işi para almadan, isteyerek yapan kişiler.' },
            { word: 'belgesellerde', meaning: 'Doğayı ya da gerçek olayları anlatan filmlerde.' },
            { word: 'parıltısından', meaning: 'Hafif hafif parlayan ışığından.' },
            { word: 'yüzgeçleriyle', meaning: 'Suda yüzmeye yarayan yassı kollarıyla.' },
          ],
        },
        G4: {
          paragraphs: [
            'Bir yaz gecesi Can, ablası ve annesiyle Antalya’da sessiz bir kumsala gitti. Karanlıkta yürürken kıyıda bekleyen gönüllülerin gölgelerini seçebiliyordu. Bu gece yaşanacak olay, belgesellerde izlediği sahnelerden çok daha yakın ve gerçek olacaktı: Yaklaşık iki aydır kumun altında bekleyen yumurtalardan deniz kaplumbağası yavruları çıkacak, denizle ilk kez buluşacaktı.',
            'Gönüllü Ayşe Hanım çocuklara yaklaştı. “Bir anne kaplumbağa, yumurtalarını yazın bu kumsala bıraktı. Yavrular denizi ay ışığının parıltısından bulur. Fenerler onların yolunu şaşırtır. O yüzden bütün ışıkları kapatalım,” dedi. Can elindeki küçük fenere baktı. Zararsız sandığı bu ışık, bir canlının ilk yolculuğunu yarıda bırakabilirdi. Düğmeye basıp feneri söndürürken sorumluluğun bazen bu kadar basit bir davranışla başladığını düşündü.',
            'Bütün ışıklar sönünce gece birden genişledi; geriye yalnızca ayın denizdeki gümüş izi ve dalgaların sesi kaldı. Kumun içinden önce minik bir kafa çıktı, sonra bir tane daha. Az sonra onlarca yavru, küçük yüzgeçleriyle kumda ilerlemeye başladı. Boyları avuç içi kadar bile değildi, ama önlerindeki uçsuz bucaksız denize doğru hiç duraksamadan yürüyorlardı.',
            'Can nefesini tutup onları izledi. Bir yavru yolunu kaybeder gibi oldu ve kumda küçük bir daire çizdi. Can içgüdüyle ona doğru bir adım attı, fakat Ayşe Hanım yavaşça elini kaldırarak onu durdurdu. Yavru, kendi yolunu kendisi bulmalıydı. Birkaç uzun saniyenin ardından başını denize çevirdi ve dalgalara karışıp gözden kayboldu. Can sevinçle ablasının elini sıktı.',
            'Dönerken Can, Ayşe Hanım’a sordu: “Ben de onlara yardım edebilir miyim?” Ayşe Hanım gülümsedi. “Kumsalı temiz tut, yuvalara dokunma ve geceleri kumsala ışık tutma,” dedi. Can bu cevabı önce çok küçük buldu; oysa kumsaldan uzaklaştıkça anladı ki doğaya yardım etmek, çoğu zaman büyük işler yapmak değil, ona yer açmaktı.',
          ],
          questions: [
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Yavrular denizi ay ışığının parıltısından bulur. II. Can, feneri kapatmayı başta reddetti. III. Ayşe Hanım, yavruya dokunulmasını istemedi.',
              options: ['I ve III', 'Yalnız II', 'II ve III', 'I, II ve III'],
              correctIndex: 0,
              hint: 'İpucu: Her yargıyı tek tek ele al; Can’ın fenerle ne yaptığına ikinci paragrafta bak.',
              explanation: 'Aferin! Can feneri hemen söndürdü, bu yüzden II. yargı yanlıştır.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Metnin son cümlesinden hareketle vurgulanan düşünce aşağıdakilerden hangisidir?',
              options: [
                'Kaplumbağalar yalnızca Antalya kıyılarında yaşar.',
                'Doğaya yardım etmek çoğu zaman ona saygı gösterip karışmamaktır.',
                'Çocuklar geceleri kumsala gitmemelidir.',
                'Gönüllü olmak için yetişkin olmak gerekir.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son cümlede “büyük işler yapmak” ile hangi davranış karşılaştırılıyor?',
              explanation: 'Çok güzel! Can, doğaya yer açmanın da bir yardım olduğunu anladı.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Dördüncü paragrafta asıl anlatılan aşağıdakilerden hangisidir?',
              options: [
                'Anne kaplumbağanın yumurtalarını nasıl bıraktığı',
                'Ayşe Hanım’ın fenerleri neden söndürdüğü',
                'Ayın denizde bıraktığı iz',
                'Yolunu şaşıran yavrunun denizi kendi başına bulması',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dördüncü paragrafın ilk ve son cümleleri arasında yavruya neler olduğunu izle.',
              explanation:
                'Harika! Bu paragraf, yolunu şaşıran yavrunun denize ulaşmasını anlatıyor.',
            },
          ],
          glossary: [
            { word: 'parıltısından', meaning: 'Hafif hafif parlayan ışığından.' },
            { word: 'uçsuz bucaksız', meaning: 'Çok geniş, sonu görünmeyen.' },
            { word: 'duraksamadan', meaning: 'Durup beklemeden.' },
            { word: 'içgüdüyle', meaning: 'Düşünmeden, kendiliğinden gelen bir istekle.' },
          ],
        },
      },
    }),
    story(city, {
      position: 7,
      slug: 'deniz-feneri',
      theme: TextTheme.SORUMLULUK,
      title: 'Deniz Feneri Bekçisi',
      summary:
        'Fırtınalı bir gecede elektrikler kesilince fenerin ışığını yeniden yakan Hasan Kaptan’ın hikâyesi.',
      level,
      paragraphs: [
        'Küçük bir adanın ucunda beyaz bir deniz feneri vardı. Feneri yıllardır Hasan Kaptan beklerdi.',
        'Her akşam güneş batarken Hasan Kaptan yüz yirmi basamağı tek tek çıkar, fenerin lambasını yakardı. Lambanın ışığı, karanlıkta yolunu arayan gemilere yol gösterirdi.',
        'Bir kış gecesi fırtına çıktı ve elektrikler kesildi. Uzaktan bir balıkçı teknesinin kornası duyuluyordu.',
        'Hasan Kaptan hiç vakit kaybetmeden eski gaz lambasını hazırladı. Lambayı fenerin tepesine taşıdı ve aynaların önüne yerleştirdi.',
        'Işık yeniden denize yayıldı. Balıkçı teknesi kayalıklara çarpmadan limana sığındı. Ertesi sabah balıkçılar, Hasan Kaptan’a sıcak bir çorba ve kocaman bir teşekkürle geldiler.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Hasan Kaptan her akşam ne yapardı?',
          options: ['Balığa çıkardı', 'Fenerin lambasını yakardı', 'Gemileri boyardı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta güneş batarken ne yaptığı yazıyor.',
          explanation: 'Doğru! Her akşam basamakları çıkıp fenerin lambasını yakardı.',
        },
        {
          type: QuestionType.CUMLEDE_ANLAM,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Hasan Kaptan “hiç vakit kaybetmeden” lambayı hazırladı. Bu ne demek?',
          options: ['Hemen, beklemeden', 'Çok yavaş yavaş', 'Ertesi sabah'],
          correctIndex: 0,
          hint: 'İpucu: Fırtınada yolunu arayan bir tekne vardı. Hasan Kaptan beklemiş olabilir mi?',
          explanation: 'Aferin! Vakit kaybetmeden, hiç beklemeden hemen demektir.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
        { word: 'sığındı', meaning: 'Tehlikeden korunmak için güvenli bir yere girdi.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Küçük bir adada beyaz bir fener vardı. Feneri Hasan Kaptan beklerdi.',
            'Her akşam yüz yirmi basamak çıkardı. Fenerin lambasını yakardı. Işık, gemilere yol gösterirdi.',
            'Bir kış gecesi fırtına çıktı. Elektrikler kesildi. Fener karanlıkta kaldı. Uzaktan bir teknenin kornası duyuldu.',
            'Hasan Kaptan hiç vakit kaybetmedi. Eski gaz lambasını hazırladı. Lambayı fenerin tepesine taşıdı. Işık yeniden denize yayıldı.',
            'Tekne güvenle limana geldi. Ertesi sabah balıkçılar Hasan Kaptan’a geldi. Ona sıcak bir çorba getirdiler. “Teşekkür ederiz!” dediler.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Balıkçılar Hasan Kaptan’a ne getirdi?',
              options: ['Sıcak bir çorba', 'Yeni bir lamba', 'Büyük bir balık'],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafı oku.',
              explanation: 'Doğru! Balıkçılar ona sıcak bir çorba getirdi.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Fener neden karanlıkta kaldı?',
              options: [
                'Hasan Kaptan uyuduğu için',
                'Lamba kırıldığı için',
                'Elektrikler kesildiği için',
              ],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafta o gece ne olduğunu oku.',
              explanation: 'Aferin! Elektrikler kesilince fener karanlıkta kaldı.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Hiç vakit kaybetmedi” ne demek?',
              options: ['Çok geç kaldı', 'Hemen işe başladı', 'Saatine baktı'],
              correctIndex: 1,
              hint: 'İpucu: Dördüncü paragrafta Hasan Kaptan’ın ardından ne yaptığını oku.',
              explanation: 'Harika! Vakit kaybetmemek, beklemeden hemen işe başlamaktır.',
            },
          ],
          glossary: [
            { word: 'basamak', meaning: 'Merdivenin her bir adımı.' },
            { word: 'fırtına', meaning: 'Çok şiddetli rüzgâr.' },
            { word: 'kornası', meaning: 'Uyarmak için güçlü ses çıkaran aleti.' },
          ],
        },
        G3: {
          paragraphs: [
            'Küçük bir adanın ucunda beyaz bir deniz feneri vardı. Feneri yıllardır Hasan Kaptan beklerdi. Eskiden gemilerde çalışan Hasan Kaptan, şimdi karanlıkta yolunu arayan gemilere yardım etmekten büyük mutluluk duyuyordu. Adada başka kimse yaşamıyordu, ama o bundan hiç yakınmazdı.',
            'Her akşam güneş batarken yüz yirmi basamağı tek tek çıkar, fenerin lambasını yakardı. Dizleri ağrıdığı günlerde bile bu işi bir kez olsun aksatmamıştı. Lambanın ışığı, gemilere yol gösterirdi. Onun için bu ışık, sadece bir lamba değil, denizdeki insanlara verilmiş bir sözdü.',
            'Bir kış gecesi fırtına çıktı ve elektrikler kesildi. Fener bir anda karardı. Hasan Kaptan pencereye koştu. Uzaktan bir balıkçı teknesinin kornası duyuluyordu. Tekne kıyıya yaklaşıyordu ama kayalıkları göremiyordu.',
            'Hasan Kaptan hiç vakit kaybetmeden eski gaz lambasını hazırladı. Elektrik kesilirse diye onu yıllardır temiz tutuyordu. Lambayı basamaklardan dikkatle çıkarıp fenerin tepesine taşıdı ve aynaların önüne yerleştirdi. Aynalar, küçük alevin ışığını çoğaltıp uzağa gönderdi.',
            'Işık yeniden denize yayıldı. Balıkçı teknesi yönünü değiştirdi ve kayalıklara çarpmadan limana sığındı. Ertesi sabah fırtına dinmişti. Balıkçılar, Hasan Kaptan’a sıcak bir çorba ve kocaman bir teşekkürle geldiler. Fenerin ışığını hiç unutmayacaklarını söylediler. Hasan Kaptan çorbasını içerken gülümsedi; verdiği sözü yine tutmuştu.',
          ],
          questions: [
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Hasan Kaptan’ın gaz lambasını yıllardır temiz tutması onun hangi özelliğini gösterir?',
              options: [
                'Tedbirli ve sorumlu olduğunu',
                'Eski eşyaları satmak istediğini',
                'Elektrikten hoşlanmadığını',
                'Çok unutkan olduğunu',
              ],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafta lambayı neden temiz tuttuğunu oku.',
              explanation: 'Aferin! Hasan Kaptan olabilecek sorunlara önceden hazırlanmıştı.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Onun için bu ışık, sadece bir lamba değil, denizdeki insanlara verilmiş bir sözdü.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Lambanın üzerinde yazı olduğu',
                'Hasan Kaptan’ın denizcilere mektup yazdığı',
                'Gemilerin ışığa ihtiyaç duymadığı',
                'Hasan Kaptan’ın bu işi bir sorumluluk olarak gördüğü',
              ],
              correctIndex: 3,
              hint: 'İpucu: Aynı paragrafta Hasan Kaptan’ın ağrılı günlerde bile ne yaptığını düşün.',
              explanation:
                'Çok güzel! O, ışığı yakmayı denizdeki insanlara karşı bir görev sayıyordu.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Balıkçı teknesinin kayalıklara çarpmamasını sağlayan asıl etken nedir?',
              options: [
                'Fırtınanın hemen dinmesi',
                'Hasan Kaptan’ın ışığı yeniden yakması',
                'Teknenin kornasının çok güçlü olması',
                'Balıkçıların aynaları kullanması',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafın ilk iki cümlesini birlikte düşün.',
              explanation: 'Harika! Işık yeniden yanınca tekne yönünü değiştirebildi.',
            },
          ],
          glossary: [
            { word: 'aksatmamıştı', meaning: 'Yapmayı hiç ihmal etmemişti.' },
            { word: 'kayalıkları', meaning: 'Denizde ya da kıyıda bulunan sert, taşlık yerleri.' },
            { word: 'sığındı', meaning: 'Tehlikeden korunmak için güvenli bir yere girdi.' },
            { word: 'dinmişti', meaning: 'Bitmişti, durmuştu.' },
          ],
        },
        G4: {
          paragraphs: [
            'Küçük bir adanın ucunda, dalgaların yıllardır dövdüğü kayaların üstünde beyaz bir deniz feneri yükseliyordu. Feneri uzun zamandır Hasan Kaptan beklerdi. Gençliğini gemilerde geçiren Hasan Kaptan, denizin karanlıkta nasıl bir bilinmezliğe dönüştüğünü çok iyi bilirdi; bu yüzden başkalarına sıradan görünen bu işi, hayatının en önemli görevi sayıyordu. Adada ondan başka kimse yaşamıyordu, ama o bu yalnızlıktan hiç yakınmazdı.',
            'Her akşam güneş ufka yaklaşırken yüz yirmi basamağı tek tek çıkar, fenerin lambasını yakardı. Yıllar dizlerini yorsa da o bu basamakları çıkmaktan hiç vazgeçmemişti. Lambanın ışığı, karanlıkta yolunu arayan gemilere yol gösterirdi. Gemilerdeki insanlar onu tanımazdı; Hasan Kaptan da onların adını bilmezdi. Aralarındaki tek bağ, her gece denize uzanan o ince ışıktı.',
            'Bir kış gecesi fırtına çıktı ve elektrikler kesildi. Fenerin ışığı bir anda söndü ve ada, gecenin içinde kayboldu. Rüzgârın uğultusu arasından uzaktaki bir balıkçı teknesinin kornası duyuluyordu. O, bu sesin ne anlama geldiğini yıllar önce gemilerde öğrenmişti. Bu ses, Hasan Kaptan’a bir soru sorar gibiydi: “Neredesin?”',
            'Hasan Kaptan hiç vakit kaybetmeden eski gaz lambasını hazırladı. Elektriğin bir gün kesilebileceğini hesaba kattığı için onu yıllardır temiz ve hazır tutuyordu. Bu hazırlığın bir gün işe yarayacağını hep biliyordu. Lambayı karanlık basamaklardan dikkatle çıkardı, fenerin tepesine taşıdı ve aynaların önüne yerleştirdi. Küçücük alev, aynalarda çoğalarak koskoca bir ışık hâline geldi.',
            'Işık yeniden denize yayıldı ve soru sonunda cevabını buldu. Balıkçı teknesi yönünü düzeltti, kayalıklara çarpmadan limana sığındı. Ertesi sabah deniz, gece hiçbir şey olmamış gibi sakindi. Balıkçılar, Hasan Kaptan’a sıcak bir çorba ve kocaman bir teşekkürle geldiler. Hasan Kaptan onlara yalnızca “Işık yanmalıydı,” dedi; çünkü ona göre sorumluluk, teşekkür beklemek için yapılan bir iş değildi.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde asıl vurgulanmak istenen düşünce aşağıdakilerden hangisidir?',
              options: [
                'Fener bekçiliği kolay bir iştir.',
                'Deniz en çok kışın güzeldir.',
                'Sorumluluk, karşılık beklemeden görevini özenle yapmaktır.',
                'Gaz lambaları elektrikli lambalardan daha güçlüdür.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son cümlede Hasan Kaptan’ın sorumluluk hakkındaki görüşünü oku.',
              explanation: 'Aferin! Hasan Kaptan görevini teşekkür beklemeden yerine getirdi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Aralarındaki tek bağ, her gece denize uzanan o ince ışıktı.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Hasan Kaptan’ın gemilere iple bağlı olduğu',
                'Hasan Kaptan’ın tanımadığı insanlara ışığıyla yardım ettiği',
                'Fenerin ışığının çok zayıf olduğu',
                'Gemilerin feneri göremediği',
              ],
              correctIndex: 1,
              hint: 'İpucu: Bu cümleden hemen önce gemilerdeki insanlarla Hasan Kaptan için ne söyleniyor?',
              explanation:
                'Çok güzel! Birbirlerini tanımasalar da ışık onları birbirine bağlıyordu.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Hasan Kaptan gaz lambasını yıllardır hazır tutmasaydı metne göre aşağıdakilerden hangisi beklenirdi?',
              options: [
                'Fenerin ışığı o gece hemen yeniden yakılamazdı.',
                'Elektrikler hiç kesilmezdi.',
                'Balıkçılar o gece denize çıkmazdı.',
                'Aynalar kendiliğinden parlardı.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Elektrik kesildiğinde ışık neyle yeniden yandı? Dördüncü paragrafı düşün.',
              explanation:
                'Harika! Elektrik kesikken ışığı yeniden yakan şey, hazır tutulan gaz lambasıydı.',
            },
          ],
          glossary: [
            { word: 'bilinmezliğe', meaning: 'Ne olacağının bilinmediği bir duruma.' },
            { word: 'ufka', meaning: 'Göğün yerle birleşir gibi göründüğü uzak çizgiye.' },
            { word: 'uğultusu', meaning: 'Sürekli ve boğuk sesi.' },
            { word: 'hesaba kattığı', meaning: 'Düşünüp göz önünde bulundurduğu.' },
          ],
        },
      },
    }),
    story(city, {
      position: 8,
      slug: 'bir-gunde-kar-ve-deniz',
      theme: TextTheme.KESIF,
      title: 'Bir Günde Kar ve Deniz',
      summary:
        'Arda’nın aynı gün Toros Dağları’nda karda kayıp Akdeniz’de ayaklarını suya soktuğu gün.',
      level,
      paragraphs: [
        'Mart ayında Arda’nın babası ilginç bir öneride bulundu: “Bugün sabah karda kayalım, öğleden sonra deniz kenarına gidelim!” Arda bunun mümkün olduğuna inanmadı.',
        'Sabah erkenden Toros Dağları’na doğru yola çıktılar. Yol kıvrıla kıvrıla yükseldi. Bir saat sonra Saklıkent’e vardılar. Her yer bembeyazdı. Arda kızağıyla karlı yamaçtan kaydı, kardan adam yaptı.',
        'Öğlen dağdan indiler. Aşağı indikçe kar azaldı, yerini yeşil ağaçlara bıraktı. Hava da ısındı. Arda montunu çıkarıp arka koltuğa koydu.',
        'Öğleden sonra Konyaaltı sahilindeydiler. Deniz masmaviydi. Arda ayakkabılarını çıkarıp ayaklarını suya soktu. Su biraz soğuktu ama güneş sıcacıktı.',
        'Arda başını çevirince uzakta, dağların karlı tepelerini gördü. Sabah oradaydı, şimdi deniz kenarındaydı. “Antalya’da bir günde iki mevsim yaşanıyor,” dedi gülerek.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Arda sabah nereye gitti?',
          options: ['Saklıkent’e', 'Konyaaltı sahiline', 'Kaleiçi’ne'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta sabah nereye vardıkları yazıyor.',
          explanation: 'Doğru! Arda sabah karlı Saklıkent’e gitti.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Dağdan inerken kar neden azaldı?',
          options: [
            'Güneş battığı için',
            'Aşağılarda hava daha sıcak olduğu için',
            'Biri bütün karı küreyip kaldırdığı için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta aşağı indikçe havanın nasıl değiştiği yazıyor.',
          explanation: 'Aferin! Aşağılarda hava daha sıcak olduğu için kar erir.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Arda hikâyenin sonunda neden güldü?',
          options: [
            'Ayakları üşüdüğü için',
            'Babası ona şaka yaptığı için',
            'Bir günde hem kar hem deniz gördüğü için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Arda’nın son paragrafta söylediği sözü oku.',
          explanation: 'Harika! Arda aynı gün iki mevsimi birden yaşadığı için çok sevindi.',
        },
      ],
      glossary: [
        { word: 'öneride', meaning: 'Bir şeyin yapılmasını teklif etmekte.' },
        { word: 'kıvrıla kıvrıla', meaning: 'Sağa sola dönerek, eğri büğrü.' },
        {
          word: 'mevsim',
          meaning: 'Yılın dört bölümünden biri: ilkbahar, yaz, sonbahar ya da kış.',
        },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Mart ayıydı. Arda’nın babası bir öneride bulundu: “Sabah karda kayalım, sonra denize gidelim!” Arda buna inanmadı.',
            'Sabah erkenden Toros Dağları’na gittiler. Yol kıvrıla kıvrıla yükseldi. Saklıkent’e vardılar. Her yer bembeyazdı. Arda kızakla kaydı ve kardan adam yaptı.',
            'Öğlen dağdan indiler. Aşağıda kar azaldı. Hava da ısındı. Arda montunu çıkardı.',
            'Öğleden sonra Konyaaltı sahiline geldiler. Deniz masmaviydi. Arda ayaklarını suya soktu. Su biraz soğuktu ama güneş sıcacıktı.',
            'Arda uzakta karlı dağları gördü. “Antalya’da bir günde iki mevsim yaşanıyor!” dedi gülerek.',
          ],
          questions: [
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Her yer bembeyazdı.” Burada “bembeyaz” ne demek?',
              options: ['Çok beyaz', 'Biraz sarı', 'Çok karanlık'],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafta karlı dağı düşün. Kar ne renktir?',
              explanation: 'Aferin! Bembeyaz, çok beyaz demektir.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Arda montunu neden çıkardı?',
              options: ['Çok acıktığı için', 'Kızakla kaydığı için', 'Hava ısındığı için'],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafta montu çıkarmadan önce ne olduğunu oku.',
              explanation: 'Harika! Dağdan inince hava ısındı, Arda da montunu çıkardı.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Arda günün sonunda nasıl hissediyordu?',
              options: ['Üzgündü', 'Neşeliydi', 'Korkmuştu'],
              correctIndex: 1,
              hint: 'İpucu: Son cümlede Arda’nın sözünü nasıl söylediğine bak.',
              explanation: 'Çok güzel! Arda bu güne çok sevindi ve gülerek konuştu.',
            },
          ],
          glossary: [
            { word: 'öneride', meaning: 'Bir şeyin yapılmasını teklif etmekte.' },
            { word: 'kıvrıla kıvrıla', meaning: 'Sağa sola dönerek, eğri büğrü.' },
            {
              word: 'mevsim',
              meaning: 'Yılın dört bölümünden biri: ilkbahar, yaz, sonbahar ya da kış.',
            },
          ],
        },
        G3: {
          paragraphs: [
            'Mart ayında Arda’nın babası ilginç bir öneride bulundu: “Bugün sabah karda kayalım, öğleden sonra deniz kenarına gidelim!” Arda bunun mümkün olduğuna inanmadı. Ona göre kar kışın, deniz ise yazın gidilecek bir yerdi. Yine de meraklandı ve hemen hazırlandı.',
            'Sabah erkenden Toros Dağları’na doğru yola çıktılar. Yol kıvrıla kıvrıla yükseldi. Pencereden bakınca şehir gittikçe küçülüyordu. Bir saat sonra Saklıkent’e vardılar. Her yer bembeyazdı. Arda kızağıyla karlı yamaçtan kaydı, kardan adam yaptı. Burnu ve elleri soğuktan kızarmıştı.',
            'Öğlen dağdan indiler. Aşağı indikçe kar azaldı, yerini yeşil ağaçlara bıraktı. Hava da ısındı. Arda önce beresini, sonra montunu çıkarıp arka koltuğa koydu. Arda şaşkınlıkla pencereden baktı. Babası, aşağı inildikçe havanın ısındığını anlattı.',
            'Öğleden sonra Konyaaltı sahilindeydiler. Deniz masmaviydi. Arda ayakkabılarını çıkarıp ayaklarını suya soktu. Su biraz soğuktu ama güneş sıcacıktı. Sabah karda üşüyen ayakları, şimdi sıcak çakılların üstündeydi. Sahilde yürüyenler ince giysilerle dolaşıyordu.',
            'Arda başını çevirince uzakta, dağların karlı tepelerini gördü. Sabah oradaydı, şimdi deniz kenarındaydı. “Antalya’da bir günde iki mevsim yaşanıyor,” dedi gülerek. Babası, “Bu kadar kısa bir yolda bu kadar farklı şey görmek çok güzel, değil mi?” diye sordu. Arda başını salladı. Artık babasının önerisinin şaka olmadığını biliyordu.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Arda babasının önerisine neden önce inanmadı?',
              options: [
                'Kar ve denizi farklı mevsimlere ait sandığı için',
                'Arabaları bozuk olduğu için',
                'Kızağa binmeyi bilmediği için',
                'Deniz çok uzakta olduğu için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Birinci paragrafın son cümlesini oku.',
              explanation: 'Aferin! Arda karı kışa, denizi yaza ait sanıyordu.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne aşağıdakilerden hangisi başlık olarak da uygun olurdu?',
              options: [
                'Konyaaltı’nda Balık Tutmak',
                'Kardan Adam Yapmanın Yolları',
                'Arka Koltuktaki Mont',
                'İki Mevsimlik Bir Gün',
              ],
              correctIndex: 3,
              hint: 'İpucu: Metnin bütününü düşün: Arda’nın aynı günde yaşadıklarını özetleyen başlığı seç.',
              explanation:
                'Çok güzel! Bu başlık, Arda’nın bir günde yaşadığı kar ve denizi anlatıyor.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Babasının anlattığına göre aşağı inildikçe hava nasıl değişir?',
              options: ['Soğur', 'Isınır', 'Hiç değişmez', 'Kararır'],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafın son cümlesini oku.',
              explanation: 'Doğru! Aşağı inildikçe hava ısınır.',
            },
          ],
          glossary: [
            { word: 'öneride', meaning: 'Bir şeyin yapılmasını teklif etmekte.' },
            { word: 'yamaçtan', meaning: 'Dağın ya da tepenin eğimli yanından.' },
            { word: 'beresini', meaning: 'Başa geçirilen yumuşak şapkasını.' },
            { word: 'çakılların', meaning: 'Küçük, yuvarlak taşların.' },
          ],
        },
        G4: {
          paragraphs: [
            'Mart ayında bir gün Arda’nın babası kahvaltıda ilginç bir öneride bulundu: “Bugün sabah karda kayalım, öğleden sonra deniz kenarına gidelim!” Arda bunu şaka sandı. Kar, onun zihninde kalın montlara ve kış tatillerine aitti; deniz ise yaz günlerine ve sıcak kumlara. İkisini aynı güne sığdırmak, ona mevsimlerin kuralını bozmak gibi geliyordu. Yine de merakına yenik düştü ve hemen hazırlandı.',
            'Çok geçmeden Toros Dağları’na doğru yola çıktılar. Yol, dağın yamacında kıvrıla kıvrıla yükseldi; şehir aşağıda bir oyuncak maketine dönüşürken sanki başka bir ülkeye gidiyorlardı. Bir saat sonra Saklıkent’e vardıklarında her yer bembeyazdı. Arda kızağıyla karlı yamaçtan kaydı, kardan adam yaptı; burnunun ucu soğuktan kızarana kadar oyuna doydu.',
            'Öğlen dağdan inmeye başladılar. Aşağı indikçe manzara, yavaş yavaş açılan bir kitabın sayfaları gibi değişiyordu. Önce kar inceldi, sonra yerini yeşil ağaçlara bıraktı. Arabanın penceresinden giren hava gittikçe ısındı. Arda önce beresini, sonra montunu çıkarıp arka koltuğa koydu. Babası, yükseklik azaldıkça havanın ısındığını, bu yüzden aynı gün içinde bu kadar farklı görüntülerle karşılaşabildiklerini anlattı.',
            'Öğleden sonra Konyaaltı sahilindeydiler. Akdeniz, masmavi ve sakin, önlerinde uzanıyordu. Arda ayakkabılarını çıkarıp ayaklarını suya soktu. Su biraz soğuktu ama güneş sıcacıktı. Birkaç saat önce karda üşüyen ayakları şimdi çakılların üzerinde ısınıyordu. Sahilde yürüyen insanlar ince giysilerle dolaşıyor, bazıları çakılların üzerine oturup denizi izliyordu.',
            'Arda başını çevirince uzakta, dağların karlı tepelerini gördü. Sabah oradaydı, şimdi deniz kenarındaydı ve ikisi aynı manzaranın içinde yan yana duruyordu. “Antalya’da bir günde iki mevsim yaşanıyor,” dedi gülerek. O an, mevsimlerin yalnızca takvimde değil, yeryüzünün şeklinde de yazılı olduğunu anladı. Demek dünyayı anlamak için bazen bir kitap açmak kadar, bir yolculuğa çıkmak da gerekiyordu.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Aşağıdakilerden hangisi bu metnin yardımcı düşüncelerinden biridir?',
              options: [
                'Yükseklik azaldıkça hava ısınır.',
                'Kışın denize girmek zararlıdır.',
                'Karda oynamak kısa sürede sıkıcı olur.',
                'Akdeniz her mevsim aynı renktedir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta babanın anlattıklarını oku.',
              explanation:
                'Aferin! Bu bilgi, Arda’nın neden aynı gün kar ve deniz görebildiğini açıklıyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Aşağı indikçe manzara, yavaş yavaş açılan bir kitabın sayfaları gibi değişiyordu.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Arda’nın arabada kitap okuduğu',
                'Manzaranın hiç değişmediği',
                'Görüntülerin adım adım farklılaştığı',
                'Yolun bir kitapta anlatıldığı',
              ],
              correctIndex: 2,
              hint: 'İpucu: Bu cümleden sonra manzarada sırasıyla nelerin değiştiğini oku.',
              explanation:
                'Çok güzel! Manzara, sayfa çevirir gibi yavaş yavaş başka bir görüntüye dönüştü.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin paragrafları olayları nasıl bir düzenle anlatır?',
              options: [
                'Olaylar sondan başa doğru anlatılır.',
                'Olaylar sabahtan öğleden sonraya doğru zaman sırasıyla anlatılır.',
                'Her paragraf farklı bir kahramanı anlatır.',
                'Bütün paragraflarda aynı yer anlatılır.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Paragrafların başındaki zaman sözlerine bak: kahvaltı, öğlen, öğleden sonra.',
              explanation: 'Harika! Metin, Arda’nın gününü zaman sırasıyla anlatıyor.',
            },
          ],
          glossary: [
            { word: 'zihninde', meaning: 'Aklında, düşüncesinde.' },
            { word: 'maketine', meaning: 'Bir şeyin küçültülmüş örneğine.' },
            { word: 'manzara', meaning: 'Bakınca görülen doğa görüntüsü.' },
            { word: 'yeryüzünün', meaning: 'Dünyanın üzerinin.' },
          ],
        },
      },
    }),
    story(city, {
      position: 9,
      slug: 'piril-ve-ressam',
      theme: TextTheme.MERAK,
      title: 'Pırıl ve Ressam',
      summary:
        'Pırıl’ın Kaleiçi’nde bir ressamın tuvalinde Kapadokya’nın balonlarını görüp yeni durağını seçtiği gün.',
      level,
      paragraphs: [
        'Pırıl, Kaleiçi’nin dar bir sokağında güneşleniyordu. Az ilerde yaşlı bir ressam, şövalesinin önünde resim yapıyordu. Pırıl merakla yanına sokuldu.',
        'Tuvalde, gökyüzünde süzülen rengârenk balonlar vardı. Balonların altında ise külah gibi sivri, tuhaf kayalar yükseliyordu. Pırıl daha önce böyle bir yer görmemişti.',
        'Ressam onu fark edip gülümsedi. “Merhaba güzel kedi. Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisi olmalısın,” dedi. Sonra resmi gösterdi. “Burası Kapadokya. O sivri kayalara peri bacası derler. Sabahları gökyüzü balonlarla dolar.”',
        'Pırıl resme uzun uzun baktı. Balonların arasında uçmayı hayal etti. Kuyruğu heyecanla bir sağa bir sola sallandı.',
        'Ressam fırçasını bıraktı ve Pırıl’ın başını okşadı. “Van’a giderken yolun Kapadokya’dan geçer. Balonlara benden selam söyle,” dedi. Pırıl o gece portakal kokulu sokaklara veda etti ve Kapadokya’ya doğru yola çıktı.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Ressamın resminde neler vardı?',
          options: ['Deniz ve tekneler', 'Balonlar ve sivri kayalar', 'Portakal ağaçları'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta tuvalde ne olduğu yazıyor.',
          explanation: 'Doğru! Resimde rengârenk balonlar ve sivri kayalar vardı.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Ressama göre “peri bacası” nedir?',
          options: ['Kapadokya’daki sivri kayalar', 'Bir çeşit balon', 'Eski bir evin bacası'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta ressamın Kapadokya hakkında söylediklerini oku.',
          explanation: 'Aferin! Peri bacaları, Kapadokya’daki külah biçimli sivri kayalardır.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Resme bakarken Pırıl’ın kuyruğu neden sallanıyordu?',
          options: ['Çok kızdığı için', 'Üşüdüğü için', 'Heyecanlandığı için'],
          correctIndex: 2,
          hint: 'İpucu: Dördüncü paragrafta kuyruğunun nasıl sallandığı yazıyor.',
          explanation: 'Harika! Pırıl balonların arasında uçmayı hayal edip heyecanlandı.',
        },
      ],
      glossary: [
        { word: 'şövalesinin', meaning: 'Resim yaparken tuvali tutan ayaklı sehpanın.' },
        { word: 'Tuvalde', meaning: 'Üstüne resim yapılan, gerilmiş bezde.' },
        {
          word: 'peri bacası',
          meaning: 'Kapadokya’da rüzgârın ve yağmurun yonttuğu, külah biçimli kaya.',
        },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Pırıl, Kaleiçi’nde güneşleniyordu. Pırıl bir kediydi. Az ileride yaşlı bir ressam resim yapıyordu. Pırıl merakla yanına gitti.',
            'Resimde rengârenk balonlar vardı. Altında sivri kayalar yükseliyordu. Pırıl böyle bir yer görmemişti.',
            'Ressam gülümsedi. “Merhaba güzel kedi. Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisisin,” dedi. Sonra resmi gösterdi. “Burası Kapadokya. Bu kayalara peri bacası derler.”',
            'Pırıl balonlarla uçmayı hayal etti. Kuyruğu heyecanla sallandı.',
            '“Van’a giderken yolun oradan geçer,” dedi ressam. Pırıl o gece sokaklara veda etti. Kapadokya’ya doğru yola çıktı.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Resimde neler vardı?',
              options: ['Balonlar ve sivri kayalar', 'Deniz ve tekneler', 'Portakal ağaçları'],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafı oku.',
              explanation: 'Doğru! Resimde rengârenk balonlar ve sivri kayalar vardı.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Pırıl’ın kuyruğu neden sallandı?',
              options: ['Çok acıktığı için', 'Heyecanlandığı için', 'Üşüdüğü için'],
              correctIndex: 1,
              hint: 'İpucu: Dördüncü paragrafı oku.',
              explanation: 'Harika! Pırıl balonlarla uçmayı hayal edip heyecanlandı.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Pırıl sokaklara veda etti.” Burada “veda etti” ne demek?',
              options: ['Yeniden geldi', 'Uzun uzun uyudu', 'Hoşça kal deyip ayrıldı'],
              correctIndex: 2,
              hint: 'İpucu: Sonraki cümlede Pırıl’ın nereye gittiğine bak.',
              explanation: 'Aferin! Veda etmek, hoşça kal deyip ayrılmaktır.',
            },
          ],
          glossary: [
            { word: 'ressam', meaning: 'Resim yapan kişi.' },
            { word: 'kehribar', meaning: 'Sarı-turuncu renkli, parlak bir süs taşı.' },
            {
              word: 'peri bacası',
              meaning: 'Kapadokya’da rüzgârın ve yağmurun yonttuğu, külah biçimli kaya.',
            },
          ],
        },
        G3: {
          paragraphs: [
            'Pırıl, Kaleiçi’nin dar bir sokağında güneşleniyordu. Portakal kokulu bu sokakları çok sevmişti ama Van’a dönmek için hangi yöne gideceğini henüz bilmiyordu. Az ilerde yaşlı bir ressam, şövalesinin önünde resim yapıyordu. Pırıl merakla yanına sokuldu.',
            'Tuvalde, gökyüzünde süzülen rengârenk balonlar vardı. Balonların altında ise külah gibi sivri, tuhaf kayalar yükseliyordu. Pırıl daha önce böyle bir yer görmediği için bunun gerçek mi yoksa ressamın hayali mi olduğunu merak etti.',
            'Ressam onu fark edip gülümsedi. “Merhaba güzel kedi. Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisi olmalısın,” dedi. Sonra resmi gösterdi. “Burası Kapadokya. O sivri kayalara peri bacası derler. Rüzgâr ve yağmur onları çok uzun zamanda yontmuş. Sabahları gökyüzü balonlarla dolar.”',
            'Pırıl resme uzun uzun baktı ve balonların arasında uçmayı hayal etti. Kuyruğu heyecanla bir sağa bir sola sallandı; demek dünya, gördüğü sokaklardan çok daha büyüktü. Ressamın anlattıklarını aklında tutmaya çalışırken içinde yeni bir yolculuk isteği büyüdü.',
            'Ressam fırçasını bıraktı ve Pırıl’ın başını okşadı. “Van’a giderken yolun Kapadokya’dan geçer. Balonlara benden selam söyle,” dedi. Pırıl bu sözle yeni durağını bulmuştu ve o gece portakal kokulu sokaklara son kez baktı, onlara veda etti ve Kapadokya’ya doğru yola çıktı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Ressam, Pırıl’ın Van kedisi olduğunu neyden anladı?',
              options: [
                'Gözlerinin renginden',
                'Kuyruğunun uzunluğundan',
                'Pırıl’ın miyavlamasından',
                'Boynundaki tasmadan',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta ressamın Pırıl’a ilk söylediklerini oku.',
              explanation:
                'Aferin! Ressam, Pırıl’ın bir gözünün mavi, bir gözünün kehribar olduğunu gördü.',
            },
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Aşağıdakilerden hangisi bu metinden çıkarılabilir?',
              options: [
                'Ressamlar yalnızca Kaleiçi’ni çizer.',
                'Kediler resim yapmayı öğrenebilir.',
                'Bir resim, görülmemiş bir yeri merak ettirebilir.',
                'Balonlar yalnızca Antalya’da uçar.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Pırıl resme baktıktan sonra neler hissediyor, neye karar veriyor?',
              explanation: 'Harika! Resmi gören Pırıl, Kapadokya’yı çok merak etti.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Pırıl merakla yanına sokuldu.” cümlesindeki “sokuldu” sözcüğü ne anlama gelir?',
              options: ['Kaçtı', 'Yaklaştı', 'Uyudu', 'Bağırdı'],
              correctIndex: 1,
              hint: 'İpucu: Pırıl merak ettiği için ressama ne yapmış olabilir?',
              explanation: 'Çok güzel! Sokulmak, bir şeye yaklaşmak demektir.',
            },
          ],
          glossary: [
            { word: 'şövalesinin', meaning: 'Resim yaparken tuvali tutan ayaklı sehpanın.' },
            { word: 'Tuvalde', meaning: 'Üstüne resim yapılan, gerilmiş bezde.' },
            {
              word: 'peri bacası',
              meaning: 'Kapadokya’da rüzgârın ve yağmurun yonttuğu, külah biçimli kaya.',
            },
            { word: 'yontmuş', meaning: 'Yavaş yavaş aşındırıp şekil vermiş.' },
          ],
        },
        G4: {
          paragraphs: [
            'Pırıl, Kaleiçi’nin dar sokaklarından birinde, taşların ısıttığı bir eşikte güneşleniyordu. Birkaç gündür Kaleiçi’nin kedileriyle dost olmuş, balıkçıların verdiği lezzetli balıkları yemiş, portakal bahçelerinin kokusunu içine çekmişti. Portakal kokulu bu şehir ona çok şey vermişti; ama eve, Van’a dönen yol henüz bitmemişti ve bir sonraki durağın neresi olacağını bilmiyordu. Az ilerde yaşlı bir ressam, şövalesinin önünde sabırla fırçasını gezdiriyordu. Merakını yenemeyen Pırıl, usulca yanına sokuldu.',
            'Tuvalde, gökyüzünde süzülen rengârenk balonlar, onların altında ise külah gibi sivri, tuhaf kayalar vardı; sabah güneşi kayaları pembeye boyuyordu. Pırıl, yolculuğu boyunca nice sokak ve nice kıyı görmüştü, fakat böyle bir yere hiç rastlamamıştı. Resim, ona bir pencere gibi göründü: Arkasında henüz bilmediği bir dünya vardı.',
            'Ressam onu fark edip gülümsedi. “Merhaba güzel kedi. Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisi olmalısın,” dedi. Sonra resmi gösterdi. “Burası Kapadokya. O sivri kayalara peri bacası derler. Rüzgâr ve yağmur onları çok uzun zamanda yontmuş; yani onların da ressamı doğadır. Sabahları gökyüzü balonlarla dolar.”',
            'Pırıl resme uzun uzun baktı ve balonların arasında uçtuğunu, aşağıda sivri kayaların minicik göründüğünü hayal etti. Kuyruğu heyecanla bir sağa bir sola sallandı. Evine duyduğu özlem hâlâ yüreğindeydi, ancak şimdi yanına başka bir duygu daha eklenmişti: görmediği yerleri görme isteği. Yolculuğun, yalnızca eve varmak için değil, yol boyunca öğrenmek için de yapıldığını seziyordu.',
            'Ressam fırçasını bıraktı ve Pırıl’ın başını okşadı. “Van’a giderken yolun Kapadokya’dan geçer. Balonlara benden selam söyle,” dedi. Bu basit cümle, Pırıl’ın aradığı pusula oldu. Resimde gördüğü balonlar artık yalnızca bir tablonun parçası değil, yolculuğunun bir sonraki işaretiydi. O gece portakal kokulu sokaklara son kez baktı, denizin tuzlu kokusunu içine çekip şehre veda etti ve Kapadokya’ya doğru yola çıktı.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Kediler kalabalık şehirlerde yaşayamaz.',
                'Resim yapmayı öğrenmek uzun yıllar alır.',
                'Balona binmek herkes için kolaydır.',
                'Yolculuk, yalnızca varılan yer için değil, yolda öğrenilenler için de değerlidir.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dördüncü paragrafın son cümlesini düşün.',
              explanation:
                'Aferin! Pırıl, yolculuğun yol boyunca öğrenmek için de yapıldığını sezdi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Bu basit cümle, Pırıl’ın aradığı pusula oldu.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Ressamın sözü Pırıl’a nereye gideceğini gösterdi.',
                'Ressam Pırıl’a bir pusula hediye etti.',
                'Pırıl bu cümleyi anlayamadı.',
                'Pırıl pusulasını Kaleiçi’nde kaybetti.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Birinci paragrafta Pırıl’ın neyi bilmediğini hatırla.',
              explanation: 'Çok güzel! Pırıl, ressamın sözüyle bir sonraki durağını öğrendi.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Pırıl, Kapadokya’yı daha önce görmüştü. II. Ressam, Pırıl’ın Van kedisi olduğunu gözlerinden anladı. III. Pırıl’ın evine duyduğu özlem sürüyordu.',
              options: ['Yalnız I', 'I ve II', 'II ve III', 'I, II ve III'],
              correctIndex: 2,
              hint: 'İpucu: Her yargıyı tek tek ele al; Pırıl’ın resimdeki yeri tanıyıp tanımadığına ikinci paragrafta bak.',
              explanation:
                'Harika! Pırıl böyle bir yere hiç rastlamamıştı, bu yüzden I. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'şövalesinin', meaning: 'Resim yaparken tuvali tutan ayaklı sehpanın.' },
            { word: 'usulca', meaning: 'Yavaşça ve sessizce.' },
            {
              word: 'peri bacası',
              meaning: 'Kapadokya’da rüzgârın ve yağmurun yonttuğu, külah biçimli kaya.',
            },
            { word: 'pusula', meaning: 'Yön gösteren alet; burada yol gösteren şey.' },
          ],
        },
      },
    }),
    chest(city, 10, 'Antalya’nın son sandığı sahilde seni bekliyor; aç ve balonlar diyarına uç!'),
  ],
};
