import { City, ReadingLevel, TextTheme } from '../../src/generated/prisma/enums.js';
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
          prompt: 'Kaan ipucu avının sonunda ne buldu?',
          options: ['En sevdiği kitabı', 'Oyuncak bir tekneyi', 'Eski bir haritayı'],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta kutunun içinden ne çıktığını oku.',
          explanation: 'Doğru! Kutunun içinden Kaan’ın en sevdiği kitap çıktı.',
        },
        {
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
          prompt: 'Kaptan Rıza Ela’ya ne öğretti?',
          options: ['Yüzmeyi', 'Denizci düğümü atmayı', 'Balık tutmayı'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta kaptanın Ela’ya gösterdiği şeyi oku.',
          explanation: 'Doğru! Kaptan Ela’ya denizci düğümü atmayı öğretti.',
        },
        {
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
          prompt: 'Aşağı Düden Şelalesi nereye dökülüyordu?',
          options: ['Bir göle', 'Denize', 'Bir nehre'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafın ikinci cümlesine bak.',
          explanation: 'Doğru! Aşağı Düden Şelalesi yüksek kayalıklardan denize dökülür.',
        },
        {
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
          prompt: 'İlkbaharda portakal ağaçları ne açar?',
          options: ['Pembe yapraklar', 'Beyaz çiçekler', 'Sarı tohumlar'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta dedesinin anlattıklarını oku.',
          explanation: 'Doğru! İlkbaharda portakal ağaçları beyaz çiçek açar.',
        },
        {
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
          prompt: 'Kaplumbağa yavruları denizi neyle bulur?',
          options: ['Ay ışığının parıltısıyla', 'Annelerinin sesiyle', 'Fenerlerin ışığıyla'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta Ayşe Hanım’ın anlattıklarını oku.',
          explanation: 'Doğru! Yavrular denizi ay ışığının parıltısından bulur.',
        },
        {
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
          prompt: 'Hasan Kaptan her akşam ne yapardı?',
          options: ['Balığa çıkardı', 'Fenerin lambasını yakardı', 'Gemileri boyardı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta güneş batarken ne yaptığı yazıyor.',
          explanation: 'Doğru! Her akşam basamakları çıkıp fenerin lambasını yakardı.',
        },
        {
          prompt: 'Hasan Kaptan “hiç vakit kaybetmeden” lambayı hazırladı. Bu ne demek?',
          options: ['Hemen, beklemeden', 'Çok yavaş yavaş', 'Ertesi sabah'],
          correctIndex: 0,
          hint: 'İpucu: Fırtınada yolunu arayan bir tekne vardı. Hasan Kaptan beklemiş olabilir mi?',
          explanation: 'Aferin! Vakit kaybetmeden, hiç beklemeden hemen demektir.',
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
        { word: 'sığındı', meaning: 'Tehlikeden korunmak için güvenli bir yere girdi.' },
      ],
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
          prompt: 'Arda sabah nereye gitti?',
          options: ['Saklıkent’e', 'Konyaaltı sahiline', 'Kaleiçi’ne'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta sabah nereye vardıkları yazıyor.',
          explanation: 'Doğru! Arda sabah karlı Saklıkent’e gitti.',
        },
        {
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
          prompt: 'Ressamın resminde neler vardı?',
          options: ['Deniz ve tekneler', 'Balonlar ve sivri kayalar', 'Portakal ağaçları'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta tuvalde ne olduğu yazıyor.',
          explanation: 'Doğru! Resimde rengârenk balonlar ve sivri kayalar vardı.',
        },
        {
          prompt: 'Ressama göre “peri bacası” nedir?',
          options: ['Kapadokya’daki sivri kayalar', 'Bir çeşit balon', 'Eski bir evin bacası'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta ressamın Kapadokya hakkında söylediklerini oku.',
          explanation: 'Aferin! Peri bacaları, Kapadokya’daki külah biçimli sivri kayalardır.',
        },
        {
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
    }),
    chest(city, 10, 'Antalya’nın son sandığı sahilde seni bekliyor; aç ve balonlar diyarına uç!'),
  ],
};
