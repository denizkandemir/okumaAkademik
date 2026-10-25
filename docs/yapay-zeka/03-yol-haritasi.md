# Yapay zekâ aşamaları: yol haritası

İstekler: `00-istekler.md` · Araştırma: `01-arastirma.md` · Egzersizler: `02-egzersiz-katalogu.md`

## 1. İlkeler

1. **Önce ölçüm, sonra yapay zekâ.** Yapay zekâ ancak doğru ölçülmüş veriyle iyi karar verir.
   Okuma hızı, anlama oranı ve soru türlerine göre başarı önce yapay zekâsız kurulur (A0).
2. **Hız tek başına ödüllendirilmez.** Her yerde hız ile anlama birlikte (`01-arastirma.md` §1).
3. **Yapay zekâ kuralların içinde karar verir.** Hangi egzersizin geleceğini yapay zekâ önerir.
   Kesin kurallar (yaş sınırları, günlük süre, anlama düşükken hız egzersizi yok) kodda durur ve
   yapay zekânın önerisi bu kurallara göre doğrulanır. Böylece karar hem akıllı hem güvenli olur.
4. **İçerik önceden üretilir, çocuğa anlık üretilmez.** Metin, soru ve egzersizler toplu üretilir,
   otomatik kontrollerden ve ikinci bir yapay zekâ incelemesinden geçer, onaylanınca yayına girer.
   Çocuğun ekranına onaysız üretim düşmez. İstisna: kısa geri bildirimler (A6), sıkı kurallarla.
5. **Kişisel veri yapay zekâya gitmez.** Ad, kullanıcı adı ve kimlik gönderilmez; sadece sınıf ve
   sayısal ölçümler gider. Pırıl'ın mesajındaki ad, cihazda yerine konur.
6. **Her yapay zekâ çağrısı kaydedilir.** Amaç, model, token, maliyet ve sonuç bir tabloda tutulur;
   aylık bütçe sınırı kodda uygulanır.

## 2. Sıralama

Daha önce konuştuğumuz gibi yapay zekâ aşaması P06'dan sonra başlar:

**P06 → A0 → A1 → A2 → A3 → A4 → A5 → P07 → A6 → P08 → P09**

A7 (kalite ve güvenlik) A2'den itibaren her aşamaya eşlik eder.

| Aşama | Ad | Yapay zekâ var mı | Bağımlılık |
|---|---|---|---|
| A0 | Ölçüm ve veri temeli | Hayır | P06 |
| A1 | Egzersiz motoru | Hayır | A0 |
| A2 | Yapay zekâ altyapısı | Evet (altyapı) | A0 |
| A3 | Yapay zekâ ile içerik üretimi | Evet | A1, A2 |
| A4 | Uyarlanabilir plan (yol haritası) | Evet | A1, A2, A3 |
| A5 | Raporlar ve grafikler | Evet | A0, A2 (A4 ile birlikte en iyisi) |
| A6 | Pırıl'ın yapay zekâ konuşmaları | Evet | A2, A5 |
| A7 | Kalite, güvenlik, etkinlik ölçümü | Evet | A2'den itibaren sürekli |

## 3. Aşamalar

### A0 · Ölçüm ve veri temeli (yapay zekâsız)

**Amaç:** Her okumadan güvenilir ölçüm almak ve içerikleri zorluğa göre etiketlemek.

- **Metin ölçümleri:** Her metin için kelime sayısı, cümle sayısı, ortalama cümle uzunluğu ve
  **Ateşman puanı** otomatik hesaplanır. Türkçede hece sayısı ünlü sayısına eşit olduğu için hece
  sayımı basittir. Formül orijinal makaleden doğrulanmalı.
- **Okuma ölçümleri:** Biten her okuma için şunlar kaydedilir:
  - dakikadaki kelime sayısı
  - ilk denemede doğru cevap oranı
  - soru türlerine göre doğru ve yanlış sayısı
  - "acele okuma" işareti (çok hızlı ve anlama %60'ın altında)
- **Seviye belirleme:** Kayıttan sonra sınıfa uygun 2 kısa metin ve sorulardan oluşan bir okuma
  yapılır. Bundan çocuğun başlangıç hızı ve anlama düzeyi çıkar. Oyun gibi sunulur:
  "Pırıl seni tanımak istiyor!"
- **Soru etiketleri:** soru türü (Q1-Q13), bilişsel düzey, varsa MEB kazanım kodu. Seçenek sayısı
  3-4 olabilir hale gelir (şu an veritabanı tam 3 seçenek zorunlu tutuyor).
- **Sınıf grubu varyantları:** Yolculuk dersi aynı kalır (şehir, sıra, başlık), ama metin ve
  soruları sınıf grubuna göre farklı olabilir (G1-G4). Çocuk kendi sınıfına uygun varyantı görür.
  Şimdiki 48 hikâye G2 (3-4. sınıf) varyantı sayılır; diğer gruplar A3'te üretilir.
- **Özet görünümler:** öğrenci başına günlük, haftalık ve aylık özet (SQL view).
  Okunaklı veritabanı kuralı (`server/docs/veritabani.md`) burada da geçerli.
- **Bitti sayılır:** Ölçümler testli; demo kullanıcılar için anlamlı ölçüm verisi seed'de var;
  Prisma Studio'da günlük, haftalık ve aylık özetler okunabiliyor.

### A1 · Egzersiz motoru (yapay zekâsız)

**Amaç:** Kataloğdaki egzersizleri uygulamaya eklemek; içerik şimdilik mevcut metinlerden.

- Ortak egzersiz altyapısı: egzersiz türü, ayarlar, başlangıç ve bitiş, ölçümler
  (`exercise_sessions` tablosu).
- **Önce:** E1 (tekrarlı okuma ve grafik), E4 (öbek öbek oku), E5 (hızlı kelime tanıma),
  E6 (Pırıl'ın ışığı), E7 (kök ve ek ustası).
- **Sonra:** E2 ve E3 (seslendirme gerektirir; cihazdaki Türkçe ses motorunun yetenekleri
  kontrol edilecek), E8 (anlama stratejileri), E9 ve E10 (soru türü olarak).
- Ana sayfaya **"Bugünün antrenmanı"** kartı: 1-3 kısa egzersiz, toplam 5-10 dakika. Bu aşamada
  seçim basit kurallarla yapılır; A4'te akıllı planlayıcı devralır.
- Egzersizler de seri ve lokuma sayılır, ama ders ilerlemesinin (seviye ve şehir) yerine geçmez.
- **Büyüklük:** Muhtemelen iki prompta bölünür (A1a, A1b).

### A2 · Yapay zekâ altyapısı (backend)

**Amaç:** Sonraki aşamaların hepsinin kullanacağı güvenli, ölçülebilir ve ucuz bir çağrı katmanı.

- **SDK:** `@anthropic-ai/sdk` (TypeScript). API anahtarı sadece `server/.env`'de durur;
  uygulamada hiçbir zaman bulunmaz.
- **Model:** Varsayılan `claude-opus-5-5`. Görev başına model ayarlanabilir (ortam değişkeni),
  böylece maliyet gerekirse görev görev düşürülebilir (bkz. §5).
- **Yapılandırılmış çıktı:** Her görevin yanıtı bir şemaya (zod) göre alınır ve doğrulanır
  (`output_config.format` / `messages.parse`). Şemaya uymayan yanıt kullanılmaz.
- **Toplu işlem (Message Batches API):** İçerik üretimi ve haftalık raporlar toplu gönderilir.
  Normal fiyatın yarısına mal olur; sonuçlar sırasız gelir, `custom_id` ile eşlenir.
- **İstem önbelleği (prompt caching):** Uzun ve sabit talimatlar (kurallar, şemalar, örnekler)
  önbelleğe alınır; tekrarlayan çağrılarda girdi maliyeti büyük ölçüde düşer.
- **Kayıt tablosu `ai_requests`:** amaç, model, istem sürümü, girdi ve çıktı token'ı, tahmini
  maliyet, süre, durum (başarılı, reddedildi, hata), toplu iş kimliği.
- **Sınırlar:** aylık toplam bütçe, öğrenci başına günlük canlı çağrı sınırı. Sınır aşılınca
  sabit (yapay zekâsız) içeriğe düşülür; uygulama asla bozulmaz.
- **Kişisel veri koruması:** Gönderilen her veride ad ve kullanıcı adı olmadığını kontrol eden
  bir koruma.
- **Ret durumu:** Modelin isteği reddetmesi (`stop_reason: "refusal"`) kaydedilir ve sabit
  içeriğe düşülür.
- **İstemler dosya olarak:** İstemler depoda sürümlü dosyalar olarak tutulur (`server/src/ai/prompts/`).
- **Testler:** Ağsız çalışan sahte yanıt modu.

### A3 · Yapay zekâ ile içerik üretimi

**Amaç:** Her sınıf grubu ve seviye için metin, soru ve egzersiz içeriği üretmek.

- **Akış:** üretim isteği → toplu üretim → otomatik kontroller → yapay zekâ incelemesi → **taslak**
  → onay → **yayında**.
- **Otomatik kontroller:**
  - şemaya uygunluk
  - Ateşman puanının sınıf grubu aralığında olması
  - uzunluk sınırları
  - kelime anlamlarının metinde birebir geçmesi
  - tam bir doğru cevap olması
  - seçenek uzunluklarının dengeli olması
  - tekrar eden içerik olmaması
  - yasaklı konular (şiddet, korku, marka, siyaset)
- **İkinci inceleme:** Ayrı bir yapay zekâ çağrısı, içeriği bir puanlama listesine göre puanlar:
  yaşa uygunluk, yerlerle ilgili bilgilerin doğruluğu, sorunun tek ve kesin cevabı, Türkçenin
  doğallığı, MEB ve LGS türüne uygunluk. Eşiğin altı reddedilir.
- **Onay:** Başta sen onaylarsın (basit bir komut satırı aracı ya da Prisma Studio'da durum
  alanı). Kalite oturunca otomatik onay eşiği konabilir.
- **Ne üretilir:**
  1. 48 yolculuk hikâyesinin G1, G3 ve G4 varyantları, soruları türlere göre dengeli
     (G3-G4 için LGS türleri ve 4 seçenek).
  2. Egzersiz içerikleri: öbek işaretli metinler (E4), kelime kartları (E5), kök-ek soruları
     (E7), hikâye haritası verisi (E8), LGS setleri (E9), grafik verisi ve soruları (E10).
  3. Pratik metinleri (yolculuk dışı, kitaplık ve antrenman için).
- **Kurallar:** Özgün içerik üretilir. Var olan kitaplardan ya da gerçek sınav sorularından
  kopyalanmaz, sadece türleri örnek alınır.

### A4 · Uyarlanabilir plan (yol haritası)

**Amaç:** "Ne zaman, hangi zorlukta, hangi egzersiz" kararını kişiye göre vermek ve haftalık
yeniden planlamak.

- **Kural katmanı (kodda, testli):**
  - Son 5 okumada anlama %60'ın altındaysa: hız egzersizi yok (E6 yasak); E8, E7 ve daha kolay metin.
  - Anlama %80 ve üstüyse ama hız ilerlemiyorsa: E1, E4 ve G2+ için E6.
  - G1'de yavaş okuma ve düşük anlama birlikteyse: E2, E3, E5.
  - G3-G4'te LGS türlerinin (E9, E10) haftalık payı sınıf yükseldikçe artar.
  - Günlük antrenman süresi en fazla 10-15 dakika; aynı egzersiz art arda 2 kezden fazla gelmez.
- **Yapay zekâ katmanı:** Haftalık planlayıcı çocuğun özet ölçümlerini alır (kişisel veri yok):
  - hız eğilimi
  - soru türlerine göre başarı
  - yapılan egzersizler ve sonuçları
  - sınıf ve seviye

  Bunlara göre 7 günlük plan önerir: her gün için egzersiz türü, ayarları, içerik etiketleri ve
  kısa bir gerekçe. Öneri kural katmanında doğrulanır; uymayan madde düzeltilir ya da kuralla
  değiştirilir.
- **Yeniden planlama:** her hafta, seviye atlayınca ya da performans belirgin düşüp yükselince.
- **Uygulamada:**
  - "Bugünün antrenmanı" kartı plandan beslenir.
  - **"Yol haritam"** ekranında haftanın planı ve Pırıl'ın açıklaması görünür: "Bu hafta
    ana fikir bulmaya çalışacağız, çünkü...".

### A5 · Raporlar ve grafikler

**Amaç:** Günlük, haftalık ve aylık geri bildirim ve görselleştirme.

- **Günlük (yapay zekâsız, şablonla):** bugün kaç dakika, kaç metin, hız ve anlama, seri.
- **Haftalık (yapay zekâ, toplu, pazar gecesi):**
  - geçen haftayla karşılaştırma
  - güçlü yanlar (örneğin "neden-sonuç sorularında çok iyisin")
  - gelişecek yanlar
  - gelecek hafta için 1-2 öneri

  A4'teki yeniden planlamayla aynı akışta üretilir.
- **Aylık (yapay zekâ):** başlangıç seviyesine göre gelişim, hedefler, yol haritası güncellemesi.
- **İki dil düzeyi:** çocuk için Pırıl'ın ağzından kısa ve cesaretlendirici; ileride veli ve
  öğretmen için ayrıntılı (ayrı bir aşamada).
- **"Gelişimim" ekranı (grafikler, `react-native-svg`):**
  - dakikadaki kelime eğrisi ve hedef bandı
  - soru türlerine göre başarı sütunları
  - haftalık okuma dakikaları
  - egzersiz dağılımı

  Her grafiğin yanında ekran okuyucu için metin özeti olur.
- **`reports` tablosu:** dönem, tür, ölçümler, yapay zekâ metni, oluşturulma zamanı.

### A6 · Pırıl'ın yapay zekâ konuşmaları

- **Durumlar:** ders sonu kutlama, seviye atlama, seri, geri dönüş, zorlanma (anlama düşük),
  haftalık tavsiye, egzersiz başlangıcı.
- **Mesaj havuzları (toplu, onaylı):** Durum × sınıf grubu × şehir başına 15-20 varyant. Şehir ve
  seri sayısı gibi boşluklar uygulamada doldurulur; çocuğun adı cihazda eklenir. Böylece mesajlar
  hem çeşitli hem güvenli olur, ve neredeyse bedavadır.
- **Canlı üretim (sınırlı):** Sadece bağlam gerektiren yerlerde: haftalık rapordan çıkan tavsiye,
  E8'de çocuğun özetine geri bildirim.
  - En fazla 2 cümle, sıkı şema.
  - Pırıl'ın pozu da yapay zekâ tarafından mevcut 8 pozdan seçilir.
  - Hata, ret ya da bütçe aşımında havuzdan bir mesaj gösterilir.

### A7 · Kalite, güvenlik ve etkinlik ölçümü (sürekli)

- **Değerlendirme setleri:** Üretilen içerik ve geri bildirimler için örnek seti ve puanlama
  listesi. İstem ya da model değiştirmeden önce bu setle karşılaştırma yapılır.
- **Egzersiz etkinliği:** Her egzersiz türünden önce ve sonra hız ve anlama değişimi. Kendi
  verimizde işe yaramayan egzersiz azaltılır ya da çıkarılır. Örneğin E6'nın normal okumaya
  aktarımı araştırmada zayıftı; bunu ayrıca izleriz.
- **KVKK:** aydınlatma metni, veli onayı, veri en aza indirme, saklama süresi, silme talebi.
  API sağlayıcısının veri saklama ayarları ve sözleşme koşulları kontrol edilir.
- **Maliyet paneli:** `ai_requests` tablosundan aylık harcama.

## 4. Sonraki aşamaya bırakılanlar

- **Sesli okuma ve mikrofon:** Altın standart ölçüm (dakikada doğru okunan kelime, doğruluk).
  Türkçe konuşma tanıma gerekir ve çocuğun sesi hassas veri olduğu için veli onayı ister.
- **Veli ve öğretmen paneli:** A5 raporlarının ayrıntılı sürümü.
- **Okuma tiyatrosu ve tonlama çalışmaları:** ses gerektirir.

## 5. Maliyet tahmini (kaba)

Ayrıntılı hesap ve teknolojiler: `04-teknoloji-ve-maliyet.md`.

| | Senaryo A (hepsi Opus 5.5) | Senaryo B (karma) |
|---|---|---|
| Aktif öğrenci başına, aylık | ≈ $0,27 | ≈ $0,05 |
| 1.000 aktif öğrenci, aylık | ≈ $280 | ≈ $62 |
| 10.000 aktif öğrenci, aylık | ≈ $2.700 | ≈ $530 |
| İlk içerik kütüphanesi (tek seferlik) | ≈ $86 | ≈ $86 |

Gerçek değerler `ai_requests` tablosundan ölçülür. Hangi görevde daha ucuz modele geçileceği senin
kararın; geçişten önce A7'deki değerlendirme setiyle kalite karşılaştırılmalı.

## 6. Senin karar vermen gerekenler

1. **İçerik onayı:** Üretilen içeriği başta kim onaylayacak (sen, bir öğretmen)? Kalite oturunca
   otomatik onaya geçilsin mi?
2. **Aylık yapay zekâ bütçesi:** Üst sınır ne olsun?
3. **Model:** Varsayılan Opus 5.5. Maliyet için bazı görevler (mesaj havuzu, kısa geri bildirim)
   daha ucuz modele alınsın mı?
4. **Sesli okuma:** Mikrofonlu ölçüm hangi aşamada gelsin? Veli onayı gerekecek.
5. **Veli ve öğretmen raporu:** Ne zaman?
