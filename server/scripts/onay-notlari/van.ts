import { quote, reason, type CityNotes } from './types.js';

export const vanNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; sürümlerin ortalaması 3,62-4,22 kelime, yani hedefin altında. Ateşman aralığı (85-100) cümleleri fazla uzatmaya izin vermiyor. Cümleler size fazla kesik geliyorsa işaretleyebilirsiniz.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: inci kefalinin başka balıkların dayanamadığı bu suya uyum sağladığı (“Van Gölü’nün Sırrı” G3, G4), badem çiçeklerinin uzun sürmeyip kısa sürede döküldüğü (“Akdamar’ın Badem Ağaçları” G3, G4), Van Kalesi’nin bulunduğu şehrin adının o zamanlar Tuşpa olduğu ve Urartuların başkenti olduğu (“Van Kalesi’nde Gün Batımı” G4), inci kefalinin yumurtalarını tatlı suya bıraktığı (“İnci Kefalinin Yolculuğu” G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**Akdamar’daki yapı:** G2 metninde adadaki yapının adı verilmiyor (“çok eski, taştan bir yapı”); yeni sürümlerde de verilmedi. Oymaların “bin yıldan daha eski” olduğu bilgisi G2’den geliyor.',
    '**G1’de sadeleştirilen ayrıntılar:** “Kedilerin Evinde” G1’de “kehribar” yerine “sarı” denildi. “Eve Dönüş” G1’de şehirler tek tek sayılmadı (“vapurları, eski taşları, balonları…”). “Van Kalesi’nde Gün Batımı” G1’de Urartular ve “üç bin yıl” yerine “çok, çok eski” denildi.',
    '**Hikâyeye eklenen ayrıntılar:** Olaylar aynı kalsa da G3 ve G4’te küçük ayrıntılar eklendi: Emre’nin hayvanları sayarken en baştan başlaması ve annesinin fotoğraf çekmesi, rehberin Emre’ye “her birine dikkatle bakmanı” demesi (G4), Kerim’in elini uzatıp geri çekmesi, Can’ın sayarken teyzesine dönmesi, Deniz’in bisiklet öğrenirken düştüğü günleri hatırlaması (G4), Fındık’ın Berk’e doğru yürümesi ve çocukların parmak uçlarında dolaşması, Zehra’nın ödevlerinden sonra dokuması, Pırıl’ın kardeşlerinin “Sonra?” diye sorması. Hikâyeyi değiştirdiğini düşündüğünüz yerleri işaretleyebilirsiniz.',
    '**Mecazlar (G4):** “tek bir mavi örtüye dönüşüyordu”, “dantel gibi beyaz köpükler”, “dağlar … onun sırlarını dinliyormuş gibi”, “pembe beyaz bir halıyla örtüyordu”, “dev bir gemi gibi yükselen”, “geçmişi korumak, geleceğe bir mektup bırakmak gibidir”, “binlerce minik ayna taşıyormuş gibi”, “tamamlanmayı bekleyen bir masal gibi”, “her şekil bir kelime, her sıra da bir cümle gibiydi”, “gökyüzünün yere inmiş bir parçası gibi”, “yüreğinde bir taş gibi taşıdığı özlem” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
    '**“Eve Dönüş” ve okura seslenme:** Bu son hikâyede Pırıl bütün sürümlerde doğrudan okura (“Evet, sen!”) teşekkür ediyor. G4’teki paragraf yapısı sorusu bu özelliğe dayanır.',
  ],
  evidence: {
    'van-golunun-sirri-g1': [
      quote('“Bu göl sodalı,” dedi anneannesi.'),
      quote('Gölde tek bir balık yaşar: inci kefali.'),
      quote('Doğa ne güzel!'),
    ],
    'van-golunun-sirri-g3': [
      quote(
        'Suyu tuzlu ve sodalı olduğu için de içinde yalnızca bir tür balık yaşayabilir: inci kefali. Başka balıklar bu suya dayanamaz.',
      ),
      reason(
        'Göl o kadar geniştir ki Ayşe onu denize benzetip sorar: “Anneanne, bu bir deniz mi?” Sis ya da Ayşe’nin gözleriyle ilgili bir şey söylenmez.',
      ),
      reason(
        'Ayşe göle yakından bakınca sodalı suyun sırrını keşfeder ve günlüğüne “Doğa ne kadar şaşırtıcı!” yazar. Öbür şıklar metinde desteklenmez.',
      ),
    ],
    'van-golunun-sirri-g4': [
      reason(
        'Metin, Ayşe’nin gölün sodalı suyunu keşfedişini anlatır ve gölü “kendine özgü bir dünya” olarak tanıtır. Öbür başlıklar ya ayrıntıdır ya da metinde yoktur.',
      ),
      reason(
        'I doğru: “Suyu hem tuzlu hem sodalı olduğu için”. II yanlış: “yalnızca bir tür balık yaşayabilir”. III doğru: “Eskiden kadınlar çamaşırlarını sabun kullanmadan, bu suyla yıkarmış.”',
      ),
      reason(
        '“sanmıştı” ve “oysa” sözcükleri, Ayşe’nin göller hakkındaki eski düşüncesini gölü tanıdıktan sonraki düşüncesiyle karşılaştırır; yani bakışı değişmiştir.',
      ),
    ],
    'akdamarin-badem-agaclari-g1': [
      quote('Ada çiçeklerle doluydu.'),
      reason(
        'Aslanlar ve kuşlar duvarda, “taşa oyulmuştu”; yani taş kazınarak şekil verilmişti. Boya ya da kâğıttan söz edilmez.',
      ),
      quote('“Yine gelelim,” dedi Emre.'),
    ],
    'akdamarin-badem-agaclari-g3': [
      reason(
        'Cümlenin devamı nedeni verir: “çünkü adanın her yeri beyaz ve pembe çiçeklerle kaplıydı.” Emre gördüğü manzaraya şaşırmıştır.',
      ),
      quote('Onuncuda şaşırdı, on beşincide karıştırdı ve en baştan başlamak zorunda kaldı.'),
      quote('Rehber, bu oymaların bin yıldan daha eski olduğunu'),
    ],
    'akdamarin-badem-agaclari-g4': [
      reason(
        'Son paragraf kısa süren çiçeklerle yüzyıllardır duran oymaları yan yana koyar: “çiçekler yakında dökülecek, ama taştaki hayvanlar yüzyıllardır olduğu gibi yerinde kalacaktı.” Emre ikisine de hayran kalır.',
      ),
      quote(
        'İlkbaharda hepsi birden çiçek açar ama bu güzellik uzun sürmez; kısa bir süre sonra çiçekler dökülür,',
      ),
      reason(
        'Emre hayvanları sayarken defalarca karıştırır; rehber ondan saymak yerine “her birine dikkatle” bakmasını ister. Ustanın emeği ayrıntılara bakınca görülür.',
      ),
    ],
    'van-kalesinde-gun-batimi-g1': [
      quote('Ona zarar vermek istemedi.'),
      reason(
        'Kerim işaretleri görünce “Bunlar ne?” diye sorar; yani ne olduklarını öğrenmek ister.',
      ),
      reason(
        'Lale renklere bakıp “Biri göğü boyuyor” der; manzarayı bir resme benzetecek kadar beğenmiştir.',
      ),
    ],
    'van-kalesinde-gun-batimi-g3': [
      quote('Urartular yazılarını keskilerle kayalara kazırlarmış.'),
      reason(
        'Kerim kayalarda binlerce yıllık çivi yazısını görmüştür; babası da kayaları korursak “hatırlamaya devam edecekler” der. Kayalar, üstlerindeki yazılarla geçmişi bugüne taşır.',
      ),
      quote('Belki onlar da tıpkı kendisi gibi gökyüzünün renklerine hayran kalmış'),
    ],
    'van-kalesinde-gun-batimi-g4': [
      reason(
        'Kerim çivi yazısına zarar vermekten kaçınır; babası da “geçmişi korumak, geleceğe bir mektup bırakmak gibidir” der. Metin, tarihî yerlerin geçmişi taşıdığını ve korunması gerektiğini işler.',
      ),
      reason(
        'I doğru: “O zamanlar bu şehrin adı Tuşpa’ymış ve Urartuların başkentiymiş.” II yanlış: Kerim elini “vazgeçip geri çekti ve parmağıyla işaretlerin üstünden geçmedi”. III doğru: “Urartular yazılarını keskilerle kayalara kazırlarmış.”',
      ),
      reason(
        'Mektup, sonradan okunmak için bırakılır. Baba, korunursa “hatırlamaya devam edecek” kayaları bizden sonrakilere bırakılan bir mektuba benzetir.',
      ),
    ],
    'tabak-tabak-van-kahvaltisi-g1': [
      quote('Yirmiye gelince durdu.'),
      reason(
        'Can bunu yirmi tabak saydıktan sonra söyler; şölen bol yemekli, neşeli bir sofradır.',
      ),
      quote('Elif teyzesine sarıldı. “En güzeli birlikte olmamız,” dedi.'),
    ],
    'tabak-tabak-van-kahvaltisi-g3': [
      quote('Çaylar defalarca tazelendi ama kimse saatin nasıl geçtiğini fark etmedi.'),
      reason(
        'Sonraki cümle evin nasıl neşelendiğini anlatır: “Dedesi eski günleri anlattı, kuzenler güldü”.',
      ),
      quote('Bence bu sofranın en güzel yanı yemekler değil, hep birlikte olmamız'),
    ],
    'tabak-tabak-van-kahvaltisi-g4': [
      quote('Elif, sofranın asıl tadını yemeklerde değil, insanlarda bulmuştu.'),
      reason(
        'Son cümle yeni bir olay anlatmaz; Elif’in “hep birlikte olmamız” sözünü “sofranın asıl tadını yemeklerde değil, insanlarda bulmuştu” diyerek pekiştirir.',
      ),
      quote(
        'Van’da kahvaltı acele edilmez, evladım; sofra kalabalık olur, herkes sohbet eder; kimse kalkmak için bahane aramaz',
      ),
    ],
    'inci-kefalinin-yolculugu-g1': [
      quote('Burada yumurta bırakırlar.'),
      reason('Balık şelalenin üstüne çıkınca “Deniz alkışladı.” Alkışlamak sevinci gösterir.'),
      quote('Tekrar tekrar deneyeceğim,'),
    ],
    'inci-kefalinin-yolculugu-g3': [
      reason(
        'Dede “Onları rahat bırakırsak her yıl geri gelirler” der; üçüncü paragrafa göre balıklar yumurtalarını çaylara bırakır ve “Yavrular biraz büyüyünce göle dönerler.” Böylece göl balıksız kalmaz.',
      ),
      quote('Her ilkbahar tuzlu gölden çıkıp tatlı sulu çaylara gelirler,'),
      quote('Ben de zor bir şeyi başaramadığımda o balık gibi tekrar tekrar deneyeceğim,'),
    ],
    'inci-kefalinin-yolculugu-g4': [
      quote('Balık her düşüşten sonra biraz soluklanıyor, sonra yeniden hamle yapıyordu.'),
      reason(
        'I yanlış: “yumurtalarını tatlı suya bırakırlar.” II doğru: “Yavrular biraz büyüyünce göle dönerler.” III doğru: “bu dönemde balık avlamanın yasak olduğunu anlattı.”',
      ),
      reason(
        'Dede, balıkları bu dönemde rahat bırakmamızı ister: “Onları rahat bırakırsak her yıl geri gelirler.” Doğadan yararlanırken onun yenilenmesine fırsat tanımak gerekir; hiç yararlanmamak söylenmez.',
      ),
    ],
    'kedilerin-evinde-g1': [
      quote('“Van kedileri suyu sever,” dedi Zehra Hanım.'),
      quote('Suyla oynamaya başladı. Bütün sınıf güldü.'),
      reason(
        'Berk, Fındık’ı okşar ve “Büyüyünce veteriner olacağım” der; bu, hayvanları sevdiğini gösterir.',
      ),
    ],
    'kedilerin-evinde-g3': [
      reason(
        'Zehra Hanım “Van kedileri suyla oynamayı sever” der; hemen ardından Fındık “su kabına patisini daldırdı ve suyu şapırdatarak oynamaya başladı.” Öbür şıklar bu sözle ilgili değildir.',
      ),
      quote('Van kedilerinin tüyleri genellikle bembeyaz ve yumuşaktır.'),
      reason(
        'Berk Fındık’ı “nazikçe” okşar ve “hayvanlara yardım eden bir veteriner olmaya” karar verir.',
      ),
    ],
    'kedilerin-evinde-g4': [
      quote('Ama bir hazineyi yalnızca sevmek yetmez, onu korumak da gerekir.'),
      reason(
        'Yüzebilen ve gözleri farklı olan kediler için “bazıları” denir; bu yüzden “bütün” diyen şıklar kesin değildir. Kedilerin yalnızca bu evde yaşadığı da söylenmez. Fındık’ın suyla oynadığı ise dördüncü paragrafta görülür.',
      ),
      reason(
        'Üçüncü paragrafta bazı çocuklar Zehra Hanım’ın sözlerine “inanmakta zorlanıp” kaşlarını kaldırır; dördüncü paragrafta Fındık, “sözlerini kanıtlamak istercesine” suyla oynar.',
      ),
    ],
    'ninemin-kilimi-g1': [
      quote('“Bu koçboynuzu. Güç demek.'),
      quote('İlk sırası eğri oldu.'),
      quote('Zehra kedisini gururla gösterdi.'),
    ],
    'ninemin-kilimi-g3': [
      quote('Eskiden kadınlar duygularını, dileklerini kilimlere dokurdu.'),
      reason(
        'Zehra’nın ilk sırası eğri olunca “yüzü asıldı”; ninesi kendi ilk kiliminin de eğri olduğunu söyleyip “El alıştıkça düzelir” diyerek onu cesaretlendirir.',
      ),
      quote('iki gözü farklı renkte, beyaz bir kedi.'),
    ],
    'ninemin-kilimi-g4': [
      quote('Duvardaki kilimde artık iki kuşağın hikâyesi yan yana duruyordu'),
      reason(
        'Ninesi bu sözü, Zehra’nın ilk sırası eğri olup “bir an her şeyi bırakmak” istediği anda söyler. İpi bırakmamak, vazgeçmemek demektir.',
      ),
      reason(
        'I doğru: “Bu koçboynuzu, güç ve cesaret demek.” II yanlış: “Zehra’nın ilk sırası eğri oldu.” III yanlış: “Bu desen hiçbir eski kilimde yoktu.”',
      ),
    ],
    'eve-donus-g1': [
      quote('Bu, Pırıl’ın annesiydi!'),
      quote('Bana hikâye okuyan bir arkadaşım vardı.'),
      quote('“Evet, sen! Teşekkür ederim, arkadaşım.”'),
    ],
    'eve-donus-g3': [
      reason(
        'Pırıl annesine bu uzun yolu “hikâyeler okuyan bir arkadaşım” sayesinde geldiğini söyler; okunan her hikâye onu evine biraz daha yaklaştırmıştır.',
      ),
      reason(
        'Metin, Pırıl’ın ailesine kavuşmasını ve bu yolu okunan hikâyeler sayesinde geldiğini anlatır. Portakallar ve uyku yalnızca ayrıntıdır; metinde kardeşlerin oynadığı bir oyun yoktur.',
      ),
      quote('Her şehirde benim için hikâyeler okuyan bir arkadaşım vardı,'),
    ],
    'eve-donus-g4': [
      quote(
        'Okumayı seven biri için yolculuklar hiç bitmez; her kitap, yeni bir yolun başlangıcıdır.',
      ),
      reason(
        'Öbür paragraflarda Pırıl ailesiyle konuşur ya da olaylar anlatılır; beşinci paragrafta Pırıl “doğrudan sana baktı” ve “Evet, sen!” diyerek okura seslenir.',
      ),
      reason(
        'Pırıl, kardeşlerine anlattıkları arasında “Kapadokya’nın balonlarını” da sayar. Yolculuğa annesiyle çıktığı, kardeşlerinin şehirleri gezdiği ya da bir daha yolculuğa çıkmayacağı söylenmez.',
      ),
    ],
  },
};
