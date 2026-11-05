import {
  City,
  CognitiveLevel,
  QuestionType,
  ReadingLevel,
  TextTheme,
} from '../../src/generated/prisma/enums.js';
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'O zamanlar kitaplar nasıl saklanırdı?',
          options: ['Rulo yapılarak', 'Kutulara gömülerek', 'Duvarlara asılarak'],
          correctIndex: 0,
          hint: 'İpucu: İkinci paragrafta rehberin anlattıklarını oku.',
          explanation: 'Doğru! O zamanlar kitaplar rulo yapılıp saklanırdı.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Selin’in sınıfı Efes’e geziye gitti. Yollar mermerdi. Rehber bir binanın önünde durdu. Binanın iki katı ve uzun sütunları vardı.',
            '“Burası Celsus Kütüphanesi,” dedi rehber. “Çok eski bir yer. İki bin yıl önce yapıldı. O zaman kitaplar sayfalı değildi. Uzun yapraklara yazı yazılırdı. Bu yapraklar rulo yapılırdı.”',
            'Selin çok şaşırdı. “Burada çok rulo var mıydı?” diye sordu. Rehber, “Evet, binlerce,” dedi. “Halk buraya okumaya gelirdi.”',
            'Selin gözlerini kapattı. İnsanları elinde ruloyla hayal etti. “Demek okumak o gün de değerliymiş,” diye düşündü.',
          ],
          questions: [
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Hikâyedeki “rehber” kimdir?',
              options: ['Selin’in arkadaşı', 'Gezilen yeri anlatan kişi', 'Binanın bekçisi'],
              correctIndex: 1,
              hint: 'İpucu: Rehber çocuklara neler anlatıyor?',
              explanation: 'Aferin! Rehber, gezilen yeri tanıtan kişidir.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Halk kütüphaneye neden gelirdi?',
              options: ['Okumak için', 'Uyumak için', 'Yemek yemek için'],
              correctIndex: 0,
              hint: 'İpucu: Rehberin üçüncü paragraftaki sözüne bak.',
              explanation: 'Doğru! Halk buraya okumaya gelirdi.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Selin rehberi dinleyince nasıl hissetti?',
              options: ['Kızdı', 'Korktu', 'Şaşırdı'],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafın ilk cümlesine bak.',
              explanation: 'Harika! Selin duyduklarına çok şaşırdı.',
            },
          ],
          glossary: [
            { word: 'sütunları', meaning: 'Binayı tutan uzun, kalın direkleri.' },
            { word: 'rulo', meaning: 'Sarılarak boru gibi yapılmış şey.' },
            { word: 'değerliymiş', meaning: 'Çok önemliymiş.' },
          ],
        },
        G3: {
          paragraphs: [
            'Selin’in sınıfı okul gezisiyle Efes Antik Kenti’ne gitmişti. Çocuklar mermer döşeli sokaklarda yürürken rehber bir binanın önünde durdu. Binanın ön yüzü iki katlıydı ve uzun sütunlarla süslenmişti. Selin böyle gösterişli bir yapıyı ilk kez görüyordu. Arkadaşlarıyla birlikte rehberin çevresinde toplandı ve onun anlatacaklarını merakla beklemeye başladı.',
            '“Burası Celsus Kütüphanesi,” dedi rehber. “Yaklaşık iki bin yıl önce yapıldı. O zamanlar kitaplar bugünkü gibi sayfalı değildi. Parşömen denen uzun yapraklara yazılır, sonra rulo yapılıp saklanırdı.” Selin, çantasındaki kitabın rulo olduğunu düşününce gülümsedi.',
            'Dayanamayıp “Burada binlerce rulo kitap var mıydı?” diye sordu. Rehber başını sallayarak onayladı. “Evet, binlerce. İnsanlar buraya okumak ve öğrenmek için gelirdi.” Selin, o kadar çok kitabın tek bir binada durmasını aklına sığdıramadı.',
            'Selin sütunların arasındaki heykellere baktı. Rehber, bu heykellerin bilgeliği ve bilgiyi anlattığını söyledi. Demek ki kütüphaneyi yapanlar, içeri girenlere daha kapıdayken bir mesaj vermek istemişti: Burası öğrenmeye değer veren bir yerdi.',
            'Selin bir an gözlerini kapattı. Uzun giysili insanların ellerinde rulolarla merdivenlerden çıktığını hayal etti. Kimi heyecanla konuşuyor, kimi sessizce okuyordu. Gözlerini açtığında aynı merdivenlerde kendi arkadaşlarını gördü. “Demek okumak, iki bin yıl önce de bu kadar değerliymiş,” diye düşündü ve çantasındaki kitaba sevgiyle dokundu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Okul gezileri her zaman eğlencelidir.',
                'Okumak ve öğrenmek geçmişte de değerliydi.',
                'Rulo kitaplar sayfalı kitaplardan güzeldir.',
                'Mermer sokaklarda dikkatli yürünmelidir.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Selin’in gezinin sonunda vardığı düşünceye bak.',
              explanation: 'Aferin! İnsanlar binlerce yıldır okumaya ve öğrenmeye değer veriyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Daha kapıdayken bir mesaj vermek istemişti” sözüyle anlatılmak istenen nedir?',
              options: [
                'Kapıya yazılı bir not asıldığı',
                'Kütüphanenin kapısının kilitli olduğu',
                'Rehberin bir mektup getirdiği',
                'Heykellerin, gelenlere bilginin önemini hatırlattığı',
              ],
              correctIndex: 3,
              hint: 'İpucu: Dördüncü paragrafta heykellerin neyi anlattığını oku.',
              explanation: 'Çok güzel! Heykeller, içeri girenlere bilginin değerini anlatıyordu.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Selin gözlerini kapatınca neyi hayal etti?',
              options: [
                'Ellerinde rulolarla merdiven çıkan insanları',
                'Kütüphaneyi yapan ustaları',
                'Efes’e gelen gemileri',
                'Okuldaki sınıfını',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafın ikinci cümlesini oku.',
              explanation: 'Doğru! Selin, ellerinde rulolarla merdiven çıkan insanları hayal etti.',
            },
          ],
          glossary: [
            {
              word: 'Parşömen',
              meaning: 'Eskiden üstüne yazı yazılan, hayvan derisinden yapılmış ince yaprak.',
            },
            { word: 'gösterişli', meaning: 'Görenleri etkileyen, süslü ve büyük.' },
            { word: 'onayladı', meaning: 'Doğru olduğunu belirtti.' },
          ],
        },
        G4: {
          paragraphs: [
            'Selin’in sınıfı, okul gezisi için Efes Antik Kenti’ne gitmişti. Güneşin ısıttığı mermer sokaklarda ilerlerken rehber, görkemli bir binanın önünde durdu. İki katlı ön yüzü yan yana dizilmiş uzun sütunlarla süslenmiş olan bu yapı, çevresindeki yıkıntıların arasında adeta bir sahne gibi yükseliyordu. Selin o ana kadar geziyi sıradan bir okul etkinliği sanıyordu; bu görüntü karşısında fikrini değiştirmeye başladı.',
            '“Burası Celsus Kütüphanesi,” dedi rehber. “Yaklaşık iki bin yıl önce yapıldı. O dönemde kitaplar bugünkü gibi sayfalı değildi. Parşömen denen uzun yapraklara yazılır, sonra rulo yapılıp saklanırdı.” Selin, çantasında taşıdığı kitabın metrelerce uzunlukta bir şeride dönüştüğünü düşününce gülümsemeden edemedi.',
            'Merakını daha fazla tutamayarak “Burada binlerce rulo kitap var mıydı?” diye sordu. Rehber başını salladı. “Evet, binlerce. İnsanlar buraya okumak ve öğrenmek için gelirdi.” Bu yanıt, Selin’in zihnindeki eski zaman resmini bir anda değiştirdi; geçmiş ona artık yalnızca taşlardan ve tarih kitaplarındaki adlardan ibaret görünmüyordu. Demek ki o insanlar da tıpkı kendisi gibi merak ediyor, soru soruyor ve yeni bir şey öğrenince seviniyordu.',
            'Ardından sütunların arasındaki heykellere baktı. Rehber, bu heykellerin bilgeliği ve bilgiyi anlattığını söyledi. Selin, taşın da konuşabildiğini o an anladı: Kütüphaneyi yapanlar, kapıdan girecek olanlara daha ilk adımda bilginin değerini hatırlatmak istemişti. Bir binanın yalnızca duvarlarıyla değil, süsleriyle de söz söyleyebileceğini daha önce hiç düşünmemişti.',
            'Selin gözlerini kapatınca sessizlik bir perde gibi aralandı. Uzun giysili insanlar, ellerinde rulolarla merdivenlerden çıkıyor, kimi heyecanla tartışıyor, kimi köşesine çekilip sessizce okuyordu. Gözlerini açtığında aynı basamaklarda kendi arkadaşlarını gördü. Aradan geçen iki bin yıl, sanki bu merdivenlerde kısalıvermişti. “Demek okumak, iki bin yıl önce de bu kadar değerliymiş,” diye düşündü. Eve dönerken çantasındaki kitap ona her zamankinden daha kıymetli geliyordu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metinde asıl vurgulanmak istenen düşünce aşağıdakilerden hangisidir?',
              options: [
                'Antik kentler okul gezileri için en uygun yerlerdir.',
                'Eski kitaplar bugünkülerden daha dayanıklıydı.',
                'Okumanın ve öğrenmenin değeri çağlar boyunca değişmemiştir.',
                'Tarih kitapları yalnızca adlardan oluşur.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Selin’in son paragrafta aklından geçirdiği sözü düşün.',
              explanation:
                'Aferin! Metin, okumanın iki bin yıl önce de değerli olduğunu vurguluyor.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Aradan geçen iki bin yıl, sanki bu merdivenlerde kısalıvermişti.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Merdivenlerin eskiden daha kısa olduğu',
                'Selin’in geçmişteki insanlara yakınlık duyduğu',
                'Gezinin planlanandan kısa sürdüğü',
                'Kütüphanenin yakın zamanda yapıldığı',
              ],
              correctIndex: 1,
              hint: 'İpucu: Selin gözlerini kapatınca kimleri, açınca kimleri görüyor?',
              explanation: 'Çok güzel! Selin aynı basamaklarda geçmişle bugünü bir arada hissetti.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Selin geziyi başta sıradan bir etkinlik sanıyordu. II. Heykeller kütüphaneyi yapan ustaları anlatıyordu. III. Eskiden kitaplar rulo yapılarak saklanırdı.',
              options: ['Yalnız II', 'I ve III', 'II ve III', 'I, II ve III'],
              correctIndex: 1,
              hint: 'İpucu: Her yargıyı tek tek ele al; heykellerin neyi anlattığına dördüncü paragrafta bak.',
              explanation:
                'Harika! Heykeller bilgeliği ve bilgiyi anlatıyordu, bu yüzden II. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'görkemli', meaning: 'Çok büyük ve gösterişli.' },
            { word: 'yıkıntıların', meaning: 'Yıkılmış yapılardan kalan parçaların.' },
            { word: 'ibaret', meaning: 'Yalnızca ondan oluşan.' },
            { word: 'kıymetli', meaning: 'Değerli.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Antik tiyatro yaklaşık kaç kişi alıyordu?',
          options: ['İki yüz', 'Yirmi beş bin', 'Beş yüz'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Tiyatro yaklaşık yirmi beş bin kişi alıyordu.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Emir ile ablası Ece, Efes’e geldi. Eski bir tiyatroyu gezdiler. Tiyatro bir tepenin yanına yapılmıştı. Taş sıralar yukarı doğru uzanıyordu.',
            'Rehber, “Buraya yirmi beş bin kişi sığardı,” dedi. Emir çok şaşırdı. “Bu kadar kişi ne izlerdi?” diye sordu. Rehber, “Oyun ve konser,” dedi.',
            'Sonra bir sır verdi: “Burada sahnedeki ses en üste kadar gider.” Emir bunu denemek istedi. Ece en üste çıktı.',
            'Emir sahnede durdu. Hiç bağırmadı. “Ece, beni duyuyor musun?” dedi. Yukarıdan ses geldi: “Duyuyorum!”',
            'Emir güldü. Eski ustaları düşündü. “Ne kadar akıllıca yapmışlar!” dedi.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Ece nereye çıktı?',
              options: ['Sahneye', 'En üste', 'Tepenin arkasına'],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafın son cümlesine bak.',
              explanation: 'Doğru! Ece en üst sıralara çıktı.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Ece, Emir’in sesini neden duydu?',
              options: [
                'Emir çok bağırdığı için',
                'Ece sahneye indiği için',
                'Sahnedeki ses en üste kadar gittiği için',
              ],
              correctIndex: 2,
              hint: 'İpucu: Rehberin verdiği sırrı hatırla.',
              explanation: 'Aferin! Bu tiyatroda sahnedeki ses en üste kadar gider.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Emir, Ece’nin sesini duyunca nasıl hissetti?',
              options: ['Sevindi', 'Korktu', 'Sıkıldı'],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafta Emir ne yapıyor?',
              explanation: 'Harika! Emir denemesi başarılı olunca sevinçle güldü.',
            },
          ],
          glossary: [
            { word: 'tepenin', meaning: 'Küçük dağa benzeyen yüksek yerin.' },
            { word: 'sığardı', meaning: 'İçine girebilirdi.' },
            { word: 'sır', meaning: 'Herkesin bilmediği şey.' },
          ],
        },
        G3: {
          paragraphs: [
            'Emir ile ablası Ece, Efes’in antik tiyatrosunu gezmeye geldiler. Tiyatro bir tepenin yamacına yapılmıştı ve taş basamaklar yukarıya doğru sıra sıra yükseliyordu. Emir en alttan yukarı bakınca basamakların sanki gökyüzüne kadar uzandığını sandı. Ablası ise fotoğraf makinesini çıkarmış, bu kocaman yapıyı tek kareye sığdırmaya çalışıyordu.',
            'Rehber, tiyatronun yaklaşık yirmi beş bin kişi aldığını söyledi. Emir şaşkınlıkla etrafına baktı, çünkü okulundaki salona bile en fazla birkaç yüz kişi sığıyordu. “Bu kadar kişi burada ne izlerdi?” diye sordu.',
            'Rehber, eskiden burada oyunlar oynandığını ve konserler yapıldığını anlattı. Sonra sesini alçaltıp bir sır verdi: “Tiyatro öyle yapılmış ki sahnede konuşanın sesi en üst sıralara kadar ulaşır.” Emir buna pek inanamadı. O kadar uzaktaki biri, sesi nasıl duyabilirdi? Bunu öğrenmenin tek bir yolu vardı.',
            'Bunu denemeye karar verdi. Ece nefes nefese en üst sıralara tırmandı ve oradan el salladı. Emir sahnenin ortasında durdu, derin bir nefes aldı ve bağırmadan, “Ece, beni duyuyor musun?” dedi.',
            'Bir an sessizlik oldu. Sonra yukarıdan Ece’nin sesi geldi: “Duyuyorum!” Emir hayretle güldü. Hoparlör yokken bile sesi herkese ulaştıran eski ustaları düşündü. O ustalar belki de yıllarca deneme yapmış, basamakların yerini tek tek hesaplamıştı. “Ne kadar akıllıca yapmışlar!” dedi.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Emir sahnede neden bağırmadan konuştu?',
              options: [
                'Ablasını uyandırmamak için',
                'Rehber bağırmayı yasakladığı için',
                'Sesi yorulmasın diye',
                'Rehberin sözünün doğru olup olmadığını anlamak için',
              ],
              correctIndex: 3,
              hint: 'İpucu: Emir, rehberin söylediği sırra inandı mı? Üçüncü ve dördüncü paragraflara bak.',
              explanation: 'Aferin! Bağırsaydı rehberin sözünü gerçekten denemiş olmazdı.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne başka bir başlık verilecek olsa hangisi en uygun olur?',
              options: [
                'Eski Ustaların Ses Sırrı',
                'Ece’nin Tırmanışı',
                'Okuldaki Salon',
                'Efes’e Giden Yol',
              ],
              correctIndex: 0,
              hint: 'İpucu: Metnin tamamını kapsayan başlığı seç; yalnızca küçük bir ayrıntıyı anlatanı değil.',
              explanation:
                'Harika! Metin, tiyatronun sesi taşıyan yapısını ve bunu deneyen Emir’i anlatıyor.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Emir, rehberin verdiği sırrı duyunca ne hissetti?',
              options: ['Korktu', 'Sıkıldı', 'Kuşkulanıp merak etti', 'Ablasına kızdı'],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafın son iki cümlesini oku.',
              explanation: 'Doğru! Emir buna inanamadı ve nasıl olabileceğini merak etti.',
            },
          ],
          glossary: [
            { word: 'yamacına', meaning: 'Bir tepenin eğik yanına.' },
            { word: 'hayretle', meaning: 'Çok şaşırarak.' },
            { word: 'Hoparlör', meaning: 'Sesi büyütüp uzağa ulaştıran elektrikli alet.' },
          ],
        },
        G4: {
          paragraphs: [
            'Emir ile ablası Ece, Efes’in antik tiyatrosunu gezmeye geldiler. Bir tepenin yamacına yapılmış olan tiyatronun taş basamakları, yukarıya doğru sıra sıra yükseliyordu. Emir en alttan başını kaldırdığında karşısındaki görüntü bir yapıdan çok, taştan dev bir yelpazeye benziyordu.',
            'Rehber, tiyatronun yaklaşık yirmi beş bin kişi aldığını söyleyince Emir şaşkınlıkla etrafına baktı. Okulunun salonuna birkaç yüz kişi güçlükle sığarken binlerce insanın burada aynı anda oturduğunu hayal etmek kolay değildi. Basamaklara dokundu; taşlar, üzerinde oturan onca insanın ayak izleriyle yer yer aşınmış ve parlamış gibiydi. “Bu kadar kişi burada ne izlerdi?” diye sordu.',
            'Rehber, eskiden burada oyunlar oynandığını ve konserler yapıldığını anlattı. Ardından gizemli bir sesle ekledi: “Tiyatro öyle yapılmış ki sahnede konuşanın sesi en üst sıralara kadar ulaşır.” Emir’in aklına hemen bir soru takıldı. Elektriğin, mikrofonun adının bile bilinmediği bir çağda bu nasıl mümkün olabilirdi? Sorusunun cevabını başkasından duymak yerine kendi kulaklarıyla almaya karar verdi.',
            'Ece, kardeşinin deneyine yardım etmek için basamakları tek tek tırmandı ve en üst sıraya vardığında küçücük bir nokta gibi görünüyordu. Emir sahnenin ortasında durdu. Kalbi küt küt atıyordu, çünkü birazdan ya rehber haklı çıkacak ya da kendisi boşluğa konuşan bir çocuk gibi kalacaktı. Bağırmadan, “Ece, beni duyuyor musun?” dedi.',
            'Birkaç saniyelik sessizlik ona bir yıl kadar uzun geldi. Sonra yukarıdan Ece’nin neşeli sesi süzüldü: “Duyuyorum!” Emir hayretle güldü. Hoparlör yokken bile sesi herkese ulaştıran eski ustaları düşündü. Onlar için ses, taş ve tepe aynı hesabın parçalarıydı. Çünkü bu kalabalığın en arkasındaki kişi bile oyunu kaçırmasın diye her basamağı düşünerek yerleştirmişlerdi. “Ne kadar akıllıca yapmışlar!” dedi. O gün Emir, bir bilgiyi duymakla onu kendi deneyerek öğrenmenin aynı şey olmadığını da anlamıştı.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Bu metinden aşağıdaki yargılardan hangisine ulaşılamaz?',
              options: [
                'Antik tiyatro bir tepenin yamacına yapılmıştır.',
                'Emir, rehberin söylediğini kendisi sınamak istemiştir.',
                'Tiyatroda eskiden oyunlar oynanır, konserler yapılırdı.',
                'Tiyatroda ses için mikrofon kullanılmıştır.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü ve son paragraflarda sesin nasıl ulaştığına dair anlatılanlara bak.',
              explanation:
                'Aferin! Metne göre o çağda mikrofon yoktu; sesi tiyatronun yapısı taşıyordu.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Rehberin sözü doğruysa ve Ece en üst sıradaysa aşağıdakilerden hangisi kesin olarak söylenebilir?',
              options: [
                'Ece, sahnede konuşan Emir’in sesini duyar.',
                'Emir, Ece’nin sesini hiç duyamaz.',
                'Ece, sahneye inmek zorunda kalır.',
                'Emir’in bağırması gerekir.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Rehberin üçüncü paragraftaki sözünü bu duruma uygula.',
              explanation:
                'Harika! Sahnede konuşanın sesi en üst sıralara ulaşıyorsa Ece de Emir’i duyar.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Eski yapılar bugünküler kadar sağlam değildir.',
                'Bir bilgiyi kendi deneyerek öğrenmek, yalnızca duymaktan farklıdır.',
                'Kardeşler gezilerde birbirinden ayrılmamalıdır.',
                'Büyük tiyatrolar küçük salonlardan daha eğlencelidir.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son cümlede Emir’in o gün neyi anladığı yazıyor.',
              explanation: 'Çok güzel! Emir, duyduğu bilgiyi deneyerek öğrenmenin farkını yaşadı.',
            },
          ],
          glossary: [
            {
              word: 'yelpazeye',
              meaning: 'Açılıp kapanan, serinlemeye yarayan yarım daire biçimli eşyaya.',
            },
            { word: 'gizemli', meaning: 'Sırlı, merak uyandıran.' },
            { word: 'süzüldü', meaning: 'Yavaşça, hafifçe geldi.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Kerem eve geldiğinde neyi bulamadı?',
          options: ['Çantasını', 'Anahtarını', 'Ceketini'],
          correctIndex: 1,
          hint: 'İpucu: İlk paragrafta Kerem çantasını karıştırınca neyin olmadığını fark ediyor.',
          explanation: 'Doğru! Kerem anahtarını bulamadı.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
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
      versions: {
        G1: {
          paragraphs: [
            'Kerem okuldan eve geldi. Kapının önünde durdu. Çantasına baktı, anahtar yoktu! Cebine baktı, orada da yoktu.',
            'Önce telaşlandı. Sonra derin bir nefes aldı. “Bir dedektif gibi düşüneyim,” dedi.',
            'Sabahı düşündü. Anahtarı ceketinin cebine koymuştu. Teneffüste ceketi çıkarıp bankın üstüne bırakmıştı. Belki anahtar orada düştü.',
            'Kerem okula geri gitti. Ahmet Amca ona gülümsedi. Cebinden bir anahtar çıkardı. “Bunu bankın altında buldum,” dedi.',
            'Kerem ona teşekkür etti. O günden sonra anahtarı hep çantanın küçük gözüne koydu. Akşam annesine her şeyi anlattı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Kerem neden okula geri gitti?',
              options: [
                'Anahtar orada düşmüş olabilir diye',
                'Ödevini unuttuğu için',
                'Oyun oynamak için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafta Kerem neyi düşünüyor?',
              explanation: 'Aferin! Kerem anahtarın okulda düştüğünü tahmin etti.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Telaşlandı” ne demektir?',
              options: ['Çok sevindi', 'Uykusu geldi', 'Heyecanla ne yapacağını şaşırdı'],
              correctIndex: 2,
              hint: 'İpucu: Anahtarı olmayan Kerem’in o an hâlini düşün.',
              explanation: 'Doğru! Telaşlanmak, heyecanla ne yapacağını şaşırmaktır.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Ahmet Amca anahtarı nerede buldu?',
              options: ['Sınıfta', 'Bankın altında', 'Kapının önünde'],
              correctIndex: 1,
              hint: 'İpucu: Ahmet Amca’nın sözüne bak.',
              explanation: 'Harika! Anahtar bankın altındaydı.',
            },
          ],
          glossary: [
            { word: 'dedektif', meaning: 'İpuçlarını izleyerek gizemleri çözen kişi.' },
            { word: 'Teneffüste', meaning: 'Okulda iki ders arasındaki dinlenme zamanında.' },
          ],
        },
        G3: {
          paragraphs: [
            'Kerem okuldan döndüğünde kapının önünde durdu ve çantasını karıştırmaya başladı. Anahtarı yoktu! Defterleri, kalemleri tek tek çıkardı, ceplerine de baktı ama anahtar hiçbir yerde görünmüyordu. Evde o saatte kimse olmadığı için kapıyı açacak kimse de yoktu.',
            'Önce telaşlandı, kalbi hızlı hızlı atmaya başladı. Sonra derin bir nefes aldı. “Bir dedektif gibi düşünmeliyim,” dedi kendi kendine. Telaşla hiçbir şeyin bulunamayacağını biliyordu, çünkü acele edince gözünün önündeki şeyleri bile göremiyordu.',
            'Merdivene oturup gün boyunca neler yaptığını sırayla hatırlamaya çalıştı. Sabah anahtarı ceketinin cebine koymuştu, bundan emindi. Teneffüste ise hava ısınınca ceketini çıkarıp bahçedeki bankın üstüne bırakmıştı. Demek ki anahtar o sırada düşmüş olabilirdi.',
            'Okula geri döndü. Yol boyunca anahtarın hâlâ orada olmasını diledi. Okulun görevlisi Ahmet Amca onu görünce gülümsedi ve cebinden parlak bir anahtar çıkardı. “Bunu bahçedeki bankın altında buldum,” dedi. “Sahibinin bir gün geleceğini biliyordum.” Kerem’in tahmini doğru çıkmıştı. Demek ki düşünmek, çantayı on kez karıştırmaktan çok daha işe yarıyordu.',
            'Kerem teşekkür etti ve rahat bir nefes aldı. O günden sonra anahtarını hep çantasının küçük gözüne koydu, çünkü her şeyin bir yeri olursa kaybolması da zorlaşıyordu. Akşam annesine bütün macerayı anlattı. Annesi en çok, oğlunun telaşa kapılmadan düşünebilmesine sevindi.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Kerem’in anahtarını bulmasını asıl sağlayan nedir?',
              options: [
                'Sakinleşip olayları sırayla düşünmesi',
                'Ahmet Amca’ya telefon etmesi',
                'Çantasını yeniden karıştırması',
                'Annesinden yardım istemesi',
              ],
              correctIndex: 0,
              hint: 'İpucu: Kerem telaşlandıktan sonra ne yaptı? İkinci ve üçüncü paragraflara bak.',
              explanation:
                'Aferin! Kerem sakinleşip düşünerek anahtarın nerede düşmüş olabileceğini buldu.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Kerem, “Bir dedektif gibi düşünmeliyim.” derken ne demek istiyor?',
              options: [
                'Büyüyünce dedektif olacağını',
                'Oyun oynamak istediğini',
                'İpuçlarını sırayla izleyeceğini',
                'Birinden yardım bekleyeceğini',
              ],
              correctIndex: 2,
              hint: 'İpucu: Bu sözden sonra Kerem’in ne yaptığını üçüncü paragrafta oku.',
              explanation: 'Çok güzel! Kerem yaptıklarını sırayla düşünüp ipuçlarını izledi.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Anahtarlar çantada taşınmamalıdır.',
                'Sorunlar sakin kalıp düşünerek çözülebilir.',
                'Okul görevlileri her şeyi bulur.',
                'Ceketler teneffüste çıkarılmamalıdır.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Annesinin en çok neye sevindiğini düşün.',
              explanation: 'Harika! Kerem telaşını yenip düşünerek sorununu çözdü.',
            },
          ],
          glossary: [
            { word: 'dedektif', meaning: 'İpuçlarını takip ederek gizemleri çözen kişi.' },
            { word: 'Teneffüste', meaning: 'Okulda iki ders arasındaki dinlenme zamanında.' },
            { word: 'tahmini', meaning: 'Olabileceğini düşündüğü şey.' },
          ],
        },
        G4: {
          paragraphs: [
            'Kerem okuldan döndüğünde kapının önünde durdu ve her zamanki gibi elini çantasına attı. Parmakları, anahtarın tanıdık soğukluğu yerine yalnızca defterlere ve kalemlere değdi. Çantasını boşalttı, ceplerini birer birer yokladı; ama anahtar, sanki hiç var olmamış gibi ortadan kaybolmuştu. Evde o saatte kimse yoktu ve kapının önünde beklemek, hiç de hoş bir akşamüstü geçirmek anlamına gelmiyordu.',
            'İlk anda telaşlandı; aklına kapının önünde saatlerce bekleyeceği geldi. Sonra derin bir nefes aldı. “Bir dedektif gibi düşünmeliyim,” dedi kendi kendine. Telaşın, gözün önündeki şeyi bile görünmez kıldığını daha önce yaşadıklarından biliyordu.',
            'Basamağa oturdu ve gününü bir film şeridi gibi geriye sardı. Sabah anahtarı ceketinin cebine koymuştu; bundan emindi. Teneffüste hava ısınınca ceketini çıkarıp bahçedeki bankın üstüne bırakmıştı. Demek ki cep, ancak o sırada boşalmış olabilirdi. Elindeki ipuçları aynı yeri gösteriyordu: bahçedeki bank. Bir dedektifin de böyle çalıştığını okumuştu: Önce bilinenleri sıralar, sonra onların gösterdiği yere giderdi.',
            'Okula geri dönerken adımları bu kez telaşlı değil, kararlıydı. Yol boyunca kafasında aynı soruyu evirip çevirdi: Ya anahtarı başka biri bulup götürdüyse? Okulun görevlisi Ahmet Amca onu görünce gülümsedi ve cebinden parlak bir anahtar çıkardı. “Bunu bahçedeki bankın altında buldum,” dedi. “Sahibinin eninde sonunda geleceğini biliyordum.” Kerem’in yüzüne yayılan gülümseme, yalnızca anahtarına kavuşmanın değil, doğru tahminde bulunmanın da sevinciydi.',
            'Kerem, Ahmet Amca’ya teşekkür etti. O günden sonra anahtarını hep çantasının küçük gözüne koydu; çünkü yeri belli olan bir eşyayı dedektif gibi aramak gerekmiyordu. Akşam annesine bütün macerayı anlattı. Annesi anahtarın kaybolmasına değil, oğlunun telaş içinde aklını kullanabilmesine dikkat çekti. Kerem de o gece bir şeyi fark etti: Kaybolan bir eşyayı bulmak bazen aramakla değil, düşünmekle başlıyordu.',
          ],
          questions: [
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'İkinci paragrafın sonuna aşağıdaki cümlelerden hangisi getirilirse anlam akışı bozulmaz?',
              options: [
                'Bu yüzden önce sakinleşmesi gerektiğini anladı.',
                'Ahmet Amca o sırada bahçeyi süpürüyordu.',
                'Annesi akşam için yemek hazırlıyordu.',
                'Ertesi gün okulda sınav vardı.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Paragrafın son cümlesi telaş hakkında ne söylüyor? Onu sürdüren cümleyi seç.',
              explanation: 'Çok güzel! Bu cümle, telaşla ilgili düşünceyi doğal olarak sürdürüyor.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Anahtar sabah ceketin cebindeydi. Ceket teneffüste çıkarılıp bankın üstüne bırakılmıştı. Kerem’in akıl yürütmesine göre buradan hangi sonuç çıkar?',
              options: [
                'Anahtar sınıfta düşmüştür.',
                'Anahtar büyük olasılıkla bankın çevresine düşmüştür.',
                'Anahtarı annesi almıştır.',
                'Anahtar cebe hiç konmamıştır.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Üçüncü paragrafın son iki cümlesini dikkatle oku.',
              explanation: 'Aferin! Kerem ipuçlarını birleştirip bahçedeki bankı işaret etti.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne başka bir başlık verilecek olsa hangisi en uygun olur?',
              options: [
                'Akşam Yemeği',
                'Okulun Bahçesi',
                'Ahmet Amca’nın Cebi',
                'Telaşını Aklıyla Yenen Çocuk',
              ],
              correctIndex: 3,
              hint: 'İpucu: Metnin tamamını kapsayan başlığı seç; yalnızca bir ayrıntıya değineni değil.',
              explanation:
                'Harika! Metin, Kerem’in telaşını yenip düşünerek çözüme ulaşmasını anlatıyor.',
            },
          ],
          glossary: [
            { word: 'yokladı', meaning: 'Eliyle dokunarak kontrol etti.' },
            { word: 'kıldığını', meaning: 'Hâline getirdiğini.' },
            { word: 'şeridi', meaning: 'Uzun ve ince bandı.' },
            { word: 'kararlıydı', meaning: 'Ne yapacağını bilen, vazgeçmeyen biri gibiydi.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Yamaç Evler’deki resimler neyden yapılmıştı?',
          options: ['Boyalı kumaşlardan', 'Minicik taşlardan', 'Tahta parçalarından'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta Duru resme yakından bakınca ne gördü?',
          explanation: 'Doğru! Resimler minicik taşlardan yapılmıştı.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
      versions: {
        G1: {
          paragraphs: [
            'Duru, ailesiyle Efes’e gitti. Yamaç Evler’i gezdiler. Eskiden bu evlerde zengin aileler yaşardı. Evlerin yeri renkli resimlerle doluydu.',
            'Duru yere eğildi. Resme iyi baktı. Resim minik taşlardan yapılmıştı. Kırmızı, beyaz, siyah ve sarı taşlar yan yanaydı.',
            'Babası, “Buna mozaik denir,” dedi. “Ustalar taşları tek tek dizmiş.” Duru çok merak etti.',
            'Eve dönünce kendi mozaiğini yapmak istedi. Renkli kâğıtları kare kare kesti. Sonra onları bir kartona tek tek yapıştırdı. Bu iş çok uzun sürdü.',
            'Akşam kartonda mavi bir balık vardı. Duru yorgundu ama çok mutluydu. “Eski ustalar ne kadar sabırlıymış!” dedi.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Duru’nun işi neden uzun sürdü?',
              options: [
                'Kâğıtları tek tek yapıştırdığı için',
                'Kâğıt bulamadığı için',
                'Babası gelmediği için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafta Duru’nun neler yaptığını oku.',
              explanation: 'Aferin! Küçük parçaları tek tek yapıştırmak uzun sürer.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Hikâyeye göre “mozaik” nedir?',
              options: ['Bir çeşit ev', 'Küçük parçalardan yapılan resim', 'Renkli bir balık'],
              correctIndex: 1,
              hint: 'İpucu: İkinci ve üçüncü paragraflarda resmin neyden yapıldığına bak.',
              explanation: 'Doğru! Mozaik, küçük parçaların yan yana dizilmesiyle yapılır.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Duru işini bitirince nasıl hissetti?',
              options: ['Kızgın', 'Üzgün', 'Yorgun ama mutlu'],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafın ikinci cümlesine bak.',
              explanation: 'Harika! Duru emek verdiği işi bitirdiği için çok mutluydu.',
            },
          ],
          glossary: [
            { word: 'mozaik', meaning: 'Küçük renkli parçaları yan yana dizerek yapılan resim.' },
            { word: 'Ustalar', meaning: 'Bir işi çok iyi bilen kişiler.' },
            { word: 'sabırlıymış', meaning: 'Acele etmeden çalışırmış.' },
          ],
        },
        G3: {
          paragraphs: [
            'Duru, ailesiyle birlikte Efes’teki Yamaç Evler’i geziyordu. Buralar, eskiden zengin ailelerin yaşadığı evlerdi. Evlerin yerleri ve duvarları rengârenk resimlerle süslüydü, bu yüzden Duru nereye bakacağını şaşırmıştı. Annesi de duvardaki bir resmin önünde durmuş, renklerin bu kadar zaman sonra nasıl solmadığını merak ediyordu.',
            'Yere eğilip bir resme yakından baktı. Uzaktan boya gibi görünen resim, aslında birbirine yapıştırılmış minicik taşlardan oluşuyordu. Kırmızı, beyaz, siyah ve sarı taşlar yan yana dizilmiş, ortaya bütün bir desen çıkmıştı.',
            'Babası, “Buna mozaik denir. Ustalar binlerce küçük taşı tek tek yerleştirerek bu resimleri yapmışlar,” dedi. Duru bir resmin kaç günde bittiğini merak etti. Babası da tam olarak bilmiyordu ama günlerce, belki de haftalarca sürdüğünü tahmin ediyordu.',
            'Eve dönünce Duru kendi mozaiğini yapmaya karar verdi. Renkli kâğıtları küçük karelere kesti, sonra onları bir kartona tek tek yapıştırmaya başladı. Önce kolay sandığı iş, sandığından çok uzun sürdü. Birkaç kez bırakmayı düşündü ama yarım kalan balığa bakınca yeniden makası eline aldı.',
            'Akşam olduğunda kartonun üstünde mavi bir balık yüzüyordu. Duru yorulmuştu ama çok mutluydu. Parmakları yapıştırıcı içindeydi, gözleri ise parlıyordu. “Eski ustalar ne kadar sabırlıymış!” dedi. Artık o taşlara baktığında yalnızca güzel bir resim değil, büyük bir emek de görecekti.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Aşağıdakilerden hangisi metinde yer alan bir bilgi değildir?',
              options: [
                'Yamaç Evler’de eskiden zengin aileler yaşardı.',
                'Mozaikler minicik taşlardan oluşuyordu.',
                'Duru mozaiğini kısa sürede bitirdi.',
                'Duru kartona mavi bir balık yaptı.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Dördüncü paragrafta işin ne kadar sürdüğüne bak.',
              explanation: 'Aferin! Duru’nun işi sandığından çok uzun sürmüştü.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Yalnızca güzel bir resim değil, büyük bir emek de görecekti.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Duru resimleri artık beğenmiyordu.',
                'Duru resimlerin ardındaki çabayı fark etmişti.',
                'Resimler çok pahalıydı.',
                'Duru’nun gözleri çok yorulmuştu.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Duru kendi mozaiğini yapınca neyi anladı?',
              explanation:
                'Çok güzel! Duru bir mozaiğin ne kadar emek istediğini yaşayarak öğrendi.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Duru’nun birkaç kez bırakmayı düşünüp yine de işe devam etmesi onun hangi özelliğini gösterir?',
              options: ['Kararlılığını', 'Bencilliğini', 'Aceleciliğini', 'Tembelliğini'],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafın son cümlesini oku.',
              explanation: 'Harika! Duru zorlansa da işini bitirmeye kararlıydı.',
            },
          ],
          glossary: [
            { word: 'rengârenk', meaning: 'Birçok farklı renkte.' },
            { word: 'desen', meaning: 'Bir yüzeyi süsleyen şekil ya da resim.' },
            { word: 'emek', meaning: 'Bir iş için harcanan çaba.' },
          ],
        },
        G4: {
          paragraphs: [
            'Duru, ailesiyle birlikte Efes’teki Yamaç Evler’i geziyordu. Bir zamanlar zengin ailelerin yaşadığı bu evlerin yerleri ve duvarları, aradan geçen yüzyıllara inat rengârenk resimlerle süslüydü. Duru kendini bir müzede değil de sahipleri biraz önce dışarı çıkmış bir evde hissediyordu. Annesi de duvardaki resimlerin önünde durmuş, renklerin bu kadar zaman sonra nasıl solmadığını merak ediyordu.',
            'Yere eğilip resimlerden birine yakından baktığında şaşırdı. Uzaktan fırçayla yapılmış sanılan desen, aslında birbirine yapıştırılmış minicik taşlardan oluşuyordu. Kırmızı, beyaz, siyah ve sarı taşlar tek başına hiçbir şey anlatmıyor, ancak yan yana geldiklerinde bir bütüne dönüşüyordu. Bir taş eksik olsa belki kimse fark etmezdi, ama bütün taşlar olmasa ortada resim de kalmazdı.',
            'Babası, “Buna mozaik denir. Ustalar binlerce küçük taşı tek tek yerleştirerek bu resimleri yapmışlar,” dedi. Duru’nun aklına hemen bir soru geldi: Bir resim kaç günde bitiyordu? Babası bunu tam olarak bilmediğini söyledi; sorunun cevabına Duru, o akşam kendi elleriyle yaklaşacaktı.',
            'Eve döner dönmez kendi mozaiğini yapmaya karar verdi. Renkli kâğıtları küçük karelere kesti ve onları bir kartona tek tek yapıştırmaya başladı. İlk dakikalarda eğlenceli görünen iş, kısa sürede sabrını sınayan uzun bir yolculuğa dönüştü. Birkaç kez bırakmayı düşündü; fakat her seferinde eksik kalan pulların onu masaya geri çağırdığını hissetti. Makas elini acıtıyor, küçücük kareler parmaklarına yapışıyor, balık ise ağır ağır ortaya çıkıyordu.',
            'Akşam olduğunda kartonun üstünde mavi bir balık yüzüyordu. Duru yorulmuştu ama çok mutluydu; bu, tamamlanmış bir işin tatlı yorgunluğuydu. “Eski ustalar ne kadar sabırlıymış!” dedi. Birkaç yüz kâğıt parçası onu bütün gün uğraştırmışken binlerce taşın ne demek olduğunu artık daha iyi anlıyordu. Demek ki güzel olan yalnızca sonuç değil, ona giden sabırlı emekti.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Kâğıttan mozaik, taştan mozaikten güzeldir.',
                'Değerli eserlerin ardında sabırlı bir emek vardır.',
                'Yamaç Evler yalnızca yazın gezilmelidir.',
                'Bir işi yarıda bırakmak bazen en iyisidir.',
              ],
              correctIndex: 1,
              hint: 'İpucu: Son paragrafın son cümlesini oku.',
              explanation:
                'Aferin! Duru, güzel sonucun ardındaki sabırlı emeği kendi yaşayarak anladı.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Eksik kalan pulların onu masaya geri çağırdığını hissetti.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Birinin Duru’yu yemeğe çağırdığı',
                'Duru’nun pulları kaybettiği',
                'Bitmemiş işi tamamlama isteğinin ağır bastığı',
                'Balığın canlanıp konuştuğu',
              ],
              correctIndex: 2,
              hint: 'İpucu: Bu cümleden hemen önce Duru ne düşünüyordu?',
              explanation:
                'Çok güzel! Duru işini yarım bırakmaya gönlü razı olmadığı için devam etti.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Duru, resmin taşlardan oluştuğunu yakından bakınca fark etti. II. Babası, bir resmin kaç günde bittiğini Duru’ya tam olarak söyledi. III. Duru, kendi mozaiğini yapınca ustaların emeğini daha iyi anladı.',
              options: ['Yalnız I', 'Yalnız III', 'II ve III', 'I ve III'],
              correctIndex: 3,
              hint: 'İpucu: Her yargıyı tek tek ele al; babasının cevabına üçüncü paragrafta bak.',
              explanation:
                'Harika! Babası bunu tam olarak bilmiyordu, bu yüzden II. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'inat', meaning: 'Bir şeye karşı direnerek, ona rağmen.' },
            { word: 'sınayan', meaning: 'Ne kadar dayanıklı olduğunu ölçen.' },
            { word: 'pulların', meaning: 'Balığın derisini kaplayan küçük, ince parçaların.' },
            { word: 'emekti', meaning: 'Bir iş için harcanan çabaydı.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Nil topraktan ne buldu?',
          options: ['Altın bir yüzük', 'Eski bir testinin parçası', 'Taş bir heykel'],
          correctIndex: 1,
          hint: 'İpucu: Dördüncü paragrafta teyzesinin söylediklerini oku.',
          explanation: 'Doğru! Nil eski bir testinin parçasını buldu.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Nil’in teyzesi bir arkeologdu. Efes’te kazı yapardı. Bir yaz günü Nil’i de yanına aldı.',
            'Alan iplerle küçük karelere bölünmüştü. Teyzesi Nil’e bir fırça verdi. “Acele etmek yok,” dedi. “Toprağı yavaşça süpür.”',
            'Nil fırçayı yavaşça gezdirdi. Bir süre sonra kırmızı bir parça gördü. “Teyze, bak!” diye fısıldadı.',
            'Teyzesi parçaya iyi baktı. “Bu, eski bir testinin parçası,” dedi. “Belki iki bin yıl önce biri bununla su taşıdı.” Yerini deftere yazdı. Bir de fotoğrafını çekti.',
            'Nil parçayı eve almak istedi. Teyzesi güldü. “Bu buluntu hepimizin,” dedi. “Müzede herkes görecek.” Nil bunu duyunca gururlandı.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Nil topraktan ne buldu?',
              options: ['Altın bir yüzük', 'Testi parçası', 'Taş bir heykel'],
              correctIndex: 1,
              hint: 'İpucu: Dördüncü paragrafta teyzesinin sözüne bak.',
              explanation: 'Doğru! Nil eski bir testinin parçasını buldu.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Parça neden eve götürülmedi?',
              options: ['Çok ağır olduğu için', 'Kırık olduğu için', 'Müzede herkes görsün diye'],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta teyzesinin söylediklerini oku.',
              explanation: 'Aferin! Buluntu hepimizindir; müzede herkes görebilir.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Nil, parçanın müzeye gideceğini duyunca nasıl hissetti?',
              options: ['Gururlandı', 'Kızdı', 'Korktu'],
              correctIndex: 0,
              hint: 'İpucu: Son cümleye bak.',
              explanation: 'Harika! Nil bulduğu parçayı herkesin göreceğini düşünüp gururlandı.',
            },
          ],
          glossary: [
            { word: 'arkeologdu', meaning: 'Eski eşyaları kazıp inceleyen kişiydi.' },
            { word: 'testinin', meaning: 'Su taşımaya yarayan, topraktan yapılmış kabın.' },
            { word: 'buluntu', meaning: 'Kazıda topraktan çıkan eski eşya.' },
          ],
        },
        G3: {
          paragraphs: [
            'Nil’in teyzesi bir arkeologdu ve yıllardır Efes’te kazı yapıyordu. Bir yaz günü Nil’i de kazı alanına götürdü. Nil bu günü haftalardır bekliyordu, çünkü arkeologların büyük hazineler bulduğunu sanıyordu. Yol boyunca teyzesine nerede altın bulunduğunu, hazinelerin kimde saklandığını sorup durdu.',
            'Kazı alanı iplerle küçük karelere bölünmüştü. Her karede birileri dikkatle, neredeyse hiç konuşmadan toprağı kazıyordu. Teyzesi Nil’e küçük bir fırça verdi. “Burada acele etmek yok. Toprağı yavaşça süpürmelisin,” dedi. Nil önce kürek bekliyordu ama elinde resim fırçasına benzeyen bir şey vardı.',
            'Fırçayı usulca toprağın üstünde gezdirdi. Uzun süre hiçbir şey çıkmadı, kolları da yorulmaya başladı. Tam vazgeçecekken topraktan kırmızı, kenarı kırık bir parça göründü. “Teyze, bak!” diye fısıldadı. Neden fısıldadığını kendisi de bilmiyordu.',
            'Teyzesi parçayı dikkatle inceledi. “Bu, eski bir testinin parçası. Belki iki bin yıl önce biri bununla su taşıdı,” dedi. Sonra parçanın bulunduğu yeri deftere yazdı ve fotoğrafını çekti. Nil, küçücük bir parça için bu kadar özen gösterilmesine şaşırdı. Demek ki burada önemli olan parçanın büyüklüğü değil, anlattığı hikâyeydi.',
            'Nil parçayı eve götürmek istedi. Teyzesi gülümsedi. “Bu buluntu hepimizin. Müzede herkes görsün diye saklanacak,” dedi. Nil önce biraz üzüldü, ama sonra müzede insanların kendi bulduğu parçaya baktığını hayal etti. Bunu düşününce daha da gururlandı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Teyzesi Nil’e neden toprağı yavaşça süpürmesini söylemiş olabilir?',
              options: [
                'Fırça çabuk eskimesin diye',
                'Topraktaki eski parçalar zarar görmesin diye',
                'Nil yorulmasın diye',
                'Kazı erken bitmesin diye',
              ],
              correctIndex: 1,
              hint: 'İpucu: Toprağın altından ne çıktı ve kenarı nasıldı? Üçüncü paragrafa bak.',
              explanation: 'Aferin! Eski eşyalar kırılgandır; acele edilirse zarar görebilirler.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Fırçayı usulca toprağın üstünde gezdirdi.” cümlesindeki “usulca” ne demektir?',
              options: [
                'Hızlı ve sert biçimde',
                'Gürültü yaparak',
                'Neşeyle şarkı söyleyerek',
                'Yavaşça ve dikkatle',
              ],
              correctIndex: 3,
              hint: 'İpucu: Teyzesi Nil’e toprağı nasıl süpürmesini söylemişti?',
              explanation: 'Doğru! Usulca, yavaşça ve dikkatle demektir.',
            },
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Geçmişten kalan eserler herkesin ortak değeridir.',
                'Arkeologlar yalnızca altın arar.',
                'Kazı yapmak çok kolay bir iştir.',
                'Fırça kürekten daha kullanışlıdır.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Son paragrafta teyzesinin Nil’e söylediklerini düşün.',
              explanation: 'Harika! Eski eserler hepimizindir; müzede korunur ve herkes görebilir.',
            },
          ],
          glossary: [
            {
              word: 'arkeologdu',
              meaning: 'Eski çağlardan kalan eşyaları kazıp inceleyen bilim insanıydı.',
            },
            { word: 'usulca', meaning: 'Yavaşça ve dikkatle.' },
            { word: 'özen', meaning: 'Bir işin üstüne dikkatle ve titizlikle düşme.' },
            { word: 'buluntu', meaning: 'Kazıda topraktan çıkarılan eski eşya.' },
          ],
        },
        G4: {
          paragraphs: [
            'Nil’in teyzesi bir arkeologdu ve yıllardır Efes’te kazı yapıyordu. Nil, teyzesinin anlattıklarını dinledikçe arkeolojiyi altın sandıklarla dolu bir serüven sanmıştı. Bu yüzden, bir yaz günü kazı alanına gitmek için erkenden kalktığında aklında parıltılı hazineler vardı. Yol boyunca teyzesine, bulunan altınların nerede saklandığını sorup durdu.',
            'Oysa karşılaştığı görüntü beklediğinden çok farklıydı. Kazı alanı iplerle küçük karelere bölünmüştü; her karede birileri dikkatle, neredeyse hiç konuşmadan toprağı kazıyordu. Teyzesi Nil’e küçük bir fırça uzattı. “Burada acele etmek yok. Toprağı yavaşça süpürmelisin,” dedi. Nil, bu minik fırçayla toprağın sırlarına nasıl ulaşılacağını anlayamadı. Üstelik çevresindeki yetişkinlerin, küçücük bir toprak parçasını temizlemek için saatlerini harcaması ona başlangıçta oldukça anlamsız görünüyordu.',
            'Fırçayı usulca toprağın üstünde gezdirmeye başladı. Dakikalar güneşin altında uzadıkça uzadı; kolları yoruldu, sabrı azaldı. Tam umudunu kesmek üzereyken topraktan kırmızı, kenarı kırık bir parça göründü. “Teyze, bak!” diye fısıldadı. Yüzyıllardır süren bir uykuyu bölmekten çekinir gibiydi.',
            'Teyzesi parçayı dikkatle inceledi. “Bu, eski bir testinin parçası. Belki iki bin yıl önce biri bununla su taşıdı,” dedi. Ardından parçanın bulunduğu yeri deftere yazdı ve fotoğrafını çekti. Teyzesine göre bir buluntunun yeri de en az kendisi kadar önemliydi; çünkü o, parçanın geçmişin hangi sayfasından koptuğunu gösteriyordu. Nil elindeki sıradan görünen parçaya artık başka gözlerle bakıyor, bir zamanlar bu testiyi taşıyan kişinin nasıl biri olduğunu merak ediyordu.',
            'Nil parçayı eve götürmek istedi. Teyzesi gülümsedi. “Bu buluntu hepimizin. Müzede herkes görsün diye saklanacak,” dedi. Bu söz önce Nil’in hevesini kırar gibi oldu. Ama sonra, yıllar sonra müzeye gelecek bir çocuğun aynı parçanın önünde duracağını düşündü. Altın bir hazine bulamamıştı belki, ama geçmişle gelecek arasında küçük bir köprü kurmuştu. Bunu düşününce daha da gururlandı.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Dördüncü paragrafa göre bir buluntunun yerini not etmek neden önemlidir?',
              options: [
                'Parçanın geçmişin hangi bölümüne ait olduğunu gösterdiği için',
                'Parça kolay kaybolduğu için',
                'Parçanın değeri böyle hesaplandığı için',
                'Bulan kişinin adı unutulmasın diye',
              ],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafın son cümlesini dikkatle oku.',
              explanation:
                'Aferin! Buluntunun yeri, onun geçmişin hangi sayfasından koptuğunu gösterir.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Geçmişle gelecek arasında küçük bir köprü kurmuştu.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Nil’in kazı alanına bir köprü yaptığı',
                'Bulduğu parçanın geçmişi gelecektekilere ulaştıracağı',
                'Nil’in yeni bir meslek seçtiği',
                'Eve giden yolun kısaldığı',
              ],
              correctIndex: 1,
              hint: 'İpucu: Nil, yıllar sonra müzeye gelecek çocuğu neden düşünüyor?',
              explanation: 'Çok güzel! Müzedeki parça, geçmişi gelecekteki insanlara anlatacak.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'İlk iki paragraf arasındaki ilişkiyi en iyi hangisi anlatır?',
              options: [
                'İkinci paragraf birincisini aynen tekrar eder.',
                'İkinci paragraf konuyu tamamen değiştirir.',
                'İkinci paragraf hikâyenin sonucunu söyler.',
                'İkinci paragraf, Nil’in beklentisiyle gerçeğin farkını gösterir.',
              ],
              correctIndex: 3,
              hint: 'İpucu: İkinci paragrafın “Oysa” sözüyle başlamasına dikkat et.',
              explanation:
                'Harika! “Oysa” sözü, Nil’in beklediğinden farklı bir durumla karşılaştığını gösterir.',
            },
          ],
          glossary: [
            { word: 'serüven', meaning: 'Heyecanlı ve şaşırtıcı olaylarla dolu yaşantı.' },
            { word: 'parıltılı', meaning: 'Işıl ışıl parlayan.' },
            { word: 'hevesini', meaning: 'Bir şeyi yapma isteğini.' },
            { word: 'buluntunun', meaning: 'Kazıda topraktan çıkarılan eski eşyanın.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Taştaki yazı hangi dildeydi?',
          options: ['Türkçe', 'Eski Yunanca', 'İngilizce'],
          correctIndex: 1,
          hint: 'İpucu: İkinci paragrafta annesinin söylediğine bak.',
          explanation: 'Doğru! Taştaki yazı Eski Yunancaydı.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.DUYGU_KARAKTER,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Arda, Efes’te bir yolda yürüyordu. Yerde büyük bir taş gördü. Taşın üstünde garip harfler vardı.',
            '“Anne, bu ne yazısı?” diye sordu. Annesi yandaki tabelayı okudu. “Bu, Eski Yunanca,” dedi. “Efes’te yaşayanlar bu dili yazarmış.”',
            'Tabelada yazının anlamı da vardı. Halk bir adama teşekkür ediyordu. Çünkü adam çeşmeyi onartmıştı. Arda çok şaşırdı.',
            '“Neden kâğıda yazmamışlar?” diye sordu. Annesi, “Taş kolay yok olmaz,” dedi. “Yazı yıllar sonra da okunsun istemişler.”',
            'O akşam Arda defterine bir not yazdı: “Bugün Efes’i gezdim. Okuyan herkese selam!” Defteri iyi sakladı. Belki bir gün biri okuyacaktı.',
          ],
          questions: [
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Halk adama neden teşekkür ediyordu?',
              options: ['Çeşmeyi onarttığı için', 'Taşı getirdiği için', 'Yol yaptığı için'],
              correctIndex: 0,
              hint: 'İpucu: Üçüncü paragrafı oku.',
              explanation: 'Aferin! Adam şehrin çeşmesini onartmıştı.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Çeşmeyi onartmıştı.” cümlesinde “onartmak” ne demektir?',
              options: ['Kırmak', 'Tamir ettirmek', 'Satmak'],
              correctIndex: 1,
              hint: 'İpucu: Halk bu yüzden adama teşekkür ediyor. Adam iyi bir şey mi yaptı?',
              explanation: 'Doğru! Onartmak, bozulan bir şeyi tamir ettirmektir.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Arda notunu yazarken ne umuyordu?',
              options: [
                'Defterin kaybolmasını',
                'Annesinin kızmasını',
                'Bir gün birinin okumasını',
              ],
              correctIndex: 2,
              hint: 'İpucu: Hikâyenin son cümlesine bak.',
              explanation: 'Harika! Arda da notunun bir gün okunmasını istedi.',
            },
          ],
          glossary: [
            { word: 'garip', meaning: 'Alışılmamış, tuhaf.' },
            { word: 'tabelayı', meaning: 'Üstünde bilgi yazan levhayı.' },
            { word: 'onartmıştı', meaning: 'Tamir ettirmişti.' },
          ],
        },
        G3: {
          paragraphs: [
            'Arda, Efes’in mermer caddesinde yürürken yerde duran büyük bir taşın önünde durdu. Taşın üstünde garip harfler vardı. Bazıları üçgene, bazıları yuvarlağa benziyordu. Arda önce bunların süs olduğunu sandı, ama harfler satır satır dizilmişti.',
            '“Anne, bu ne yazısı?” diye sordu. Annesi taşın yanındaki tabelayı okudu. “Bu, Eski Yunanca. Efes’te yaşayanlar bu dili konuşur ve yazarmış,” dedi. Arda parmağını harflerin üstünde gezdirmek istedi, ama eski taşlara dokunmamak gerektiğini hatırlayıp elini geri çekti. Yüzyıllar önce yazılmış satırların bu kadar okunaklı kalabilmesi ona inanılmaz görünüyordu.',
            'Tabelada yazının anlamı da vardı. Halk, şehrin çeşmesini onarttığı için bir adama teşekkür ediyordu. Arda çok şaşırdı. Demek ki insanlar teşekkürlerini taşa yazarmış! Kendisi en fazla bir mesaj atar, sonra da unuturdu.',
            '“Neden kâğıda yazmamışlar?” diye sordu. Annesi, “Taş kolay kolay yok olmaz. Mesajlarının yüzlerce yıl sonra da okunmasını istemişler,” diye açıkladı. Arda etrafındaki taşlara bu kez başka bir gözle baktı. Belki hepsi birine bir şey söylemek istiyordu. Bu büyük taşların her biri, sahibinin unutulmasını istemediği bir düşünceyi içinde taşıyor olabilirdi.',
            'O akşam Arda defterine kısa bir mesaj yazdı: “Bugün Efes’i gezdim. Okuyan herkese selam!” Sonra defteri özenle sakladı. Belki bir gün biri onu okuyacaktı. Taş kadar dayanıklı olmasa da onun mesajı da geleceğe gönderilmiş küçük bir mektup sayılırdı.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Taştaki yazı neyi anlatıyordu?',
              options: [
                'Şehrin haritasını',
                'Bir oyunun duyurusunu',
                'Bir çeşmenin yapılışını',
                'Halkın bir adama teşekkürünü',
              ],
              correctIndex: 3,
              hint: 'İpucu: Üçüncü paragrafın ilk iki cümlesini oku.',
              explanation: 'Doğru! Halk, çeşmeyi onarttığı için bir adama teşekkür ediyordu.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Geleceğe gönderilmiş küçük bir mektup” sözüyle anlatılmak istenen nedir?',
              options: [
                'Postaneye verilen bir zarf',
                'Yıllar sonra okunması umulan bir yazı',
                'Annesine yazılmış bir not',
                'Okulda verilen bir ödev',
              ],
              correctIndex: 1,
              hint: 'İpucu: Arda’nın defterini neden sakladığını düşün.',
              explanation:
                'Aferin! Arda yazısının bir gün başka biri tarafından okunmasını umuyor.',
            },
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne başka bir başlık verilecek olsa hangisi en uygun olur?',
              options: [
                'Yıllar Sonrasına Mesaj Bırakmak',
                'Arda’nın Kayıp Defteri',
                'Efes’in Kuruyan Çeşmesi',
                'Mermerden Yollar',
              ],
              correctIndex: 0,
              hint: 'İpucu: Hem taştaki yazıyı hem de Arda’nın defterini kapsayan başlığı bul.',
              explanation: 'Harika! Hem Efesliler hem de Arda geleceğe mesaj bırakmak istedi.',
            },
          ],
          glossary: [
            { word: 'mermer', meaning: 'Parlak, sert ve değerli bir taş.' },
            { word: 'tabelayı', meaning: 'Üstünde bilgi yazan levhayı.' },
            { word: 'onarttığı', meaning: 'Bozulan bir şeyi tamir ettirdiği.' },
          ],
        },
        G4: {
          paragraphs: [
            'Arda, Efes’in mermer caddesinde yürürken yerde duran büyük bir taşın önünde durakladı. Taşın yüzeyi, bazıları üçgene, bazıları yuvarlağa benzeyen garip harflerle kaplıydı. Önce bunların süs olduğunu sandı; ama satır satır dizilen işaretler, çözülmeyi bekleyen bir bilmeceye benziyordu. Arda, kitaplarda okuduğu eski uygarlıkların izlerini ilk kez bu kadar yakından incelediğini fark etti.',
            '“Anne, bu ne yazısı?” diye sordu. Annesi taşın yanındaki tabelayı okudu. “Bu, Eski Yunanca. Efes’te yaşayanlar bu dili konuşur ve yazarmış,” dedi. Arda, yüzyıllar önce yaşamış bir insanın elinden çıkan bu satırların karşısında tuhaf bir heyecan duydu. Söyleyeni çoktan gitmiş bir söz, hâlâ burada beklemekteydi.',
            'Tabelada yazının anlamı da vardı: Halk, şehrin çeşmesini onarttığı için bir adama teşekkür ediyordu. Arda bu cevapla şaşkına döndü. Böylesine ağır bir taşa bir sır, önemli bir kural ya da büyük bir olay yazıldığını tahmin etmişti. Oysa insanlar bu dev taşı bir teşekkür için yazıyla doldurmuştu; demek ki küçük bir iyilik, belki de sandığından çok daha büyük bir şeydi. Üstelik bu teşekkürü, adamın kendisinden çok daha uzun yaşayacak biçimde herkesin gözü önüne yerleştirmişlerdi.',
            '“Neden kâğıda yazmamışlar?” diye sordu. Annesi, “Taş kolay kolay yok olmaz. Mesajlarının yüzlerce yıl sonra da okunmasını istemişler,” diye açıkladı. Arda, telefondaki mesajların bir dokunuşla silinebildiğini, oysa taşa yazı kazımanın uzun sürse de sözü zamana karşı koruduğunu düşündü.',
            'O akşam Arda defterini açtı ve kısa bir mesaj yazdı: “Bugün Efes’i gezdim. Okuyan herkese selam!” Defterini özenle kapatıp rafın en arkasına yerleştirdi. Yazdığı birkaç satır, uzun uğraşlar sonunda taşa işlenen teşekkürle karşılaştırıldığında küçücük kalıyordu; yine de içtenlikle yazılmıştı. Belki bir gün biri onu okuyacaktı. Mermer kadar dayanıklı değildi elbette, ama o da kendi küçük şişesini zamanın denizine bırakmıştı.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                'Üçüncü paragrafa göre Arda’nın şaşkınlığının nedeni aşağıdakilerden hangisidir?',
              options: [
                'Tabelanın yanlış yazılmış olması',
                'Taşın beklediğinden ağır olması',
                'Yazının önemli bir olay yerine bir teşekkür içermesi',
                'Annesinin Eski Yunanca bilmesi',
              ],
              correctIndex: 2,
              hint: 'İpucu: Arda taşta ne yazdığını tahmin etmişti? Gerçekte ne yazıyordu?',
              explanation: 'Aferin! Arda büyük bir olay beklerken taşta bir teşekkür buldu.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Kendi küçük şişesini zamanın denizine bırakmıştı.” cümlesiyle anlatılmak istenen nedir?',
              options: [
                'Arda’nın denize şişe attığı',
                'Arda’nın mesajını gelecekte birinin bulmasını umduğu',
                'Arda’nın defterini kaybettiği',
                'Arda’nın geziden hatıra aldığı',
              ],
              correctIndex: 1,
              hint: 'İpucu: Bu cümleden hemen önce Arda defteri için ne düşünüyor?',
              explanation: 'Çok güzel! Arda mesajını, bir gün birinin okuması umuduyla sakladı.',
            },
            {
              type: QuestionType.SOZEL_MANTIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Bir yazının uzun süre okunabilmesi, yazıldığı şeyin dayanıklılığına bağlıysa metne göre aşağıdakilerden hangisi söylenebilir?',
              options: [
                'Kâğıda yazılan her mesaj hemen yok olur.',
                'Taşa yazılan mesajlar hiç okunmaz.',
                'Arda’nın defteri taştan daha dayanıklıdır.',
                'Defterdeki yazı, taştaki kadar uzun ömürlü olmayabilir.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Son paragrafta defterin mermerle karşılaştırıldığı yere bak.',
              explanation:
                'Harika! Defter mermer kadar dayanıklı olmadığı için yazısı da o kadar uzun ömürlü olmayabilir.',
            },
          ],
          glossary: [
            { word: 'durakladı', meaning: 'Bir süre durup bekledi.' },
            { word: 'yüzeyi', meaning: 'Bir şeyin dış, üst kısmı.' },
            { word: 'kazımanın', meaning: 'Sert bir yüzeyi oyarak iz bırakmanın.' },
            { word: 'dayanıklı', meaning: 'Kolay bozulmayan, uzun süre kalan.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Mete etrafına bakınca neyi göremedi?',
          options: ['Ağaçları', 'Tarlaları', 'Denizi'],
          correctIndex: 2,
          hint: 'İpucu: İkinci paragrafın ilk iki cümlesine bak.',
          explanation: 'Doğru! Etrafta ne deniz vardı ne de gemi.',
        },
        {
          type: QuestionType.NEDEN_SONUC,
          cognitiveLevel: CognitiveLevel.ANLAMA,
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
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Mete, Efes’te uzun bir yolun başında durdu. Yolun iki yanı sütunlarla doluydu. Rehber, “Buranın adı Liman Caddesi,” dedi.',
            'Mete etrafa baktı. Ne deniz vardı ne de gemi. Yalnızca tarlalar ve ağaçlar vardı. “Liman nerede?” diye sordu.',
            'Rehber güldü. “Eskiden deniz buraya kadar gelirdi,” dedi. “Gemiler burada dururdu. Yolcular da bu yoldan şehre yürürdü.”',
            '“Peki deniz nereye gitti?” dedi Mete. Rehber anlattı: Yakındaki nehir denize toprak taşıdı. Toprak yıllarca birikti. Liman doldu ve deniz geri çekildi.',
            'Mete uzağa baktı. Buna çok şaşırdı. “Doğa da usta bir ressam gibi,” diye düşündü.',
          ],
          questions: [
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Mete etrafa bakınca neyi göremedi?',
              options: ['Ağaçları', 'Tarlaları', 'Denizi'],
              correctIndex: 2,
              hint: 'İpucu: İkinci paragrafın ilk iki cümlesine bak.',
              explanation: 'Doğru! Etrafta ne deniz vardı ne de gemi.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Deniz neden geri çekildi?',
              options: [
                'Nehir toprak taşıdığı için',
                'Gemiler suyu aldığı için',
                'Yağmur yağmadığı için',
              ],
              correctIndex: 0,
              hint: 'İpucu: Dördüncü paragrafta rehberin anlattıklarını oku.',
              explanation: 'Aferin! Nehrin taşıdığı toprak limanı doldurdu.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Hikâyeye göre “liman” ne demektir?',
              options: ['Uzun bir yol', 'Gemilerin durduğu yer', 'Bir çeşit ağaç'],
              correctIndex: 1,
              hint: 'İpucu: Rehberin üçüncü paragrafta anlattığı gemileri düşün.',
              explanation: 'Harika! Liman, gemilerin yanaşıp durduğu yerdir.',
            },
          ],
          glossary: [
            { word: 'sütunlarla', meaning: 'Yukarı doğru uzanan kalın direklerle.' },
            { word: 'birikti', meaning: 'Üst üste toplandı.' },
            { word: 'ressam', meaning: 'Resim yapan kişi.' },
          ],
        },
        G3: {
          paragraphs: [
            'Mete, Efes’te geniş ve uzun bir caddenin başında durdu. Caddenin iki yanında sütunlar sıralanmıştı ve yol ileriye doğru dümdüz uzanıyordu. Rehber, “Bu caddenin adı Liman Caddesi,” dedi. Mete adı duyunca denizi görmek için hemen adımlarını hızlandırdı.',
            'Mete etrafına baktı, ama ne deniz vardı ne de gemi. Yalnızca tarlalar ve ağaçlar görünüyordu. Rehberin şaka yaptığını düşündü. “Liman nerede?” diye sordu şaşkınlıkla. Hiçbir denizin olmadığı yerde liman nasıl olabilirdi ki?',
            'Rehber güldü. “Çok eskiden deniz buraya kadar gelirdi. Gemiler bu caddenin ucuna yanaşır, yolcular inip bu yoldan şehre yürürdü,” dedi. Mete gözünün önüne yelkenli gemileri, yüklerini taşıyan insanları getirmeye çalıştı. Ama çevresinde yalnızca rüzgârda sallanan ekinler vardı.',
            '“Peki deniz nereye gitti?” diye sordu. Rehber anlattı: Yakındaki Küçük Menderes Nehri, yüzyıllar boyunca denize toprak taşımıştı. Her yıl biraz daha toprak bırakıyor, toprak biriktikçe liman doluyordu. Sonunda liman kara oldu ve deniz kilometrelerce geriye çekildi. Bugün deniz, bu caddeden bakınca görünmeyecek kadar uzakta kalmıştı.',
            'Mete uzaklara baktı. Bir nehrin bir şehrin haritasını değiştirebildiğine inanamıyordu, çünkü değişim o kadar yavaştı ki kimse bir günde fark edemezdi. “Doğa da tıpkı usta bir ressam gibi,” diye düşündü. “Küçük fırça darbeleriyle koskoca bir resmi değiştiriyor.”',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Doğa yavaş yavaş da olsa yeryüzünü değiştirebilir.',
                'Gemiler nehirlerde yolculuk yapmalıdır.',
                'Tarlalar denizden daha değerlidir.',
                'Rehberlerin anlattıkları genellikle şakadır.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Mete’nin son paragrafta doğa için söylediklerini düşün.',
              explanation:
                'Aferin! Küçük ve yavaş değişimler bile koskoca bir yeri değiştirebilir.',
            },
            {
              type: QuestionType.NEDEN_SONUC,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Çevrede deniz olmadığı hâlde bu caddeye neden “Liman Caddesi” denmiştir?',
              options: [
                'Caddeye yanlışlıkla bu ad verildiği için',
                'Liman başka bir şehre taşındığı için',
                'Cadde limana uzandığı hâlde deniz sonradan çekildiği için',
                'Gemiler eskiden tarlalarda yüzdüğü için',
              ],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü ve dördüncü paragrafları birlikte düşün.',
              explanation:
                'Çok güzel! Cadde eskiden limana çıkıyordu; deniz sonradan geri çekildi.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Mete, caddenin adını ve çevreyi görünce önce ne düşündü?',
              options: [
                'Çok korktu.',
                'Rehberin şaka yaptığını sandı.',
                'Hemen eve dönmek istedi.',
                'Denizde yüzmeyi hayal etti.',
              ],
              correctIndex: 1,
              hint: 'İpucu: İkinci paragrafın üçüncü cümlesini oku.',
              explanation: 'Doğru! Deniz görmeyince Mete rehberin şaka yaptığını düşündü.',
            },
          ],
          glossary: [
            { word: 'yanaşır', meaning: 'Kıyıya yaklaşıp durur.' },
            { word: 'biriktikçe', meaning: 'Üst üste toplandıkça.' },
            { word: 'kilometrelerce', meaning: 'Birçok kilometre uzağa kadar.' },
            { word: 'darbeleriyle', meaning: 'Hafif dokunuşlarıyla, vuruşlarıyla.' },
          ],
        },
        G4: {
          paragraphs: [
            'Mete, Efes’te geniş ve uzun bir caddenin başında durdu. İki yanına sütunlar sıralanmış olan yol, ileriye doğru dümdüz uzanıyordu. Rehber, “Bu caddenin adı Liman Caddesi,” deyince Mete adımlarını sıklaştırdı; birazdan denizi, gemileri ve martıları göreceğini sanıyordu.',
            'Ama önünde beliren görüntü hiç de beklediği gibi değildi. Ne deniz vardı ne de gemi; uzaklara kadar yalnızca tarlalar ve ağaçlar uzanıyordu. “Liman nerede?” diye sordu şaşkınlıkla. Bu ad ona, üstünde “kütüphane” yazan boş bir dolap kadar anlamsız geliyordu. Güneşin altında yalnızca birkaç ağacın yaprakları kıpırdıyordu.',
            'Rehber güldü. “Çok eskiden deniz buraya kadar gelirdi. Gemiler bu caddenin ucuna yanaşır, yolcular inip bu yoldan şehre yürürdü,” dedi. Mete gözlerini kıstı ve tarlaların yerine dalgalanan suları, yelkenlerini toplayan gemileri getirmeye çalıştı. Zihnindeki resim, önündeki gerçeğe hiç uymuyordu. Bir yerin adı geçmişini bu kadar açık söylerken görüntüsünün onu böylesine yalanlaması, ona çözülmesi gereken bir soru gibi geldi.',
            '“Peki deniz nereye gitti?” diye sordu. Rehberin anlattığına göre bu değişimin sanatçısı, yakındaki Küçük Menderes Nehri’ydi. Nehir, yüzyıllar boyunca denize toprak taşımıştı. Her yıl bıraktığı ince tabaka tek başına önemsiz görünse de toprak biriktikçe liman dolmuş, deniz kilometrelerce geriye çekilmişti. Şehrin denizle kurduğu bağ da böylece yavaş yavaş kopmuştu. Gemiler başka limanlara yönelmiş, kalabalık şehrin sokakları da zamanla sessizliğe bürünmüştü.',
            'Mete uzaklara baktı. Bir nehrin bir şehrin haritasını değiştirebildiğine inanamıyordu. Hiç kimsenin bir günde fark edemeyeceği kadar küçük değişimler, üst üste gelince koskoca bir limanı silmişti. “Doğa da tıpkı usta bir ressam gibi,” diye düşündü. “Acele etmiyor, ama tuvalini sonunda baştan yaratıyor.” Arkasını döndüğünde cadde hâlâ olmayan bir denize doğru uzanıyordu; adı ise kaybolan limanın son hatırası gibi yerinde duruyordu.',
          ],
          questions: [
            {
              type: QuestionType.ANA_FIKIR,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metnin ana fikri aşağıdakilerden hangisidir?',
              options: [
                'Limanlar tarım için uygun değildir.',
                'Tarihî caddeler yenilenmelidir.',
                'Küçük değişimler zamanla büyük sonuçlar doğurabilir.',
                'Nehirler denizlerden daha güçlüdür.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta küçük değişimlerin neye yol açtığını oku.',
              explanation:
                'Aferin! Her yıl bırakılan ince tabaka, sonunda koskoca bir limanı silmişti.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                '“Bu ad ona, üstünde ‘kütüphane’ yazan boş bir dolap kadar anlamsız geliyordu.” cümlesi neyi anlatıyor?',
              options: [
                'Caddenin adıyla gördükleri arasında uyum olmadığını',
                'Mete’nin kitap okumayı sevmediğini',
                'Caddenin sonunda bir dolap bulunduğunu',
                'Rehberin yanlış konuştuğunu',
              ],
              correctIndex: 0,
              hint: 'İpucu: Caddenin adı ne, Mete çevresinde ne görüyor?',
              explanation:
                'Çok güzel! Adı “liman” olan bir yerde deniz olmaması Mete’ye anlamsız geldi.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Nehrin taşıdığı toprak, limanın dolmasına yol açmıştır. II. Deniz bir günde geri çekilmiştir. III. Mete, caddenin ucunda deniz göreceğini sanıyordu.',
              options: ['Yalnız I', 'Yalnız II', 'II ve III', 'I ve III'],
              correctIndex: 3,
              hint: 'İpucu: Her yargıyı tek tek ele al; değişimin ne kadar sürdüğüne dördüncü paragrafta bak.',
              explanation:
                'Harika! Değişim yüzyıllar sürdüğü için II. yargı yanlıştır; diğer ikisi doğrudur.',
            },
          ],
          glossary: [
            { word: 'sıklaştırdı', meaning: 'Daha hızlı ve art arda yapmaya başladı.' },
            { word: 'tabaka', meaning: 'Üst üste duran katlardan her biri.' },
            { word: 'tuvalini', meaning: 'Ressamın üstüne resim yaptığı gerili bezini.' },
          ],
        },
      },
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
          type: QuestionType.BILGI,
          cognitiveLevel: CognitiveLevel.HATIRLAMA,
          prompt: 'Pırıl’a Efes’i kim gezdirdi?',
          options: ['Yaşlı kedi Zeytin', 'Bir rehber', 'Küçük bir kız'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Bilge kedi Zeytin, Pırıl’a Efes’i gezdirdi.',
        },
        {
          type: QuestionType.SOZCUK_ANLAMI,
          cognitiveLevel: CognitiveLevel.ANLAMA,
          prompt: 'Zeytin “bilge” bir kediydi. “Bilge” ne demektir?',
          options: ['Çok hızlı', 'Çok bilgili ve akıllı', 'Çok yaramaz'],
          correctIndex: 1,
          hint: 'İpucu: Zeytin, Pırıl’a Efes hakkında neler anlattı?',
          explanation: 'Aferin! Bilge, çok şey bilen ve akıllıca konuşan demektir.',
        },
        {
          type: QuestionType.ANA_FIKIR,
          cognitiveLevel: CognitiveLevel.CIKARIM,
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
      versions: {
        G1: {
          paragraphs: [
            'Pırıl, Efes’in eski taşları arasında geziyordu. Orada çok kedi vardı. Kimi gölgede uyuyor, kimi gelenleri izliyordu.',
            'Yaşlı ve bilge bir kedi yanına geldi. Adı Zeytin’di. “Hoş geldin yolcu. Nereye gidiyorsun?” diye sordu. Pırıl, “Evime, Van’a dönüyorum,” dedi.',
            'Zeytin ona Efes’i gezdirdi. Kütüphanenin önünde durdular. Tiyatroda dinlendiler. Zeytin, “Bu taşlar çok hikâye saklıyor,” dedi.',
            'Akşam bir tepeye çıktılar. Zeytin uzakta bir sütun gösterdi. “Orada çok büyük bir tapınak vardı. Şimdi o sütun kaldı,” dedi.',
            'Pırıl sütuna uzun uzun baktı. “Her şey değişse de hikâyeler kalıyor,” diye düşündü. Sabah Zeytin’e veda etti. Sonra Antalya’ya doğru yola çıktı.',
          ],
          questions: [
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: '“Zeytin’e veda etti.” cümlesinde “veda etmek” ne demektir?',
              options: ['Hoşça kal demek', 'Yemek yemek', 'Uyumak'],
              correctIndex: 0,
              hint: 'İpucu: Bu cümleden sonra Pırıl ne yaptı?',
              explanation: 'Aferin! Veda etmek, ayrılırken hoşça kal demektir.',
            },
            {
              type: QuestionType.BILGI,
              cognitiveLevel: CognitiveLevel.HATIRLAMA,
              prompt: 'Pırıl’a Efes’i kim gezdirdi?',
              options: ['Bir rehber', 'Bir çocuk', 'Zeytin'],
              correctIndex: 2,
              hint: 'İpucu: Üçüncü paragrafın ilk cümlesine bak.',
              explanation: 'Doğru! Bilge kedi Zeytin, Pırıl’a Efes’i gezdirdi.',
            },
            {
              type: QuestionType.DUYGU_KARAKTER,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Zeytin, Pırıl’a nasıl davrandı?',
              options: ['Kaba davrandı', 'Dostça davrandı', 'Ondan kaçtı'],
              correctIndex: 1,
              hint: 'İpucu: Zeytin ilk ne dedi, sonra Pırıl için ne yaptı?',
              explanation: 'Harika! Zeytin, Pırıl’ı güzel karşıladı ve ona Efes’i gezdirdi.',
            },
          ],
          glossary: [
            { word: 'bilge', meaning: 'Çok şey bilen, akıllı.' },
            { word: 'tapınak', meaning: 'Eskiden yapılmış büyük ve kutsal bina.' },
            { word: 'veda', meaning: 'Ayrılırken hoşça kal deme.' },
          ],
        },
        G3: {
          paragraphs: [
            'Pırıl, Efes’in eski taşları arasında dolaşırken güneşlenen kedilerle karşılaştı. Efes’te çok kedi yaşardı. Kimi sütunların gölgesinde uyuyor, kimi ziyaretçileri tembel tembel izliyordu. Pırıl uzun yoldan geldiği için onların bu rahatlığına biraz imrendi.',
            'Yaşlı ve bilge bir kedi olan Zeytin yanına geldi. “Hoş geldin yolcu. Nereye gidiyorsun?” diye sordu. Pırıl, memleketi Van’a döndüğünü anlattı. Zeytin bıyıklarını oynatarak gülümsedi, çünkü buraya uğrayan her yolcunun bir hikâyesi olduğunu bilirdi.',
            'Zeytin ona Efes’i gezdirdi. Kütüphanenin önünde durdular, tiyatronun basamaklarında dinlendiler. Yaşlı kedi her köşeyi çok iyi biliyordu. “Bu taşlar binlerce insanın hikâyesini saklıyor,” dedi. Pırıl taşlara kulak verse, sanki o hikâyeleri duyacaktı. Zeytin yolda rastladığı her kediye selam veriyor, onlar da kuyruklarını havaya kaldırarak karşılık veriyordu.',
            'Akşamüstü Zeytin onu bir tepeye götürdü. Uzakta tek başına duran bir sütun gösterdi. “Orada bir zamanlar dünyanın en büyük tapınaklarından biri vardı. Şimdi yalnızca o sütun kaldı,” dedi. Gün batarken sütunun gölgesi tarlaların üstüne upuzun düşüyordu. Pırıl böyle bir yapının nasıl göründüğünü gözünde canlandırmaya çalıştı.',
            'Pırıl sütuna uzun uzun baktı. “Her şey değişse de hikâyeler kalıyor,” diye düşündü. Ertesi sabah Zeytin’e veda etti. Küçük bir üzüntü duydu, ama aklında artık yeni bir hikâye vardı. Portakal kokulu Antalya’ya doğru neşeyle yola çıktı.',
          ],
          questions: [
            {
              type: QuestionType.YARDIMCI_FIKIR,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt: 'Aşağıdakilerden hangisi Zeytin için söylenemez?',
              options: [
                'Efes’i çok iyi bilir.',
                'Yaşlı ve bilgedir.',
                'Pırıl’la birlikte Antalya’ya gitmiştir.',
                'Pırıl’a Efes’i gezdirmiştir.',
              ],
              correctIndex: 2,
              hint: 'İpucu: Son paragrafta yola kimin çıktığına dikkat et.',
              explanation: 'Aferin! Pırıl, Zeytin’e veda edip Antalya’ya tek başına yola çıktı.',
            },
            {
              type: QuestionType.CUMLEDE_ANLAM,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: '“Her şey değişse de hikâyeler kalıyor.” sözüyle anlatılmak istenen nedir?',
              options: [
                'Eski taşlar hiç değişmez.',
                'Kitaplar binalardan pahalıdır.',
                'Hikâyeler yalnızca kedilere anlatılır.',
                'Yapılar yıkılsa da yaşananlar unutulmaz.',
              ],
              correctIndex: 3,
              hint: 'İpucu: Pırıl bunu tek kalan sütuna bakarken düşünüyor. Sütun ona neyi hatırlatıyor?',
              explanation:
                'Çok güzel! Tapınaktan bir sütun kalsa da onun hikâyesi anlatılmaya devam ediyor.',
            },
            {
              type: QuestionType.SOZCUK_ANLAMI,
              cognitiveLevel: CognitiveLevel.ANLAMA,
              prompt:
                '“Onların bu rahatlığına biraz imrendi.” cümlesindeki “imrenmek” ne demektir?',
              options: [
                'Birine kızmak',
                'Başkasındaki güzel bir şeyi kendisi için de istemek',
                'Bir şeyden korkmak',
                'Bir şeye gülmek',
              ],
              correctIndex: 1,
              hint: 'İpucu: Uzun yoldan gelen yorgun bir yolcu, rahatça uyuyan kedileri görünce ne ister?',
              explanation:
                'Harika! İmrenmek, başkasında gördüğün güzel bir şeyi kendin için de istemektir.',
            },
          ],
          glossary: [
            { word: 'imrendi', meaning: 'Kendisinde de olsun istedi.' },
            { word: 'bilge', meaning: 'Çok şey bilen, akıllı ve olgun.' },
            {
              word: 'tapınaklarından',
              meaning: 'Eski zamanlarda yapılmış büyük ve kutsal binalardan.',
            },
            { word: 'veda', meaning: 'Ayrılırken hoşça kal deme.' },
          ],
        },
        G4: {
          paragraphs: [
            'Pırıl, Efes’in eski taşları arasında dolaşırken güneşlenen kedilerle karşılaştı. Efes’te çok kedi yaşardı. Kimi sütunların gölgesinde uyukluyor, kimi ziyaretçileri bir kralın sakin bakışlarıyla izliyordu. Yüzyılların taşları arasında bu kadar rahat olabilmek, uzun yoldan gelen Pırıl’a hem şaşırtıcı hem de imrenilecek bir şey gibi göründü.',
            'Yaşlı ve bilge bir kedi olan Zeytin yanına geldi. “Hoş geldin yolcu. Nereye gidiyorsun?” diye sordu. Pırıl, memleketi Van’a döndüğünü anlattı. Zeytin bu uzun yolu duyunca şaşırmadı; çünkü bu sokaklardan yıllardır nice yolcunun geçtiğini görmüştü. Ona göre herkes bir yerden bir yere yürürken aslında kendi hikâyesini yazıyordu.',
            'Zeytin, yeni arkadaşına Efes’i gezdirdi. Kütüphanenin önünde durdular, tiyatronun basamaklarında dinlendiler. Yaşlı kedi her köşeyi ezbere biliyordu ve anlatırken bir tarih öğretmeninden çok eski bir dosta benziyordu. “Bu taşlar binlerce insanın hikâyesini saklıyor,” dedi. Pırıl için taşlar artık sessiz değildi; her biri, dinlemesini bilene bir şeyler fısıldıyordu. Zeytin yolda rastladığı her kediye selam veriyor, onlar da kuyruklarını havaya kaldırarak bu yaşlı dosta saygılarını gösteriyordu.',
            'Akşamüstü Zeytin onu bir tepeye götürdü ve uzakta tek başına duran bir sütunu gösterdi. “Orada bir zamanlar Artemis Tapınağı vardı. Dünyanın en büyük tapınaklarından biriydi, eski çağlarda dünyanın yedi harikasından biri sayılırdı. Şimdi yalnızca o sütun kaldı,” dedi. Gün batarken sütunun gölgesi tarlaların üstüne upuzun düşüyor, sanki geçmişi bugüne bağlamaya çalışıyordu.',
            'Pırıl sütuna uzun uzun baktı. Koskoca bir tapınaktan geriye bir sütun kalmıştı; yine de o sütun sayesinde tapınağın adı hâlâ anılıyordu. “Her şey değişse de hikâyeler kalıyor,” diye düşündü. Ertesi sabah Zeytin’e veda etti. Ayrılığın burukluğunu, aklına yerleşen yeni hikâyenin sevinci hafifletiyordu. Portakal kokulu Antalya’ya doğru yola çıktığında artık yalnızca bir yolcu değil, hikâyeler biriktiren biri olduğunu biliyordu.',
          ],
          questions: [
            {
              type: QuestionType.BASLIK,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt: 'Bu metne başka bir başlık verilecek olsa hangisi en uygun olur?',
              options: [
                'Efes’te Kedi Bakımı',
                'Antalya’nın Portakalları',
                'Taşların Sakladığı Hikâyeler',
                'Zeytin’in Tarih Dersi',
              ],
              correctIndex: 2,
              hint: 'İpucu: Metnin tamamını kapsayan başlığı seç; Pırıl’ın son paragrafta vardığı düşünceyi de hesaba kat.',
              explanation:
                'Aferin! Metin, Efes’in taşlarının sakladığı hikâyeleri ve Pırıl’ın bunu fark etmesini anlatıyor.',
            },
            {
              type: QuestionType.PARAGRAF_YAPISI,
              cognitiveLevel: CognitiveLevel.CIKARIM,
              prompt:
                'Dördüncü paragrafın sonuna aşağıdaki cümlelerden hangisi getirilirse anlam akışı bozulmaz?',
              options: [
                'Pırıl, tapınağın eski hâlini gözünde canlandırmaya çalıştı.',
                'Antalya’da portakallar kışın toplanır.',
                'Kediler balığı çok sever.',
                'Okullar yazın tatil olur.',
              ],
              correctIndex: 0,
              hint: 'İpucu: Paragraf hangi yapıyı anlatıyor? Onu sürdüren cümleyi seç.',
              explanation: 'Çok güzel! Bu cümle, tapınağı ve sütunu anlatan bölümü sürdürüyor.',
            },
            {
              type: QuestionType.ONCULLU_YORUM,
              cognitiveLevel: CognitiveLevel.DEGERLENDIRME,
              prompt:
                'Metne göre aşağıdaki yargılardan hangileri doğrudur? I. Artemis Tapınağı’ndan bugün yalnızca bir sütun kalmıştır. II. Zeytin, Pırıl’la birlikte Antalya’ya gitmiştir. III. Pırıl’a göre yapılar değişse de hikâyeler yaşar.',
              options: ['Yalnız I', 'I ve III', 'II ve III', 'I, II ve III'],
              correctIndex: 1,
              hint: 'İpucu: Her yargıyı tek tek ele al; Pırıl’ın kiminle yola çıktığına son paragrafta bak.',
              explanation:
                'Harika! Pırıl, Zeytin’e veda edip yola çıktığı için II. yargı yanlıştır.',
            },
          ],
          glossary: [
            { word: 'uyukluyor', meaning: 'Hafif hafif uyuyor.' },
            { word: 'ezbere', meaning: 'Bakmadan, çok iyi bilerek.' },
            { word: 'burukluğunu', meaning: 'Hafif üzüntüsünü.' },
            { word: 'anılıyordu', meaning: 'Hatırlanıp söyleniyordu.' },
          ],
        },
      },
    }),
    chest(city, 10, 'Efes’in son hazinesi bu sandıkta; aç, lokumlarını al ve Antalya’ya koş!'),
  ],
};
