import { quote, reason, type CityNotes } from './types.js';

export const antalyaNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; sürümlerin ortalaması 4,26-5,35 kelime, yani çoğu hedefin biraz altında. Ateşman aralığı (85-100) cümleleri fazla uzatmaya izin vermiyor. Cümleler size fazla kesik ya da fazla uzun geliyorsa işaretleyebilirsiniz.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: Yukarı Düden ile Aşağı Düden’in aynı suyun üzerinde olduğu (“Denize Dökülen Şelale” G4), yavruların yumurtalarda yaklaşık iki ay beklediği ve yavrulara dokunulmaması gerektiği (“Ay Işığında Yolculuk” G3, G4), Konyaaltı sahilinin çakıllı olduğu ve aşağı inildikçe havanın ısındığı (“Bir Günde Kar ve Deniz” G3, G4), peri bacalarının rüzgâr ve yağmurla çok uzun zamanda yontulduğu (“Pırıl ve Ressam” G3, G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**Hikâyeye eklenen ayrıntılar:** Olaylar aynı kalsa da G3 ve G4’te küçük ayrıntılar eklendi: Kaan’ın tatili sıkıcı sanması, Ela’nın başarısız denemelerinin tek tek anlatılması, Melis’in yaşlı bir komşusunun çocukluğunu hatırlaması, Can’ın yavruya yardım etmek isteyip durdurulması, Hasan Kaptan’ın eskiden gemilerde çalışması ve “Işık yanmalıydı” demesi, Arda’nın beresi. Hikâyeyi değiştirdiğini düşündüğünüz yerleri işaretleyebilirsiniz.',
    '**“Deniz Feneri Bekçisi” hikâyesi:** G2 metninde Antalya’dan söz edilmiyor; yeni sürümlerde de ada ve fener için yer adı verilmedi. Fener ve ada kurgudur.',
    '**“Kayalıklara çarpma” ve fırtına:** “Deniz Feneri Bekçisi” sürümlerinde fırtına ve tehlike korku yaratmayacak bir dille anlatıldı. G1’de kayalık tehlikesi hiç geçmiyor. 1-2. sınıf için tonu kontrol etmenizi rica ederiz.',
    '**Mecazlar (G4):** “evler, sokağın üstünden fısıldaşıyor gibiydi”, “ellerinde bir bilmeceye dönüştü”, “dünya o perdenin ardında bulanıklaşıyordu”, “sepet boşaldıkça bir şeyler doluyordu”, “gece birden genişledi”, “ona yer açmaktı”, “mevsimlerin yeryüzünün şeklinde yazılı olması”, “Pırıl’ın aradığı pusula oldu” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
  ],
  evidence: {
    'kaleicinde-ipucu-avi-g1': [
      quote('İçinde Kaan’ın en sevdiği kitap duruyordu!'),
      quote(
        '“Sokağa taşan pencereleri bul,” diyordu. Kaan dar sokaklarda başını kaldırdı. “Bunlara cumba denir,” dedi babaannesi.',
      ),
      quote('Kaan babaannesine sarıldı. “Bu en güzel oyundu,” dedi.'),
    ],
    'kaleicinde-ipucu-avi-g3': [
      reason(
        'Kaan aynı sokaklardan geçer ama artık “Kaleiçi’nin her köşesi ona bir hikâye” anlatmaktadır; değişen sokaklar değil, Kaan’ın bakışıdır.',
      ),
      quote('Babaannesi, kapının yaklaşık iki bin yıl önce yapıldığını anlattı.'),
      reason(
        'Kaan ipuçlarının peşinde kapıyı, cumbaları ve limanı öğrenir; sonunda da her köşenin bir hikâye anlattığını fark eder. Öbür şıklar metinde söylenmez.',
      ),
    ],
    'kaleicinde-ipucu-avi-g4': [
      quote('Kaleiçi’nin her köşesi, dinlemeyi bilene bir hikâye anlatıyordu.'),
      quote('Karşılıklı cumbalar birbirine öylesine yaklaşmıştı ki'),
      reason(
        'I doğru: “günlerin sıcak ve sıkıcı geçeceğini sanıyordu.” II yanlış: kutu limanda, “birinin altında” bulunur. III doğru: “onun neyi sevdiğini hiç unutmamıştı.”',
      ),
    ],
    'guletle-mavi-yolculuk-g1': [
      quote('Su çok berraktı. Dipteki taşlar ve balıklar görünüyordu.'),
      quote('Dördüncü denemede düğümü doğru attı.'),
      quote('Ela çok gururlandı.'),
    ],
    'guletle-mavi-yolculuk-g3': [
      quote(
        'Yine de vazgeçmedi; kaptanın ellerini dikkatle izledi ve dördüncü denemede düğümü doğru attı.',
      ),
      reason(
        'Metnin merkezinde Ela’nın düğüm atmayı denemesi ve başarması vardır: “onu kendi emeğiyle öğrenmişti.” Balıklar yalnızca bir ayrıntıdır; ip kaybolmaz, akşam yemeği de geçmez.',
      ),
      reason(
        'Kaptan, Ela’nın düğümünü övünerek herkese gösterir; hemen sonra düğümün Ela için “o günün en büyük başarısı” olduğu söylenir.',
      ),
    ],
    'guletle-mavi-yolculuk-g4': [
      quote('fakat Ela için emekle kazanılmış ilk madalyaydı.'),
      quote(
        'İlk denemede ip elinden kaydı, ikincide düğüm kendiliğinden çözüldü, üçüncüde ise ip birbirine dolaştı.',
      ),
      reason(
        'Kaptanın kuralına göre bu düğüm çekildikçe sıkılaşır (“Ne kadar çekersen o kadar sıkılaşır”). Çekilince gevşeyen düğüm bu kurala uymaz.',
      ),
    ],
    'denize-dokulen-selale-g1': [
      reason(
        'Su damlaları yüze değince sıcaklık azalır, insan ferahlar; öbür şıklar suyun etkisine uymaz.',
      ),
      quote('Mağara şelalenin arkasındaydı.'),
      quote('Gözlerini kapattı ve suyun sesini dinledi.'),
    ],
    'denize-dokulen-selale-g3': [
      quote('Bu şelale, yüksek kayalıklardan doğrudan denize dökülüyordu.'),
      quote('diye bağırdı ama sesi suyun gürültüsünde kayboldu.'),
      quote(
        'Fotoğraf görüntüyü saklayabilirdi ama sesi, serinliği ve o anki sevinci saklayamazdı.',
      ),
    ],
    'denize-dokulen-selale-g4': [
      quote(
        'Resimlerde gördüğü şelalelerin sessiz olduğunu o an fark etti; gerçeği ise insanın bütün bedeniyle duyabileceği kadar canlıydı.',
      ),
      reason(
        'Paragrafın sonunda Efe, görüntülerin şelale kadar canlı olmadığını düşünür; “o anı yaşamak” bu düşünceyi sürdürür. Öbür cümleler konu dışıdır ya da düşünceyle çelişir.',
      ),
      quote('bu damlalar sıcak yaz gününde yüzlerini serinletiyordu.'),
    ],
    'portakal-bahcesi-g1': [
      quote('“İlkbaharda ağaçlar beyaz çiçek açar.'),
      quote('“Portakalı yavaşça çevir, dalı kırma,” dedi.'),
      quote('“Paylaşınca portakallar daha tatlı oluyor,” dedi Melis.'),
    ],
    'portakal-bahcesi-g3': [
      quote('“Dede, paylaşınca portakallar daha da tatlı oluyor,”'),
      quote('Dal sağlam kalırsa ağaç gelecek yıl da meyve verir,'),
      quote(
        '“İlkbaharda ağaçlar beyaz çiçek açar. Bu çiçeklere portakal çiçeği denir. Çiçekler zamanla küçük yeşil meyvelere dönüşür.',
      ),
    ],
    'portakal-bahcesi-g4': [
      quote('Melis’in içinde, sepet boşaldıkça bir şeyler doluyordu.'),
      quote('“Dede, paylaşınca portakallar daha da tatlı oluyor,”'),
      quote('Bugün kıracağın dal, gelecek yıl meyve veremez,'),
    ],
    'ay-isiginda-yolculuk-g1': [
      quote('Fenerler yollarını şaşırtır. Işıkları kapatalım,'),
      quote('Can çok sevindi.'),
      reason(
        'Ayşe Hanım gönüllülerden biridir; yavrular için kumsalda bekler ve insanları bilgilendirir. Kaplumbağa ya da Can’ın arkadaşı değildir.',
      ),
    ],
    'ay-isiginda-yolculuk-g3': [
      quote('Yavrunun yolu kendisinin bulması gerekiyordu.'),
      quote(
        'Can, doğaya yardım etmenin bazen hiçbir şey yapmadan beklemek olduğunu o gece öğrendi.',
      ),
      quote('Az sonra onlarca yavru, küçük yüzgeçleriyle kumda ilerlemeye başladı.'),
    ],
    'ay-isiginda-yolculuk-g4': [
      reason(
        'I doğru: “Yavrular denizi ay ışığının parıltısından bulur.” II yanlış: “Düğmeye basıp feneri söndürürken” sorumluluğu düşünür, karşı çıkmaz. III doğru: Ayşe Hanım “elini kaldırarak onu durdurdu.”',
      ),
      quote('doğaya yardım etmek, çoğu zaman büyük işler yapmak değil, ona yer açmaktı.'),
      quote(
        'Birkaç uzun saniyenin ardından başını denize çevirdi ve dalgalara karışıp gözden kayboldu.',
      ),
    ],
    'deniz-feneri-g1': [
      quote('Ona sıcak bir çorba getirdiler.'),
      quote('Elektrikler kesildi. Fener karanlıkta kaldı.'),
      reason('Hasan Kaptan beklemez; hemen ardından “Eski gaz lambasını hazırladı.”'),
    ],
    'deniz-feneri-g3': [
      quote('Elektrik kesilirse diye onu yıllardır temiz tutuyordu.'),
      quote('Dizleri ağrıdığı günlerde bile bu işi bir kez olsun aksatmamıştı.'),
      quote(
        'Işık yeniden denize yayıldı. Balıkçı teknesi yönünü değiştirdi ve kayalıklara çarpmadan limana sığındı.',
      ),
    ],
    'deniz-feneri-g4': [
      quote('çünkü ona göre sorumluluk, teşekkür beklemek için yapılan bir iş değildi.'),
      quote('Gemilerdeki insanlar onu tanımazdı; Hasan Kaptan da onların adını bilmezdi.'),
      quote(
        'Elektriğin bir gün kesilebileceğini hesaba kattığı için onu yıllardır temiz ve hazır tutuyordu.',
      ),
    ],
    'bir-gunde-kar-ve-deniz-g1': [
      reason('Arda’nın vardığı yer karlıdır; kar da beyazdır. “Bem-” ön eki rengi güçlendirir.'),
      quote('Hava da ısındı. Arda montunu çıkardı.'),
      quote('dedi gülerek.'),
    ],
    'bir-gunde-kar-ve-deniz-g3': [
      quote('Ona göre kar kışın, deniz ise yazın gidilecek bir yerdi.'),
      quote('“Antalya’da bir günde iki mevsim yaşanıyor,”'),
      quote('Babası, aşağı inildikçe havanın ısındığını anlattı.'),
    ],
    'bir-gunde-kar-ve-deniz-g4': [
      quote('Babası, yükseklik azaldıkça havanın ısındığını,'),
      quote('Önce kar inceldi, sonra yerini yeşil ağaçlara bıraktı.'),
      reason(
        'Olaylar kahvaltıdan başlar, “Öğlen dağdan inmeye başladılar” ve “Öğleden sonra Konyaaltı sahilindeydiler” diye sürer. Kahraman her paragrafta Arda’dır, yer ise değişir.',
      ),
    ],
    'piril-ve-ressam-g1': [
      quote('Resimde rengârenk balonlar vardı. Altında sivri kayalar yükseliyordu.'),
      quote('Kuyruğu heyecanla sallandı.'),
      reason(
        'Pırıl veda ettikten sonra “Kapadokya’ya doğru yola çıktı”; yani bu sokaklardan ayrılmaktadır.',
      ),
    ],
    'piril-ve-ressam-g3': [
      quote('Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisi olmalısın,'),
      quote('balonların arasında uçmayı hayal etti.'),
      reason(
        'Pırıl resmi merak eder ve hemen sonraki paragrafta tuvaldekileri görür; bunun için ressama yaklaşmış olmalıdır.',
      ),
    ],
    'piril-ve-ressam-g4': [
      quote(
        'Yolculuğun, yalnızca eve varmak için değil, yol boyunca öğrenmek için de yapıldığını seziyordu.',
      ),
      quote('bir sonraki durağın neresi olacağını bilmiyordu.'),
      reason(
        'I yanlış: “böyle bir yere hiç rastlamamıştı.” II doğru: “Bir gözün mavi, bir gözün kehribar. Sen bir Van kedisi olmalısın.” III doğru: “Evine duyduğu özlem hâlâ yüreğindeydi.”',
      ),
    ],
  },
};
