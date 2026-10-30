import { City, ReadingLevel, TextTheme } from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.IZMIR;
const level = ReadingLevel.BASLANGIC;

/** 2. durak — "Kordon'un Rüzgârı" (2.-4. sınıf) */
export const izmir: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'saat-kulesinin-guvercinleri',
      theme: TextTheme.MERAK,
      title: 'Saat Kulesi’nin Güvercinleri',
      summary:
        'Can’ın Konak’taki Saat Kulesi’nin önünde güvercinleri beslerken saati okumayı öğrendiği gün.',
      level,
      paragraphs: [
        'Can ile dedesi Konak Meydanı’na geldiler. Meydanın ortasında beyaz taştan, süslü bir saat kulesi vardı. Kulenin dört yüzünde de birer saat duruyordu.',
        'Kulenin çevresinde yüzlerce güvercin dolaşıyordu. Dedesi Can’a bir avuç yem verdi. Can yemleri yere serpince güvercinler pır pır uçarak etrafını sardı.',
        'Can başını kaldırıp saate baktı. “Dede, saat kaç?” diye sordu. Dedesi, “Sen söyle bakalım,” dedi. “Uzun kol on ikide, kısa kol üçte.”',
        'Can biraz düşündü. Sonra sevinçle bağırdı: “Saat üç!” Tam o anda uzaktan bir vapur düdüğü duyuldu. Güvercinler hep birlikte havalandı.',
        'Can o gün saati okumayı öğrenmişti. Eve dönerken dedesine, “Artık saati hep ben söyleyeceğim,” dedi. Dedesi onun saçlarını okşadı.',
      ],
      questions: [
        {
          prompt: 'Saat Kulesi’nin çevresinde neler dolaşıyordu?',
          options: ['Martılar', 'Güvercinler', 'Kediler'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Kulenin çevresinde yüzlerce güvercin vardı.',
        },
        {
          prompt: 'Uzun kol on ikide, kısa kol üçteyse saat kaçtır?',
          options: ['Saat üç', 'Saat on iki', 'Saat dokuz'],
          correctIndex: 0,
          hint: 'İpucu: Kısa kol saati gösterir. Can dördüncü paragrafta ne diye bağırdı?',
          explanation: 'Aferin! Uzun kol on ikideyken kısa kol üçü gösteriyorsa saat üçtür.',
        },
        {
          prompt: 'Can saati doğru okuyunca nasıl hissetti?',
          options: ['Üzüldü', 'Korktu', 'Sevindi'],
          correctIndex: 2,
          hint: 'İpucu: Can “Saat üç!” derken nasıl bağırdı?',
          explanation: 'Harika! Can yeni bir şey öğrendiği için çok sevindi.',
        },
      ],
      glossary: [
        { word: 'Meydanın', meaning: 'Şehirde insanların toplandığı geniş, açık alanın.' },
        { word: 'serpince', meaning: 'Küçük parçaları etrafa dağıtarak atınca.' },
        { word: 'havalandı', meaning: 'Yerden kalkıp uçmaya başladı.' },
      ],
    }),
    story(city, {
      position: 2,
      slug: 'boyoz-sabahi',
      theme: TextTheme.KESIF,
      title: 'Boyoz Sabahı',
      summary: 'Defne’nin halasıyla İzmir’in meşhur boyozunu ilk kez tattığı lezzetli bir sabah.',
      level,
      paragraphs: [
        'Defne yaz tatilinde İzmir’deki halasına gitmişti. İlk sabah halası onu erkenden uyandırdı. “Hadi, sana İzmir’in en meşhur kahvaltısını tattıracağım,” dedi.',
        'Birlikte köşedeki fırına yürüdüler. Fırından mis gibi bir koku geliyordu. Tezgâhta yuvarlak, altın sarısı hamurlar diziliydi. Fırıncı amca onlara güler yüzle selam verdi.',
        '“Bunlara boyoz denir,” dedi halası. “İzmir’de boyozu haşlanmış yumurta ve çayla yeriz.” Defne bir ısırık aldı. Boyoz kat kat ve çıtır çıtırdı.',
        '“Hala, bu çok lezzetli!” dedi Defne. Halası güldü. “İzmirliler sabahları boyozsuz yapamaz,” dedi. Defne hemen bir boyoz daha istedi.',
        'Defne tatil boyunca her sabah boyoz yedi. Eve dönerken arkadaşı Ayşe için de bir paket aldı. Ayşe’ye İzmir’in tadını göstermek istiyordu.',
      ],
      questions: [
        {
          prompt: 'İzmir’de boyoz neyle yenir?',
          options: ['Bal ve tereyağıyla', 'Haşlanmış yumurta ve çayla', 'Peynir ve zeytinle'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta halasının söylediklerini oku.',
          explanation: 'Doğru! İzmir’de boyoz haşlanmış yumurta ve çayla yenir.',
        },
        {
          prompt: '“Meşhur” kelimesi ne demektir?',
          options: ['Ünlü, herkesin bildiği', 'Çok pahalı', 'Yeni yapılmış'],
          correctIndex: 0,
          hint: 'İpucu: Halası “İzmir’in en meşhur kahvaltısı” diyor. Herkesin bildiği bir şey olabilir mi?',
          explanation: 'Aferin! Meşhur, çok kişinin bildiği, ünlü demektir.',
        },
        {
          prompt: 'Defne arkadaşı Ayşe için neden boyoz aldı?',
          options: [
            'Boyozları sevmediği için',
            'Halası öyle istediği için',
            'Sevdiği bir tadı arkadaşıyla paylaşmak istediği için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafın son cümlesine bak.',
          explanation: 'Harika! Defne sevdiği bir şeyi arkadaşıyla paylaşmak istedi.',
        },
      ],
      glossary: [
        { word: 'meşhur', meaning: 'Herkesin bildiği, ünlü.' },
        { word: 'Tezgâhta', meaning: 'Dükkânda yiyeceklerin dizildiği uzun masada.' },
        { word: 'haşlanmış', meaning: 'Kaynar suda pişirilmiş.' },
      ],
    }),
    story(city, {
      position: 3,
      slug: 'kordonda-bisiklet',
      theme: TextTheme.CESARET,
      title: 'Kordon’da Bisiklet',
      summary: 'Elif’in Kordon’da düşe kalka, yan tekerleksiz bisiklet sürmeyi öğrendiği gün.',
      level,
      paragraphs: [
        'Elif’in yeni bisikletinin yan tekerlekleri yoktu. Babası, “Bugün Kordon’a gidip birlikte deneyelim,” dedi.',
        'Kordon, deniz kenarında uzanan geniş bir yoldu. Bisiklet yolunda çocuklar pedal çeviriyor, denizden serin bir rüzgâr esiyordu. Martılar da denizin üstünde süzülüyordu.',
        'Babası bisikletin arkasını tuttu. Elif pedallara bastı ama birkaç metre sonra dengesini kaybetti ve yere düştü. Dizi biraz sızladı. Gözleri doldu.',
        'Babası yanına çömeldi. “Herkes önce düşer. Önemli olan yeniden denemek,” dedi. Elif derin bir nefes aldı ve bisiklete yeniden bindi.',
        'Bu sefer gözünü ileriye dikti ve durmadan pedal çevirdi. Bir süre sonra arkasına baktığında babasının çoktan bıraktığını gördü. Elif tek başına gidiyordu! “Başardım!” diye bağırdı.',
      ],
      questions: [
        {
          prompt: 'Elif bisiklet sürmeyi nerede denedi?',
          options: ['Okulun bahçesinde', 'Kordon’da', 'Parkta'],
          correctIndex: 1,
          hint: 'İpucu: Babasının birinci paragrafta söylediği söze bak.',
          explanation: 'Doğru! Elif bisiklet sürmeyi Kordon’da denedi.',
        },
        {
          prompt: 'Elif ilk denemede neden yere düştü?',
          options: [
            'Dengesini kaybettiği için',
            'Bisikletin tekerleği patladığı için',
            'Biri ona çarptığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta Elif’e ne olduğunu oku.',
          explanation: 'Aferin! Elif dengesini kaybedince yere düştü.',
        },
        {
          prompt: 'Babası Elif’e ne öğretti?',
          options: [
            'Bisikletin tehlikeli olduğunu',
            'Düşünce hemen eve dönmeyi',
            'Düştükten sonra yeniden denemeyi',
          ],
          correctIndex: 2,
          hint: 'İpucu: Babasının dördüncü paragrafta söylediği sözü oku.',
          explanation: 'Harika! Düşmek öğrenmenin bir parçasıdır; önemli olan yeniden denemektir.',
        },
      ],
      glossary: [
        { word: 'dengesini', meaning: 'Düşmeden durabilmesini, devrilmeden gidebilmesini.' },
        { word: 'sızladı', meaning: 'Hafif hafif acıdı.' },
        { word: 'çömeldi', meaning: 'Dizlerini bükerek yere yakın oturdu.' },
      ],
    }),
    story(city, {
      position: 4,
      slug: 'kemeraltinin-kokulari',
      theme: TextTheme.KESIF,
      title: 'Kemeraltı’nın Kokuları',
      summary:
        'Ali’nin Kemeraltı’ndaki baharatçıda gözleri kapalı bir koku tahmin oyunu oynadığı gün.',
      level,
      paragraphs: [
        'Ali ile annesi Kemeraltı Çarşısı’na gitti. Çarşının dar sokakları insanlarla doluydu. Her köşede başka bir dükkân vardı. Kimi dükkânda kumaş, kimisinde oyuncak satılıyordu.',
        'Annesi, babaannesinin yemek tarifi için baharat alacaktı. Baharatçının önüne gelince Ali’nin burnuna harika kokular geldi.',
        'Baharatçı amca gülümsedi. “Bir oyun oynayalım mı? Gözlerini kapat, kokladığın şeyi tahmin et,” dedi. Ali gözlerini sımsıkı kapattı.',
        'İlk kavanozu kokladı. “Bu nane!” dedi. İkinci kavanoz tatlı ve sıcak kokuyordu. “Tarçın!” diye bağırdı. Üçüncüsünü bilemedi. Amca, “Bu kekik. Dağlarda yetişir,” dedi.',
        'Ali oyunu çok sevdi. Eve dönerken annesine, “Burnum bugün çok çalıştı,” dedi. Annesi kahkahalarla güldü. Akşam babaannesi de en sevdiği yemeği yaptı.',
      ],
      questions: [
        {
          prompt: 'Ali hangi kokuyu bilemedi?',
          options: ['Kekik', 'Nane', 'Tarçın'],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta üçüncü kavanozda ne olduğunu oku.',
          explanation: 'Doğru! Ali üçüncü kavanozdaki kekiği bilemedi.',
        },
        {
          prompt: 'Baharatçı amca “Kokladığın şeyi tahmin et” dedi. “Tahmin et” ne demektir?',
          options: [
            'Hemen oradan uzaklaş',
            'Ne olduğunu düşünüp bir cevap söyle',
            'Kavanozu açıp tat',
          ],
          correctIndex: 1,
          hint: 'İpucu: Ali gözleri kapalıyken kokuların ne olduğunu bulmaya çalışıyordu.',
          explanation: 'Aferin! Tahmin etmek, emin olmadan düşünüp bir cevap söylemektir.',
        },
        {
          prompt: 'Ali koku oyunu için ne hissetti?',
          options: ['Çok sıkıldı', 'Oyunu çok sevdi', 'Korktu'],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafın ilk cümlesine bak.',
          explanation: 'Harika! Ali bu koku oyununu çok sevdi.',
        },
      ],
      glossary: [
        {
          word: 'baharat',
          meaning: 'Yemeklere tat ve koku vermek için kullanılan kurutulmuş bitkiler.',
        },
        { word: 'tarifi', meaning: 'Bir yemeğin nasıl yapılacağını anlatan bilgi.' },
        { word: 'tahmin', meaning: 'Emin olmadan düşünülüp söylenen cevap.' },
      ],
    }),
    chest(city, 5, 'Kordon’da bir hazine sandığı buldun; kapağını kaldır, lokumlar dökülsün!'),
    story(city, {
      position: 6,
      slug: 'ucurtma-ve-imbat',
      theme: TextTheme.SABIR,
      title: 'Uçurtma ve İmbat',
      summary:
        'Mert ile Nehir’in uçurtmalarını uçurmak için Kordon’da serin imbat rüzgârını beklediği gün.',
      level,
      paragraphs: [
        'Sıcak bir yaz günüydü. Mert ile kardeşi Nehir, yeni uçurtmalarını uçurmak için Kordon’a gelmişlerdi. Ama hiç rüzgâr yoktu.',
        'Mert uçurtmayı havaya attı. Uçurtma bir an yükseldi, sonra yere düştü. Nehir üzüldü. “Hiç uçmayacak mı?” diye sordu.',
        'Yanlarındaki bankta oturan yaşlı bir teyze gülümsedi. “Biraz bekleyin. Öğleden sonra imbat eser. İmbat, denizden gelen serin bir rüzgârdır. İzmir’i yazın o serinletir,” dedi.',
        'Çocuklar sabırla beklediler. Bir süre sonra denizden hafif bir esinti geldi. Ağaçların yaprakları kıpırdadı. Mert uçurtmayı yeniden havaya bıraktı.',
        'Bu sefer uçurtma rüzgârı yakaladı ve gökyüzüne doğru yükseldi. Nehir sevinçle zıpladı. İkisi birlikte teyzeye el salladılar. “Teşekkürler, imbat!” diye bağırdılar.',
      ],
      questions: [
        {
          prompt: 'Teyzeye göre imbat ne zaman eser?',
          options: ['Sabah erkenden', 'Gece yarısı', 'Öğleden sonra'],
          correctIndex: 2,
          hint: 'İpucu: Üçüncü paragrafta teyzenin söylediklerini oku.',
          explanation: 'Doğru! İmbat öğleden sonra denizden eser.',
        },
        {
          prompt: 'Uçurtma ilk seferde neden uçmadı?',
          options: ['Hiç rüzgâr olmadığı için', 'İpi koptuğu için', 'Uçurtma yırtık olduğu için'],
          correctIndex: 0,
          hint: 'İpucu: Birinci paragrafın son cümlesine bak.',
          explanation: 'Aferin! Rüzgâr olmayınca uçurtma havada kalamaz.',
        },
        {
          prompt: 'Çocuklar uçurtmayı uçurabilmek için ne yaptılar?',
          options: ['Eve gidip uyudular', 'Sabırla beklediler', 'Uçurtmayı çöpe attılar'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafın ilk cümlesi çocukların ne yaptığını anlatıyor.',
          explanation: 'Harika! Sabırla beklediler ve imbat gelince uçurtmaları uçtu.',
        },
      ],
      glossary: [
        {
          word: 'imbat',
          meaning: 'İzmir’de yazın öğleden sonra denizden esen serin rüzgâr.',
        },
        { word: 'sabırla', meaning: 'Acele etmeden, kızmadan.' },
        { word: 'esinti', meaning: 'Hafif, yumuşak bir rüzgâr.' },
      ],
    }),
    story(city, {
      position: 7,
      slug: 'tramvayda-bir-yer',
      theme: TextTheme.IYILIK,
      title: 'Tramvayda Bir Yer',
      summary:
        'Ece’nin İzmir tramvayında yaşlı bir amcaya yer verip iyiliğin sevincini tattığı yolculuk.',
      level,
      paragraphs: [
        'Ece ile annesi Karşıyaka’da tramvaya bindiler. Tramvay raylar üzerinde sessizce kayıyordu. Ece cam kenarındaki boş bir koltuğa oturdu.',
        'Bir sonraki durakta tramvaya elinde bastonuyla yaşlı bir amca bindi. Bütün koltuklar doluydu. Amca bir eliyle direğe tutundu. Tramvay sallandıkça zorlanıyordu.',
        'Ece amcaya baktı, sonra annesine baktı. Annesi hiçbir şey söylemedi, sadece gülümsedi. Ece hemen ayağa kalktı. “Buyurun amca, oturun,” dedi.',
        'Amca teşekkür ederek oturdu. “Ne kibar bir kızsın,” dedi. Sonra Ece’ye, torununun da onun yaşında olduğunu anlattı.',
        'Ece yolun geri kalanında ayakta durdu ama hiç yorulmadı. İçi sevinçle doluydu. İnerken annesi, “Seninle gurur duyuyorum,” dedi. Ece de annesine sıkıca sarıldı.',
      ],
      questions: [
        {
          prompt: 'Bir sonraki durakta tramvaya kim bindi?',
          options: [
            'Elinde bastonu olan yaşlı bir amca',
            'Okul çantalı bir çocuk',
            'Köpeğiyle bir teyze',
          ],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Bastonlu, yaşlı bir amca bindi.',
        },
        {
          prompt: 'Amca “Ne kibar bir kızsın” dedi. “Kibar” ne demektir?',
          options: ['Çok hızlı', 'Nazik ve saygılı', 'Çok uzun boylu'],
          correctIndex: 1,
          hint: 'İpucu: Ece amcaya yerini verdi. Böyle davranan birine ne denir?',
          explanation: 'Aferin! Kibar, nazik ve saygılı demektir.',
        },
        {
          prompt: 'Ece ayakta dururken neden hiç yorulmadı?',
          options: [
            'Tramvay çok yavaş gittiği için',
            'Annesi onu kucağına aldığı için',
            'İçi sevinçle dolu olduğu için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafın ikinci cümlesine bak.',
          explanation: 'Harika! İyilik yapmanın verdiği sevinç Ece’ye güç verdi.',
        },
      ],
      glossary: [
        { word: 'bastonuyla', meaning: 'Yürürken destek almak için kullanılan değnekle.' },
        { word: 'direğe', meaning: 'Tutunmak için konmuş dik demir boruya.' },
        { word: 'kibar', meaning: 'Nazik, saygılı.' },
      ],
    }),
    story(city, {
      position: 8,
      slug: 'kordonun-martisi',
      theme: TextTheme.YARDIMLASMA,
      title: 'Kordon’un Martısı',
      summary:
        'Zeynep’in Kordon’da ayağına misina dolanmış bir martının kurtarılmasına yardım ettiği gün.',
      level,
      paragraphs: [
        'Zeynep, babasıyla Kordon’da yürürken çimenlerin üstünde bir martı gördü. Martı uçmaya çalışıyor ama bir türlü havalanamıyordu.',
        'Zeynep yaklaşınca nedenini anladı. Martının ayağına uzun bir misina dolanmıştı. Zeynep hemen martıya dokunmak istedi.',
        'Babası onu nazikçe durdurdu. “Korkmuş bir hayvana kendimiz dokunmayalım. Ona nasıl yardım edileceğini bilen birini bulalım,” dedi.',
        'Yakında oltasıyla balık tutan bir balıkçı amca vardı. Babası ona durumu anlattı. Balıkçı amca martıyı bir havluyla yavaşça tuttu ve küçük bir makasla misinayı kesti.',
        'Martı bir an durdu, sonra kanatlarını açıp denize doğru uçtu. Zeynep sevinçle el salladı. “Hoşça kal, Kordon’un martısı!” dedi. O günden sonra yerde gördüğü misinaları hep çöpe attı.',
      ],
      questions: [
        {
          prompt: 'Martı neden uçamıyordu?',
          options: ['Kanadı kırılmıştı', 'Ayağına misina dolanmıştı', 'Çok yorgundu'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Zeynep yaklaşınca neyi fark etti?',
          explanation: 'Doğru! Martının ayağına misina dolanmıştı.',
        },
        {
          prompt: 'Babası neden martıya kendilerinin dokunmasını istemedi?',
          options: [
            'Martı korkmuştu; ona nasıl yardım edileceğini bilen biri gerekiyordu',
            'Martı çok kirliydi',
            'Eve geç kalıyorlardı',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta babasının söylediklerini oku.',
          explanation:
            'Aferin! Korkmuş bir hayvana, onu nasıl tutacağını bilen biri yardım etmelidir.',
        },
        {
          prompt: 'Zeynep o günden sonra ne yaptı?',
          options: [
            'Martıları kovaladı',
            'Kordon’a hiç gitmedi',
            'Yerde gördüğü misinaları çöpe attı',
          ],
          correctIndex: 2,
          hint: 'İpucu: Hikâyenin son cümlesine bak.',
          explanation:
            'Harika! Çöpleri toplamak hayvanları korumanın en güzel yollarından biridir.',
        },
      ],
      glossary: [
        { word: 'misina', meaning: 'Balık tutmakta kullanılan ince, şeffaf ip.' },
        { word: 'nazikçe', meaning: 'Yumuşak ve kibar bir şekilde.' },
        { word: 'oltasıyla', meaning: 'Balık tutmaya yarayan ipli, iğneli çubuğuyla.' },
      ],
    }),
    story(city, {
      position: 9,
      slug: 'pirilin-korfez-yolculugu',
      theme: TextTheme.MERAK,
      title: 'Pırıl’ın Körfez Yolculuğu',
      summary:
        'Pırıl’ın körfez vapurunda kitap okuyan bir kızdan Efes’i duyup yeni durağını seçtiği yolculuk.',
      level,
      paragraphs: [
        'Pırıl, İzmir’de körfez vapuruna bindi. Vapur Konak’tan Karşıyaka’ya gidiyordu. Pırıl güvertede oturdu ve rüzgârın tüylerini okşamasına izin verdi.',
        'Yanındaki bankta küçük bir kız kitap okuyordu. Kitabın kapağında kocaman taş sütunlar vardı. Pırıl merakla kitaba doğru eğildi.',
        'Kız gülümsedi. “Bu kitap Efes’i anlatıyor. Efes çok eski bir kent. Orada yaklaşık iki bin yıl önce yapılmış bir kütüphane var,” dedi.',
        'Pırıl’ın gözleri parladı. Bir gözü kehribar, öbürü mavi ışıl ışıldı. Kız kitaptan birkaç sayfayı yüksek sesle okudu. Pırıl hiç kıpırdamadan dinledi.',
        'Vapur Karşıyaka’ya yanaştığında Pırıl kararını vermişti. Bir sonraki durağı Efes olacaktı. Kıza teşekkür eder gibi miyavladı ve iskeleye atladı.',
      ],
      questions: [
        {
          prompt: 'Kızın okuduğu kitap neyi anlatıyordu?',
          options: ['Van’ı', 'İstanbul’u', 'Efes’i'],
          correctIndex: 2,
          hint: 'İpucu: Üçüncü paragrafta kızın söylediklerine bak.',
          explanation: 'Doğru! Kitap çok eski bir kent olan Efes’i anlatıyordu.',
        },
        {
          prompt: '“Pırıl’ın gözleri parladı.” Bu cümle ne anlatıyor?',
          options: [
            'Pırıl çok heyecanlandı ve merak etti',
            'Pırıl’ın gözüne güneş girdi',
            'Pırıl’ın uykusu geldi',
          ],
          correctIndex: 0,
          hint: 'İpucu: Kız Efes’ten söz edince Pırıl ne hissetmiş olabilir?',
          explanation:
            'Aferin! Gözleri parlamak, bir şeye çok heyecanlanmak ve merak etmek demektir.',
        },
        {
          prompt: 'Pırıl kıza neden teşekkür eder gibi miyavladı?',
          options: [
            'Kız ona balık verdiği için',
            'Kız ona Efes’i anlatıp kitap okuduğu için',
            'Kız onu vapurdan indirdiği için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Kız vapurda Pırıl’a neler anlattı?',
          explanation: 'Harika! Kız ona Efes’i anlattı; Pırıl da bunun için minnettardı.',
        },
      ],
      glossary: [
        { word: 'körfez', meaning: 'Denizin karanın içine doğru girdiği geniş yer.' },
        { word: 'güvertede', meaning: 'Geminin üstündeki açık alanda.' },
        { word: 'sütunlar', meaning: 'Binaları taşıyan uzun, yuvarlak direkler.' },
      ],
    }),
    chest(city, 10, 'İzmir’in son sandığı Saat Kulesi’nin dibinde; aç ve Efes’e doğru yola çık!'),
  ],
};
