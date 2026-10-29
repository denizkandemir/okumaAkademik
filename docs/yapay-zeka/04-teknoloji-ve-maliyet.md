# Yapay zekâ aşaması: teknolojiler, istek sayıları ve maliyet

Bu belge, yapay zekâ aşamasında kullanılacak teknolojileri ve öğrenci sayısı arttıkça yapay zekâ
için ödenecek tahmini tutarları gösterir. Bütün tutarlar **ABD doları** ve **kaba tahmindir**.
Gerçek değerler A2'deki `ai_requests` tablosundan ölçülüp bu belge güncellenir.

## 1. Teknolojiler

| Katman | Teknoloji | Ne için | Ek ücret |
|---|---|---|---|
| Yapay zekâ modeli | **Claude API** (Anthropic) | İçerik üretimi, inceleme, plan, rapor, Pırıl'ın mesajları | Kullandıkça (§3) |
| SDK | `@anthropic-ai/sdk` (TypeScript) | Sunucudan API çağrıları | Yok |
| Toplu işlem | Message Batches API | İçerik üretimi, haftalık ve aylık raporlar; **yarı fiyatına** | Dahil |
| İstem önbelleği | Prompt caching | Sabit talimatlar ve şemalar tekrar okununca girdi maliyeti ≈ %95 düşer | Dahil |
| Yapılandırılmış çıktı | `output_config.format` + zod şemaları | Yanıtın her zaman geçerli JSON olması | Yok |
| Sunucu | Node 22 + TypeScript + Fastify (mevcut) | Yapay zekâ çağrıları sadece burada; anahtar uygulamada asla bulunmaz | Barındırma (§7) |
| Veritabanı | PostgreSQL + Prisma 7 (mevcut) | Ölçümler, içerik, planlar, raporlar, `ai_requests` | Barındırma (§7) |
| Zamanlanmış işler | `pg-boss` (PostgreSQL üzerinde iş kuyruğu) ya da basit zamanlayıcı | Pazar gecesi toplu raporlar, toplu işlerin sonucunu toplama | Yok (ek sunucu gerektirmez) |
| Doğrulama | zod (mevcut) | Gelen ve giden verinin kontrolü | Yok |
| Okunabilirlik | Kendi Ateşman hesaplayıcımız (TypeScript) | Üretilen metnin sınıfa uygunluğu | Yok |
| Uygulama | Expo SDK 58, React Native, Reanimated (mevcut) | Egzersizler, Pırıl'ın ışığı animasyonu | Yok |
| Grafikler | `react-native-svg` (mevcut) | "Gelişimim" ekranı | Yok |
| Seslendirme | `expo-speech` (cihazdaki Türkçe ses) | Dinle-sonra-oku, dinlerken oku | Yok. Kalite yetmezse bulut seslendirme hizmeti gerekir; ayrı ücretlidir, bu hesaba dahil değil |
| İzleme | `ai_requests` tablosu + SQL görünümü | Aylık harcama, hata ve ret oranı | Yok |

## 2. Giden istekler

### Öğrenci sayısıyla artanlar (aktif öğrenci başına, aylık)

"Aktif öğrenci": ayda yaklaşık 17 gün, günde bir ders ve bir antrenman yapan çocuk.

| İstek | Nasıl | Ayda adet | Girdi / çıktı (token) |
|---|---|---|---|
| Özet geri bildirimi (E8) | Canlı | 8 | 1.200 (900'ü önbellekten) / 120 |
| "Sen sor": Pırıl çocuğun sorusunu cevaplar | Canlı | 4 | 1.000 (700'ü önbellekten) / 150 |
| Pırıl'ın bağlama özel mesajı | Canlı | 4 | 800 (600'ü önbellekten) / 80 |
| Haftalık rapor ve yeni plan | Toplu | 4,3 | 3.000 / 900 |
| Aylık rapor | Toplu | 1 | 5.000 / 1.200 |
| **Toplam** | | **≈ 21 istek** | |

Pırıl'ın diğer bütün mesajları (kutlama, seri, geri dönüş) önceden üretilmiş havuzdan gelir;
bunlar istek sayısına eklenmez.

### Öğrenci sayısından bağımsız olanlar (içerik)

| İş | Ne zaman | İstek | Tahmini tutar |
|---|---|---|---|
| İlk içerik kütüphanesi: 1.500 içerik + inceleme | Bir kez (A3) | ≈ 3.000 | |
| Pırıl mesaj havuzları | Bir kez (A6), birkaç ayda bir yenilenir | ≈ 170 | |
| **Tek seferlik toplam** | | **≈ 3.170** | **≈ $86** |
| Ayda 200 yeni içerik + inceleme | Her ay | ≈ 400 | **≈ $11/ay** |

**Önemli:** İçerik bir kez üretilip herkese gösterildiği için öğrenci sayısıyla büyümez.
Maliyeti büyüten tek şey kişiye özel istekler (geri bildirim, rapor, plan).

## 3. Model fiyatları (1 milyon token başına, ekim 2026)

| Model | Girdi | Çıktı | Önbellekten okuma |
|---|---|---|---|
| Claude Opus 5.5 | $4,00 | $20,00 | $0,20 |
| Claude Sonnet 5.5 | $2,00 | $10,00 | $0,20 |
| Claude Haiku 5.5 | $0,10 | $0,50 | ≈ $0,01 (girdinin onda biri varsayıldı) |

- Toplu işlemler **%50 indirimli**.
- Opus 5.5'te düşünme kapatılamaz ve düşünme tokenleri çıktı olarak faturalanır. Hesapta düşünmenin
  görünür çıktı kadar olduğu varsayıldı (kısa işler için düşük efor ayarı). Sonnet ve Haiku'da
  düşünme kapalı varsayıldı.
- Hatalar, tekrar denemeler ve reddedilen içerik için **%15** pay eklendi.

## 4. İki senaryo

- **Senaryo A (hepsi Opus 5.5):** En yüksek kalite, en yüksek maliyet. Varsayılan budur.
- **Senaryo B (karma):**
  - İçerik üretimi ve incelemesi: Opus 5.5 (kalite en çok burada önemli; zaten bir kez yapılıyor)
  - Haftalık ve aylık raporlar: Sonnet 5.5
  - Kısa canlı mesajlar: Haiku 5.5

  Hangisinin seçileceği senin kararın; geçmeden önce A7'deki değerlendirme setiyle kalite
  karşılaştırılmalı.

### Öğrenci başına aylık maliyet

| İstek | Senaryo A | Senaryo B |
|---|---|---|
| Özet geri bildirimi (8) | $0,057 | $0,001 |
| "Sen sor" (4) | $0,034 | $0,001 |
| Bağlama özel mesaj (4) | $0,019 | $0,0003 |
| Haftalık rapor ve plan (4,3) | $0,119 | $0,037 |
| Aylık rapor (1) | $0,039 | $0,013 |
| **Toplam** | **≈ $0,27** | **≈ $0,05** |

## 5. Öğrenci sayısı arttıkça

Sabit aylık içerik maliyeti ($11) dahil. Tek seferlik $86 dahil değil.

| Aktif öğrenci | Aylık istek | Senaryo A / ay | Senaryo B / ay | Öğrenci başına (A / B) |
|---|---|---|---|---|
| 100 | ≈ 2.500 | ≈ $38 | ≈ $16 | $0,38 / $0,16 |
| 1.000 | ≈ 21.700 | ≈ $280 | ≈ $62 | $0,28 / $0,06 |
| 5.000 | ≈ 107.000 | ≈ $1.350 | ≈ $270 | $0,27 / $0,05 |
| 10.000 | ≈ 213.000 | ≈ $2.700 | ≈ $530 | $0,27 / $0,05 |
| 50.000 | ≈ 1,07 milyon | ≈ $13.400 | ≈ $2.600 | $0,27 / $0,05 |
| 100.000 | ≈ 2,13 milyon | ≈ $26.700 | ≈ $5.200 | $0,27 / $0,05 |

- Maliyet öğrenci sayısıyla **neredeyse doğrusal** artıyor. Öğrenci başına tutar 1.000 öğrenciden
  sonra sabitleniyor.
- Sadece aktif öğrenciler sayılır. Uygulamayı açmayan öğrenciye rapor üretilmez; maliyeti
  ≈ $0'dır.

## 6. Belirsizlikler ve aralıklar

| Değişken | Etkisi (Senaryo A, öğrenci başına) |
|---|---|
| Opus'un düşünme miktarı yarıya iner | $0,22 |
| Düşünme görünür çıktının 2 katı olur | $0,37 |
| Çok kullanan öğrenci (2 kat canlı istek) | ≈ $0,38 |
| Sadece 5-8. sınıflar özet yazıyorsa (1-4'te özet geri bildirimi yok) | ≈ $0,24 |

Gerçekçi aralık: **Senaryo A $0,20-0,40, Senaryo B $0,04-0,08** (öğrenci başına, aylık).

## 7. Yoğunluk ve sınırlar

**Canlı istekler** akşam saatlerinde yoğunlaşır. En yoğun saatte günlük trafiğin %20'si
varsayılarak:

| Aktif öğrenci | En yoğun saatte canlı istek | Saniyede |
|---|---|---|
| 1.000 | ≈ 110 | 0,03 |
| 10.000 | ≈ 1.070 | 0,3 |
| 100.000 | ≈ 10.700 | 3 |

Bunlar düşük sayılar. Yine de API hesabının hız sınırları kullanım kademesine bağlı; büyümeden
önce Anthropic konsolundan kontrol edilmeli.

- **Toplu raporlar:** Pazar gecesi her aktif öğrenci için bir istek (100.000 öğrencide 100.000
  istek). Bir toplu işin büyüklük sınırı var; büyük sayılarda birden çok parçaya bölünür. Sonuçlar
  24 saat içinde gelir, raporlar pazartesi sabahı hazır olur.
- **Bütçe sınırı:** A2'de aylık üst sınır konur. Aşılırsa canlı mesajlar havuza, raporlar
  şablona düşer; uygulama çalışmaya devam eder.

## 8. Maliyeti düşürme yolları (önem sırasıyla)

1. **Önbellek:** Sabit talimat ve şemaları istemin başına koymak. Hesaba zaten dahil.
2. **Toplu işlem:** Acil olmayan her şey toplu. Hesaba zaten dahil.
3. **Havuz mesajları:** Pırıl'ın mesajlarının çoğu canlı değil, havuzdan.
4. **Model seçimi görev görev:** Senaryo B ≈ 5 kat daha ucuz.
5. **Efor ayarı:** Kısa işlerde düşük efor (Opus'ta daha az düşünme tokeni).
6. **Sadece aktif öğrenciye rapor:** Haftada hiç okumamış çocuğa rapor yerine kısa bir "Seni
   özledim" mesajı (havuzdan).
7. **Kısa yanıt sınırları:** Geri bildirim en fazla 2 cümle.

## 9. Bu hesaba dahil olmayanlar

- **Sunucu ve veritabanı barındırma:** Ürün yayına çıkınca gerekir. Fiyatı seçilecek sağlayıcıya ve
  öğrenci sayısına göre değişir; sağlayıcı seçildiğinde ayrıca hesaplanır.
- **Mağaza üyelikleri:** Apple Developer (yıllık) ve Google Play (tek seferlik). Güncel ücretleri
  kontrol et.
- **EAS derlemeleri:** Ücretsiz kotası var; yoğun kullanımda ücretli plan gerekebilir.
- **Bulut seslendirme:** Cihazdaki ses yetmezse.
- **Sesli okuma (mikrofon) ve konuşma tanıma:** Sonraki aşamada.
- **Kur farkı ve vergiler:** Fatura dolar cinsinden.
