import { City, ReadingLevel } from '../../src/generated/prisma/enums.js';
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
          prompt: 'Annesine göre peri bacalarının taşı neyden oluşmuş?',
          options: ['Deniz kumundan', 'Yanardağ külünden', 'Eriyen kardan'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta annesinin anlattıklarını oku.',
          explanation: 'Doğru! Yanardağlardan çıkan kül sertleşip yumuşak bir taşa dönüşmüş.',
        },
        {
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
    }),
    story(city, {
      position: 2,
      slug: 'ucan-balon',
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
          prompt: 'Selim Bey’e göre balonu yükselten nedir?',
          options: ['Rüzgâr', 'Sıcak hava', 'Kuşlar'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Selim Bey’in açıklamasını oku.',
          explanation: 'Doğru! Sıcak hava soğuk havadan hafif olduğu için balonu yükseltir.',
        },
        {
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
    }),
    story(city, {
      position: 3,
      slug: 'yerin-altindaki-sehir',
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
          prompt: 'Yeraltı şehrinin kapıları neyle kapatılırdı?',
          options: ['Tahta kapılarla', 'Kocaman, yuvarlak taşlarla', 'Demir parmaklıklarla'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta rehberin anlattıklarını oku.',
          explanation: 'Doğru! Kapılar kocaman, yuvarlak taşlar yuvarlanarak kapatılırdı.',
        },
        {
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
    }),
    story(city, {
      position: 4,
      slug: 'avanosta-comlek',
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
          prompt: 'Avanos’taki çömlekçiler kırmızı toprağı nereden alıyordu?',
          options: ['Kızılırmak’tan', 'Denizden', 'Dağın tepesinden'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta ustanın söylediklerini oku.',
          explanation: 'Doğru! Kırmızı toprak Kızılırmak’tan alınıyordu.',
        },
        {
          prompt: 'Mert’in çamuru “yamuldu.” Bu ne demek?',
          options: ['Çok güzel bir şekil aldı', 'Şekli bozulup eğri oldu', 'Sertleşip taşa döndü'],
          correctIndex: 1,
          hint: 'İpucu: Çamur bir yana kaydıktan sonra nasıl görünmüş olabilir?',
          explanation: 'Aferin! Yamulmak, şeklin bozulup eğri olması demektir.',
        },
        {
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
    }),
    chest(
      city,
      5,
      'Peri bacalarının arasında bir sandık parlıyor; aç bakalım, içinden kaç lokum çıkacak?',
    ),
    story(city, {
      position: 6,
      slug: 'guvercinlerin-evleri',
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
    }),
    story(city, {
      position: 7,
      slug: 'gokyuzundeki-haritalar',
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
    }),
    story(city, {
      position: 8,
      slug: 'magara-evde-bir-gece',
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
          prompt: 'Bora’nın ailesi nerede kaldı?',
          options: ['Kayaya oyulmuş bir otelde', 'Bir çadırda', 'Bir apartman dairesinde'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin ilk cümlesine bak.',
          explanation: 'Doğru! Kayaya oyulmuş bir otelde kaldılar.',
        },
        {
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
    }),
    story(city, {
      position: 9,
      slug: 'piril-ve-balonlar',
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
          prompt: 'Pırıl ile Ayla damda neyi izlediler?',
          options: ['Yıldızları', 'Balonları', 'Kuşları'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta gökyüzünün neyle dolduğu yazıyor.',
          explanation: 'Doğru! Gün doğarken gökyüzünü dolduran balonları izlediler.',
        },
        {
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
    }),
    chest(
      city,
      10,
      'Kapadokya’nın son sandığı bir balon sepetinde! Aç ve Van’a doğru son yolculuğa çık!',
    ),
  ],
};
