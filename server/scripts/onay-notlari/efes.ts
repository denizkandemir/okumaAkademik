import { quote, reason, type CityNotes } from './types.js';

export const efesNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; sürümlerin ortalaması 4,39-5 kelime, yani hedefin alt sınırında ya da biraz altında. Cümleler size fazla kesik geliyorsa işaretleyebilirsiniz; bu metinlerin çoğunda Ateşman puanı cümleleri biraz uzatmaya izin veriyor.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: Liman’ı dolduran nehrin Küçük Menderes olduğu (“Kaybolan Liman” G3, G4) ve tek kalan sütunun Artemis Tapınağı’ndan kaldığı, tapınağın eski çağlarda dünyanın yedi harikasından biri sayıldığı (“Pırıl ve Efes’in Kedileri” G4), liman dolunca gemilerin başka limanlara yöneldiği ve şehrin sessizleştiği (“Kaybolan Liman” G4), Yamaç Evler’deki resimlerin renklerinin solmadığı (“Minik Taşlardan Resim” G3, G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**“Hademe” sözcüğü:** G2 metninde geçen “hademe” yerine G3 ve G4’te “okulun görevlisi” dedik; G1’de yalnızca “Ahmet Amca” geçiyor. G2 metni değiştirilmedi. Bu tercihi ve G2’deki sözcüğü değerlendirmenizi rica ederiz.',
    '**Hikâyeye eklenen ayrıntılar:** Olaylar aynı kalsa da G3 ve G4’te küçük betimlemeler eklendi: Emir’in okulundaki salonla karşılaştırma yapması, Nil’in altın hazine beklemesi, Duru’nun işi bırakmayı düşünmesi, Arda’nın telefondaki mesajları düşünmesi, Kerem’in annesinin tepkisi, Duru’nun annesinin duvar resimlerine bakması gibi. Hikâyeyi değiştirdiğini düşündüğünüz yerleri işaretleyebilirsiniz.',
    '**Tahmin olarak yazılan cümleler:** “Tiyatroda Bir Fısıltı” G3’te ustaların “belki de” yıllarca deneme yaptığı ve basamakların yerini hesapladığı söyleniyor; bu bir tahmin olarak yazıldı. Çocuğa kesin bilgi gibi geliyorsa işaretleyebilirsiniz.',
    '**Mecazlar (G4):** “sessizlik bir perde gibi aralandı”, “taştan dev bir yelpaze”, “gününü bir film şeridi gibi geriye sardı”, “eksik kalan pulların onu masaya geri çağırdığını”, “geçmişle gelecek arasında küçük bir köprü”, “küçük şişesini zamanın denizine bırakmıştı”, “tuvalini sonunda baştan yaratıyor” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
  ],
  evidence: {
    'celsus-kutuphanesinde-g1': [
      reason(
        'Rehber, çocuklara binayı ve eski kitapları anlatır; yani gezilen yeri tanıtan kişidir.',
      ),
      quote('“Halk buraya okumaya gelirdi.”'),
      quote('Selin çok şaşırdı.'),
    ],
    'celsus-kutuphanesinde-g3': [
      quote('“Demek okumak, iki bin yıl önce de bu kadar değerliymiş,”'),
      reason(
        'Metinde kapıya asılı bir yazı yoktur; heykeller bilgeliği ve bilgiyi anlatır, “mesaj” sözü bunun için kullanılmıştır.',
      ),
      quote('Uzun giysili insanların ellerinde rulolarla merdivenlerden çıktığını hayal etti.'),
    ],
    'celsus-kutuphanesinde-g4': [
      quote('“Demek okumak, iki bin yıl önce de bu kadar değerliymiş,”'),
      reason(
        'Selin aynı basamaklarda önce geçmişin insanlarını hayal eder, sonra arkadaşlarını görür; aradaki zaman ona kısalmış gibi gelir.',
      ),
      reason(
        'I doğru: “geziyi sıradan bir okul etkinliği sanıyordu.” II yanlış: heykeller “bilgeliği ve bilgiyi” anlatır. III doğru: “rulo yapılıp saklanırdı.”',
      ),
    ],
    'tiyatroda-bir-fisilti-g1': [
      quote('Ece en üste çıktı.'),
      quote('“Burada sahnedeki ses en üste kadar gider.”'),
      quote('Emir güldü.'),
    ],
    'tiyatroda-bir-fisilti-g3': [
      reason(
        'Emir rehberin sözüne pek inanamaz ve “Bunu denemeye karar verdi.” Bağırsaydı sesin kendiliğinden ulaştığını sınamış olmazdı.',
      ),
      reason(
        'Metin baştan sona tiyatronun sesi taşıyan yapısını ve bunu deneyen Emir’i anlatır; öbür başlıklar yalnızca bir ayrıntıyı karşılar ya da metinde yoktur.',
      ),
      quote('Emir buna pek inanamadı. O kadar uzaktaki biri, sesi nasıl duyabilirdi?'),
    ],
    'tiyatroda-bir-fisilti-g4': [
      quote('Elektriğin, mikrofonun adının bile bilinmediği bir çağda'),
      reason(
        'Rehber “sahnede konuşanın sesi en üst sıralara kadar ulaşır” der; Ece en üst sıradaysa sahnede konuşan Emir’i duyar.',
      ),
      quote(
        'O gün Emir, bir bilgiyi duymakla onu kendi deneyerek öğrenmenin aynı şey olmadığını da anlamıştı.',
      ),
    ],
    'kayip-anahtar-g1': [
      quote('Teneffüste ceketi çıkarıp bankın üstüne bırakmıştı. Belki anahtar orada düştü.'),
      reason(
        'Kerem anahtarını bulamayınca telaşlanır, sonra derin bir nefes alır; sözcük bu heyecanı anlatır.',
      ),
      quote('“Bunu bankın altında buldum,” dedi.'),
    ],
    'kayip-anahtar-g3': [
      quote('Merdivene oturup gün boyunca neler yaptığını sırayla hatırlamaya çalıştı.'),
      reason(
        'Kerem bu sözden sonra gün boyunca yaptıklarını sırayla düşünür ve anahtarın nerede düşmüş olabileceğini bulur.',
      ),
      quote('Annesi en çok, oğlunun telaşa kapılmadan düşünebilmesine sevindi.'),
    ],
    'kayip-anahtar-g4': [
      reason(
        'Paragrafın son cümlesi telaşın insanı göremez hâle getirdiğini söyler; “önce sakinleşmesi gerektiği” bunu doğal olarak sürdürür, öbür cümleler konuyu değiştirir.',
      ),
      quote('Demek ki cep, ancak o sırada boşalmış olabilirdi.'),
      reason(
        'Metin, Kerem’in telaşını yenip düşünerek anahtarı bulmasını anlatır; öbür başlıklar yalnızca küçük bir ayrıntıyı karşılar ya da metinde yoktur.',
      ),
    ],
    'minik-taslardan-resim-g1': [
      quote('Sonra onları bir kartona tek tek yapıştırdı. Bu iş çok uzun sürdü.'),
      reason(
        'Resim minik taşlardan yapılmıştır; babası da “Buna mozaik denir,” der. Duru aynı işi küçük kâğıtlarla yapar.',
      ),
      quote('Duru yorgundu ama çok mutluydu.'),
    ],
    'minik-taslardan-resim-g3': [
      quote('Önce kolay sandığı iş, sandığından çok uzun sürdü.'),
      reason(
        'Duru kendi mozaiğini yapınca işin ne kadar uzun sürdüğünü yaşar; bu yüzden artık resimde harcanan emeği de görür.',
      ),
      quote(
        'Birkaç kez bırakmayı düşündü ama yarım kalan balığa bakınca yeniden makası eline aldı.',
      ),
    ],
    'minik-taslardan-resim-g4': [
      quote('Demek ki güzel olan yalnızca sonuç değil, ona giden sabırlı emekti.'),
      reason(
        'Duru bırakmayı düşünür ama yine işe döner; “pullar” bitmemiş balığı, “geri çağırmak” da işi tamamlama isteğini anlatır.',
      ),
      reason(
        'I doğru: “yakından baktığında şaşırdı… minicik taşlardan oluşuyordu.” II yanlış: “tam olarak bilmediğini söyledi.” III doğru: “artık daha iyi anlıyordu.”',
      ),
    ],
    'fircali-kazi-g1': [
      quote('“Bu, eski bir testinin parçası,” dedi.'),
      quote('“Müzede herkes görecek.”'),
      quote('Nil bunu duyunca gururlandı.'),
    ],
    'fircali-kazi-g3': [
      reason(
        'Teyzesi nedenini söylemez; ama topraktan kenarı kırık, çok eski bir parça çıkar ve ona büyük özen gösterilir. Bu, parçaların zarar görmemesi gerektiğini düşündürür.',
      ),
      reason(
        'Teyzesinin “Toprağı yavaşça süpürmelisin” sözünden hemen sonra Nil fırçayı “usulca” gezdirir; sözcük yavaş ve dikkatli hareketi anlatır.',
      ),
      quote('“Bu buluntu hepimizin. Müzede herkes görsün diye saklanacak,”'),
    ],
    'fircali-kazi-g4': [
      quote('çünkü o, parçanın geçmişin hangi sayfasından koptuğunu gösteriyordu.'),
      reason(
        'Nil’in bulduğu parça müzede saklanacak ve yıllar sonra gelen çocuklar onu görecek; “köprü” geçmişin geleceğe ulaşmasını anlatır.',
      ),
      reason(
        'Birinci paragrafta Nil altın hazineler bekler; ikinci paragraf “Oysa” diye başlar ve beklediğinden çok farklı bir görüntüyü anlatır.',
      ),
    ],
    'tasa-yazilmis-mesaj-g1': [
      quote('Halk bir adama teşekkür ediyordu. Çünkü adam çeşmeyi onartmıştı.'),
      reason('Halk bu yüzden adama teşekkür ediyor; yani adam bozulan çeşmeyi tamir ettirmiştir.'),
      quote('Belki bir gün biri okuyacaktı.'),
    ],
    'tasa-yazilmis-mesaj-g3': [
      quote('Halk, şehrin çeşmesini onarttığı için bir adama teşekkür ediyordu.'),
      quote('Belki bir gün biri onu okuyacaktı.'),
      reason(
        'Taştaki yazı da Arda’nın defteri de yıllar sonra okunmak üzere yazılmıştır; öbür başlıklar metinde yoktur ya da yalnızca küçük bir ayrıntıyı karşılar.',
      ),
    ],
    'tasa-yazilmis-mesaj-g4': [
      quote(
        'Böylesine ağır bir taşa bir sır, önemli bir kural ya da büyük bir olay yazıldığını tahmin etmişti.',
      ),
      quote('Belki bir gün biri onu okuyacaktı.'),
      quote('Mermer kadar dayanıklı değildi elbette'),
    ],
    'kaybolan-liman-g1': [
      quote('Ne deniz vardı ne de gemi.'),
      quote('Yakındaki nehir denize toprak taşıdı. Toprak yıllarca birikti. Liman doldu'),
      quote('“Gemiler burada dururdu.'),
    ],
    'kaybolan-liman-g3': [
      quote('“Küçük fırça darbeleriyle koskoca bir resmi değiştiriyor.”'),
      quote('“Çok eskiden deniz buraya kadar gelirdi. Gemiler bu caddenin ucuna yanaşır'),
      quote('Rehberin şaka yaptığını düşündü.'),
    ],
    'kaybolan-liman-g4': [
      quote(
        'Hiç kimsenin bir günde fark edemeyeceği kadar küçük değişimler, üst üste gelince koskoca bir limanı silmişti.',
      ),
      reason(
        'Caddenin adı “Liman”dır ama Mete çevresinde deniz ve gemi göremez; boş dolap benzetmesi ad ile görüntü arasındaki uyumsuzluğu anlatır.',
      ),
      reason(
        'I doğru: “toprak biriktikçe liman dolmuş.” II yanlış: “yüzyıllar boyunca.” III doğru: “birazdan denizi, gemileri ve martıları göreceğini sanıyordu.”',
      ),
    ],
    'piril-ve-efesin-kedileri-g1': [
      reason('Pırıl bu sözden sonra yola çıkar; “veda etmek” ayrılırken hoşça kal demektir.'),
      quote('Zeytin ona Efes’i gezdirdi.'),
      reason(
        'Zeytin, “Hoş geldin yolcu.” der ve Pırıl’a Efes’i gezdirir; bunlar dostça davranıştır.',
      ),
    ],
    'piril-ve-efesin-kedileri-g3': [
      quote('Ertesi sabah Zeytin’e veda etti.'),
      reason(
        'Pırıl tek kalan sütuna bakarken bunu düşünür: Tapınak yok olmuştur ama hikâyesi anlatılmaya devam eder.',
      ),
      reason(
        'Uzun yoldan gelen Pırıl, güneşlenen kedilerin rahatlığını görür; “imrenmek” bu rahatlığı kendisi için de istemesini anlatır.',
      ),
    ],
    'piril-ve-efesin-kedileri-g4': [
      reason(
        'Zeytin “Bu taşlar binlerce insanın hikâyesini saklıyor,” der, Pırıl da “hikâyeler kalıyor” sonucuna varır; öbür başlıklar metnin bütününü karşılamaz.',
      ),
      reason(
        'Dördüncü paragraf tapınağı ve geriye kalan sütunu anlatır; Pırıl’ın tapınağı gözünde canlandırması bunu sürdürür, öbür cümleler konuyu değiştirir.',
      ),
      reason(
        'I doğru: “Şimdi yalnızca o sütun kaldı.” II yanlış: Pırıl “Zeytin’e veda etti.” III doğru: “Her şey değişse de hikâyeler kalıyor.”',
      ),
    ],
  },
};
