import { quote, reason, type CityNotes } from './types.js';

export const kapadokyaNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; sürümlerin ortalaması 3,86-4,81 kelime, yani hedefin altında. Ateşman aralığı (85-100) cümleleri fazla uzatmaya izin vermiyor. Cümleler size fazla kesik geliyorsa işaretleyebilirsiniz.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: Erciyes ve Hasan Dağı’nın bölgedeki en büyük yanardağlardan olduğu (“Perilerin Bacaları” G4), balonların sabah erken uçmasının nedeninin rüzgârın o saatte genellikle daha sakin olması (“Uçan Balon” G4), yeraltı şehrinin bugün yalnızca bir bölümünün gezilebildiği (“Yerin Altındaki Şehir” G4), Kızılırmak’ın adını kızıl renkten aldığı (“Avanos’ta Çömlek” G4), Kuzey Yıldızı’nın gökyüzünün en parlak yıldızı olmadığı, öbür yıldızların gece boyunca yer değiştirdiği ve şehir ışıklarının yıldızları görmeyi zorlaştırdığı (“Gökyüzündeki Haritalar” G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**“Aynı yıldızlar” ifadesi:** “Gökyüzündeki Haritalar” metninin G2’sinden gelen “binlerce yıl önce insanlara yol gösteren aynı yıldızlar” sözü bütün sürümlerde korundu. Gökyüzü yavaş yavaş kaydığı için binlerce yıl önce kuzeyi gösteren yıldız bugünkü Kuzey Yıldızı değildi; cümle yıldızları genel olarak anlatıyor ama çocuğu yanıltabileceğini düşünürseniz işaretleyebilirsiniz.',
    '**Hikâyeye eklenen ayrıntılar:** Olaylar aynı kalsa da G3 ve G4’te küçük ayrıntılar eklendi: Ali’nin gece heyecandan uyuyamaması ve annesinin elini fark etmeden bırakması, Defne’nin taşı itmeye çalışması, Kaan’ın taşa omzunu dayaması, Mert’in kapları makinede yapılmış sanması, Zeynep’in delikleri pencere sanması, Bora’nın duvara dokunması ve masallardaki mağaraları hatırlaması, Ayla’nın Pırıl’ın arkasından el sallaması. Hikâyeyi değiştirdiğini düşündüğünüz yerleri işaretleyebilirsiniz.',
    '**“Pırıl ve Balonlar” G4 ile önceki duraklar:** Bu sürümde Pırıl’ın yolculuğunda geçtiği şehirler sayılıyor (İstanbul, İzmir, Efes, Antalya) ve Antalya’da bir resimde balon gördüğü hatırlatılıyor. Soru I. yargısı bu cümleye dayanır.',
    '**“Gökyüzündeki Haritalar” hikâyesi:** G2 metninde kahraman ve Kapadokya bilgisi yok; bilgi veren bir metin. Yeni sürümler de böyle bırakıldı. 1-2. sınıf için “Uydu” ve “Ekim zamanı” kelimelerine ayrıca bakmanızı rica ederiz.',
    '**“Güvercin pisliği”:** G2’de de geçen bu sözcük, gübreyi anlatmak için bütün sürümlerde kullanıldı; G4’te “tiksindiği” sözcüğü de var. Sınıf düzeyine uygunluğunu değerlendirebilirsiniz.',
    '**Mecazlar (G4):** “dev parmaklar gibi”, “uykudaki bir dev gibi”, “karanlığın içinde unutulmuş bir yıldız gibi”, “inatçı bir kedi gibi”, “çamura söz geçirmeye değil, onu dinlemeye”, “sayısız göz gibi”, “İnsanla kuş arasındaki bu eski anlaşma”, “Gökyüzü, herkesin ortak kitabı gibiydi”, “içindeki sevinçle hüzün, yan yana yürüyordu” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
  ],
  evidence: {
    'perilerin-bacalari-g1': [
      quote('Kül sertleşip taş olmuş.'),
      quote('Tepedeki sert taşlar alttaki kayayı korumuş,'),
      quote('Nehir kahkahalarla güldü.'),
    ],
    'perilerin-bacalari-g3': [
      quote('Tepedeki sert taşlar ise altlarındaki kayayı korumuş, tıpkı bir şemsiye gibi.'),
      quote(
        'Artık aynı kayaların hem bir masalı hem de bir bilimsel açıklaması olduğunu biliyordu.',
      ),
      reason(
        'Cümlenin devamı şaşkınlığın nedenini verir: “çünkü vadide yüzlerce sivri kaya yükseliyordu.” Nehir’in gözlerinde bir sorun olduğu söylenmez.',
      ),
    ],
    'perilerin-bacalari-g4': [
      quote('Masal insanın hayalini besliyor, bilim ise merakını yanıtlıyordu.'),
      reason(
        'Annesi, rüzgâr ve yağmurun “binlerce yıl boyunca yumuşak taşı aşındırmış” olduğunu anlatır; Nehir de bu işi heykeltıraşın taşı yontmasına benzetir.',
      ),
      reason(
        'Annesine göre “Tepedeki sert taşlar ise altlarındaki kayayı korumuş.” Koruyan taş olmasaydı alttaki yumuşak taş da “çevredeki taş” gibi aşınırdı.',
      ),
    ],
    'ucan-balon-g1': [
      quote('“Sıcak hava balonu yükseltir,”'),
      quote('Ali biraz korktu. Annesinin elini tuttu.'),
      reason(
        'Sepet yerden kesildikten sonra Ali “aşağı” bakar ve gökyüzündeki balonları görür; yani sepet havaya yükselmiştir.',
      ),
    ],
    'ucan-balon-g3': [
      reason(
        'Ali korktuğu için annesinin elini “sıkıca” tutmuştu; manzarayı görünce “korkusu meraka dönüştü” ve eli bıraktığını fark etmedi.',
      ),
      quote(
        'balonun altındaki brülörü yaktı. Kocaman bir alev çıktı ve balonun içi ısınmaya başladı.',
      ),
      reason(
        'Metin, Ali’nin korkuyla başlayan yolculuğunu ve “korkusu meraka dönüştü” sözüyle anlatılan değişimi işler. Öbür başlıklar ya ayrıntıdır ya da metinde yoktur.',
      ),
    ],
    'ucan-balon-g4': [
      reason(
        'Ali korkmasına rağmen balona biner ve sonunda “iyi ki binmişim” der; son cümle de korkusunun öbür yanında neler olduğunu gördüğünü söyler.',
      ),
      reason(
        'I yanlış: “önce biraz korktu.” II doğru: “balonu da o yükseltir.” III doğru: “rüzgârın bu saatte genellikle daha sakin olmasıdır.”',
      ),
      reason(
        'Önceki cümlede Ali “iyi ki binmişim” der ve yukarıdan her şeyin çok güzel göründüğünü söyler; “öbür yan”, korkusunu aştıktan sonra yaşadığı güzelliktir.',
      ),
    ],
    'yerin-altindaki-sehir-g1': [
      quote('Kapıyı bu taşla kapatırlarmış,'),
      quote('“Temiz hava buradan iner,”'),
      quote('Defne çok şaşırdı.'),
    ],
    'yerin-altindaki-sehir-g3': [
      quote(
        'Eskiden insanlar tehlike anında buraya sığınırmış. Bu taşı yuvarlayıp kapıyı içeriden kapatırlarmış.',
      ),
      quote('mutfaklar, ambarlar, hatta hayvanlar için ahırlar.'),
      reason(
        'Defne karanlıkta yaşamanın zorluğunu düşünür ve “Bu şehri kazan insanlar çok çalışkan ve akıllıymış” der. Öbür şıklar metinde desteklenmez.',
      ),
    ],
    'yerin-altindaki-sehir-g4': [
      quote('havayı, yiyeceği ve güvenliği önceden düşünen insanların'),
      reason(
        'Küçük ışık “deliğin ucunda” görünür ve karanlıkta bir yıldıza benzetilir. Gerçek bir yıldız söz konusu değildir, çünkü dışarıda gündüzdür: “Yukarıda güneş parlıyor.”',
      ),
      quote('Temiz hava yukarıdan buralara kadar iner,'),
    ],
    'avanosta-comlek-g1': [
      reason('Çamur “bir yana kaydı ve yamuldu”; deneme de olmadı. Yani şekli bozulmuştur.'),
      quote('Mert yavaşça yeniden başladı. Bu kez küçük bir kâse yaptı.'),
      quote('Mert’in yüzü asıldı.'),
    ],
    'avanosta-comlek-g3': [
      reason(
        'Mert iki kez başarısız olur; usta “acele etme” der, Mert de “yavaşça yeniden” başlayınca kâsesini yapar.',
      ),
      reason(
        'Usta kendisinin “yüz kere” bozduğunu anlatır ve “acele etme” der; yani çamura zamanla, deneyerek alışılır.',
      ),
      quote(
        'kırmızı çamur, ustanın ellerinde bir anda bir testiye dönüştü. Mert hayranlıkla izledi; iş ona çok kolay görünmüştü.',
      ),
    ],
    'avanosta-comlek-g4': [
      reason(
        'Metnin merkezinde Mert’in denemeleri ve ustanın “acele etme” öğüdüyle yaptığı kâse vardır. Öbür başlıklar ya ayrıntıdır ya da metinde yoktur.',
      ),
      quote('Çark yavaşça döndü, parmakları ağır ağır yükseldi'),
      reason(
        'Cümle “Oysa az sonra” diye başlar ve “bambaşka bir emek” olduğunun öğrenileceğini söyler; okur atölyede anlatılacaklara hazırlanır.',
      ),
    ],
    'guvercinlerin-evleri-g1': [
      quote('Güvercinlere ev yapmışlar.'),
      quote('İnsanlar onu üzüm bağlarına serpermiş. Üzümler bol olurmuş.'),
      reason(
        'Dedesi, Zeynep “Güvercinler de yardım etmiş!” dedikten hemen sonra güler. Öbür şıklar metinde geçmez.',
      ),
    ],
    'guvercinlerin-evleri-g3': [
      quote('pislik gibi bir şeyin değerli olabileceği hiç aklına gelmemişti.'),
      reason(
        'İnsanlar güvercinlere “evler” yapar, onların gübresini de bağlarında kullanır; iki taraf birlikte yaşar. Öbür şıklar metinde desteklenmez.',
      ),
      reason(
        'Gübre “üzüm bağlarına” serpilir ve bunun sonucu olarak üzümler “daha bereketli” olur; yani ürün bollaşır.',
      ),
    ],
    'guvercinlerin-evleri-g4': [
      quote(
        'Bir kaşık pekmezin arkasında güneş, toprak, kuşlar ve yüzyıllardır süren bir emek vardı.',
      ),
      reason(
        'I doğru: “üzüm bağlarına serperlermiş.” II doğru: “önce bunların pencere olduğunu düşündü.” III yanlış: “Deliklerin bazılarının çevresi” boyanmıştı.',
      ),
      quote('Kuş yuva buluyor, insan da bağını besliyordu.'),
    ],
    'gokyuzundeki-haritalar-g1': [
      quote('Bu yıldızlar bir kepçeye benzer.'),
      reason(
        'Bu haber, gökyüzüne bakan insanlara mevsimi bildirir; “ekim” burada tohumu toprağa atma işidir, ay adı değildir.',
      ),
      quote('Bu yıldız onlara kuzeyi gösterirdi.'),
    ],
    'gokyuzundeki-haritalar-g3': [
      reason(
        'Metinde yıldızlar iki iş görür: yön bulmak ve “mevsimleri anlamak”. Harita yönü, takvim de mevsimi karşılar.',
      ),
      quote(
        'Kepçenin ucundaki iki yıldızdan çizilen hayalî bir çizgi, Kuzey Yıldızı’na ulaşır. Bu yüzden Kuzey Yıldızı’nı bulmak isteyenler önce kepçeyi arar.',
      ),
      reason(
        'Bütün paragraflar yıldızlarla yön ve mevsim bulmayı anlatır. Öbür başlıklar ya ayrıntıdır ya da metinde yoktur.',
      ),
    ],
    'gokyuzundeki-haritalar-g4': [
      quote('değeri parlaklığından değil, değişmezliğinden gelir.'),
      reason(
        'Çizgi “Kuzey Yıldızı’na ulaşır” (üçüncü paragraf); o yıldız da denizcilere “kuzeyi gösterirdi” (ikinci paragraf).',
      ),
      reason(
        'Yazar önce sorularla merak uyandırır, cevabı paragrafın sonunda verir: “Cevap, başımızın üstünde parıldıyordu: yıldızlar.”',
      ),
    ],
    'magara-evde-bir-gece-g1': [
      quote('“Kalın duvarlar sıcağı içeri almaz,”'),
      quote('İçi rahatladı. Artık hiç korkmuyordu.'),
      reason('Bora’nın “içi rahatladı” ve “hiç korkmuyordu”; bu rahat hâlle uykuya dalar.'),
    ],
    'magara-evde-bir-gece-g3': [
      quote(
        'Taşın serinliği ve sessizliği içine huzur verdi; gözlerini kapattığında hiç korkmuyordu.',
      ),
      reason(
        'İzleri görünce ustayı hayal eder ve hemen ardından taşın “içine huzur verdi” denir; önceki çekingenliği geçmiştir.',
      ),
      quote('Bu yüzden mağara evler yazın serin, kışın sıcak olur.'),
    ],
    'magara-evde-bir-gece-g4': [
      reason(
        'Bora önce “eşikte durdu” ve “biraz çekinerek” sordu; keski izlerini görüp ustayı hayal edince “hiç korkmuyordu”.',
      ),
      reason(
        'I yanlış: “Bu açıklama Bora’yı pek rahatlatmadı.” II doğru: “yazın sıcağı, kışın soğuğu içeri almaz.” III doğru: “Bora’ya yalnız olmadığını hissettirdi.”',
      ),
      quote('Kalın kaya duvarlar yazın sıcağı, kışın soğuğu içeri almaz.'),
    ],
    'piril-ve-balonlar-g1': [
      quote('Sonra bir balon havalandı. Ardından bir balon daha!'),
      reason(
        'Ayla bu sözü, Pırıl “Van’a doğru yola çıktı” denmeden hemen önce söyler; yola çıkana edilen iyi dilektir.',
      ),
      quote('Gidiyorsun, değil mi?'),
    ],
    'piril-ve-balonlar-g3': [
      quote('Ayla biraz üzüldü ama gülümsedi.'),
      quote('memleketi Van onu bekliyordu.'),
      reason(
        '“Sanki” sözcüğü benzetme yapar: Ayla pilotun selamına karşılık verir, Pırıl’ın patisini kaldırması da selama benzetilir.',
      ),
    ],
    'piril-ve-balonlar-g4': [
      quote('Sevdiğini yolundan alıkoymamak da bir tür dostluktu'),
      reason(
        'Pırıl eve “çok yakındı” ama Ayla’dan ayrılıyordu; sevinç ve hüzün aynı anda yaşanır.',
      ),
      reason(
        'I doğru: “Antalya’da bir resimde gördüğü balonlar.” II yanlış: “Cevabı biliyordu.” III doğru: Pırıl “doğuya” baktı ve “orada” memleketi Van onu bekliyordu.',
      ),
    ],
  },
};
