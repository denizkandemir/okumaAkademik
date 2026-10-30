import { City, ReadingLevel, TextTheme } from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.EFES;
const level = ReadingLevel.ORTA;

/** 3. durak — "Antik Kentin Sırları" */
export const efes: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'celsus-kutuphanesinde',
      theme: TextTheme.MERAK,
      title: 'Celsus Kütüphanesi’nde',
      summary:
        'Selin’in Efes’teki Celsus Kütüphanesi’nde iki bin yıl önceki rulo kitapları hayal ettiği gezi.',
      level,
      paragraphs: [
        'Selin’in sınıfı okul gezisiyle Efes Antik Kenti’ne gitmişti. Mermer sokaklarda yürürken rehber bir binanın önünde durdu. Binanın ön yüzü iki katlıydı ve uzun sütunlarla süslüydü.',
        '“Burası Celsus Kütüphanesi,” dedi rehber. “Yaklaşık iki bin yıl önce yapıldı. O zamanlar kitaplar bugünkü gibi sayfalı değildi. Parşömen denen uzun yapraklara yazılır, rulo yapılıp saklanırdı.”',
        'Selin şaşırdı. “Burada binlerce rulo kitap var mıydı?” diye sordu. Rehber başını salladı. “Evet, binlerce. İnsanlar buraya okumak ve öğrenmek için gelirdi.”',
        'Selin sütunların arasındaki heykellere baktı. Rehber, bu heykellerin bilgeliği ve bilgiyi anlattığını söyledi.',
        'Selin gözlerini kapattı. Uzun giysili insanların ellerinde rulolarla merdivenlerden çıktığını hayal etti. “Demek okumak, iki bin yıl önce de bu kadar değerliymiş,” diye düşündü.',
      ],
      questions: [
        {
          prompt: 'O zamanlar kitaplar nasıl saklanırdı?',
          options: ['Rulo yapılarak', 'Kutulara gömülerek', 'Duvarlara asılarak'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta rehberin anlattıklarını oku.',
          explanation: 'Doğru! O zamanlar kitaplar rulo yapılıp saklanırdı.',
        },
        {
          prompt: 'Hikâyedeki “rehber” kimdir?',
          options: [
            'Kütüphanenin bekçisi',
            'Gezilen yeri tanıtıp bilgi veren kişi',
            'Selin’in sınıf arkadaşı',
          ],
          correctIndex: 1,
          hint: 'İpucu: Rehber gezi boyunca çocuklara neler anlatıyor?',
          explanation: 'Aferin! Rehber, gezilen yeri tanıtan ve bilgi veren kişidir.',
        },
        {
          prompt: 'Selin hikâyenin sonunda ne düşündü?',
          options: [
            'Kütüphanelerin sıkıcı olduğunu',
            'Eski binaların tehlikeli olduğunu',
            'Okumanın iki bin yıl önce de değerli olduğunu',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Selin’in aklından geçenleri oku.',
          explanation: 'Harika! İnsanlar binlerce yıldır okumaya ve öğrenmeye değer veriyor.',
        },
      ],
      glossary: [
        { word: 'rehber', meaning: 'Gezilen yeri tanıtan, bilgi veren kişi.' },
        {
          word: 'Parşömen',
          meaning: 'Eskiden üstüne yazı yazılan, hayvan derisinden yapılmış ince yaprak.',
        },
        { word: 'rulo', meaning: 'Sarılarak boru gibi yuvarlak hâle getirilmiş.' },
      ],
    }),
    story(city, {
      position: 2,
      slug: 'tiyatroda-bir-fisilti',
      theme: TextTheme.KESIF,
      title: 'Tiyatroda Bir Fısıltı',
      summary:
        'Emir’in Efes’in antik tiyatrosunda sesini en üst sıradaki ablasına duyurduğu ilginç deney.',
      level,
      paragraphs: [
        'Emir ile ablası Ece, Efes’in antik tiyatrosunu gezmeye geldiler. Tiyatro bir tepenin yamacına yapılmıştı. Taş basamaklar yukarıya doğru sıra sıra yükseliyordu.',
        'Rehber, tiyatronun yaklaşık yirmi beş bin kişi aldığını söyledi. Emir şaşkınlıkla etrafına baktı. “Bu kadar kişi burada ne izlerdi?” diye sordu.',
        'Rehber, eskiden burada oyunlar oynandığını ve konserler yapıldığını anlattı. Sonra bir sır verdi: “Tiyatro öyle yapılmış ki sahnede konuşanın sesi en üst sıralara kadar ulaşır.”',
        'Emir bunu denemek istedi. Ece en üst sıralara tırmandı. Emir sahnenin ortasında durdu ve bağırmadan, “Ece, beni duyuyor musun?” dedi.',
        'Yukarıdan Ece’nin sesi geldi: “Duyuyorum!” Emir hayretle güldü. Hoparlör yokken bile sesi herkese ulaştıran eski ustaları düşündü. “Ne kadar akıllıca yapmışlar!” dedi.',
      ],
      questions: [
        {
          prompt: 'Antik tiyatro yaklaşık kaç kişi alıyordu?',
          options: ['İki yüz', 'Yirmi beş bin', 'Beş yüz'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Tiyatro yaklaşık yirmi beş bin kişi alıyordu.',
        },
        {
          prompt: 'Ece, Emir’in sesini neden duyabildi?',
          options: [
            'Emir çok yüksek sesle bağırdığı için',
            'Ece sahneye indiği için',
            'Tiyatro sesi yukarı taşıyacak şekilde yapıldığı için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Rehberin üçüncü paragrafta verdiği sırrı hatırla.',
          explanation:
            'Aferin! Tiyatro, sahnedeki ses en üst sıralara ulaşacak şekilde yapılmıştı.',
        },
        {
          prompt: 'Emir eski ustalar için ne düşündü?',
          options: [
            'Çok akıllıca iş yaptıklarını',
            'Tiyatroyu çok küçük yaptıklarını',
            'Hiç dikkat etmediklerini',
          ],
          correctIndex: 0,
          hint: 'İpucu: Emir’in son paragrafta söylediği söze bak.',
          explanation: 'Harika! Emir, sesi herkese ulaştıran eski ustalara hayran kaldı.',
        },
      ],
      glossary: [
        { word: 'yamacına', meaning: 'Bir tepenin eğik yanına.' },
        { word: 'hayretle', meaning: 'Çok şaşırarak.' },
        { word: 'Hoparlör', meaning: 'Sesi büyütüp uzağa ulaştıran elektrikli alet.' },
      ],
    }),
    story(city, {
      position: 3,
      slug: 'kayip-anahtar',
      theme: TextTheme.SORUMLULUK,
      title: 'Kayıp Anahtar',
      summary: 'Anahtarını kaybeden Kerem’in bir dedektif gibi düşünerek onu bulma hikâyesi.',
      level,
      paragraphs: [
        'Kerem okuldan döndüğünde kapının önünde durdu ve çantasını karıştırdı. Anahtarı yoktu! Ceplerine baktı, orada da yoktu.',
        'Önce telaşlandı, sonra derin bir nefes aldı. “Bir dedektif gibi düşünmeliyim,” dedi kendi kendine. Telaşla hiçbir şeyin bulunamayacağını biliyordu.',
        'Gün boyunca neler yaptığını sırayla hatırlamaya çalıştı. Sabah anahtarı ceketinin cebine koymuştu. Teneffüste ceketini çıkarıp bankın üstüne bırakmıştı. Belki anahtar orada düşmüştü.',
        'Okula geri döndü. Hademe Ahmet Amca onu görünce gülümsedi ve cebinden parlak bir anahtar çıkardı: “Bunu bahçedeki bankın altında buldum.”',
        'Kerem teşekkür etti. O günden sonra anahtarını hep çantasının küçük gözüne koydu. Akşam annesine de bütün macerayı anlattı.',
      ],
      questions: [
        {
          prompt: 'Kerem eve geldiğinde neyi bulamadı?',
          options: ['Çantasını', 'Anahtarını', 'Ceketini'],
          correctIndex: 1,
          hint: 'İpucu: İlk paragrafta Kerem çantasını karıştırınca neyin olmadığını fark ediyor.',
          explanation: 'Doğru! Kerem anahtarını bulamadı.',
        },
        {
          prompt: 'Kerem neden okula geri döndü?',
          options: [
            'Anahtarın teneffüste bankın yanında düşmüş olabileceğini düşündüğü için',
            'Ödevini sınıfta unuttuğu için',
            'Arkadaşlarıyla oyun oynamak için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta Kerem gün boyunca yaptıklarını hatırlıyor.',
          explanation:
            'Aferin! Kerem ipuçlarını birleştirip anahtarın bankın yanında olabileceğini buldu.',
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
        { word: 'Teneffüste', meaning: 'Okulda iki ders arasındaki dinlenme zamanında.' },
        { word: 'Hademe', meaning: 'Okulun temizliğine ve düzenine yardım eden görevli.' },
      ],
    }),
    story(city, {
      position: 4,
      slug: 'minik-taslardan-resim',
      theme: TextTheme.SABIR,
      title: 'Minik Taşlardan Resim',
      summary:
        'Duru’nun Efes’teki Yamaç Evler’de mozaikleri görüp evde kendi mozaiğini yaptığı gün.',
      level,
      paragraphs: [
        'Duru, ailesiyle Efes’teki Yamaç Evler’i geziyordu. Buralar, eskiden zengin ailelerin yaşadığı evlerdi. Evlerin yerleri ve duvarları rengârenk resimlerle süslüydü.',
        'Duru yere eğildi ve bir resme yakından baktı. Resim, birbirine yapıştırılmış minicik taşlardan oluşuyordu. Kırmızı, beyaz, siyah ve sarı taşlar yan yana dizilmişti.',
        'Babası, “Buna mozaik denir. Ustalar binlerce küçük taşı tek tek yerleştirerek bu resimleri yapmışlar,” dedi. Duru, bir resmin kaç günde bittiğini merak etti.',
        'Eve dönünce Duru kendi mozaiğini yapmaya karar verdi. Renkli kâğıtları küçük karelere kesti. Sonra onları bir kartona tek tek yapıştırdı. İş sandığından çok uzun sürdü.',
        'Akşam olduğunda kartonun üstünde mavi bir balık yüzüyordu. Duru yorulmuştu ama çok mutluydu. “Eski ustalar ne kadar sabırlıymış!” dedi.',
      ],
      questions: [
        {
          prompt: 'Yamaç Evler’deki resimler neyden yapılmıştı?',
          options: ['Boyalı kumaşlardan', 'Minicik taşlardan', 'Tahta parçalarından'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Duru resme yakından bakınca ne gördü?',
          explanation: 'Doğru! Resimler minicik taşlardan yapılmıştı.',
        },
        {
          prompt: 'Duru’nun mozaiği neden sandığından uzun sürdü?',
          options: [
            'Küçük parçaları tek tek kesip yapıştırmak zaman aldığı için',
            'Babası ona yardım etmediği için',
            'Renkli kâğıt bulamadığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta Duru’nun neler yaptığını oku.',
          explanation: 'Aferin! Küçük parçaları tek tek yerleştirmek çok zaman alır.',
        },
        {
          prompt: 'Duru mozaiğini bitirince nasıl hissetti?',
          options: ['Kızgın', 'Sıkılmış', 'Yorgun ama mutlu'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafın ikinci cümlesine bak.',
          explanation: 'Harika! Duru emek verdiği işi bitirdiği için çok mutluydu.',
        },
      ],
      glossary: [
        {
          word: 'mozaik',
          meaning: 'Küçük renkli taş ya da cam parçalarını yan yana dizerek yapılan resim.',
        },
        { word: 'Ustalar', meaning: 'Bir işi çok iyi bilen, yıllarca çalışarak öğrenen kişiler.' },
        { word: 'sabırlıymış', meaning: 'Acele etmeden, yılmadan çalışırmış.' },
      ],
    }),
    chest(city, 5, 'Antik kentin taşları arasında saklı bir sandık var; aç, lokumlar senin!'),
    story(city, {
      position: 6,
      slug: 'fircali-kazi',
      theme: TextTheme.KESIF,
      title: 'Fırçalı Kazı',
      summary:
        'Nil’in arkeolog teyzesiyle Efes’teki kazıda fırçasıyla çok eski bir testi parçası bulduğu gün.',
      level,
      paragraphs: [
        'Nil’in teyzesi bir arkeologdu. Yıllardır Efes’te kazı yapıyordu. Bir yaz günü Nil’i de kazı alanına götürdü.',
        'Kazı alanı iplerle küçük karelere bölünmüştü. Her karede birileri dikkatle toprağı kazıyordu. Teyzesi Nil’e küçük bir fırça verdi. “Burada acele etmek yok. Toprağı yavaşça süpürmelisin,” dedi.',
        'Nil fırçayı usulca toprağın üstünde gezdirdi. Bir süre sonra topraktan kırmızı, kenarı kırık bir parça göründü. “Teyze, bak!” diye fısıldadı.',
        'Teyzesi parçayı dikkatle inceledi. “Bu, eski bir testinin parçası. Belki iki bin yıl önce biri bununla su taşıdı,” dedi. Parçanın bulunduğu yeri deftere yazdı ve fotoğrafını çekti.',
        'Nil parçayı eve götürmek istedi. Teyzesi gülümsedi. “Bu buluntu hepimizin. Müzede herkes görsün diye saklanacak,” dedi. Nil bunu duyunca daha da gururlandı.',
      ],
      questions: [
        {
          prompt: 'Nil topraktan ne buldu?',
          options: ['Altın bir yüzük', 'Eski bir testinin parçası', 'Taş bir heykel'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafta teyzesinin söylediklerini oku.',
          explanation: 'Doğru! Nil eski bir testinin parçasını buldu.',
        },
        {
          prompt: 'Teyzesi Nil’e neden toprağı yavaşça süpürmesini söyledi?',
          options: [
            'Topraktaki eski eşyalar kırılmasın diye',
            'Fırça çabuk eskimesin diye',
            'Nil yorulmasın diye',
          ],
          correctIndex: 0,
          hint: 'İpucu: Toprağın altında çok eski ve kırılgan şeyler olabilir. Hızlı kazarsan ne olur?',
          explanation: 'Aferin! Eski eşyalar çok kırılgandır; acele edersek zarar görebilirler.',
        },
        {
          prompt: 'Bu hikâyeden ne öğreniyoruz?',
          options: [
            'Kazıda bulduğumuzu eve götürebileceğimizi',
            'Eski eşyaların hiçbir işe yaramadığını',
            'Eski buluntuların herkes için müzede korunduğunu',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta teyzesinin Nil’e söylediklerini oku.',
          explanation: 'Harika! Eski eserler hepimizindir; müzede korunur ve herkes görebilir.',
        },
      ],
      glossary: [
        {
          word: 'arkeologdu',
          meaning: 'Eski çağlardan kalan eşyaları kazıp inceleyen bilim insanıydı.',
        },
        { word: 'testinin', meaning: 'Su taşımaya yarayan, topraktan yapılmış kabın.' },
        { word: 'buluntu', meaning: 'Kazıda topraktan çıkarılan eski eşya.' },
      ],
    }),
    story(city, {
      position: 7,
      slug: 'tasa-yazilmis-mesaj',
      theme: TextTheme.HATIRALAR,
      title: 'Taşa Yazılmış Mesaj',
      summary:
        'Arda’nın Efes’te Eski Yunanca yazılmış bir taşın mesajını öğrenip kendi mesajını yazdığı gün.',
      level,
      paragraphs: [
        'Arda, Efes’in mermer caddesinde yürürken yerde duran büyük bir taşın önünde durdu. Taşın üstünde garip harfler vardı. Bazıları üçgene, bazıları yuvarlağa benziyordu.',
        '“Anne, bu ne yazısı?” diye sordu. Annesi taşın yanındaki tabelayı okudu. “Bu, Eski Yunanca. Efes’te yaşayanlar bu dili konuşur ve yazarmış,” dedi.',
        'Tabelada yazının anlamı da vardı. Halk, şehrin çeşmesini onarttığı için bir adama teşekkür ediyordu. Arda çok şaşırdı. Demek ki insanlar teşekkürlerini taşa yazarmış!',
        '“Neden kâğıda yazmamışlar?” diye sordu. Annesi, “Taş kolay kolay yok olmaz. Mesajlarının yüzlerce yıl sonra da okunmasını istemişler,” diye açıkladı.',
        'O akşam Arda defterine kısa bir mesaj yazdı: “Bugün Efes’i gezdim. Okuyan herkese selam!” Defteri özenle sakladı. Belki bir gün biri onu okuyacaktı.',
      ],
      questions: [
        {
          prompt: 'Taştaki yazı hangi dildeydi?',
          options: ['Türkçe', 'Eski Yunanca', 'İngilizce'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta annesinin söylediğine bak.',
          explanation: 'Doğru! Taştaki yazı Eski Yunancaydı.',
        },
        {
          prompt: 'Eskiden insanlar bazı mesajları neden taşa yazarmış?',
          options: [
            'Kâğıt çok pahalı olduğu için',
            'Taş daha güzel koktuğu için',
            'Taş uzun yıllar yok olmadığı için',
          ],
          correctIndex: 2,
          hint: 'İpucu: Dördüncü paragrafta annesinin açıklamasını oku.',
          explanation: 'Aferin! Taş kolay yok olmaz; mesaj yüzlerce yıl sonra bile okunabilir.',
        },
        {
          prompt: 'Arda defterine mesaj yazarken ne umuyordu?',
          options: [
            'Bir gün birinin onu okumasını',
            'Defterin kaybolmasını',
            'Annesinin kızmasını',
          ],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin son cümlesine bak.',
          explanation: 'Harika! Arda da Efesliler gibi mesajının bir gün okunmasını istedi.',
        },
      ],
      glossary: [
        { word: 'mermer', meaning: 'Parlak, sert ve değerli bir taş.' },
        { word: 'tabelayı', meaning: 'Üstünde bilgi yazan levhayı.' },
        { word: 'onarttığı', meaning: 'Bozulan bir şeyi tamir ettirdiği.' },
      ],
    }),
    story(city, {
      position: 8,
      slug: 'kaybolan-liman',
      theme: TextTheme.DOGA,
      title: 'Kaybolan Liman',
      summary:
        'Mete’nin Efes’te Liman Caddesi’ni görüp bir nehrin denizi nasıl geri çektiğini öğrendiği gün.',
      level,
      paragraphs: [
        'Mete, Efes’te geniş ve uzun bir caddenin başında durdu. Caddenin iki yanında sütunlar sıralanmıştı. Rehber, “Bu caddenin adı Liman Caddesi,” dedi.',
        'Mete etrafına baktı. Ne deniz vardı ne de gemi. Sadece tarlalar ve ağaçlar görünüyordu. “Liman nerede?” diye sordu şaşkınlıkla.',
        'Rehber güldü. “Çok eskiden deniz buraya kadar gelirdi. Gemiler bu caddenin ucuna yanaşır, yolcular inip bu yoldan şehre yürürdü,” dedi.',
        '“Peki deniz nereye gitti?” diye sordu Mete. Rehber anlattı: Yakındaki nehir, yüzyıllar boyunca denize toprak taşımıştı. Toprak biriktikçe liman doldu ve deniz kilometrelerce geriye çekildi.',
        'Mete uzaklara baktı. Bir nehrin bir şehrin haritasını değiştirebildiğine inanamıyordu. “Doğa da tıpkı usta bir ressam gibi,” diye düşündü.',
      ],
      questions: [
        {
          prompt: 'Mete etrafına bakınca neyi göremedi?',
          options: ['Ağaçları', 'Tarlaları', 'Denizi'],
          correctIndex: 2,
          hint: 'İpucu: İkinci paragrafın ilk iki cümlesine bak.',
          explanation: 'Doğru! Etrafta ne deniz vardı ne de gemi.',
        },
        {
          prompt: 'Deniz neden geri çekildi?',
          options: [
            'Nehrin taşıdığı toprak limanı doldurduğu için',
            'Gemiler suyu alıp götürdüğü için',
            'Deniz bir gün aniden kuruduğu için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Dördüncü paragrafta rehberin anlattıklarını oku.',
          explanation: 'Aferin! Nehrin yüzyıllarca taşıdığı toprak limanı doldurdu.',
        },
        {
          prompt: 'Mete hikâyenin sonunda doğa için ne düşündü?',
          options: [
            'Doğanın hiç değişmediğini',
            'Doğanın usta bir ressam gibi her şeyi değiştirebildiğini',
            'Doğanın korkutucu olduğunu',
          ],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafta Mete’nin aklından geçenleri oku.',
          explanation: 'Harika! Doğa yavaş yavaş ama güçlü bir şekilde dünyayı değiştirir.',
        },
      ],
      glossary: [
        { word: 'yanaşır', meaning: 'Kıyıya yaklaşıp durur.' },
        { word: 'biriktikçe', meaning: 'Üst üste toplandıkça.' },
        { word: 'kilometrelerce', meaning: 'Birçok kilometre uzağa kadar.' },
      ],
    }),
    story(city, {
      position: 9,
      slug: 'piril-ve-efesin-kedileri',
      theme: TextTheme.HATIRALAR,
      title: 'Pırıl ve Efes’in Kedileri',
      summary:
        'Pırıl’ın Efes’in bilge kedisi Zeytin’le antik kenti gezip Antalya’ya yola çıktığı gün.',
      level,
      paragraphs: [
        'Pırıl, Efes’in eski taşları arasında dolaşırken güneşlenen kedilerle karşılaştı. Efes’te çok kedi yaşardı. Kimi sütunların gölgesinde uyuyor, kimi ziyaretçileri izliyordu.',
        'Yaşlı ve bilge bir kedi olan Zeytin yanına geldi. “Hoş geldin yolcu. Nereye gidiyorsun?” diye sordu. Pırıl, memleketi Van’a döndüğünü anlattı.',
        'Zeytin ona Efes’i gezdirdi. Kütüphanenin önünde durdular, tiyatronun basamaklarında dinlendiler. Zeytin, “Bu taşlar binlerce insanın hikâyesini saklıyor,” dedi.',
        'Akşamüstü Zeytin onu bir tepeye götürdü. Uzakta tek başına duran bir sütun gösterdi. “Orada bir zamanlar dünyanın en büyük tapınaklarından biri vardı. Şimdi yalnızca o sütun kaldı,” dedi.',
        'Pırıl sütuna uzun uzun baktı. “Her şey değişse de hikâyeler kalıyor,” diye düşündü. Ertesi sabah Zeytin’e veda etti ve portakal kokulu Antalya’ya doğru yola çıktı.',
      ],
      questions: [
        {
          prompt: 'Pırıl’a Efes’i kim gezdirdi?',
          options: ['Yaşlı kedi Zeytin', 'Bir rehber', 'Küçük bir kız'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Bilge kedi Zeytin, Pırıl’a Efes’i gezdirdi.',
        },
        {
          prompt: 'Zeytin “bilge” bir kediydi. “Bilge” ne demektir?',
          options: ['Çok hızlı', 'Çok bilgili ve akıllı', 'Çok yaramaz'],
          correctIndex: 1,
          hint: 'İpucu: Zeytin, Pırıl’a Efes hakkında neler anlattı?',
          explanation: 'Aferin! Bilge, çok şey bilen ve akıllıca konuşan demektir.',
        },
        {
          prompt: 'Pırıl tek kalan sütuna bakınca ne düşündü?',
          options: [
            'Eski şeylerin önemsiz olduğunu',
            'Sütunun hemen yıkılacağını',
            'Her şey değişse de hikâyelerin kaldığını',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Pırıl’ın aklından geçenleri oku.',
          explanation: 'Harika! Taşlar ve hikâyeler geçmişi bize anlatmaya devam eder.',
        },
      ],
      glossary: [
        { word: 'bilge', meaning: 'Çok şey bilen, akıllı ve olgun.' },
        {
          word: 'tapınaklarından',
          meaning: 'Eski zamanlarda yapılmış büyük ve kutsal binalardan.',
        },
        { word: 'veda', meaning: 'Ayrılırken hoşça kal deme.' },
      ],
    }),
    chest(city, 10, 'Efes’in son hazinesi bu sandıkta; aç, lokumlarını al ve Antalya’ya koş!'),
  ],
};
