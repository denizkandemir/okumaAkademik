import {
  City,
  CognitiveLevel,
  QuestionType,
  ReadingLevel,
  TextTheme,
} from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.KAPADOKYA;

/** 5. durak — "Balonlar Yükselirken" */
export const kapadokya: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'perilerin-bacalari',
      theme: TextTheme.MERAK,
      title: 'Perilerin Bacaları',
      summary:
        'Nehir’in peri bacalarının hem masalını hem de yanardağ külünden nasıl oluştuğunu öğrendiği gün.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Nehir, Kapadokya’ya ilk kez geliyordu. Arabanın camından dışarı bakınca gözlerine inanamadı. Vadide yüzlerce sivri kaya yükseliyordu. Bazılarının tepesinde, şapka gibi duran koyu renkli taşlar vardı.',
        'Dedesi gülümsedi. “Bunlara peri bacası derler. Eskiden insanlar, bu kayaların içinde perilerin yaşadığına inanırmış,” dedi. Nehir, kayaların arasında uçuşan minik perileri hayal etti.',
        'Annesi ise başka bir şey anlattı: “Çok uzun zaman önce buradaki yanardağlar patlamış. Etrafa kalın bir kül tabakası yayılmış. Bu kül zamanla sertleşip yumuşak bir taşa dönüşmüş.”',
        '“Peki kayalar nasıl bu kadar sivri olmuş?” diye sordu Nehir. Annesi açıkladı: “Rüzgâr ve yağmur binlerce yıl boyunca yumuşak taşı aşındırmış. Tepedeki sert taşlar ise altlarındaki kayayı korumuş. Böylece bu şapkalı kuleler ortaya çıkmış.”',
        'Nehir bir peri bacasına dokundu. Taş, avucunun altında pürüzlüydü. “Demek rüzgâr ve yağmur, usta birer heykeltıraşmış,” dedi. Dedesi göz kırptı. “Belki periler de onlara yardım etmiştir!” Nehir kahkahalarla güldü.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Annesine göre peri bacalarının taşı neyden oluşmuş?',
          options: ['Deniz kumundan', 'Yanardağ külünden', 'Eriyen kardan'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta annesinin anlattıklarını oku.',
          explanation: 'Doğru! Yanardağlardan çıkan kül sertleşip yumuşak bir taşa dönüşmüş.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Peri bacalarının tepesindeki sert taşlar ne işe yaramış?',
          options: [
            'Altlarındaki kayayı korumuş',
            'Perileri saklamış',
            'Kayaları daha ağır yapmış',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta rüzgâr ve yağmurdan sonra ne olduğu anlatılıyor.',
          explanation: 'Aferin! Sert taşlar şemsiye gibi altlarındaki kayayı aşınmaktan korumuş.',
        },
        {
          type: QuestionType.CUMLEDE_ANLAM,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Nehir rüzgârı ve yağmuru neye benzetti?',
          options: ['Yaramaz çocuklara', 'Usta heykeltıraşlara', 'Yorgun yolculara'],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafta Nehir’in söylediği söze bak.',
          explanation:
            'Harika! Rüzgâr ve yağmur, kayaları bir heykeltıraş gibi yavaş yavaş yontmuş.',
        },
      ],
      glossary: [
        { word: 'yanardağlar', meaning: 'Ağzından ateş, kül ve lav çıkan dağlar.' },
        { word: 'aşındırmış', meaning: 'Yavaş yavaş aşındırıp küçültmüş, yontmuş.' },
        { word: 'heykeltıraşmış', meaning: 'Taşı oyarak heykel yapan sanatçıymış.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Nehir, Kapadokya’ya ilk kez geldi. Arabadan dışarı baktı. Vadide sivri kayalar vardı. Bazı kayaların şapkası bile vardı!',
            '“Bunlara peri bacası derler,” dedi dedesi. “Eskiden insanlar, içinde periler yaşar sanırmış.” Nehir minik perileri hayal etti.',
            'Annesi başka bir şey anlattı. “Çok önce burada yanardağlar patlamış. Her yere kül yayılmış. Kül sertleşip taş olmuş.”',
            '“Kayalar nasıl sivri olmuş?” diye sordu Nehir. “Rüzgâr ve yağmur taşı aşındırmış. Tepedeki sert taşlar alttaki kayayı korumuş,” dedi annesi.',
            'Nehir bir kayaya dokundu. Taş pürüzlüydü. “Rüzgâr ve yağmur ne usta!” dedi. Dedesi göz kırptı. “Belki periler de yardım etmiştir!” Nehir kahkahalarla güldü.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Annesine göre bu taş neyden oluşmuş?',
              options: ['Kardan', 'Külden', 'Kumdan'],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafta annesinin anlattıklarını oku.',
              explanation: 'Doğru! Yanardağlardan çıkan kül sertleşip taş olmuş.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Tepedeki sert taşlar ne işe yaramış?',
              options: ['Alttaki kayayı korumuş', 'Perileri saklamış', 'Yağmuru çağırmış'],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafta annesinin cevabını oku.',
              explanation: 'Aferin! Sert taşlar alttaki kayanın aşınmasını önlemiş.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dedesinin son sözünden sonra Nehir nasıl hissetti?',
              options: ['Çok korktu', 'Dedesine kızdı', 'Çok neşelendi'],
              correctIndex: 2,
              hint: 'İpucu: Son cümlede Nehir’in ne yaptığına bak.',
              explanation: 'Harika! Nehir, dedesinin şakasına kahkahalarla güldü.',
            },
          ],
          glossary: [
            { word: 'yanardağlar', meaning: 'Ağzından ateş, kül ve lav çıkan dağlar.' },
            { word: 'aşındırmış', meaning: 'Yavaş yavaş yontup küçültmüş.' },
            { word: 'pürüzlüydü', meaning: 'Düz değildi, elde takılan bir yüzeyi vardı.' },
          ],
        },
        G3: {
          paragraphs: [
            'Nehir, Kapadokya’ya ilk kez geliyordu. Arabanın camından dışarı bakınca gözlerine inanamadı, çünkü vadide yüzlerce sivri kaya yükseliyordu. Bazılarının tepesinde, şapka gibi duran koyu renkli taşlar vardı. Nehir, böyle bir yeri daha önce yalnızca kitaplarda görmüştü.',
            'Dedesi gülümsedi. “Bunlara peri bacası derler. Eskiden insanlar, bu kayaların içinde perilerin yaşadığına inanırmış,” dedi. Nehir, kayaların arasında uçuşan minik perileri hayal etti. Bu masal çok hoşuna gitmişti ama kayaların gerçekte nasıl oluştuğunu da merak ediyordu.',
            'Annesi ise başka bir şey anlattı: “Çok uzun zaman önce buradaki yanardağlar patlamış ve etrafa kalın bir kül tabakası yayılmış. Bu kül zamanla sertleşip yumuşak bir taşa dönüşmüş.”',
            '“Peki kayalar nasıl bu kadar sivri olmuş?” diye sordu Nehir. Annesi açıkladı: “Rüzgâr ve yağmur binlerce yıl boyunca yumuşak taşı aşındırmış. Tepedeki sert taşlar ise altlarındaki kayayı korumuş, tıpkı bir şemsiye gibi. Böylece bu şapkalı kuleler ortaya çıkmış.” Nehir bunu duyunca kayalara yeniden baktı.',
            'Nehir bir peri bacasına dokundu; taş, avucunun altında pürüzlüydü. “Demek rüzgâr ve yağmur, usta birer heykeltıraşmış,” dedi. Dedesi göz kırptı. “Belki periler de onlara yardım etmiştir!” Nehir kahkahalarla güldü. Artık aynı kayaların hem bir masalı hem de bir bilimsel açıklaması olduğunu biliyordu.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Annesi tepedeki sert taşları neden şemsiyeye benzetmiş olabilir?',
              options: [
                'Renkleri şemsiyeye benzediği için',
                'İnsanlar altlarında yağmurdan korunduğu için',
                'Altlarındaki kayayı rüzgârdan ve yağmurdan korudukları için',
                'Rüzgârda şemsiye gibi açılıp kapandıkları için',
              ],
              correctIndex: 2,
              hint: 'İpucu: Dördüncü paragrafta sert taşların ne yaptığını oku.',
              explanation:
                'Aferin! Şemsiye nasıl bizi koruyorsa sert taşlar da alttaki kayayı korumuş.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'Bir yerin hem masalı hem de bilimsel açıklaması olabilir.',
                'Masallar yalnızca küçük çocuklar için anlatılmalıdır.',
                'Bilim öğrenenler masal dinlememelidir.',
                'Peri bacaları birkaç yılda oluşmuştur.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafın son cümlesinde Nehir’in neyi öğrendiğine bak.',
              explanation:
                'Çok güzel! Nehir, kayaların hem masalını hem de oluşumunu öğrenip ikisini de sevdi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Arabanın camından dışarı bakınca gözlerine inanamadı.” cümlesi ne anlatıyor?',
              options: [
                'Nehir’in gözlerinin ağrıdığını',
                'Nehir’in gördüklerine çok şaşırdığını',
                'Arabanın camının kirli olduğunu',
                'Nehir’in dışarıyı göremediğini',
              ],
              correctIndex: 1,
              hint: 'İpucu: Aynı cümlenin devamında Nehir’in vadide ne gördüğünü oku.',
              explanation: 'Harika! “Gözlerine inanamamak”, bir şeye çok şaşırmak demektir.',
            },
          ],
          glossary: [
            { word: 'tabakası', meaning: 'Bir şeyin üstünü örten katmanı.' },
            { word: 'aşındırmış', meaning: 'Yavaş yavaş yontup küçültmüş.' },
            { word: 'heykeltıraşmış', meaning: 'Taşı oyarak heykel yapan sanatçıymış.' },
          ],
        },
        G4: {
          paragraphs: [
            'Nehir, Kapadokya’ya ilk kez geliyordu. Uzun yolun yorgunluğuyla arka koltukta uyuklarken arabanın yavaşladığını hissetti ve camdan dışarı baktı. Gördükleri karşısında gözlerine inanamadı: Vadide yüzlerce sivri kaya, sanki yerden göğe uzanmak isteyen dev parmaklar gibi yükseliyordu. Bazılarının tepesinde, şapka gibi duran koyu renkli taşlar vardı. Bu manzara, gördüğü hiçbir yere benzemiyordu.',
            'Dedesi, torununun şaşkınlığını görünce gülümsedi. “Bunlara peri bacası derler. Eskiden insanlar, bu kayaların içinde perilerin yaşadığına inanırmış,” dedi. Nehir, kayaların arasında uçuşan minik perileri, küçük pencerelerinden dışarı bakan masal kahramanlarını hayal etti. Masal güzeldi ama içindeki merak susmuyordu; bir kaya böyle bir biçimi nasıl alabilirdi? Nehir bunu yüksek sesle sorunca annesi gülümsedi, çünkü kendisi de küçükken aynı şeyi merak etmişti.',
            'Annesi ise işin başka bir yüzünü anlattı: “Çok uzun zaman önce bu bölgedeki yanardağlar patlamış, etrafa kalın bir kül tabakası yayılmış. Bu kül zamanla sertleşip yumuşak bir taşa dönüşmüş. Erciyes ve Hasan Dağı, o yanardağların en büyüklerindendir.”',
            '“Peki kayalar nasıl bu kadar sivri olmuş?” diye sordu Nehir. Annesi açıkladı: “Rüzgâr ve yağmur binlerce yıl boyunca yumuşak taşı aşındırmış. Tepedeki sert taşlar ise altlarındaki kayayı korumuş. Çevredeki taş aşınıp giderken korunan bölüm ayakta kalmış ve böylece bu şapkalı kuleler ortaya çıkmış.” Nehir, bu sözleri dinlerken gözlerini kayalardan ayıramadı.',
            'Nehir bir peri bacasına yaklaşıp elini uzattı. Taş, avucunun altında pürüzlüydü; her çizgisi, geçen binlerce yılın izini taşıyor gibiydi. “Demek rüzgâr ve yağmur, usta birer heykeltıraşmış,” dedi. Dedesi göz kırptı. “Belki periler de onlara yardım etmiştir!” Nehir kahkahalarla güldü. O gün, aynı manzaranın iki ayrı biçimde anlatılabileceğini öğrenmişti: Masal insanın hayalini besliyor, bilim ise merakını yanıtlıyordu. Kendisi ikisinden de vazgeçmek istemiyordu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Yanardağların yakınında yaşamak zordur.',
                'Masallar, bilimin yerini tutabilir.',
                'Bilim öğrenen, hayal kurmayı bırakmalıdır.',
                'Masal da bilim de aynı manzarayı farklı biçimde anlatabilir; ikisinin de değeri vardır.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Son paragrafta Nehir’in masal ve bilim için söylediklerini düşün.',
              explanation:
                'Aferin! Nehir, masalın hayalini, bilimin de merakını beslediğini gördü.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Demek rüzgâr ve yağmur, usta birer heykeltıraşmış” sözüyle anlatılmak istenen nedir?',
              options: [
                'Rüzgâr ve yağmurun kayalara zaman içinde biçim verdiği',
                'Kayaları heykeltıraşların oyduğu',
                'Rüzgârın ve yağmurun her yıl bu vadide arttığı',
                'Eskiden vadide çok sayıda heykel bulunduğu',
              ],
              correctIndex: 0,
              hint: 'İpucu: Bir önceki paragrafta annesinin rüzgâr ve yağmur için anlattıklarını hatırla.',
              explanation:
                'Çok güzel! Rüzgâr ve yağmur, bir heykeltıraş gibi kayayı yavaş yavaş yontmuş.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Annesinin anlattıklarına göre bir kulenin tepesinde sert taş olmasaydı ne olurdu?',
              options: [
                'Kule daha hızlı yükselirdi.',
                'Alttaki yumuşak taş daha çabuk aşınırdı.',
                'Kuleye yağmur hiç değmezdi.',
                'Yumuşak taş zamanla sertleşirdi.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Dördüncü paragrafta korunan bölüm ile çevredeki taşa ne olduğunu karşılaştır.',
              explanation:
                'Harika! Sert taş koruduğu için altındaki bölüm ayakta kalmış; o olmasaydı daha çabuk aşınırdı.',
            },
          ],
          glossary: [
            { word: 'tabakası', meaning: 'Bir şeyin üstünü örten katmanı.' },
            { word: 'aşındırmış', meaning: 'Yavaş yavaş yontup küçültmüş.' },
            { word: 'heykeltıraşmış', meaning: 'Taşı oyarak heykel yapan sanatçıymış.' },
            { word: 'manzaranın', meaning: 'Bir yerden bakınca görülen görüntünün.' },
          ],
        },
      },
    }),
    story(city, {
      position: 2,
      slug: 'ucan-balon',
      theme: TextTheme.CESARET,
      title: 'Uçan Balon',
      summary:
        'Ali’nin Kapadokya’da gün doğarken ilk kez sıcak hava balonuna binip korkusunu yendiği sabah.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Saat sabahın beşiydi ve hava hâlâ karanlıktı. Ali, ailesiyle birlikte geniş bir tarlaya geldi. Yerde kocaman, rengârenk bir balon yatıyordu. Bugün Ali’nin ilk balon yolculuğuydu.',
        'Balon pilotu Selim Bey, balonun altındaki brülörü yaktı. Kocaman bir alev çıktı ve balonun içi ısınmaya başladı. Selim Bey, “Sıcak hava, soğuk havadan hafiftir. Balonu da o yükseltir,” diye açıkladı.',
        'Balon yavaş yavaş doğruldu. Ali ve ailesi sepete bindiler. Bir süre sonra sepet yerden kesildi. Ali önce biraz korktu ve annesinin elini sıkıca tuttu.',
        'Ama aşağı bakınca korkusu meraka dönüştü. Güneş ufukta doğuyor, peri bacaları pembe bir ışıkla boyanıyordu. Çevrelerinde yüzlerce balon süzülüyordu. Kırmızı, mavi, sarı… Sanki gökyüzünde bir renk şenliği vardı.',
        'Bir saat sonra balon yumuşak bir şekilde yere indi. Selim Bey, Ali’ye küçük bir balon rozeti verdi. Ali rozetini göğsüne taktı. “Korkmuştum ama iyi ki binmişim. Yukarıdan her şey çok güzel görünüyor!” dedi.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Selim Bey’e göre balonu yükselten nedir?',
          options: ['Rüzgâr', 'Sıcak hava', 'Kuşlar'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Selim Bey’in açıklamasını oku.',
          explanation: 'Doğru! Sıcak hava soğuk havadan hafif olduğu için balonu yükseltir.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Ali neden annesinin elini sıkıca tuttu?',
          options: [
            'Sepet yerden kesilince biraz korktuğu için',
            'Elleri üşüdüğü için',
            'Annesi düşmesin diye',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafın son cümlesine bak.',
          explanation: 'Aferin! Sepet yerden kesilince Ali bir an korktu.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Yolculuğun sonunda Ali ne düşünüyordu?',
          options: [
            'Bir daha asla binmeyeceğini',
            'Rozetin çok küçük olduğunu',
            'Korksa da binmekle iyi yaptığını',
          ],
          correctIndex: 2,
          hint: 'İpucu: Ali’nin son paragrafta söylediklerini oku.',
          explanation: 'Harika! Ali korkusunu yendi ve çok güzel bir şey yaşadı.',
        },
      ],
      glossary: [
        { word: 'brülörü', meaning: 'Alev üfleyerek balonun içindeki havayı ısıtan aleti.' },
        { word: 'ufukta', meaning: 'Gökle yerin birleşiyormuş gibi göründüğü uzak çizgide.' },
        { word: 'şenliği', meaning: 'Neşeli bir kutlaması.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Hava daha karanlıktı. Ali ailesiyle bir tarlaya geldi. Yerde kocaman bir balon yatıyordu. Bugün Ali ilk kez balona binecekti.',
            'Pilot Selim Bey ateşi yaktı. Balonun içi ısındı. “Sıcak hava balonu yükseltir,” dedi.',
            'Balon yavaşça doğruldu. Herkes sepete bindi. Sepet yerden kesildi. Ali biraz korktu. Annesinin elini tuttu.',
            'Sonra aşağı baktı. Güneş doğuyordu. Kayalar pembe olmuştu. Gökyüzünde yüzlerce balon vardı.',
            'Balon yavaşça yere indi. Selim Bey, Ali’ye bir rozet verdi. “Korkmuştum ama iyi ki bindim!” dedi Ali.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Selim Bey’e göre balonu ne yükseltir?',
              options: ['Rüzgâr', 'Kuşlar', 'Sıcak hava'],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafta Selim Bey’in sözünü oku.',
              explanation: 'Doğru! Balonun içindeki sıcak hava onu yukarı taşır.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Sepet yerden kesilince Ali nasıl hissetti?',
              options: ['Biraz korktu', 'Çok kızdı', 'Uykusu geldi'],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta Ali’nin ne yaptığına bak.',
              explanation: 'Aferin! Ali biraz korktu ve annesinin elini tuttu.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Sepet yerden kesildi.” Bu ne demek?',
              options: ['Sepet ikiye ayrıldı', 'Sepet havaya yükseldi', 'Sepet yere düştü'],
              correctIndex: 1,
              hint: 'İpucu: Balon sonra nereye gidiyor? Dördüncü paragrafı düşün.',
              explanation: 'Harika! Yerden kesilmek, yerden ayrılıp havaya yükselmektir.',
            },
          ],
          glossary: [
            { word: 'Pilot', meaning: 'Balonu ya da uçağı kullanan kişi.' },
            { word: 'sepete', meaning: 'Balonun altındaki, yolcuların durduğu bölüme.' },
            { word: 'rozet', meaning: 'Yakaya takılan küçük süs ya da işaret.' },
          ],
        },
        G3: {
          paragraphs: [
            'Saat sabahın beşiydi ve hava hâlâ karanlıktı; Ali, ailesiyle birlikte geniş bir tarlaya geldi. Yerde kocaman, rengârenk bir balon yatıyordu. Bugün Ali’nin ilk balon yolculuğuydu; bu yüzden gece heyecandan neredeyse hiç uyuyamamıştı.',
            'Balon pilotu Selim Bey, balonun altındaki brülörü yaktı. Kocaman bir alev çıktı ve balonun içi ısınmaya başladı. Selim Bey, “Sıcak hava, soğuk havadan hafiftir, balonu da o yükseltir,” diye açıkladı. Ali alevin sesine önce şaşırdı, sonra dikkatle izlemeye başladı.',
            'Balon yavaş yavaş doğruldu ve Ali ile ailesi sepete bindi. Bir süre sonra sepet yerden kesildi. Ali önce biraz korktu ve annesinin elini sıkıca tuttu. Annesi bir şey söylemedi, yalnızca gülümseyerek aşağıyı gösterdi.',
            'Ali aşağı bakınca korkusu meraka dönüştü. Güneş ufukta doğuyor, peri bacaları pembe bir ışıkla boyanıyordu. Çevrelerinde yüzlerce balon süzülüyordu. Kırmızı, mavi, sarı… Sanki gökyüzünde bir renk şenliği vardı. Ali, annesinin elini ne zaman bıraktığını fark etmedi bile.',
            'Bir saat sonra balon yumuşak bir şekilde yere indi ve Selim Bey, Ali’ye küçük bir balon rozeti verdi. Ali rozetini göğsüne taktı. “Korkmuştum ama iyi ki binmişim. Yukarıdan her şey çok güzel görünüyor!” dedi. Bu rozet, ona o sabah yaptığı cesur yolculuğu her zaman hatırlatacaktı.',
          ],
          questions: [
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Ali, annesinin elini ne zaman bıraktığını fark etmedi bile.” cümlesi ne anlatıyor?',
              options: [
                'Annesinin Ali’ye kızdığını',
                'Ali’nin elinin üşüdüğünü',
                'Sepetin çok sallandığını',
                'Ali’nin manzaraya dalıp korkusunu unuttuğunu',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü paragrafta Ali’nin elini neden tuttuğunu hatırla.',
              explanation:
                'Aferin! Ali korktuğu için tuttuğu eli, manzaraya dalınca farkında olmadan bıraktı.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Balonun içindeki havayı ısıtan alet hangisidir?',
              options: ['Brülör', 'Pusula', 'Sepet', 'Rozet'],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafta Selim Bey’in ne yaktığına bak.',
              explanation: 'Doğru! Selim Bey brülörü yakınca balonun içi ısınmaya başladı.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin başlığı değiştirilecek olsa en uygunu hangisi olurdu?',
              options: [
                'Selim Bey’in Rozetleri',
                'Korkudan Meraka Bir Yolculuk',
                'Tarlada Kaybolan Balon',
                'Balon Nasıl Dikilir?',
              ],
              correctIndex: 1,
              hint: 'İpucu: Ali’nin yolculuğun başındaki ve sonundaki duygularını karşılaştır.',
              explanation:
                'Çok güzel! Metin, Ali’nin korkusunun yolculukta meraka ve sevince dönüşmesini anlatıyor.',
            },
          ],
          glossary: [
            { word: 'brülörü', meaning: 'Alev üfleyerek balonun içindeki havayı ısıtan aleti.' },
            { word: 'ufukta', meaning: 'Gökle yerin birleşiyormuş gibi göründüğü uzak çizgide.' },
            { word: 'süzülüyordu', meaning: 'Havada yavaş ve kolayca ilerliyordu.' },
          ],
        },
        G4: {
          paragraphs: [
            'Saat sabahın beşiydi ve hava hâlâ karanlıktı; Ali, ailesiyle birlikte soğuk toprağa basarak geniş bir tarlaya yürüdü. Yerde kocaman, rengârenk bir balon, uykudaki bir dev gibi yatıyordu. Bugün Ali’nin ilk balon yolculuğuydu ve günlerdir beklediği bu sabah, şimdi gözüne biraz ürkütücü görünüyordu.',
            'Balon pilotu Selim Bey, balonun altındaki brülörü yaktı. Kocaman bir alev, gürültüyle kumaşın içine doğru uzandı. Selim Bey, “Sıcak hava, soğuk havadan hafiftir, balonu da o yükseltir. Sabahın erken saatinde uçmamızın nedeni de rüzgârın bu saatte genellikle daha sakin olmasıdır,” diye açıkladı. Ali başını salladı; anlamıştı ama kalbi hâlâ hızlı atıyordu.',
            'Dev yavaş yavaş uyandı, balon doğruldu ve Ali ile ailesi sepete bindi. Bir süre sonra sepet, hiçbir sarsıntı olmadan yerden kesildi. Ali, ayaklarının altındaki toprağın uzaklaştığını görünce önce biraz korktu ve annesinin elini sıkıca tuttu. Annesi, onun korkusunu anlamış gibi elini hafifçe sıktı ve hiçbir şey söylemeden aşağıdaki vadiyi gösterdi.',
            'Ama aşağı bakınca korkusunun yerini yavaş yavaş merak aldı. Güneş ufukta doğuyor, peri bacaları pembe bir ışıkla boyanıyordu. Çevrelerinde yüzlerce balon, sessizce süzülüyordu; kırmızı, mavi, sarı… sanki gökyüzünde bir renk şenliği vardı ve Ali de bu şenliğin küçük bir konuğuydu. Brülörün arada bir yükselen sesi dışında çıt çıkmıyordu. Onu asıl sakinleştiren, gözlerinin önünde açılan bu geniş manzaraydı.',
            'Bir saat sonra balon yumuşak bir şekilde yere indi ve Selim Bey, Ali’ye küçük bir balon rozeti verdi. Ali rozetini göğsüne taktı ve tarlanın ortasında durup başını kaldırdı. “Korkmuştum ama iyi ki binmişim, yukarıdan her şey çok güzel görünüyor!” dedi. Gerçekten de o sabah yalnızca gökyüzüne çıkmamış, korkusunun öbür yanında neler olduğunu da görmüştü.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Korkuya rağmen denemek, insana yeni güzellikler kazandırabilir.',
                'Balon yolculuğu yalnızca yetişkinler için uygundur.',
                'Erken kalkmak her zaman sağlıklıdır.',
                'Pilotlar yolculara her zaman rozet vermelidir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafın son cümlesinde Ali’nin o sabah neyi gördüğünü düşün.',
              explanation: 'Aferin! Ali korktuğu hâlde bindi ve çok güzel bir şey yaşadı.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Ali, yolculuk boyunca hiç korkmadı. II. Balonu sıcak hava yükseltir. III. Erken uçulmasının nedeni, rüzgârın o saatte genellikle daha sakin olmasıdır.',
              options: ['Yalnız I', 'I ve II', 'II ve III', 'I, II ve III'],
              correctIndex: 2,
              hint: 'İpucu: Her yargıyı tek tek ele al; Ali’nin duygularına üçüncü paragrafta bak.',
              explanation: 'Harika! Ali önce biraz korktu, bu yüzden I. yargı yanlıştır.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…korkusunun öbür yanında neler olduğunu da görmüştü.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Ali’nin başka bir tarlaya indiği',
                'Sepetin öbür yanından manzaranın daha güzel göründüğü',
                'Ali’nin yeni bir korku edindiği',
                'Ali’nin korkusunu aşınca güzel bir deneyim yaşadığı',
              ],
              correctIndex: 3,
              hint: 'İpucu: Ali’nin korkusu yolculuk boyunca neye dönüştü?',
              explanation:
                'Çok güzel! Korku bir duvar gibiydi; Ali onu aşınca arkasındaki güzelliği gördü.',
            },
          ],
          glossary: [
            { word: 'ürkütücü', meaning: 'İnsanı biraz korkutan.' },
            { word: 'brülörü', meaning: 'Alev üfleyerek balonun içindeki havayı ısıtan aleti.' },
            { word: 'ufukta', meaning: 'Gökle yerin birleşiyormuş gibi göründüğü uzak çizgide.' },
            { word: 'şenliğin', meaning: 'Neşeli bir kutlamanın.' },
          ],
        },
      },
    }),
    story(city, {
      position: 3,
      slug: 'yerin-altindaki-sehir',
      theme: TextTheme.KESIF,
      title: 'Yerin Altındaki Şehir',
      summary:
        'Defne’nin Derinkuyu’daki yeraltı şehrinde taş kapıları ve havalandırma bacalarını keşfettiği gezi.',
      level: ReadingLevel.ILERI,
      paragraphs: [
        'Defne ile ağabeyi Kaan, Derinkuyu’da dar bir merdivenin başında durdular. Rehber, “Şimdi yerin altındaki bir şehre ineceğiz,” dedi. Defne şaşırdı. Yerin altında şehir mi olurdu?',
        'Merdivenlerden inip daracık koridorlardan geçtiler. Kayaların içine oyulmuş odalar vardı: mutfaklar, ambarlar, hatta hayvanlar için ahırlar. Rehber, şehrin yerin altında katlar hâlinde, çok derinlere uzandığını anlattı.',
        'Bir koridorun yanında, değirmen taşına benzeyen kocaman, yuvarlak bir taş duruyordu. Rehber açıkladı: “Eskiden insanlar tehlike anında buraya sığınırmış. Bu taşı yuvarlayıp kapıyı içeriden kapatırlarmış.”',
        'Kaan, “Peki bu kadar derinde nasıl nefes alıyorlarmış?” diye sordu. Rehber yukarıya doğru uzanan dar bir deliği gösterdi. “Bunlar havalandırma bacaları. Temiz hava yukarıdan buralara kadar iner,” dedi. Defne başını kaldırıp baktı; deliğin ucunda küçük bir ışık görünüyordu.',
        'Yukarı çıktıklarında güneş gözlerini kamaştırdı. Defne, karanlıkta yaşamanın hiç kolay olmadığını düşündü. “Bu şehri kazan insanlar çok çalışkan ve akıllıymış,” dedi. Kaan da başını salladı.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Yeraltı şehrinin kapıları neyle kapatılırdı?',
          options: ['Tahta kapılarla', 'Kocaman, yuvarlak taşlarla', 'Demir parmaklıklarla'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta rehberin anlattıklarını oku.',
          explanation: 'Doğru! Kapılar kocaman, yuvarlak taşlar yuvarlanarak kapatılırdı.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Yerin altında yaşayanlar nasıl nefes alabiliyordu?',
          options: [
            'Havalandırma bacaları temiz hava getirdiği için',
            'Odalarda ağaçlar olduğu için',
            'Kapılar hep açık kaldığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Kaan’ın sorusuna rehberin verdiği cevabı oku.',
          explanation: 'Aferin! Havalandırma bacaları yukarıdan temiz hava taşıyordu.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Defne şehri kazan insanlar için ne düşündü?',
          options: [
            'Çok tembel olduklarını',
            'Karanlığı sevdiklerini',
            'Çok çalışkan ve akıllı olduklarını',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Defne’nin söylediği söze bak.',
          explanation: 'Harika! Kayaları oyarak koca bir şehir kurmak büyük emek ve akıl ister.',
        },
      ],
      glossary: [
        { word: 'ambarlar', meaning: 'Yiyeceklerin saklandığı depolar.' },
        { word: 'sığınırmış', meaning: 'Korunmak için güvenli bir yere girermiş.' },
        { word: 'havalandırma', meaning: 'Bir yere temiz hava girmesini sağlama.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Defne ile ağabeyi Kaan, Derinkuyu’ya geldi. Önlerinde dar bir merdiven vardı. “Yerin altındaki şehre ineceğiz,” dedi rehber. Defne çok şaşırdı.',
            'Aşağı indiler. Kayaların içinde odalar vardı. Mutfak, ambar ve ahır gördüler.',
            'Bir yanda kocaman, yuvarlak bir taş duruyordu. “İnsanlar tehlikede buraya gelirmiş. Kapıyı bu taşla kapatırlarmış,” dedi rehber.',
            '“Burada nasıl nefes alıyorlarmış?” diye sordu Kaan. Rehber dar bir deliği gösterdi. “Temiz hava buradan iner,” dedi.',
            'Yukarı çıktılar. Güneş gözlerini kamaştırdı. “Bu şehri kazanlar çok akıllıymış,” dedi Defne.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Yuvarlak taş ne işe yarıyordu?',
              options: ['Kapıyı kapatmaya', 'Yemek pişirmeye', 'Odayı aydınlatmaya'],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta rehberin sözünü oku.',
              explanation: 'Doğru! İnsanlar kapıyı bu taşla kapatırmış.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'İnsanlar yerin altında nasıl nefes alabiliyordu?',
              options: [
                'Odalarda ağaç vardı',
                'Kapılar hep açıktı',
                'Dar delikten temiz hava iniyordu',
              ],
              correctIndex: 2,
              hint: 'İpucu: Kaan’ın sorusuna rehberin verdiği cevabı oku.',
              explanation: 'Aferin! Temiz hava dar delikten aşağı iniyordu.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Rehberin sözünü duyunca Defne nasıl hissetti?',
              options: ['Sıkıldı', 'Çok şaşırdı', 'Kızdı'],
              correctIndex: 1,
              hint: 'İpucu: Birinci paragrafın son cümlesine bak.',
              explanation: 'Harika! Yerin altında şehir olması Defne’yi çok şaşırttı.',
            },
          ],
          glossary: [
            { word: 'rehber', meaning: 'Gezenlere yol gösterip bilgi veren kişi.' },
            { word: 'ambar', meaning: 'Yiyeceklerin saklandığı yer.' },
            { word: 'ahır', meaning: 'Hayvanların barındığı yer.' },
          ],
        },
        G3: {
          paragraphs: [
            'Defne ile ağabeyi Kaan, Derinkuyu’da dar bir merdivenin başında durdular. Rehber, “Şimdi yerin altındaki bir şehre ineceğiz,” dedi. Defne şaşırdı, çünkü şehirler ona göre yerin üstünde olurdu. Yerin altında şehir mi olurdu?',
            'Merdivenlerden inip daracık koridorlardan geçtiler; bazı yerlerde başlarını eğmek zorunda kaldılar. Kayaların içine oyulmuş odalar vardı: mutfaklar, ambarlar, hatta hayvanlar için ahırlar. Rehber, şehrin yerin altında katlar hâlinde, çok derinlere uzandığını anlattı. Rehberin anlattıkları, Defne’nin aklındaki soruları daha da çoğalttı.',
            'Bir koridorun yanında, değirmen taşına benzeyen kocaman, yuvarlak bir taş duruyordu. Rehber açıkladı: “Eskiden insanlar tehlike anında buraya sığınırmış. Bu taşı yuvarlayıp kapıyı içeriden kapatırlarmış.” Defne taşı itmeye çalıştı ama taş hiç kıpırdamadı. Bu taşı kaç kişinin birlikte yuvarladığını merak etti.',
            'Kaan, “Peki bu kadar derinde nasıl nefes alıyorlarmış?” diye sordu. Rehber yukarıya doğru uzanan dar bir deliği gösterdi. “Bunlar havalandırma bacaları. Temiz hava yukarıdan buralara kadar iner,” dedi. Defne başını kaldırıp baktı; deliğin ucunda küçük bir ışık görünüyordu.',
            'Yukarı çıktıklarında güneş gözlerini kamaştırdı. Defne, karanlıkta yaşamanın hiç kolay olmadığını düşündü. Yemek pişirmek, hayvanlara bakmak orada çok daha zor olmalıydı. “Bu şehri kazan insanlar çok çalışkan ve akıllıymış,” dedi. Kaan da başını salladı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'İnsanlar taş kapıyı neden içeriden kapatıyor olabilir?',
              options: [
                'Odaları serin tutmak için',
                'Tehlike anında içeridekileri korumak için',
                'Temiz havayı dışarı çıkarmak için',
                'Hayvanlar kaçmasın diye',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafta rehberin insanların buraya ne zaman geldiğini söylediğine bak.',
              explanation:
                'Aferin! İnsanlar buraya tehlike anında sığınır, kapıyı kapatıp korunurdu.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt:
                'Aşağıdakilerden hangisi metinde yeraltı şehrinde sayılan yerlerden biri değildir?',
              options: ['Mutfaklar', 'Ambarlar', 'Ahırlar', 'Pazar yerleri'],
              correctIndex: 3,
              hint: 'İpucu: İkinci paragrafta sayılan odaları oku.',
              explanation: 'Doğru! Metinde mutfak, ambar ve ahır sayılıyor; pazar yeri geçmiyor.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'İnsanlar zor koşullarda emek ve akılla çözüm üretebilir.',
                'Yerin altında yaşamak yerin üstünden daha kolaydır.',
                'Bütün şehirler yerin altına yapılmalıdır.',
                'Karanlık yerlere asla girilmemelidir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Defne’nin son paragrafta düşündüklerini ve söylediklerini birlikte değerlendir.',
              explanation:
                'Harika! İnsanlar akıl ve emekle yerin altında yaşanacak bir şehir kurmuş.',
            },
          ],
          glossary: [
            { word: 'ambarlar', meaning: 'Yiyeceklerin saklandığı depolar.' },
            { word: 'sığınırmış', meaning: 'Korunmak için güvenli bir yere girermiş.' },
            { word: 'havalandırma', meaning: 'Bir yere temiz hava girmesini sağlama.' },
          ],
        },
        G4: {
          paragraphs: [
            'Defne ile ağabeyi Kaan, Derinkuyu’da dar bir merdivenin başında durdular. Yukarıda güneş parlıyor, kasabanın sokaklarında hayat olağan akışında sürüyordu. Merdivenin ağzından yüzlerine serin bir hava vuruyordu. Rehber, “Şimdi ayaklarımızın altındaki şehre ineceğiz,” dedi. Defne şaşırdı; şehir dediğin, yerin üstünde, gökyüzüne bakan bir yer değil miydi?',
            'Merdivenlerden inip daracık koridorlardan geçtiler. Hava gitgide serinliyor, taşın kokusu her adımda biraz daha belirginleşiyordu. Kayaların içine oyulmuş odalar birbirini izliyordu: mutfaklar, ambarlar, hatta hayvanlar için ahırlar. Rehber, şehrin yerin altında katlar hâlinde, çok derinlere uzandığını, bugün yalnızca bir bölümünün gezilebildiğini anlattı. Yürüdükçe karanlık da derinleşiyordu.',
            'Bir koridorun yanında, değirmen taşına benzeyen kocaman, yuvarlak bir taş duruyordu. Rehber açıkladı: “Eskiden insanlar tehlike anında buraya sığınırmış. Bu taşı yuvarlayıp kapıyı içeriden kapatırlarmış.” Kaan taşa omzunu dayadı, ama taş ona aldırmadı bile. Defne, bu ağırlığı yuvarlamanın ancak birlikte çalışan insanların başarabileceği bir iş olduğunu düşündü.',
            'Kaan, “Peki bu kadar derinde nasıl nefes alıyorlarmış?” diye sordu. Rehber yukarıya doğru uzanan dar bir deliği gösterdi. “Bunlar havalandırma bacaları. Temiz hava yukarıdan buralara kadar iner,” dedi. Defne başını kaldırıp baktı; deliğin ucunda, karanlığın içinde unutulmuş bir yıldız gibi küçük bir ışık görünüyordu. Bu küçücük deliklerin koca bir şehri ayakta tuttuğunu düşünmek ona tuhaf geliyordu.',
            'Yukarı çıktıklarında güneş gözlerini kamaştırdı. Defne, gün ışığının ne kadar değerli olduğunu ilk kez bu kadar açık hissediyordu. Karanlıkta yaşamak hiç kolay olmamalıydı. Öte yandan, kayayı kat kat oyan, havayı, yiyeceği ve güvenliği önceden düşünen insanların aklına da hayran kalmıştı. “Bu şehri kazan insanlar çok çalışkan ve akıllıymış,” dedi. Kaan da başını salladı; ikisi de ayaklarının altındaki sessiz şehri düşünerek yürüdüler.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Aşağıdakilerden hangisi yeraltı şehrinin önceden düşünülerek yapıldığını en iyi gösterir?',
              options: [
                'Merdivenlerin dar olması',
                'Havanın aşağı indikçe serinlemesi',
                'Temiz hava bacaları, ambarlar ve taş kapılar bulunması',
                'Şehrin bir bölümünün bugün gezilebilmesi',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta insanların önceden neleri düşündüğü yazıyor.',
              explanation:
                'Aferin! Bacalar havayı, ambarlar yiyeceği, taş kapılar güvenliği sağlıyordu.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…karanlığın içinde unutulmuş bir yıldız gibi küçük bir ışık görünüyordu.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Karanlıkta küçücük görünen ışığın dikkat çekici olduğu',
                'Defne’nin gökyüzünde yıldız gördüğü',
                'Bacanın ucunda bir lamba unutulduğu',
                'Gecenin çoktan bastırdığı',
              ],
              correctIndex: 0,
              hint: 'İpucu: Bir benzetme var. O sırada gündüz mü, gece mi? Birinci paragrafı hatırla.',
              explanation:
                'Çok güzel! Baca ucundaki ışık, karanlıkta bir yıldız gibi küçük ve parlak görünüyordu.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Rehberin anlattıklarına göre havalandırma bacaları tıkansaydı ne olurdu?',
              options: [
                'Taş kapılar kendiliğinden açılırdı.',
                'Ambarlardaki yiyecekler çoğalırdı.',
                'Odalar daha aydınlık olurdu.',
                'Aşağıdakiler için temiz hava bulmak güçleşirdi.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dördüncü paragrafta bacaların ne işe yaradığını oku.',
              explanation:
                'Harika! Temiz hava bu bacalardan indiği için tıkanmaları büyük sorun olurdu.',
            },
          ],
          glossary: [
            { word: 'olağan', meaning: 'Her zamanki gibi, alışılmış.' },
            { word: 'belirginleşiyordu', meaning: 'Daha açık, daha kolay fark edilir oluyordu.' },
            { word: 'sığınırmış', meaning: 'Korunmak için güvenli bir yere girermiş.' },
            { word: 'havalandırma', meaning: 'Bir yere temiz hava girmesini sağlama.' },
          ],
        },
      },
    }),
    story(city, {
      position: 4,
      slug: 'avanosta-comlek',
      theme: TextTheme.SABIR,
      title: 'Avanos’ta Çömlek',
      summary:
        'Mert’in Avanos’ta Kızılırmak’ın kırmızı çamuruyla, birkaç denemeden sonra ilk kâsesini yaptığı gün.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Mert, ailesiyle Kızılırmak kıyısındaki Avanos’a geldi. Kasabanın sokaklarında çömlekçi dükkânları sıralanıyordu. Vitrinlerde testiler, tabaklar ve vazolar parlıyordu.',
        'Bir atölyeye girdiler. Yaşlı bir usta, ayağıyla bir tahta çarkı döndürüyordu. Çarkın ortasındaki kırmızı çamur, ustanın ellerinde bir anda bir testiye dönüştü. Mert hayranlıkla izledi.',
        'Usta, “Bu kırmızı toprağı Kızılırmak’tan alırız. Burada çömlekçilik yüzyıllardır babadan oğula geçer,” dedi. Sonra Mert’e döndü: “Sen de denemek ister misin?”',
        'Mert çarkın başına oturdu. Çamuru ıslak elleriyle sarmaya çalıştı ama çamur bir yana kaydı ve yamuldu. İkinci denemede de testisi çöktü. Mert’in yüzü asıldı.',
        'Usta gülümsedi. “Ben ilk testimi yapana kadar yüz kere bozdum. Ellerin çamuru tanısın, acele etme,” dedi. Mert derin bir nefes aldı ve yavaşça yeniden başladı. Bu sefer küçük, biraz eğri ama sağlam bir kâse ortaya çıktı.',
        'Kâseyi fırında pişirmek için atölyede bıraktılar. Mert ertesi gün kâsesini aldığında çok gururluydu. Onu annesine hediye etti.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Avanos’taki çömlekçiler kırmızı toprağı nereden alıyordu?',
          options: ['Kızılırmak’tan', 'Denizden', 'Dağın tepesinden'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta ustanın söylediklerini oku.',
          explanation: 'Doğru! Kırmızı toprak Kızılırmak’tan alınıyordu.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Mert’in çamuru “yamuldu.” Bu ne demek?',
          options: ['Çok güzel bir şekil aldı', 'Şekli bozulup eğri oldu', 'Sertleşip taşa döndü'],
          correctIndex: 1,
          hint: 'İpucu: Çamur bir yana kaydıktan sonra nasıl görünmüş olabilir?',
          explanation: 'Aferin! Yamulmak, şeklin bozulup eğri olması demektir.',
        },
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Usta Mert’e ne öğütledi?',
          options: [
            'Hemen pes etmesini',
            'Çamuru atıp eve gitmesini',
            'Acele etmeden yeniden denemesini',
          ],
          correctIndex: 2,
          hint: 'İpucu: Beşinci paragrafta ustanın söylediklerini oku.',
          explanation: 'Harika! Usta olmak sabır ister; her deneme bizi biraz daha geliştirir.',
        },
      ],
      glossary: [
        { word: 'atölyeye', meaning: 'Bir şeylerin elle yapıldığı iş yerine.' },
        { word: 'çarkı', meaning: 'Kendi etrafında dönen yuvarlak tablayı.' },
        { word: 'yamuldu', meaning: 'Şekli bozulup eğri oldu.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Mert, Avanos’a geldi. Avanos, Kızılırmak kıyısında bir kasabaydı. Sokaklarda çömlekçi dükkânları vardı.',
            'Bir atölyeye girdiler. Yaşlı bir usta, ayağıyla tahta bir çark döndürüyordu. Kırmızı çamur bir anda testi oldu. Mert çok beğendi.',
            '“Bu toprağı Kızılırmak’tan alırız,” dedi usta. “Sen de denemek ister misin?”',
            'Mert çarkın başına oturdu. Çamur bir yana kaydı ve yamuldu. İkinci deneme de olmadı. Mert’in yüzü asıldı.',
            '“Ben de çok bozdum. Acele etme,” dedi usta. Mert yavaşça yeniden başladı. Bu kez küçük bir kâse yaptı. Kâse biraz eğriydi ama sağlamdı. Kâse fırında pişti. Ertesi gün Mert onu annesine verdi.',
          ],
          questions: [
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Çamur yamuldu.” Bu ne demek?',
              options: ['Çamur sertleşti', 'Çamurun şekli bozuldu', 'Çamur çok güzel oldu'],
              correctIndex: 1,
              hint: 'İpucu: Çamur bir yana kayınca nasıl görünür?',
              explanation: 'Aferin! Yamulmak, şeklin bozulup eğri olmasıdır.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Mert kâseyi nasıl yapabildi?',
              options: [
                'Yavaşça yeniden başlayınca',
                'Ustası onun yerine yapınca',
                'Çamuru fırına atınca',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafta ustanın sözünden sonra Mert’in ne yaptığını oku.',
              explanation: 'Doğru! Mert acele etmedi ve küçük bir kâse yaptı.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'İkinci deneme olmayınca Mert nasıl hissetti?',
              options: ['Çok sevindi', 'Uykusu geldi', 'Üzüldü'],
              correctIndex: 2,
              hint: 'İpucu: Dördüncü paragrafın son cümlesine bak.',
              explanation: 'Harika! Yüzü asılan Mert üzülmüştü ama sonra yeniden denedi.',
            },
          ],
          glossary: [
            { word: 'çömlekçi', meaning: 'Çamurdan kap yapan kişi.' },
            { word: 'testi', meaning: 'Su koymaya yarayan, toprak kap.' },
            { word: 'çark', meaning: 'Kendi etrafında dönen yuvarlak tabla.' },
            { word: 'kâse', meaning: 'Çorba gibi şeyler konan derin kap.' },
          ],
        },
        G3: {
          paragraphs: [
            'Mert, ailesiyle Kızılırmak kıyısındaki Avanos’a geldi. Kasabanın sokaklarında çömlekçi dükkânları sıralanıyordu. Vitrinlerde testiler, tabaklar ve vazolar parlıyordu. Mert bunların makinede yapıldığını sanıyordu, çünkü hepsi çok düzgün görünüyordu.',
            'Bir atölyeye girdiler. Yaşlı bir usta, ayağıyla bir tahta çarkı döndürüyordu. Çarkın ortasındaki kırmızı çamur, ustanın ellerinde bir anda bir testiye dönüştü. Mert hayranlıkla izledi; iş ona çok kolay görünmüştü.',
            'Usta, “Bu kırmızı toprağı Kızılırmak’tan alırız. Burada çömlekçilik yüzyıllardır babadan oğula geçer,” dedi. Sonra Mert’e döndü: “Sen de denemek ister misin?” Mert hemen kollarını sıvadı.',
            'Mert çarkın başına oturdu. Çamuru ıslak elleriyle sarmaya çalıştı ama çamur bir yana kaydı ve yamuldu. İkinci denemede de testisi çöktü. Mert’in yüzü asıldı; uzaktan kolay görünen iş, yakından hiç de kolay değildi.',
            'Usta gülümsedi. “Ben ilk testimi yapana kadar yüz kere bozdum. Ellerin çamuru tanısın, acele etme,” dedi. Mert derin bir nefes aldı ve yavaşça yeniden başladı. Bu sefer küçük, biraz eğri ama sağlam bir kâse ortaya çıktı.',
            'Kâseyi fırında pişirmek için atölyede bıraktılar. Mert ertesi gün kâsesini aldığında çok gururluydu. Vitrinlerdeki düzgün kaplar kadar güzel değildi belki ama onu kendi elleriyle yapmıştı. Kâseyi annesine hediye etti.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'Çömlekçilik yalnızca babadan oğula öğretilmelidir.',
                'El yapımı kaplar her zaman çok düzgündür.',
                'Bir işi öğrenmek sabır ve deneme ister.',
                'Kolay görünen işler gerçekten kolaydır.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Mert’in kâseyi hangi denemede, nasıl yaptığını düşün.',
              explanation: 'Aferin! Mert bozdukça öğrendi ve sonunda sabırla kâsesini yaptı.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Ellerin çamuru tanısın, acele etme.” sözüyle usta ne demek istiyor?',
              options: [
                'Deneye deneye çamura alışmak gerektiğini',
                'Çamurla çalışmadan önce ellerin yıkanması gerektiğini',
                'Mert’in işi bırakması gerektiğini',
                'Çamurun bir adının olduğunu',
              ],
              correctIndex: 0,
              hint: 'İpucu: Ustanın aynı konuşmada kendi bozduğu testiler için söylediklerini oku.',
              explanation:
                'Çok güzel! Usta, ellerin çamura zamanla ve deneyerek alışacağını anlatıyor.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Mert başta bu işi neden kolay sanmış olabilir?',
              options: [
                'Daha önce çok testi yaptığı için',
                'Annesi ona öyle söylediği için',
                'Çarkın çok küçük olduğunu gördüğü için',
                'Usta çamuru bir anda testiye dönüştürdüğü için',
              ],
              correctIndex: 3,
              hint: 'İpucu: İkinci paragrafta Mert’in ustayı izlerken ne gördüğüne bak.',
              explanation: 'Harika! Ustanın hızı, Mert’e bu işin kolay olduğunu düşündürmüştü.',
            },
          ],
          glossary: [
            { word: 'atölyeye', meaning: 'Bir şeylerin elle yapıldığı iş yerine.' },
            { word: 'çarkı', meaning: 'Kendi etrafında dönen yuvarlak tablayı.' },
            { word: 'yamuldu', meaning: 'Şekli bozulup eğri oldu.' },
          ],
        },
        G4: {
          paragraphs: [
            'Mert, ailesiyle Kızılırmak kıyısındaki Avanos’a geldi. Kasabanın sokaklarında çömlekçi dükkânları sıra sıra dizilmişti; vitrinlerde testiler, tabaklar ve vazolar güneşin altında parlıyordu. Bunca düzgün kabı gören Mert, hepsinin bir makineden çıktığını sandı. Oysa az sonra, bu kapların ardında bambaşka bir emek olduğunu öğrenecekti.',
            'Bir atölyeye girdiler; içerisi nemli toprak kokuyordu. Yaşlı bir usta, ayağıyla bir tahta çarkı döndürüyor, gözünü elinden ayırmıyordu. Çarkın ortasındaki kırmızı çamur, ustanın parmakları arasında canlanmışçasına yükseldi ve bir anda testiye dönüştü. Mert hayranlıkla izledi; iş, uzaktan bakınca bir oyun kadar kolay görünüyordu.',
            'Usta, “Bu kırmızı toprağı Kızılırmak’tan alırız, ırmak da adını bu kızıl renkten alır. Burada çömlekçilik yüzyıllardır babadan oğula geçer,” dedi. Sonra Mert’e döndü: “Sen de denemek ister misin?”',
            'Mert kollarını sıvayıp çarkın başına oturdu. Çamuru ıslak elleriyle sarmaya çalıştı ama çamur inatçı bir kedi gibi elinden kaçtı, bir yana kaydı ve yamuldu. İkinci denemede testisi, daha boyu yükselmeden çöktü. Mert’in yüzü asıldı ve ustanın hareketlerindeki kolaylığın aslında yılların birikimi olduğunu o an anladı.',
            'Usta gülümsedi. “Ben ilk testimi yapana kadar yüz kere bozdum. Ellerin çamuru tanısın, acele etme,” dedi. Bu sözler, Mert’in içindeki hayal kırıklığını yavaş yavaş yatıştırdı. Mert derin bir nefes aldı ve bu kez çamura söz geçirmeye değil, onu dinlemeye çalıştı. Çark yavaşça döndü, parmakları ağır ağır yükseldi ve sonunda küçük, biraz eğri ama sağlam bir kâse ortaya çıktı.',
            'Kâseyi fırında pişirmek için atölyede bıraktılar ve Mert ertesi gün kâsesini aldığında çok gururluydu. Vitrinlerdeki kaplar kadar kusursuz değildi; yine de hiçbirinde onun parmak izleri yoktu. Kâseyi annesine hediye ederken ondaki eğriliği bile sevdiğini fark etti, çünkü o eğrilik, öğrenmenin izini taşıyordu.',
          ],
          questions: [
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin başlığı değiştirilecek olsa en uygunu hangisi olurdu?',
              options: [
                'Vitrinlerdeki Vazolar',
                'Sabırla Yoğrulan Kâse',
                'Kızılırmak’ın Uzunluğu',
                'Ustanın Yeni Makinesi',
              ],
              correctIndex: 1,
              hint: 'İpucu: Metnin asıl anlattığı olay, Mert’in neyi nasıl yaptığıdır.',
              explanation:
                'Aferin! Metin, Mert’in denemeler ve sabırla ilk kâsesini yapışını anlatıyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…çamura söz geçirmeye değil, onu dinlemeye çalıştı.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Mert’in çamurla konuşmaya başladığı',
                'Atölyede çok gürültü olduğu',
                'Ustanın Mert’e bağırdığı',
                'Mert’in zorlamadan, çamurun hareketine dikkat ederek çalıştığı',
              ],
              correctIndex: 3,
              hint: 'İpucu: Hemen sonraki cümlede çarkın ve parmaklarının nasıl hareket ettiğine bak.',
              explanation: 'Çok güzel! Mert çamuru zorlamayı bırakıp ona uyumla, yavaşça çalıştı.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Birinci paragrafın son cümlesinin metindeki görevi nedir?',
              options: [
                'Okuru sonra anlatılacak olaylara hazırlamak',
                'Kasabanın nerede olduğunu bildirmek',
                'Hikâyenin sonucunu özetlemek',
                'Vitrindeki kapları tek tek tanıtmak',
              ],
              correctIndex: 0,
              hint: 'İpucu: “Oysa az sonra” sözü okuru nereye yöneltiyor?',
              explanation:
                'Harika! Bu cümle, atölyede öğrenilecekleri merak ettirerek okuru hazırlıyor.',
            },
          ],
          glossary: [
            { word: 'canlanmışçasına', meaning: 'Sanki canlanmış gibi.' },
            { word: 'birikimi', meaning: 'Zamanla toplanan bilgi ve deneyimi.' },
            { word: 'kusursuz', meaning: 'Hiçbir hatası olmayan.' },
          ],
        },
      },
    }),
    chest(
      city,
      5,
      'Peri bacalarının arasında bir sandık parlıyor; aç bakalım, içinden kaç lokum çıkacak?',
    ),
    story(city, {
      position: 6,
      slug: 'guvercinlerin-evleri',
      theme: TextTheme.DOGA,
      title: 'Güvercinlerin Evleri',
      summary:
        'Zeynep’in Güvercinlik Vadisi’nde kayalara oyulmuş güvercin evlerinin ne işe yaradığını öğrendiği yürüyüş.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Zeynep, dedesiyle Güvercinlik Vadisi’nde yürüyüşe çıktı. Vadinin iki yanındaki kayalarda sıra sıra küçük delikler vardı. Deliklerin bazılarının çevresi beyaza ve kırmızıya boyanmıştı.',
        '“Dede, bu delikleri kim açmış?” diye sordu Zeynep. Dedesi bir taşa oturdu ve anlatmaya başladı: “Eskiden buradaki insanlar kayaları oyup güvercinler için evler yaparmış. Bunlara güvercinlik denir.”',
        'Zeynep merak etti. “Neden güvercinlere ev yapmışlar?” Dedesi güldü. “Çünkü güvercinlerin pisliği çok değerli bir gübreymiş. İnsanlar onu toplayıp üzüm bağlarına serperlermiş. Böylece üzümler daha bereketli olurmuş.”',
        'Tam o sırada bir güvercin sürüsü kanat çırparak deliklerden birine girdi. Zeynep onları sessizce izledi. Bu kuşların dedeleri de belki yüzyıllar önce aynı kayalarda yaşamıştı.',
        'Akşam evde babaannesi ona bir kaşık üzüm pekmezi verdi. Zeynep tadına baktı ve gülümsedi. “Bunu yapmaya güvercinler de yardım etmiş olabilir!” dedi. Dedesi kahkahalarla güldü.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Kayalardaki küçük delikler ne için açılmıştı?',
          options: [
            'Güvercinlere ev olsun diye',
            'İçeri rüzgâr girsin diye',
            'Çocuklar saklansın diye',
          ],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta dedesinin anlattıklarını oku.',
          explanation: 'Doğru! İnsanlar kayaları oyup güvercinlere ev yapmış.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'İnsanlar güvercinlik yaparak nasıl bir fayda sağlamış?',
          options: [
            'Güvercinleri satıp zengin olmuşlar',
            'Güvercin gübresiyle üzümleri daha bereketli yapmışlar',
            'Kayaları renkli boyalarla süslemişler',
          ],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta güvercinlerin neden değerli olduğu anlatılıyor.',
          explanation: 'Aferin! Güvercin gübresi üzüm bağlarını besliyor, üzümler bol oluyordu.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Zeynep pekmezi tadınca neden gülümsedi?',
          options: [
            'Pekmez çok acı olduğu için',
            'Babaannesi ona şaka yaptığı için',
            'Güvercinlerin de pekmeze yardım etmiş olabileceğini düşündüğü için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Zeynep’in son paragrafta söylediği söze bak.',
          explanation:
            'Harika! Zeynep öğrendiklerini birleştirip pekmezle güvercinler arasında bağ kurdu.',
        },
      ],
      glossary: [
        { word: 'gübreymiş', meaning: 'Toprağı besleyip bitkileri büyüten bir maddeymiş.' },
        { word: 'bereketli', meaning: 'Bol ürün veren, verimli.' },
        {
          word: 'pekmezi',
          meaning: 'Üzüm suyunun kaynatılıp koyulaştırılmasıyla yapılan tatlı.',
        },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Zeynep, dedesiyle Güvercinlik Vadisi’ne gitti. Kayalarda küçük delikler vardı. Bazıları beyaz ve kırmızı boyalıydı.',
            '“Bu delikleri kim açmış?” diye sordu Zeynep. “Eskiden insanlar açmış,” dedi dedesi. “Güvercinlere ev yapmışlar.”',
            '“Neden ev yapmışlar?” dedi Zeynep. “Güvercin pisliği çok iyi bir gübreymiş. İnsanlar onu üzüm bağlarına serpermiş. Üzümler bol olurmuş.”',
            'O sırada güvercinler geldi. Kanat çırparak deliğe girdiler. Zeynep onları izledi.',
            'Akşam babaannesi ona pekmez verdi. Zeynep tadına baktı. “Güvercinler de yardım etmiş!” dedi. Dedesi çok güldü.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Kayalardaki delikler kimin eviydi?',
              options: ['Tavşanların', 'Kedilerin', 'Güvercinlerin'],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafta dedesinin sözünü oku.',
              explanation: 'Doğru! İnsanlar kayaları oyup güvercinlere ev yapmış.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Üzümler neden bol olurmuş?',
              options: [
                'Bağlara gübre serpildiği için',
                'Güvercinler üzüm yemediği için',
                'Kayalar boyandığı için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta dedesinin anlattıklarını oku.',
              explanation: 'Aferin! Güvercin pisliği üzüm bağlarını besleyen iyi bir gübreymiş.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Dedesi sonunda neden güldü?',
              options: [
                'Pekmez çok acı olduğu için',
                'Zeynep’in sözü ona komik geldiği için',
                'Güvercinler kaçtığı için',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafta Zeynep’in ne dediğine bak.',
              explanation:
                'Harika! Zeynep’in güvercinlerle pekmez arasında bağ kurması dedesini güldürdü.',
            },
          ],
          glossary: [
            { word: 'Vadisi’ne', meaning: 'İki dağ ya da yamaç arasındaki çukur yere.' },
            { word: 'gübreymiş', meaning: 'Toprağı besleyip bitkileri büyüten bir maddeymiş.' },
            { word: 'pekmez', meaning: 'Üzüm suyunun kaynatılmasıyla yapılan tatlı.' },
          ],
        },
        G3: {
          paragraphs: [
            'Zeynep, dedesiyle Güvercinlik Vadisi’nde yürüyüşe çıktı. Vadinin iki yanındaki kayalarda sıra sıra küçük delikler vardı. Deliklerin bazılarının çevresi beyaza ve kırmızıya boyanmıştı. Zeynep bu delikleri önce pencere sandı, ama bir insanın sığamayacağı kadar küçüklerdi.',
            '“Dede, bu delikleri kim açmış?” diye sordu Zeynep. Dedesi bir taşa oturdu ve anlatmaya başladı: “Eskiden buradaki insanlar kayaları oyup güvercinler için evler yaparmış. Bunlara güvercinlik denir.” Zeynep kuşların da ev sahibi olabileceğini hiç düşünmemişti.',
            'Zeynep merak etti. “Neden güvercinlere ev yapmışlar?” Dedesi güldü. “Çünkü güvercinlerin pisliği çok değerli bir gübreymiş. İnsanlar onu toplayıp üzüm bağlarına serperlermiş. Böylece üzümler daha bereketli olurmuş.” Zeynep burnunu kırıştırdı; pislik gibi bir şeyin değerli olabileceği hiç aklına gelmemişti.',
            'Tam o sırada bir güvercin sürüsü kanat çırparak deliklerden birine girdi. Zeynep onları sessizce izledi. Bu kuşların dedeleri de belki yüzyıllar önce aynı kayalarda yaşamıştı. Belki onlar da aynı vadinin üzerinde uçmuş, aynı üzüm bağlarını görmüştü. Zeynep, vadiden dönerken de bu kuşları düşünmeyi sürdürdü.',
            'Akşam evde babaannesi ona bir kaşık üzüm pekmezi verdi. Zeynep tadına baktı ve gülümsedi. “Bunu yapmaya güvercinler de yardım etmiş olabilir!” dedi. Dedesi kahkahalarla güldü. Zeynep, bir kaşık pekmezin arkasında koca bir vadinin hikâyesi olduğunu öğrenmişti.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Zeynep dedesinin anlattıklarını duyunca neden burnunu kırıştırdı?',
              options: [
                'Burnu üşüdüğü için',
                'Üzümleri sevmediği için',
                'Güvercinleri görmek istemediği için',
                'Pislik gibi bir şeyin değerli sayılması ona tuhaf geldiği için',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü paragrafın son cümlesini oku.',
              explanation: 'Aferin! Zeynep, pisliğin değerli olabileceğini hiç düşünmemişti.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinden çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'Güvercinler yalnızca kayalarda yaşayabilir.',
                'İnsanlar doğadaki canlılarla birlikte yaşamanın yollarını bulabilir.',
                'Üzüm yetiştirmek için gübre gerekmez.',
                'Eski zamanlarda hiç pekmez yapılmazdı.',
              ],
              correctIndex: 1,
              hint: 'İpucu: İnsanlar güvercinlere ne vermiş, onlardan ne almış?',
              explanation:
                'Çok güzel! İnsanlar güvercinlere ev yapmış, onlardan da bağları için gübre almış.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Böylece üzümler daha bereketli olurmuş.” cümlesindeki “bereketli” ne anlama gelir?',
              options: ['Bol ürün veren', 'Küçük ve ekşi', 'Çabuk çürüyen', 'Rengi koyu olan'],
              correctIndex: 0,
              hint: 'İpucu: Gübre serpilen bağlarda üzüm az mı olur, çok mu?',
              explanation: 'Harika! Bereketli, bol ürün veren demektir.',
            },
          ],
          glossary: [
            { word: 'güvercinlik', meaning: 'Güvercinler için yapılan yuva.' },
            { word: 'gübreymiş', meaning: 'Toprağı besleyip bitkileri büyüten bir maddeymiş.' },
            { word: 'bereketli', meaning: 'Bol ürün veren, verimli.' },
            {
              word: 'pekmezi',
              meaning: 'Üzüm suyunun kaynatılıp koyulaştırılmasıyla yapılan tatlı.',
            },
          ],
        },
        G4: {
          paragraphs: [
            'Zeynep, dedesiyle Güvercinlik Vadisi’nde yürüyüşe çıktı. Sabahın serinliğinde patika, üzüm bağlarının arasından kıvrılarak vadinin içine iniyordu. Rüzgâr, bağların arasından olgun üzüm kokusu getiriyordu. Vadinin iki yanındaki kayalarda, sayısız göz gibi sıra sıra küçük delikler vardı. Deliklerin bazılarının çevresi beyaza ve kırmızıya boyanmıştı. Zeynep önce bunların pencere olduğunu düşündü; fakat hiçbir insanın sığamayacağı kadar küçüklerdi.',
            '“Dede, bu delikleri kim açmış?” diye sordu Zeynep. Dedesi bir taşa oturup anlatmaya başladı: “Eskiden buradaki insanlar kayaları oyup güvercinler için evler yaparmış. Bunlara güvercinlik denir.” Zeynep, bu bilgiyi aklına yazmak ister gibi gözlerini yeniden kayalara dikti.',
            'Zeynep merak etti. “Neden güvercinlere ev yapmışlar?” Dedesi güldü. “Çünkü güvercinlerin pisliği çok değerli bir gübreymiş; insanlar onu toplayıp üzüm bağlarına serperlermiş. Böylece üzümler daha bereketli olurmuş.” Zeynep burnunu kırıştırdı, çünkü tiksindiği bir şeyin bir zamanlar bu kadar değerli sayılması ona tuhaf geliyordu. Demek ki bir şeyin değeri, ona nasıl bakıldığına göre değişebiliyordu.',
            'Tam o sırada bir güvercin sürüsü, kanatlarının sesiyle vadinin sessizliğini bozarak deliklerden birine girdi; Zeynep onları sessizce izledi. Bu kuşların dedeleri de belki yüzyıllar önce aynı kayalarda yaşamıştı. İnsanla kuş arasındaki bu eski anlaşma, hiçbir yere yazılmamış ama kayalara işlenmişti: Kuş yuva buluyor, insan da bağını besliyordu. Bu sessiz düzenin yüzyıllarca sürmesi, Zeynep’e hem şaşırtıcı hem de güzel geldi.',
            'Akşam evde babaannesi ona bir kaşık üzüm pekmezi verdi, Zeynep de tadına baktı ve gülümsedi. “Bunu yapmaya güvercinler de yardım etmiş olabilir!” dedi. Dedesi kahkahalarla güldü. Zeynep kaşığa baktı: Bir kaşık pekmezin arkasında güneş, toprak, kuşlar ve yüzyıllardır süren bir emek vardı. Sofradaki en küçük tadın bile bir geçmişi olduğunu o akşam anladı.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Güvercinler insanlardan uzak yaşamalıdır.',
                'Üzüm bağları yalnızca vadilerde yetişir.',
                'Sıradan görünen şeylerin ardında doğayla kurulan uzun bir emek bağı olabilir.',
                'Bugün gübreye hiç ihtiyaç kalmamıştır.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta Zeynep’in kaşığa bakarken düşündüklerini oku.',
              explanation:
                'Aferin! Bir kaşık pekmezin arkasında güneş, toprak, kuşlar ve emek vardı.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Güvercin pisliği üzüm bağlarında kullanılırdı. II. Zeynep delikleri önce pencere sandı. III. Deliklerin hepsinin çevresi boyalıydı.',
              options: ['Yalnız I', 'I ve II', 'II ve III', 'I, II ve III'],
              correctIndex: 1,
              hint: 'İpucu: Her yargıyı tek tek ele al; birinci paragrafta boyalı delikler için söylenenlere dikkat et.',
              explanation:
                'Harika! Yalnızca bazı deliklerin çevresi boyalıydı, bu yüzden III. yargı yanlıştır.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“İnsanla kuş arasındaki bu eski anlaşma” sözüyle anlatılan nedir?',
              options: [
                'İki tarafın da yarar gördüğü bir ilişki',
                'Kayalara yazılmış gerçek bir sözleşme',
                'Kuşların insanlardan korkması',
                'İnsanların kuşları evde beslemesi',
              ],
              correctIndex: 0,
              hint: 'İpucu: Aynı cümlenin iki noktadan sonraki bölümünü oku.',
              explanation:
                'Çok güzel! Kuş yuva buluyor, insan da bağını besliyordu; ikisi de kazançlıydı.',
            },
          ],
          glossary: [
            { word: 'patika', meaning: 'Yürüyerek açılmış dar yol.' },
            { word: 'gübreymiş', meaning: 'Toprağı besleyip bitkileri büyüten bir maddeymiş.' },
            { word: 'bereketli', meaning: 'Bol ürün veren, verimli.' },
            { word: 'tiksindiği', meaning: 'Çok iğrendiği.' },
          ],
        },
      },
    }),
    story(city, {
      position: 7,
      slug: 'gokyuzundeki-haritalar',
      theme: TextTheme.KESIF,
      title: 'Gökyüzündeki Haritalar',
      summary:
        'Pusula ve uydu yokken insanların yıldızlara bakarak yollarını nasıl bulduğunu anlatan hikâye.',
      level: ReadingLevel.ILERI,
      paragraphs: [
        'Pusulanın ve uyduların olmadığı zamanlarda insanlar yönlerini nasıl bulurdu? Cevap, başımızın üstünde parıldıyordu: yıldızlar.',
        'Eski denizciler geceleri gökyüzünü dikkatle incelerdi. Kuzey Yıldızı, gökyüzünde neredeyse hiç yer değiştirmediği için onlara kuzeyi gösterirdi.',
        'Yıldızların bir araya gelerek oluşturduğu şekillere takımyıldız denir. Büyük Ayı takımyıldızındaki parlak yedi yıldız, bir kepçeye benzer. Kepçenin ucundaki iki yıldızdan çizilen hayalî bir çizgi, Kuzey Yıldızı’na ulaşır.',
        'Gezginler yalnızca yön bulmak için değil, mevsimleri anlamak için de yıldızlardan yararlanırdı. Bazı yıldızların gökyüzünde görünmeye başlaması, ekim ya da hasat zamanının yaklaştığını haber verirdi.',
        'Bugün telefonlarımızdaki haritalar işimizi kolaylaştırıyor. Yine de açık bir gecede gökyüzüne baktığında, binlerce yıl önce insanlara yol gösteren aynı yıldızları gördüğünü unutma.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Eski denizciler kuzeyi hangi yıldızla bulurdu?',
          options: ['Çoban Yıldızı', 'Kuzey Yıldızı', 'Akşam Yıldızı'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta neredeyse hiç yer değiştirmeyen yıldızın adı geçiyor.',
          explanation:
            'Doğru! Kuzey Yıldızı yer değiştirmediği için denizcilere kuzeyi gösterirdi.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Hikâyenin sonunda bize ne hatırlatılıyor?',
          options: [
            'Telefonsuz hiç yola çıkmamamız gerektiği',
            'Bugün gördüğümüz yıldızların binlerce yıl önce de insanlara yol gösterdiği',
            'Yıldızların her gece yer değiştirdiği',
          ],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafın son cümlesini dikkatle oku.',
          explanation:
            'Harika! Gökyüzüne bakınca, binlerce yıl önceki insanlarla aynı yıldızları görürüz.',
        },
      ],
      glossary: [
        { word: 'Pusulanın', meaning: 'İğnesi hep kuzeyi gösteren, yön bulmaya yarayan aletin.' },
        { word: 'takımyıldız', meaning: 'Gökyüzünde bir şekle benzeyen yıldız topluluğu.' },
        { word: 'hasat', meaning: 'Olgunlaşan ürünlerin tarladan toplanması.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Eskiden pusula yoktu. Uydu da yoktu. İnsanlar yolu nasıl bulurdu? Cevap gökyüzündeydi. Yıldızlara bakarlardı!',
            'Eski denizciler geceleri yıldızları izlerdi. Kuzey Yıldızı neredeyse hiç yer değiştirmez. Bu yıldız onlara kuzeyi gösterirdi.',
            'Bazı yıldızlar bir şekle benzer. Büyük Ayı’da yedi parlak yıldız vardır. Bu yıldızlar bir kepçeye benzer. Kepçenin ucu Kuzey Yıldızı’na doğru bakar.',
            'Yıldızlar başka haberler de verirdi. Bazı yıldızlar görünmeye başlardı. O zaman insanlar anlardı: Ekim zamanı geliyor!',
            'Bugün telefonlarda harita var. Yine de gece gökyüzüne bak. Aynı yıldızları sen de görürsün.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Büyük Ayı’daki yedi yıldız neye benzer?',
              options: ['Bir gemiye', 'Bir kepçeye', 'Bir kuşa'],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafı oku.',
              explanation: 'Doğru! Bu yedi parlak yıldız bir kepçeye benzer.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Ekim zamanı geliyor!” Burada “ekim” ne demek?',
              options: ['Tohumu toprağa atmak', 'Denize açılmak', 'Yıldız saymak'],
              correctIndex: 0,
              hint: 'İpucu: Bu haberi en çok tarlası olanlar beklerdi.',
              explanation: 'Aferin! Ekim, tohumu toprağa atma işidir.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Denizciler neden Kuzey Yıldızı’na bakardı?',
              options: [
                'En büyük yıldız olduğu için',
                'Yağmuru haber verdiği için',
                'Kuzeyi gösterdiği için',
              ],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafın son cümlesine bak.',
              explanation:
                'Harika! Kuzey Yıldızı neredeyse hiç yer değiştirmez ve kuzeyi gösterir.',
            },
          ],
          glossary: [
            { word: 'pusula', meaning: 'İğnesi hep kuzeyi gösteren, yön bulmaya yarayan alet.' },
            { word: 'Uydu', meaning: 'Dünya’nın çevresinde dönen ve bilgi gönderen araç.' },
            { word: 'kepçeye', meaning: 'Sapı uzun, derin bir kaşığa.' },
          ],
        },
        G3: {
          paragraphs: [
            'Pusulanın ve uyduların olmadığı zamanlarda insanlar yönlerini nasıl bulurdu? Denizin ortasında ya da uçsuz bucaksız bir çölde ne bir yol ne de bir tabela vardır. Yine de insanlar uzak yolculuklara çıkmaktan vazgeçmemişti. Cevap, başımızın üstünde parıldıyordu: yıldızlar.',
            'Eski denizciler geceleri gökyüzünü dikkatle incelerdi. Kuzey Yıldızı, gökyüzünde neredeyse hiç yer değiştirmediği için onlara kuzeyi gösterirdi. Kuzeyi bulan bir denizci, gitmek istediği yönü de kolayca hesaplayabilirdi. Ancak bunun için havanın açık olması ve yıldızların görünmesi gerekirdi.',
            'Yıldızların bir araya gelerek oluşturduğu şekillere takımyıldız denir. Büyük Ayı takımyıldızındaki parlak yedi yıldız, bir kepçeye benzer. Kepçenin ucundaki iki yıldızdan çizilen hayalî bir çizgi, Kuzey Yıldızı’na ulaşır. Bu yüzden Kuzey Yıldızı’nı bulmak isteyenler önce kepçeyi arar.',
            'Gezginler yalnızca yön bulmak için değil, mevsimleri anlamak için de yıldızlardan yararlanırdı. Bazı yıldızların gökyüzünde görünmeye başlaması, ekim ya da hasat zamanının yaklaştığını haber verirdi. Gökyüzü böylece hem bir harita hem de bir takvim oluyordu.',
            'Bugün telefonlarımızdaki haritalar işimizi kolaylaştırıyor. Bir düğmeye basmak yetiyor ve yolumuzu bir anda görüyoruz. Bu kolaylık sayesinde yıldızlara bakmayı neredeyse unuttuk. Yine de açık bir gecede gökyüzüne baktığında, binlerce yıl önce insanlara yol gösteren aynı yıldızları gördüğünü unutma.',
          ],
          questions: [
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Gökyüzü böylece hem bir harita hem de bir takvim oluyordu.” cümlesi ne anlatıyor?',
              options: [
                'Eskiden haritaların gökyüzüne çizildiğini',
                'Takvimlerin yıldızlardan önce bulunduğunu',
                'Gökyüzünün her gün aynı göründüğünü',
                'Yıldızların hem yönü hem de zamanı gösterdiğini',
              ],
              correctIndex: 3,
              hint: 'İpucu: Metinde yıldızların hangi iki işe yaradığını bul.',
              explanation:
                'Aferin! Yıldızlar insanlara hem yönlerini hem de mevsimleri gösteriyordu.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Kuzey Yıldızı’nı bulmak isteyenler neden önce kepçeyi arar?',
              options: [
                'Kepçenin ucundaki iki yıldızdan çizilen çizgi ona ulaştığı için',
                'Kepçe bütün yıldızlardan daha sıcak olduğu için',
                'Kuzey Yıldızı kepçenin tam ortasında durduğu için',
                'Kepçe yalnızca kuzey denizlerinde göründüğü için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta hayalî çizginin nereye ulaştığını oku.',
              explanation:
                'Çok güzel! Kepçe, Kuzey Yıldızı’na giden yolu gösteren bir işaret gibidir.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin başlığı değiştirilecek olsa en uygunu hangisi olurdu?',
              options: [
                'Denizcilerin Yemekleri',
                'Yıldızlarla Yön ve Zaman Bulmak',
                'Telefonların Tarihi',
                'Çöldeki Tabelalar',
              ],
              correctIndex: 1,
              hint: 'İpucu: Metnin bütün paragraflarında ortak olan konuyu düşün.',
              explanation:
                'Harika! Metin, insanların yıldızlarla yönü ve mevsimleri nasıl bulduğunu anlatıyor.',
            },
          ],
          glossary: [
            {
              word: 'Pusulanın',
              meaning: 'İğnesi hep kuzeyi gösteren, yön bulmaya yarayan aletin.',
            },
            { word: 'takımyıldız', meaning: 'Gökyüzünde bir şekle benzeyen yıldız topluluğu.' },
            { word: 'hayalî', meaning: 'Gerçekte olmayan, yalnızca düşünülen.' },
            { word: 'hasat', meaning: 'Olgunlaşan ürünlerin tarladan toplanması.' },
          ],
        },
        G4: {
          paragraphs: [
            'Pusulanın ve uyduların olmadığı zamanlarda insanlar yönlerini nasıl bulurdu? Denizin ortasında ne bir yol vardır ne de bir tabela; dört bir yan birbirine benzer. Öyleyse yolunu arayan bir gezgin neye güvenebilirdi? Cevap, başımızın üstünde parıldıyordu: yıldızlar.',
            'Eski denizciler geceleri gökyüzünü dikkatle incelerdi. Kuzey Yıldızı, gökyüzünde neredeyse hiç yer değiştirmediği için onlara kuzeyi gösterirdi. Öbür yıldızlar gece boyunca gökyüzünde yavaşça yol alırken o, yerinde duran bir işaret gibiydi. Üstelik sanıldığının aksine gökyüzünün en parlak yıldızı da değildir; değeri parlaklığından değil, değişmezliğinden gelir. Denizci bu sabit noktayı bulduğunda öbür yönleri de kolayca hesaplayabilirdi.',
            'Yıldızların bir araya gelerek oluşturduğu şekillere takımyıldız denir. Büyük Ayı takımyıldızındaki parlak yedi yıldız, bir kepçeye benzer. Kepçenin ucundaki iki yıldızdan çizilen hayalî bir çizgi, Kuzey Yıldızı’na ulaşır. Gökyüzünü okumayı bilen biri için bu çizgi, bir haritadaki yol işaretinden farksızdır. Bu yüzden Kuzey Yıldızı’nı arayanlar işe çoğu zaman kepçeyi bulmakla başlar.',
            'Gezginler yalnızca yön bulmak için değil, mevsimleri anlamak için de yıldızlardan yararlanırdı. Bazı yıldızların gökyüzünde görünmeye başlaması, ekim ya da hasat zamanının yaklaştığını haber verirdi. Takvimin elde olmadığı çağlarda çiftçi de denizci gibi başını göğe kaldırır, yıldızların getirdiği haberi okurdu. Tarlasını ne zaman ekeceğine karar veren çiftçi için bu haber büyük önem taşırdı. Gökyüzü, herkesin ortak kitabı gibiydi.',
            'Bugün telefonlarımızdaki haritalar işimizi kolaylaştırıyor; birkaç saniyede gideceğimiz yolu gösteriyorlar. Bu kolaylık elbette büyük bir kazanç, ama yol bulmak için gökyüzüne bakma alışkanlığımız da neredeyse unutuldu. Üstelik şehir ışıkları yüzünden birçok yıldızı artık göremiyoruz. Yine de açık bir gecede gökyüzüne baktığında, binlerce yıl önce insanlara yol gösteren aynı yıldızları gördüğünü unutma. O ışıklar, insanlığın en eski haritasıdır.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                'Metne göre Kuzey Yıldızı’nı denizciler için değerli kılan özellik hangisidir?',
              options: [
                'Gökyüzünün en parlak yıldızı olması',
                'Her gece başka bir yerde görünmesi',
                'Neredeyse hiç yer değiştirmemesi',
                'Büyük Ayı’nın en büyük yıldızı olması',
              ],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafın son cümlesinde “değeri” sözcüğünü bul.',
              explanation:
                'Aferin! Kuzey Yıldızı’nın değeri parlaklığından değil, değişmezliğinden gelir.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Açık bir gecede Büyük Ayı’yı bulan biri, metne göre kuzeyi nasıl bulabilir?',
              options: [
                'Kepçenin ucundaki iki yıldızdan çizilen çizgiyi izleyerek',
                'En parlak yıldıza doğru yürüyerek',
                'Yıldızların hareketini sabaha kadar bekleyerek',
                'Yedi yıldızı tek tek sayarak',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragraftaki hayalî çizginin nereye ulaştığını, ikinci paragrafla birleştir.',
              explanation: 'Çok güzel! Bu çizgi Kuzey Yıldızı’na ulaşır, o da kuzeyi gösterir.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Yazarın birinci paragrafta soru sormasının amacı aşağıdakilerden hangisidir?',
              options: [
                'Okuru sınamak ve yanlışını göstermek',
                'Konunun çözümsüz olduğunu belirtmek',
                'Denizcileri eleştirmek',
                'Okurun merakını uyandırıp konuya hazırlamak',
              ],
              correctIndex: 3,
              hint: 'İpucu: Sorulardan hemen sonra gelen cümleye bak; cevap orada veriliyor.',
              explanation:
                'Harika! Yazar önce merak uyandırıyor, sonra cevabı yıldızlar diye açıklıyor.',
            },
          ],
          glossary: [
            {
              word: 'Pusulanın',
              meaning: 'İğnesi hep kuzeyi gösteren, yön bulmaya yarayan aletin.',
            },
            { word: 'değişmezliğinden', meaning: 'Hep aynı kalmasından.' },
            { word: 'takımyıldız', meaning: 'Gökyüzünde bir şekle benzeyen yıldız topluluğu.' },
            { word: 'hasat', meaning: 'Olgunlaşan ürünlerin tarladan toplanması.' },
          ],
        },
      },
    }),
    story(city, {
      position: 8,
      slug: 'magara-evde-bir-gece',
      theme: TextTheme.CESARET,
      title: 'Mağara Evde Bir Gece',
      summary:
        'Bora’nın Kapadokya’da kayaya oyulmuş bir odada ilk korkusunu huzura çevirdiği gece.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Bora’nın ailesi, Kapadokya’da kayaya oyulmuş bir otelde kalacaktı. Bora odaya girince durdu. Duvarlar, tavan, hatta yatağın yanındaki raf bile kayadan oyulmuştu. Pencere küçük, duvarlar çok kalındı.',
        '“Burası bir mağara mı?” diye sordu Bora biraz çekinerek. Babası güldü. “Bir zamanlar insanlar yaşamak için bu kayaları oyarmış. Şimdi bazıları otel oldu,” dedi.',
        'Dışarıda hava çok sıcaktı ama oda serin ve ferahtı. Annesi açıkladı: “Kalın kaya duvarlar yazın sıcağı, kışın soğuğu içeri almaz. Bu yüzden mağara evler yazın serin, kışın sıcak olur.”',
        'Gece olunca Bora yatağına uzandı ve kayadan tavana baktı. Önce biraz tuhaf geldi. Sonra tavandaki keski izlerini fark etti. Bu izleri yüzlerce yıl önce bir usta bırakmıştı.',
        'Bora, o ustanın elinde küçük bir keskiyle kayayı oyduğunu hayal etti. Taşın serinliği ve sessizliği içine huzur verdi. Gözlerini kapattığında hiç korkmuyordu. “Kaya beni kucaklıyor gibi,” diye düşündü ve mışıl mışıl uyudu.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Bora’nın ailesi nerede kaldı?',
          options: ['Kayaya oyulmuş bir otelde', 'Bir çadırda', 'Bir apartman dairesinde'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin ilk cümlesine bak.',
          explanation: 'Doğru! Kayaya oyulmuş bir otelde kaldılar.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Mağara evler neden yazın serin, kışın sıcak olur?',
          options: [
            'Her odada klima olduğu için',
            'Kalın kaya duvarlar sıcağı ve soğuğu içeri almadığı için',
            'Pencereler hep açık kaldığı için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta annesinin açıklamasını oku.',
          explanation: 'Aferin! Kalın kaya duvarlar dışarıdaki sıcağı ve soğuğu içeri geçirmez.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Bora gece gözlerini kapattığında nasıl hissediyordu?',
          options: ['Çok korkuyordu', 'Kızgındı', 'Huzurluydu, hiç korkmuyordu'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Bora’nın ne hissettiği yazıyor.',
          explanation: 'Harika! Bora önce çekindi ama sonra kendini huzurlu ve güvende hissetti.',
        },
      ],
      glossary: [
        { word: 'oyulmuş', meaning: 'İçi kazılarak boşaltılmış.' },
        { word: 'ferahtı', meaning: 'Havadar ve insana rahat nefes aldıran bir yerdi.' },
        { word: 'keski', meaning: 'Taşı ya da tahtayı oymaya yarayan, ucu keskin alet.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Bora’nın ailesi bir otele geldi. Bu otel kayaya oyulmuştu. Duvarlar kayadandı. Tavan da kayadandı.',
            '“Burası mağara mı?” dedi Bora. Biraz çekiniyordu. Babası güldü. “Eskiden insanlar burada yaşarmış. Şimdi burası otel oldu,” dedi.',
            'Dışarısı çok sıcaktı. Oda ise serindi. “Kalın duvarlar sıcağı içeri almaz,” dedi annesi. “Kışın da soğuğu almaz.”',
            'Gece Bora yatağına uzandı. Tavanda izler gördü. Bu izleri eski bir usta bırakmıştı.',
            'Bora ustayı hayal etti. İçi rahatladı. Artık hiç korkmuyordu. “Kaya beni kucaklıyor gibi,” diye düşündü. Sonra mışıl mışıl uyudu.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Oda neden serindi?',
              options: [
                'Pencere hep açıktı',
                'Kalın duvarlar sıcağı içeri almıyordu',
                'Odada kar vardı',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafta annesinin sözünü oku.',
              explanation: 'Aferin! Kalın kaya duvarlar sıcağı içeri almaz.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Bora gecenin sonunda nasıl hissetti?',
              options: ['Çok korktu', 'Çok kızdı', 'Rahat ve huzurlu oldu'],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta Bora’nın içinden geçenleri oku.',
              explanation: 'Harika! Bora artık korkmuyordu, içi rahatlamıştı.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Mışıl mışıl uyudu.” Bu ne demek?',
              options: ['Derin ve rahat uyudu', 'Çok az uyudu', 'Korkarak uyudu'],
              correctIndex: 0,
              hint: 'İpucu: Bora o sırada korkuyor muydu? Son paragrafa bak.',
              explanation: 'Doğru! Mışıl mışıl uyumak, derin ve rahat uyumaktır.',
            },
          ],
          glossary: [
            { word: 'oyulmuştu', meaning: 'İçi kazılarak boşaltılmıştı.' },
            { word: 'mağara', meaning: 'Kayaların içindeki büyük oyuk.' },
            { word: 'çekiniyordu', meaning: 'Biraz korkuyor, ürkek davranıyordu.' },
          ],
        },
        G3: {
          paragraphs: [
            'Bora’nın ailesi, Kapadokya’da kayaya oyulmuş bir otelde kalacaktı. Bora odaya girince durdu. Duvarlar, tavan, hatta yatağın yanındaki raf bile kayadan oyulmuştu. Pencere küçük, duvarlar çok kalındı ve içeride alışık olduğu aydınlık yoktu. Bora, böyle bir yerde uyuyabileceğinden emin değildi.',
            '“Burası bir mağara mı?” diye sordu Bora biraz çekinerek. Babası güldü. “Bir zamanlar insanlar yaşamak için bu kayaları oyarmış. Şimdi bazıları otel oldu,” dedi. Bu açıklama Bora’yı biraz rahatlattıysa da içindeki çekingenlik tamamen geçmemişti.',
            'Dışarıda hava çok sıcaktı ama oda serin ve ferahtı. Annesi açıkladı: “Kalın kaya duvarlar yazın sıcağı, kışın soğuğu içeri almaz. Bu yüzden mağara evler yazın serin, kışın sıcak olur.” Bora elini duvara koydu; taş gerçekten serindi.',
            'Gece olunca Bora yatağına uzandı ve kayadan tavana baktı. Önce biraz tuhaf geldi, çünkü alışık olduğu düz ve beyaz tavanlara hiç benzemiyordu. Sonra tavandaki keski izlerini fark etti ve bu izleri yüzlerce yıl önce bir ustanın bıraktığını düşündü.',
            'Bora, o ustanın elinde küçük bir keskiyle kayayı oyduğunu hayal etti. Kim bilir kaç gün çalışmıştı! Taşın serinliği ve sessizliği içine huzur verdi; gözlerini kapattığında hiç korkmuyordu. “Kaya beni kucaklıyor gibi,” diye düşündü ve mışıl mışıl uyudu.',
          ],
          questions: [
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Kaya beni kucaklıyor gibi.” sözüyle Bora ne anlatmak istiyor?',
              options: [
                'Yatağın çok dar olduğunu',
                'Duvarın üstüne yıkılacağını',
                'Odada kendini güvende hissettiğini',
                'Odanın çok soğuk olduğunu',
              ],
              correctIndex: 2,
              hint: 'İpucu: Bu sözden hemen önce Bora’nın nasıl hissettiğini oku.',
              explanation:
                'Aferin! Kucaklanmak güven verir; Bora da kayanın içinde kendini güvende hissetti.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Keski izlerini fark etmek Bora’yı nasıl etkilemiş olabilir?',
              options: [
                'Tavanın yıkılacağını düşündürmüştür',
                'Ustayı hayal edince odayı daha sıcak ve yakın bulmasını sağlamıştır',
                'Bir an önce otelden ayrılmak istemesine yol açmıştır',
                'Keskiyi aramak için uykusunu kaçırmıştır',
              ],
              correctIndex: 1,
              hint: 'İpucu: İzleri gördükten sonra Bora’nın neler yaptığını ve hissettiğini oku.',
              explanation: 'Çok güzel! Ustayı hayal eden Bora’nın içi huzurla doldu.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Annesine göre mağara evler kışın nasıl olur?',
              options: ['Sıcak', 'Çok soğuk', 'Nemli', 'Karanlık'],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta annesinin açıklamasını oku.',
              explanation: 'Doğru! Kalın duvarlar sayesinde mağara evler kışın sıcak olur.',
            },
          ],
          glossary: [
            { word: 'oyulmuş', meaning: 'İçi kazılarak boşaltılmış.' },
            { word: 'ferahtı', meaning: 'Havadar ve insana rahat nefes aldıran bir yerdi.' },
            { word: 'keski', meaning: 'Taşı ya da tahtayı oymaya yarayan, ucu keskin alet.' },
          ],
        },
        G4: {
          paragraphs: [
            'Bora’nın ailesi, Kapadokya’da kayaya oyulmuş bir otelde kalacaktı. Bora odaya girince eşikte durdu. Duvarlar, tavan, hatta yatağın yanındaki raf bile kayadan oyulmuştu; sanki biri koca bir dağın içine gizlice bir oda saklamıştı. Pencere küçük, duvarlar çok kalındı ve Bora, alışık olduğu aydınlık odayı özlemeye şimdiden başlamıştı.',
            '“Burası bir mağara mı?” diye sordu Bora biraz çekinerek. Babası güldü ve “Bir zamanlar insanlar yaşamak için bu kayaları oyarmış, şimdi bazıları otel oldu,” dedi. Bu açıklama Bora’yı pek rahatlatmadı; birilerinin burada yaşamış olması, onun da burada rahat edeceği anlamına gelmiyordu. Okuduğu masallardaki karanlık mağaralar aklına geldi; oysa bu odada yatak, raf ve küçük bir lamba vardı.',
            'Dışarıda güneş yakıcıydı, ama oda serin ve ferahtı. Annesi açıkladı: “Kalın kaya duvarlar yazın sıcağı, kışın soğuğu içeri almaz. Bu yüzden mağara evler yazın serin, kışın sıcak olur. Bu evleri yapanlar doğaya karşı koymak yerine ondan yararlanmayı bilmişler.” Bora elini duvara koydu ve taşın serinliği, avucundan koluna doğru yayıldı.',
            'Gece olunca her yer sessizliğe büründü; Bora yatağına uzandı ve kayadan tavana baktı. Önce biraz tuhaf geldi; tavan, sanki üzerine eğilmiş, onu izliyordu. Sonra loş ışıkta tavandaki keski izlerini fark etti; bu izleri yüzlerce yıl önce bir usta bırakmıştı. Bir anda oda ona o kadar yabancı görünmedi.',
            'Bora, o ustanın elinde küçük bir keskiyle, vuruş vuruş kayayı oyduğunu hayal etti. Belki o da akşam olunca yorgun düşüp bu odada uyumuştu. Yüzlerce yıl öncesinden gelen bu el izi, Bora’ya yalnız olmadığını hissettirdi. Taşın serinliği ve sessizliği içine huzur verdi; gözlerini kapattığında hiç korkmuyordu. “Kaya beni kucaklıyor gibi,” diye düşündü ve mışıl mışıl uyudu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Otellerde kalmak evde kalmaktan daha güzeldir.',
                'Herkes mağarada yaşamayı öğrenmelidir.',
                'Karanlık yerlerden uzak durulmalıdır.',
                'Bilmediğimiz bir şey ilk başta ürkütse de tanıdıkça huzur verebilir.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Bora’nın odaya girdiği andaki ve uyumadan önceki duygularını karşılaştır.',
              explanation: 'Aferin! Bora, ürktüğü odayı tanıdıkça onda huzur buldu.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Babasının açıklaması Bora’yı hemen rahatlattı. II. Kalın kaya duvarlar sıcağın ve soğuğun içeri girmesini engeller. III. Keski izleri Bora’ya yalnız olmadığını hissettirdi.',
              options: ['Yalnız I', 'I ve II', 'II ve III', 'I, II ve III'],
              correctIndex: 2,
              hint: 'İpucu: Her yargıyı tek tek ele al; babasının sözünün etkisine ikinci paragrafta bak.',
              explanation:
                'Harika! Babasının açıklaması Bora’yı pek rahatlatmadı, bu yüzden I. yargı yanlıştır.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…doğaya karşı koymak yerine ondan yararlanmayı bilmişler.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Kayanın sıcağı ve soğuğu tutan özelliğini akıllıca kullandıkları',
                'Doğadan uzak yaşamayı seçtikleri',
                'Kayaları oymaktan vazgeçtikleri',
                'Yalnızca yaz aylarında bu evlerde kaldıkları',
              ],
              correctIndex: 0,
              hint: 'İpucu: Annesinin aynı konuşmada kaya duvarlar için söylediklerini oku.',
              explanation:
                'Çok güzel! Kalın kaya duvarlar, doğal bir serinlik ve sıcaklık sağlıyordu.',
            },
          ],
          glossary: [
            { word: 'eşikte', meaning: 'Kapının alt kısmındaki geçiş yerinde.' },
            { word: 'ferahtı', meaning: 'Havadar ve insana rahat nefes aldıran bir yerdi.' },
            { word: 'loş', meaning: 'Az aydınlık.' },
            { word: 'keski', meaning: 'Taşı ya da tahtayı oymaya yarayan, ucu keskin alet.' },
          ],
        },
      },
    }),
    story(city, {
      position: 9,
      slug: 'piril-ve-balonlar',
      theme: TextTheme.ARKADASLIK,
      title: 'Pırıl ve Balonlar',
      summary:
        'Pırıl’ın Göreme’de küçük Ayla’yla gün doğumunda balonları izleyip son durağı Van’a yola çıktığı sabah.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Pırıl, Göreme’de bir evin damında gün doğumunu bekliyordu. Yanında, o evde yaşayan küçük Ayla oturuyordu. İkisi de battaniyeye sarınmış, gökyüzüne bakıyordu.',
        'Önce uzakta bir alev parladı, sonra bir balon havalandı. Ardından bir tane daha, bir tane daha… Kısa sürede gökyüzü rengârenk balonlarla doldu. Ayla balonları saymaya başladı. Pırıl da her balonda kuyruğunu bir kez salladı.',
        'Bir balon damın hemen üstünden geçti. Sepetteki pilot onlara el salladı. Ayla da heyecanla karşılık verdi. Pırıl ise patisini kaldırdı; sanki o da selam veriyordu.',
        'Güneş yükselince balonlar birer birer indi. Ayla, Pırıl’ın başını okşadı. “Gidiyorsun, değil mi?” diye sordu. Pırıl doğuya, dağların ardına baktı. Orada, büyük bir gölün kıyısında memleketi Van onu bekliyordu.',
        'Ayla biraz üzüldü ama gülümsedi. “Yolun açık olsun, Pırıl. Gölüne benden selam söyle,” dedi. Pırıl, Ayla’nın elini yaladı. Sonra yolculuğunun son durağına, Van’a doğru yola çıktı. Artık eve çok yakındı.',
      ],
      questions: [
        {
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Pırıl ile Ayla damda neyi izlediler?',
          options: ['Yıldızları', 'Balonları', 'Kuşları'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta gökyüzünün neyle dolduğu yazıyor.',
          explanation: 'Doğru! Gün doğarken gökyüzünü dolduran balonları izlediler.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.CIKARIM,
          prompt: 'Pırıl doğuya, dağların ardına neden baktı?',
          options: [
            'Memleketi Van o yönde olduğu için',
            'Orada yağmur yağdığı için',
            'Kaybolan bir balonu aradığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafın son cümlesine bak.',
          explanation: 'Aferin! Memleketi Van, doğuda, büyük bir gölün kıyısındaydı.',
        },
        {
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Ayla, Pırıl gideceği için nasıl hissetti?',
          options: ['Çok sevindi', 'Ona kızdı', 'Biraz üzüldü ama ona iyi yolculuklar diledi'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafın ilk iki cümlesini oku.',
          explanation:
            'Harika! Ayla arkadaşından ayrılacağı için üzüldü ama onun mutluluğunu istedi.',
        },
      ],
      glossary: [
        { word: 'damında', meaning: 'Evin düz çatısında.' },
        { word: 'patisini', meaning: 'Kedinin ayağını.' },
        { word: 'doğuya', meaning: 'Güneşin doğduğu yöne.' },
      ],
      versions: {
        G1: {
          paragraphs: [
            'Pırıl bir kediydi. Göreme’de bir evin damında oturuyordu. Yanında küçük Ayla vardı. İkisi de gökyüzüne bakıyordu.',
            'Önce uzakta bir alev parladı. Sonra bir balon havalandı. Ardından bir balon daha! Gökyüzü rengârenk oldu. Pırıl kuyruğunu salladı.',
            'Bir balon damın üstünden geçti. Pilot el salladı. Ayla da el salladı. Pırıl patisini kaldırdı.',
            'Balonlar birer birer indi. “Gidiyorsun, değil mi?” dedi Ayla. Pırıl doğuya baktı. Memleketi Van orada bekliyordu.',
            'Ayla biraz üzüldü ama gülümsedi. “Yolun açık olsun, Pırıl,” dedi. Pırıl onun elini yaladı. Sonra Van’a doğru yola çıktı. Eve çok yakındı.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Pırıl ile Ayla gökyüzünde neyi izledi?',
              options: ['Balonları', 'Yıldızları', 'Kuşları'],
              correctIndex: 0,
              hint: 'İpucu: İkinci paragrafı oku.',
              explanation: 'Doğru! Gökyüzü rengârenk balonlarla doldu.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Yolun açık olsun” ne demek?',
              options: ['Kapıyı aç', 'İyi yolculuklar', 'Yol çok uzun'],
              correctIndex: 1,
              hint: 'İpucu: Ayla bu sözü Pırıl giderken söylüyor.',
              explanation:
                'Aferin! Yola çıkan birine iyi yolculuklar dilemek için bu söz söylenir.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Ayla neden biraz üzüldü?',
              options: ['Balonlar indiği için', 'Hava soğuduğu için', 'Pırıl gideceği için'],
              correctIndex: 2,
              hint: 'İpucu: Dördüncü paragrafta Ayla’nın sorusunu oku.',
              explanation: 'Harika! Ayla, arkadaşı Pırıl gideceği için üzüldü.',
            },
          ],
          glossary: [
            { word: 'damında', meaning: 'Evin düz çatısında.' },
            { word: 'patisini', meaning: 'Kedinin ayağını.' },
            { word: 'Memleketi', meaning: 'Doğduğu yer.' },
          ],
        },
        G3: {
          paragraphs: [
            'Pırıl, Göreme’de bir evin damında gün doğumunu bekliyordu; yanında, o evde yaşayan küçük Ayla oturuyordu. İkisi de battaniyeye sarınmış, gökyüzüne bakıyordu. Hava soğuktu ama ikisi de içeri girmeyi hiç düşünmüyordu.',
            'Önce uzakta bir alev parladı, sonra bir balon havalandı. Ardından bir tane daha, bir tane daha derken kısa sürede gökyüzü rengârenk balonlarla doldu. Ayla balonları saymaya başladı, Pırıl da her balonda kuyruğunu bir kez salladı. Ayla sayıyı şaşırınca güldü ve saymaya en baştan başladı.',
            'Bir balon damın hemen üstünden geçti. Sepetteki pilot onlara el salladı, Ayla da heyecanla karşılık verdi. Pırıl ise patisini kaldırdı; sanki o da selam veriyordu.',
            'Güneş yükselince balonlar birer birer indi. Ayla, Pırıl’ın başını okşadı ve “Gidiyorsun, değil mi?” diye sordu. Ayrılık zamanının geldiğini seziyordu. Pırıl doğuya, dağların ardına baktı, çünkü orada, büyük bir gölün kıyısında memleketi Van onu bekliyordu.',
            'Ayla biraz üzüldü ama gülümsedi. “Yolun açık olsun, Pırıl. Gölüne benden selam söyle,” dedi. Pırıl, Ayla’nın elini yaladı. Sonra yolculuğunun son durağına, Van’a doğru yola çıktı. Arkasına bir kez baktığında Ayla hâlâ damda el sallıyordu. Bu kadar güzel bir sabahın ardından ayrılmak ikisi için de kolay değildi, ama Pırıl artık eve çok yakındı.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Ayla’nın davranışından çıkarılabilecek en uygun düşünce hangisidir?',
              options: [
                'Arkadaşlar hiçbir zaman ayrılmamalıdır.',
                'Seven kişi ayrılığa üzülse de arkadaşının mutluluğunu ister.',
                'Yolculuğa çıkanlar arkalarına bakmamalıdır.',
                'Balon izlemek için erken kalkmak gerekmez.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafın ilk iki cümlesinde Ayla’nın ne hissedip ne söylediğini oku.',
              explanation: 'Aferin! Ayla üzüldü ama Pırıl’a iyi yolculuklar diledi.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Pırıl, Ayla’nın sorusundan sonra neden doğuya baktı?',
              options: [
                'Doğudan yeni balonlar geleceği için',
                'Hava soğuduğu için',
                'Ayla’nın saklandığı yeri aradığı için',
                'Gideceği yer olan memleketi Van o yönde olduğu için',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dördüncü paragrafın son cümlesine bak.',
              explanation: 'Çok güzel! Pırıl bakışıyla, Van’a gideceğini anlatıyor gibiydi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Pırıl ise patisini kaldırdı; sanki o da selam veriyordu.” cümlesi ne anlatıyor?',
              options: [
                'Pırıl’ın hareketinin selam vermeye benzediğini',
                'Pırıl’ın patisinin acıdığını',
                'Pilotun Pırıl’a kızdığını',
                'Pırıl’ın balona binmek istediğini',
              ],
              correctIndex: 0,
              hint: 'İpucu: “Sanki” sözcüğü bir benzetme yapıyor. Hemen önce Ayla ne yaptı?',
              explanation: 'Harika! Pırıl’ın kaldırdığı pati, el sallamaya benziyordu.',
            },
          ],
          glossary: [
            { word: 'damında', meaning: 'Evin düz çatısında.' },
            { word: 'patisini', meaning: 'Kedinin ayağını.' },
            { word: 'seziyordu', meaning: 'Söylenmeden anlıyor, hissediyordu.' },
            { word: 'doğuya', meaning: 'Güneşin doğduğu yöne.' },
          ],
        },
        G4: {
          paragraphs: [
            'Pırıl, Göreme’de bir evin damında gün doğumunu bekliyordu; yanında, o evde yaşayan küçük Ayla oturuyordu. İkisi de aynı battaniyeye sarınmış, gecenin son karanlığını izliyordu. Hava soğuktu, ama ikisi de gün ağarmadan içeri girmeye hiç niyetli değildi. Pırıl, uzun yolculuğu boyunca İstanbul’dan İzmir’e, Efes’ten Antalya’ya nice dost edinmişti. Şimdi bu sessiz anın, yeni bir vedanın eşiği olduğunu seziyordu.',
            'Önce uzakta bir alev parladı, sonra bir balon ağır ağır havalandı. Ardından bir tane daha, bir tane daha derken kısa sürede gökyüzü, birinin avuç avuç saçtığı renkli boncuklarla dolmuş gibi oldu. Ayla balonları saymaya başladı, Pırıl da her balonda kuyruğunu bir kez salladı; Antalya’da bir resimde gördüğü balonlar şimdi gerçekti.',
            'Bir balon damın hemen üstünden geçti ve brülörün sesi bir an için sabahın sessizliğini böldü. Sepetteki pilot onlara el salladı, Ayla da heyecanla karşılık verdi. Pırıl ise patisini kaldırdı; sanki o da selam veriyordu.',
            'Güneş yükselince balonlar birer birer indi; gökyüzü, oyun bitince boşalan bir meydan gibi sessizleşti. Ayla, Pırıl’ın başını okşadı ve “Gidiyorsun, değil mi?” diye sordu. Cevabı biliyordu, yine de sormak istemişti. Pırıl doğuya, dağların ardına baktı; orada, büyük bir gölün kıyısında memleketi Van onu bekliyordu ve bunca yolu o göle kavuşmak için yürümüştü.',
            'Ayla biraz üzüldü ama gülümsedi ve “Yolun açık olsun, Pırıl, gölüne benden selam söyle,” dedi. Sevdiğini yolundan alıkoymamak da bir tür dostluktu ve Ayla, küçük yaşına rağmen bunu biliyordu. Pırıl, Ayla’nın elini yaladı ve yolculuğunun son durağına, Van’a doğru yola çıktı. Damda kalan Ayla, uzaklaşan küçük dostunu gözden kaybolana kadar izledi. Pırıl artık eve çok yakındı; içindeki sevinçle hüzün, yan yana yürüyordu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde işlenen temel düşünce aşağıdakilerden hangisidir?',
              options: [
                'Yolculuklar insanı dostlarından uzaklaştırdığı için gereksizdir.',
                'Balonlar yalnızca Göreme’de görülebilir.',
                'Gerçek dostluk, ayrılık zor olsa da arkadaşının yoluna saygı duymaktır.',
                'Kediler uzun yolculuklara dayanamaz.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta Ayla’nın bildiği şeyi anlatan cümleyi bul.',
              explanation:
                'Aferin! Ayla, Pırıl’ı yolundan alıkoymayarak gerçek bir dost olduğunu gösterdi.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“…içindeki sevinçle hüzün, yan yana yürüyordu.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Pırıl’ın eve dönmenin sevincini ve ayrılığın hüznünü birlikte yaşadığı',
                'Pırıl’ın yanında iki arkadaşıyla yürüdüğü',
                'Pırıl’ın hiçbir şey hissetmediği',
                'Pırıl’ın geri dönmeye karar verdiği',
              ],
              correctIndex: 0,
              hint: 'İpucu: Pırıl neye sevinmiş, neye üzülmüş olabilir? Son paragrafı düşün.',
              explanation: 'Çok güzel! Pırıl evine yaklaşıyordu ama Ayla’dan da ayrılıyordu.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Pırıl balonları daha önce bir resimde görmüştü. II. Ayla, sorusunun cevabını bilmiyordu. III. Pırıl’ın memleketi, baktığı doğu yönündeydi.',
              options: ['Yalnız II', 'I ve III', 'II ve III', 'I, II ve III'],
              correctIndex: 1,
              hint: 'İpucu: Her yargıyı tek tek ele al; Ayla’nın sorusundan sonraki cümleye dikkat et.',
              explanation: 'Harika! Ayla cevabı biliyordu, bu yüzden II. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'damında', meaning: 'Evin düz çatısında.' },
            { word: 'vedanın', meaning: 'Ayrılırken hoşça kal demenin.' },
            { word: 'alıkoymamak', meaning: 'Bir şeyi yapmasına engel olmamak.' },
            { word: 'hüzün', meaning: 'Hafif ve derin bir üzüntü.' },
          ],
        },
      },
    }),
    chest(
      city,
      10,
      'Kapadokya’nın son sandığı bir balon sepetinde! Aç ve Van’a doğru son yolculuğa çık!',
    ),
  ],
};
