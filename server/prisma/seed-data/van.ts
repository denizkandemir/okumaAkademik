import { City, ReadingLevel, TextTheme } from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.VAN;

/** 6. durak (final) — "Pırıl'ın Memleketi" */
export const van: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'van-golunun-sirri',
      theme: TextTheme.DOGA,
      title: 'Van Gölü’nün Sırrı',
      summary:
        'Ayşe’nin anneannesiyle Van Gölü’nün sabun gibi köpüren sodalı suyunun sırrını keşfettiği sabah.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Ayşe, yaz tatilini Van’daki anneannesinin yanında geçiriyordu. Bir sabah birlikte Van Gölü’nün kıyısına indiler. Göl o kadar büyüktü ki karşı kıyısı görünmüyordu. Ayşe, “Anneanne, bu bir deniz mi?” diye sordu.',
        'Anneannesi güldü. “Hayır, bu bir göl. Hem de Türkiye’nin en büyük gölü. Ama sıradan bir göl değil, bir sırrı var,” dedi. Sonra eğilip avucuna biraz su aldı.',
        '“Elini suya sok ve parmaklarını birbirine sürt,” dedi anneannesi. Ayşe dediğini yaptı. Parmakları kaygan kaygan oldu, sanki sabunlu suya dokunmuştu! Kıyıya vuran dalgaların üstünde de beyaz köpükler vardı.',
        '“Bu göl sodalıdır,” diye anlattı anneannesi. “Eskiden kadınlar çamaşırlarını sabunsuz, bu suyla yıkarmış. Suyu tuzlu ve sodalı olduğu için içinde yalnızca bir tür balık yaşayabilir: inci kefali.”',
        'Ayşe hayretle göle baktı. Su, güneşin altında turkuaz renginde parlıyordu. Uzaktaki karlı dağlar göle doğru eğilmiş gibiydi.',
        'O akşam Ayşe günlüğüne şunu yazdı: “Bugün sabun gibi köpüren bir göl gördüm. Doğa ne kadar şaşırtıcı!” Sonra kalemini bıraktı ve ertesi gün göle yine gitmeyi hayal etti.',
      ],
      questions: [
        {
          prompt: 'Van Gölü’nde hangi balık yaşayabilir?',
          options: ['Alabalık', 'İnci kefali', 'Hamsi'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafta anneannenin anlattıklarını oku.',
          explanation:
            'Doğru! Van Gölü’nün tuzlu ve sodalı suyunda yalnızca inci kefali yaşayabilir.',
        },
        {
          prompt: 'Ayşe’nin parmakları neden kaygan oldu?',
          options: [
            'Gölün suyu sodalı olduğu için',
            'Elinde sabun olduğu için',
            'Su çok soğuk olduğu için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Anneannesi gölün sırrını nasıl açıkladı?',
          explanation: 'Aferin! Gölün sodalı suyu, parmakları sabunlu su gibi kaygan yapar.',
        },
        {
          prompt: 'Ayşe günlüğüne yazdıklarına göre ne hissediyordu?',
          options: ['Gölden korktuğunu', 'Tatilden sıkıldığını', 'Doğaya hayran kaldığını'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Ayşe’nin günlüğüne yazdığı cümleleri oku.',
          explanation: 'Harika! Ayşe doğanın şaşırtıcı güzelliğine hayran kaldı.',
        },
      ],
      glossary: [
        { word: 'kaygan', meaning: 'Üstünde kolayca kayılan, sabun gibi.' },
        { word: 'sodalı', meaning: 'İçinde soda denen, suyu kaygan yapan bir madde bulunan.' },
        { word: 'turkuaz', meaning: 'Mavi ile yeşil arası, açık bir renk.' },
      ],
    }),
    story(city, {
      position: 2,
      slug: 'akdamarin-badem-agaclari',
      theme: TextTheme.KESIF,
      title: 'Akdamar’ın Badem Ağaçları',
      summary:
        'Emre’nin baharda Akdamar Adası’nda badem çiçekleri arasında taş oymalardaki hayvanları saydığı gün.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Nisan ayında Emre ve ailesi, Gevaş’tan küçük bir tekneye bindiler. Tekne, Van Gölü’nün mavi sularında Akdamar Adası’na doğru ilerliyordu. Martılar teknenin peşinden uçuyordu. Emre elini teknenin kenarından uzatıp serin suya dokundu.',
        'Adaya yaklaştıklarında Emre’nin ağzı açık kaldı. Adanın her yeri beyaz ve pembe çiçeklerle kaplıydı. Babası, “Bunlar badem ağaçları. İlkbaharda hepsi birden çiçek açar,” dedi.',
        'Tekneden inip çiçekli ağaçların arasında yürüdüler. Rüzgâr esince küçük taç yapraklar kar gibi yağıyordu. Emre kollarını açıp döndü. Saçları çiçek yapraklarıyla doldu.',
        'Adanın tepesinde çok eski, taştan bir yapı vardı. Yapının duvarlarına aslanlar, kuşlar ve başka birçok hayvan oyulmuştu. Rehber, bu oymaların bin yıldan daha eski olduğunu anlattı.',
        'Emre duvarlardaki hayvanları saymaya başladı. Onuncuda şaşırdı, on beşincide karıştırdı. Gülerek, “Usta bu kadar hayvanı taşa nasıl sığdırmış?” dedi.',
        'Dönüş yolunda Emre arkasına baktı. Ada, gölün ortasında pembe bir bulut gibi duruyordu. “Gelecek bahar yine gelelim,” dedi. Annesi gülümseyerek söz verdi.',
      ],
      questions: [
        {
          prompt: 'Akdamar Adası ilkbaharda neyle kaplıydı?',
          options: ['Karla', 'Badem çiçekleriyle', 'Kumla'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta babasının söylediklerini oku.',
          explanation: 'Doğru! Ada beyaz ve pembe badem çiçekleriyle kaplıydı.',
        },
        {
          prompt: '“Ada, gölün ortasında pembe bir bulut gibi duruyordu.” Bu cümle ne anlatıyor?',
          options: [
            'Çiçekli ada uzaktan pembe bir buluta benziyordu',
            'Adanın üstünde yağmur bulutu vardı',
            'Ada suya batıyordu',
          ],
          correctIndex: 0,
          hint: 'İpucu: Ada neyle kaplıydı? Uzaktan bakınca neye benzemiş olabilir?',
          explanation: 'Aferin! Çiçeklerle kaplı ada, uzaktan pembe bir bulut gibi görünüyordu.',
        },
        {
          prompt: 'Emre adadan ayrılırken ne istedi?',
          options: ['Bir daha hiç gelmemeyi', 'Teknede uyumayı', 'Gelecek bahar yine gelmeyi'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Emre’nin söylediği söze bak.',
          explanation: 'Harika! Emre adayı o kadar sevdi ki yine gelmek istedi.',
        },
      ],
      glossary: [
        { word: 'taç yapraklar', meaning: 'Çiçeğin renkli, ince yaprakları.' },
        { word: 'oymaların', meaning: 'Taşı ya da tahtayı kazıyarak yapılan süslerin.' },
        { word: 'bahar', meaning: 'İlkbahar mevsimi.' },
      ],
    }),
    story(city, {
      position: 3,
      slug: 'van-kalesinde-gun-batimi',
      theme: TextTheme.HATIRALAR,
      title: 'Van Kalesi’nde Gün Batımı',
      summary:
        'Kerim’in Van Kalesi’nde Urartulardan kalan çivi yazısını görüp göl üstünde gün batımını izlediği akşam.',
      level: ReadingLevel.ILERI,
      paragraphs: [
        'Kerim ile ablası Lale, Van Gölü’nün kıyısında yükselen uzun bir kayanın önündeydi. Kayanın üstünde surlar, burçlar ve merdivenler vardı. Babaları, “İşte Van Kalesi. Yaklaşık üç bin yıl önce Urartular tarafından yapıldı,” dedi.',
        'Taş basamakları tek tek çıktılar. Kerim yorulmuştu ama merakı yorgunluğundan büyüktü. Yolun bir yerinde kayaya kazınmış, çivilere benzeyen küçük işaretler gördü. “Bunlar ne?” diye sordu.',
        '“Bu, çivi yazısı,” dedi babası. “Urartular yazılarını keskilerle kayalara kazırlarmış. Burada bir kralın yaptırdığı işler anlatılıyor.” Kerim parmağıyla işaretlerin üstünden geçmedi; eski yazıya zarar vermek istemiyordu.',
        'Kalenin tepesine vardıklarında güneş batmak üzereydi. Göl, turuncu ve mor renklere bürünmüştü. Uzaktaki dağların tepeleri pembe pembe parlıyordu. Lale, “Sanki biri gökyüzünü boyuyor,” diye fısıldadı.',
        'Kerim, binlerce yıl önce aynı yerde duran nöbetçileri düşündü. Onlar da bu gün batımını izlemiş miydi? Belki onlar da gökyüzünün renklerine hayran kalmıştı.',
        'İnerken Kerim babasına döndü: “Kayalar çok şey hatırlıyor, değil mi baba?” Babası gülümsedi. “Evet. Biz de onları korursak hatırlamaya devam edecekler,” dedi.',
      ],
      questions: [
        {
          prompt: 'Babasına göre Van Kalesi’ni kimler yaptı?',
          options: ['Romalılar', 'Urartular', 'Osmanlılar'],
          correctIndex: 1,
          hint: 'İpucu: Birinci paragrafta babalarının söylediklerini oku.',
          explanation: 'Doğru! Van Kalesi yaklaşık üç bin yıl önce Urartular tarafından yapıldı.',
        },
        {
          prompt: 'Kerim neden parmağıyla işaretlerin üstünden geçmedi?',
          options: [
            'Eski yazıya zarar vermek istemediği için',
            'Kaya çok sıcak olduğu için',
            'Yazıyı okuyamadığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafın son cümlesine bak.',
          explanation:
            'Aferin! Binlerce yıllık yazılar çok değerlidir; onlara dokunmadan bakmalıyız.',
        },
        {
          prompt: 'Babası, kayaların hatırlamaya devam etmesi için ne gerektiğini söyledi?',
          options: ['Onları boyamamız', 'Üstlerine adımızı yazmamız', 'Onları korumamız'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta babasının cevabını oku.',
          explanation: 'Harika! Tarihî yerleri korursak geçmişin hikâyeleri yaşamaya devam eder.',
        },
      ],
      glossary: [
        { word: 'surlar', meaning: 'Bir kaleyi ya da şehri çevreleyen kalın duvarlar.' },
        { word: 'bürünmüştü', meaning: 'Bir renge sarılmış gibi olmuştu.' },
        { word: 'nöbetçileri', meaning: 'Bir yeri korumak için sırayla bekleyen kişileri.' },
      ],
    }),
    story(city, {
      position: 4,
      slug: 'tabak-tabak-van-kahvaltisi',
      theme: TextTheme.AILE,
      title: 'Tabak Tabak Van Kahvaltısı',
      summary:
        'Elif’in tabak tabak Van kahvaltısında sofranın en güzel yanının birlikte olmak olduğunu fark ettiği sabah.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Pazar sabahı Elif’in teyzesi bütün aileyi Van kahvaltısına çağırdı. Elif ile kuzeni Can, sofrayı kurmaya yardım edecekti. Mutfağa girdiklerinde tezgâh küçük tabaklarla doluydu.',
        'Teyzesi tabakları tek tek tanıttı: “Bu otlu peynir; içinde dağlarda yetişen kokulu otlar var. Bu bal ve kaymak. Bu da murtuğa; un, tereyağı ve yumurtayla yapılır, sıcak sıcak yenir.” Elif bu kadar çok çeşidi ilk kez görüyordu.',
        'Can tabakları saymaya başladı. “On, on bir, on iki…” Yirmiye gelince saymayı bıraktı ve güldü. “Teyze, bu bir kahvaltı mı, yoksa bir şölen mi?”',
        'Teyzesi, “Van’da kahvaltı acele edilmez. Sofra kalabalık olur, herkes sohbet eder,” dedi. Elif ile Can tabakları masaya dizdiler. Çayı da Elif’in dedesi demledi.',
        'Herkes sofraya oturunca ev şenlendi. Dedesi eski günleri anlattı, kuzenler güldü, küçük Mina bal sürülmüş ekmeğini parmaklarına kadar yedi.',
        'Kahvaltı bittiğinde Elif teyzesine sarıldı. “Bence bu sofranın en güzel yanı yemekler değil, hep birlikte olmamız,” dedi. Teyzesi onun yanaklarından öptü.',
      ],
      questions: [
        {
          prompt: 'Teyzesine göre murtuğa neyle yapılır?',
          options: ['Un, tereyağı ve yumurtayla', 'Pirinç ve sütle', 'Peynir ve domatesle'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta teyzesinin tabakları tanıttığı yeri oku.',
          explanation: 'Doğru! Murtuğa un, tereyağı ve yumurtayla yapılır.',
        },
        {
          prompt: 'Can “Bu bir şölen mi?” diye sordu. “Şölen” ne demektir?',
          options: [
            'Küçük bir atıştırmalık',
            'Bol yemekli, neşeli büyük bir sofra',
            'Bir çeşit peynir',
          ],
          correctIndex: 1,
          hint: 'İpucu: Can tabakları saymaya başlamış ve yirmiye kadar saymıştı.',
          explanation: 'Aferin! Şölen, bol yemekli ve neşeli büyük bir sofradır.',
        },
        {
          prompt: 'Elif’e göre sofranın en güzel yanı neydi?',
          options: ['Bal ve kaymak', 'Tabakların sayısı', 'Hep birlikte olmaları'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Elif’in teyzesine söylediği söze bak.',
          explanation:
            'Harika! Güzel bir sofrayı en çok sevdiklerimizle birlikte olmak güzelleştirir.',
        },
      ],
      glossary: [
        { word: 'şölen', meaning: 'Bol yemekli, neşeli büyük sofra.' },
        { word: 'demledi', meaning: 'Çayı demliğe koyup yavaşça pişmeye bıraktı.' },
        { word: 'şenlendi', meaning: 'Neşe ve hareketle doldu.' },
      ],
    }),
    chest(city, 5, 'Van Gölü kıyısında mavi bir sandık bulundu; aç, içindeki lokumlar senin!'),
    story(city, {
      position: 6,
      slug: 'inci-kefalinin-yolculugu',
      theme: TextTheme.DOGA,
      title: 'İnci Kefalinin Yolculuğu',
      summary:
        'Deniz’in dedesiyle inci kefallerinin akıntıya karşı yüzüp şelalelerden sıçradığı bahar göçünü izlediği gün.',
      level: ReadingLevel.ILERI,
      paragraphs: [
        'Mayıs ayının ılık bir gününde Deniz, dedesiyle birlikte Van Gölü’ne dökülen bir çayın kenarına gitti. Dedesi, “Bugün sana gölün en büyük yolculuğunu göstereceğim,” dedi.',
        'Çayın suyu köpürerek akıyordu. Birden Deniz suyun içinde gümüş gibi parlayan yüzlerce balık gördü. Balıklar akıntının tersine, yukarıya doğru yüzmeye çalışıyordu. Bazıları küçük şelalelerin üstünden sıçrayarak atlıyordu.',
        '“Bunlar inci kefali,” dedi dedesi. “Her ilkbahar tuzlu gölden çıkıp tatlı sulu çaylara gelirler. Yumurtalarını burada bırakırlar. Yavrular biraz büyüyünce göle dönerler.”',
        'Deniz, bir balığın defalarca denediğini, her seferinde suya geri düştüğünü gördü. Sonunda balık güçlü bir sıçrayışla şelalenin üstüne çıktı. Deniz sevinçle alkışladı.',
        'Dedesi, bu dönemde balık avlamanın yasak olduğunu anlattı. “Onları rahat bırakırsak her yıl geri gelirler. Göl de onlarla yaşamaya devam eder,” dedi.',
        'Eve dönerken Deniz o inatçı balığı düşündü. “Ben de zor bir şeyi başaramadığımda o balık gibi tekrar tekrar deneyeceğim,” dedi. Dedesi onu gururla omzundan tuttu.',
      ],
      questions: [
        {
          prompt: 'İnci kefalleri yumurtalarını nereye bırakır?',
          options: ['Gölün en derin yerine', 'Tatlı sulu çaylara', 'Kumsala'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta dedesinin anlattıklarını oku.',
          explanation: 'Doğru! İnci kefalleri yumurtalarını tatlı sulu çaylara bırakır.',
        },
        {
          prompt: 'Bu dönemde balık avlamak neden yasaktır?',
          options: [
            'Balıklar yumurtlayıp çoğalabilsin diye',
            'Balıklar çok küçük olduğu için',
            'Çayların suyu kuruduğu için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Balıklar çaylara ne yapmak için geliyordu? Dedesi beşinci paragrafta ne dedi?',
          explanation:
            'Aferin! Balıklar rahat bırakılırsa yumurtlar, çoğalır ve her yıl geri gelir.',
        },
        {
          prompt: 'Deniz inatçı balıktan ne öğrendi?',
          options: [
            'Suya hiç yaklaşmamayı',
            'Zorlanınca hemen vazgeçmeyi',
            'Başaramayınca tekrar tekrar denemeyi',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Deniz’in söylediği söze bak.',
          explanation: 'Harika! Vazgeçmeden denemeye devam eden sonunda başarır.',
        },
      ],
      glossary: [
        { word: 'akıntının', meaning: 'Suyun aktığı yönün.' },
        { word: 'sıçrayışla', meaning: 'Bir anda havaya fırlayarak yapılan atlayışla.' },
        { word: 'inatçı', meaning: 'Kolay kolay vazgeçmeyen.' },
      ],
    }),
    story(city, {
      position: 7,
      slug: 'kedilerin-evinde',
      theme: TextTheme.SORUMLULUK,
      title: 'Kedilerin Evinde',
      summary:
        'Berk’in Van Kedisi Evi’nde suyla oynamayı seven, iki gözü farklı renkte Fındık’la tanıştığı gün.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Berk’in sınıfı, Van’daki Van Kedisi Evi’ni ziyaret etti. İçeri girer girmez onlarca bembeyaz kedi çocukları karşıladı. Kimi minderlerde uyuyor, kimi oyuncak toplarla oynuyordu.',
        'Görevli Zehra Hanım kedileri tanıttı. “Van kedilerinin tüyleri genellikle bembeyaz ve yumuşaktır. Bazılarının gözleri farklı renktedir: biri mavi, biri kehribar,” dedi. Berk hemen iki gözü farklı renkte bir kedi buldu. Adı Fındık’tı.',
        'Zehra Hanım bir sır daha verdi: “Çoğu kedi sudan hoşlanmaz ama Van kedileri suyla oynamayı sever. Bazıları yüzebilir bile!” Çocuklar şaşkınlıkla bakıştı.',
        'Tam o sırada Fındık, köşedeki su kabına patisini daldırdı ve suyu şapırdatarak oynamaya başladı. Bütün sınıf kahkahalarla güldü.',
        'Zehra Hanım, bu evde Van kedilerinin korunduğunu ve bakıldığını anlattı. “Onlar Van’ın bir hazinesidir. Onları sevmek kadar korumak da bizim görevimiz,” dedi.',
        'Ayrılırken Berk, Fındık’ın başını nazikçe okşadı. Fındık mırlayarak gözlerini kırptı. Berk, “Sanki bana teşekkür ediyor,” dedi. O gün büyüyünce hayvanlara yardım eden bir veteriner olmaya karar verdi.',
      ],
      questions: [
        {
          prompt: 'Zehra Hanım’a göre Van kedileri neyi sever?',
          options: ['Hiç uyumamayı', 'Suyla oynamayı', 'Ağaçlara tırmanmayı'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta Zehra Hanım’ın verdiği sırrı oku.',
          explanation: 'Doğru! Van kedileri suyla oynamayı sever, bazıları yüzebilir bile.',
        },
        {
          prompt: 'Fındık su kabına patisini daldırınca çocuklar neden güldü?',
          options: [
            'Fındık, Zehra Hanım’ın anlattığı gibi suyla oynamaya başladığı için',
            'Fındık su kabını devirip kaçtığı için',
            'Fındık çok kızdığı için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Zehra Hanım az önce Van kedileri hakkında ne söylemişti?',
          explanation: 'Aferin! Fındık, anlatılanı hemen göstererek herkesi güldürdü.',
        },
        {
          prompt: 'Zehra Hanım’a göre Van kedileri için görevimiz nedir?',
          options: ['Onları evlere kapatmak', 'Onlardan uzak durmak', 'Onları sevmek ve korumak'],
          correctIndex: 2,
          hint: 'İpucu: Beşinci paragrafta Zehra Hanım’ın söylediklerini oku.',
          explanation: 'Harika! Hayvanları sevmek kadar korumak da hepimizin görevidir.',
        },
      ],
      glossary: [
        { word: 'minderlerde', meaning: 'Yere ya da koltuğa konan yumuşak yastıklarda.' },
        { word: 'şapırdatarak', meaning: 'Suya vurup şap şap ses çıkararak.' },
        { word: 'veteriner', meaning: 'Hayvanları muayene edip tedavi eden doktor.' },
      ],
    }),
    story(city, {
      position: 8,
      slug: 'ninemin-kilimi',
      theme: TextTheme.AILE,
      title: 'Ninemin Kilimi',
      summary:
        'Zehra’nın ninesinden kilim desenlerinin anlamlarını öğrenip kilime kendi desenini dokuduğu günler.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Zehra’nın ninesi, Van’daki evinin bir köşesinde tezgâhının başında oturur, kilim dokurdu. Zehra okuldan dönünce hemen onun yanına koştu. Tezgâhta renkli iplerden yarım bir kilim vardı.',
        '“Nine, bu şekiller ne anlatıyor?” diye sordu Zehra. Ninesi parmağıyla bir deseni gösterdi. “Bu koçboynuzu. Güç ve cesaret demek. Bu da elibelinde; anneliği ve bereketi anlatır,” dedi.',
        'Zehra şaşırdı. Demek kilimdeki her şekil bir kelime gibiydi! Ninesi, “Eskiden kadınlar duygularını, dileklerini kilimlere dokurdu. Kilime bakan, onların hikâyesini okurdu,” diye anlattı.',
        'Zehra da denemek istedi. Ninesi ona ipi çözgülerin arasından nasıl geçireceğini gösterdi. Zehra’nın ilk sırası biraz eğri oldu. Ninesi gülümsedi: “Benim ilk kilimim de eğriydi. El alıştıkça düzelir.”',
        'Günler geçti. Zehra her gün okuldan sonra birkaç sıra dokudu. Sonunda kilimin bir köşesine kendi küçük desenini ekledi: iki gözü farklı renkte, beyaz bir kedi.',
        'Kilim bitince ninesi onu duvara astı. Zehra kendi kedisini gururla gösterdi. “Artık bu kilimde benim hikâyem de var,” dedi. Ninesi onu sevgiyle kucakladı.',
      ],
      questions: [
        {
          prompt: 'Ninesine göre koçboynuzu deseni ne anlatır?',
          options: ['Güç ve cesaret', 'Yağmur ve su', 'Uyku ve rüya'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta ninesinin gösterdiği ilk deseni oku.',
          explanation: 'Doğru! Koçboynuzu deseni güç ve cesaret demektir.',
        },
        {
          prompt: 'Zehra neden kilimdeki her şeklin bir kelime gibi olduğunu düşündü?',
          options: [
            'Desenler harflerden oluştuğu için',
            'Her desen bir anlam, bir duygu anlattığı için',
            'Ninesi ona kitap okuduğu için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Ninesi koçboynuzu ve elibelinde desenlerinin neyi anlattığını söyledi?',
          explanation: 'Aferin! Her desen kelimeler gibi bir anlam taşır ve bir hikâye anlatır.',
        },
        {
          prompt: 'Kilim bitince Zehra nasıl hissetti?',
          options: ['Üzüldü', 'Sıkıldı', 'Gurur duydu'],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Zehra’nın kedisini nasıl gösterdiğine bak.',
          explanation:
            'Harika! Zehra emek verip kendi hikâyesini kilime dokuduğu için gurur duydu.',
        },
      ],
      glossary: [
        { word: 'tezgâhının', meaning: 'Kilim ya da halı dokumaya yarayan aracının.' },
        {
          word: 'dokurdu',
          meaning: 'İplikleri birbirinin arasından geçirerek kumaş ya da kilim yapardı.',
        },
        { word: 'çözgülerin', meaning: 'Dokuma tezgâhında boyuna gerilmiş ipliklerin.' },
      ],
    }),
    story(city, {
      position: 9,
      slug: 'eve-donus',
      theme: TextTheme.AILE,
      title: 'Eve Dönüş',
      summary:
        'Pırıl’ın Van Gölü kıyısında ailesine kavuşup yolculuk boyunca ona hikâye okuyan arkadaşına teşekkür ettiği mutlu son.',
      level: ReadingLevel.ORTA,
      paragraphs: [
        'Uzun bir yolculuğun sonunda Pırıl, Van Gölü’nün kıyısına vardı. Göl, gökyüzü kadar maviydi. Uzakta Akdamar Adası görünüyordu. Pırıl derin bir nefes aldı. Bu kokuyu çok iyi tanıyordu: memleketinin kokusu.',
        'Kıyıdaki küçük evin bahçesinde beyaz bir kedi oturuyordu. Pırıl’ı görünce ayağa fırladı. Bu, Pırıl’ın annesiydi! Arkasından iki küçük kardeşi koşarak geldi. Hepsi birden Pırıl’ın etrafını sardı.',
        'O akşam bütün aile göl kıyısında toplandı. Kardeşleri sordu: “Nerelere gittin? Neler gördün?” Pırıl anlatmaya başladı: İstanbul’un vapurlarını, İzmir’in imbatını, Efes’in eski taşlarını, Antalya’nın portakallarını, Kapadokya’nın balonlarını…',
        'Annesi şaşkınlıkla dinledi. “Bu kadar uzun yolu nasıl geldin?” diye sordu. Pırıl gülümsedi. “Yalnız değildim. Her şehirde benim için hikâyeler okuyan bir arkadaşım vardı,” dedi.',
        'Sonra Pırıl, bir gözü mavi, bir gözü kehribar, doğrudan sana baktı. “Evet, sen! Okuduğun her hikâye bana bir adım attırdı. Teşekkür ederim, sevgili arkadaşım,” dedi.',
        'Güneş gölün üstünde batarken Pırıl annesinin yanına kıvrıldı. Uyurken rüyasında yeni hikâyeler gördü. Çünkü biliyordu: Okumayı seven biri için yolculuklar hiç bitmez.',
      ],
      questions: [
        {
          prompt: 'Pırıl’ı kıyıdaki evin bahçesinde kimler karşıladı?',
          options: ['Annesi ve kardeşleri', 'Bir balıkçı', 'Efes’teki kedi Zeytin'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta bahçede kimlerin olduğunu oku.',
          explanation: 'Doğru! Pırıl’ı annesi ve iki küçük kardeşi karşıladı.',
        },
        {
          prompt: 'Pırıl neden “Yalnız değildim” dedi?',
          options: [
            'Annesi onunla birlikte yolculuk etmişti',
            'Her şehirde ona hikâye okuyan bir arkadaşı olduğu için',
            'Bir martı ona yol göstermişti',
          ],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafta Pırıl’ın annesine verdiği cevabı oku.',
          explanation: 'Aferin! Yolculuk boyunca ona hikâye okuyan bir arkadaşı vardı: sen!',
        },
        {
          prompt: 'Pırıl hikâyenin sonunda sana ne söyledi?',
          options: [
            'Artık hiç okumayacağını',
            'Yolculuktan sıkıldığını',
            'Okuduğun her hikâye için teşekkür ettiğini',
          ],
          correctIndex: 2,
          hint: 'İpucu: Beşinci paragrafta Pırıl doğrudan sana bakıp ne diyor?',
          explanation:
            'Harika! Pırıl, okuduğun her hikâye için sana teşekkür etti. Sen harika bir okursun!',
        },
      ],
      glossary: [
        { word: 'memleketinin', meaning: 'Doğup büyüdüğü yerin.' },
        { word: 'kehribar', meaning: 'Bal gibi sarı ile turuncu arası bir renk.' },
        { word: 'kıvrıldı', meaning: 'Vücudunu yuvarlak yapıp büzülerek yattı.' },
      ],
    }),
    chest(
      city,
      10,
      'Yolculuğun son sandığı! Aç, lokumlarını topla ve Pırıl’la birlikte eve dönüşü kutla!',
    ),
  ],
};
