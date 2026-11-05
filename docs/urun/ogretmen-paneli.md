# Öğretmen paneli (karar verildi, planlanacak)

Bu belge ürün kararını kaydeder. Görev promptları (Ö0, Ö1, Ö2) sırası gelince, kodun o
günkü hâline bakılarak `docs/urun/promptlar/` altına yazılacak.

## Karar

Uygulamaya **öğretmen girişi** eklenecek. Öğretmen sınıf oluşturur, öğrencilerini ve
sınıfını bir panelden takip eder, **ödev atar**. Hedef kurs merkezleri ve okullar. İlk
kullanıcı kendi kurs merkezimiz.

Neden önemli:

- Öğretmen, uygulamayı derste ve evde düzenli kullandırır. Çocukların uygulamayı bırakma
  riski azalır.
- Kurum satışının (okul lisansı, iyzico) asıl değeri burada.
- Pilotun verisi (okuma hızı, anlama, soru türleri) öğretmenin gözünde anlam kazanır.

## Kapsam

### Roller ve giriş

- Kullanıcıya bir rol eklenir: `STUDENT`, `TEACHER` ve ileride `ADMIN` (kurum yöneticisi).
- Öğretmen hesabı herkese açık kayıtla açılmaz. Kurum yöneticisinin daveti ya da kurum kodu
  ile açılır. Başlangıçta öğretmen hesaplarını biz oluştururuz (seed veya yönetici komutu).
- Öğretmen girişi aynı giriş ekranından olur. Rol öğretmense öğretmen alanına yönlendirilir.

### Sınıflar

- Öğretmen sınıf oluşturur (ad, sınıf düzeyi, ör. "4-A Okuma").
- Her sınıfın kısa bir **katılım kodu** vardır. Öğrenci uygulamada "Sınıfa katıl" ekranına
  kodu girer. Öğretmen kodu yenileyebilir, öğrenciyi sınıftan çıkarabilir.
- Bir öğrenci birden fazla sınıfta olabilir (okul ve kurs).
- Okul lisansı (ödeme aşaması) sınıfa bağlanabilir. Lisanslı sınıftaki öğrenci ücretli
  içeriğe erişir.

### Panel

- **Sınıf özeti** (bu hafta / bu ay):
  - aktif öğrenci sayısı ve okuma dakikası
  - biten hikâye sayısı
  - sınıfın ortalama okuma hızı ve anlama oranı (A0 ölçümleri)
  - en çok zorlanılan soru türleri (ör. ana fikir, neden-sonuç)
  - "bu hafta hiç girmeyenler" listesi
- **Öğrenci ayrıntısı:**
  - seviye, şehir, seri
  - haftalık okuma hızı ve anlama grafiği (A5 grafikleriyle aynı bileşenler)
  - soru türlerine göre başarı
  - ödev durumu ve son okumalar
- Hız her zaman anlamayla birlikte gösterilir (`docs/yapay-zeka/01-arastirma.md` §1).

### Ödevler

- Öğretmen bir sınıfa ya da seçtiği öğrencilere ödev atar. Ödev şunlardan biri olabilir:
  - belirli hikâyeler (kitaplıktan seçilir)
  - egzersiz türleri ve süre (A1'den sonra; ör. "haftada 3 kez tekrarlı okuma")
  - soru türü odaklı çalışma (ör. "ana fikir" sorularına odaklı içerik; A3 ile)
- Her ödevin başlangıç ve bitiş tarihi, isteğe bağlı bir notu vardır.
- Öğrenci ödevlerini uygulamada görür ("Öğretmeninden ödev" kartı) ve yapınca durum kendiliğinden
  güncellenir. Okuma ve egzersiz verisinden hesaplanır; öğrenci elle işaretlemez.
- Öğretmen her ödev için kimin bitirdiğini, kimin başladığını ve kimin başlamadığını, ödevdeki
  anlama oranını görür.
- Hatırlatma: bitiş tarihine yakın öğrenciye yerel bildirim (T04'teki hatırlatma altyapısı).

### Yapay zekâ ile (A2'den sonra)

- Öğretmene haftalık **sınıf özeti** ve "bu öğrencilere şu çalışma iyi gelir" önerisi.
- Yapay zekâya öğrenci adı ve kullanıcı adı gitmez. Öğrenciler numaralanır, adlar panelde
  cihazda eşlenir (`A-kurallar.md` "No personal data goes to the AI").
- Öğretmen önerilen ödevi tek dokunuşla atayabilir; atamayı her zaman öğretmen onaylar.

## Gizlilik (KVKK)

- Öğrencinin verisini öğretmenin görmesi, veli onay metninde açıkça yazmalı: "Katıldığın
  sınıfın öğretmeni okuma istatistiklerini görebilir."
- Öğretmen yalnızca kendi sınıflarındaki öğrencileri görür. Sunucuda her sorgu öğretmen ve
  sınıf üyeliğiyle sınırlanır ve testle doğrulanır.
- Öğrenci sınıftan çıkınca öğretmen onun verisini artık göremez.

## Teknik notlar

- Öğretmen paneli aynı kod tabanında, **web'de ve tablette** de çalışacak şekilde yapılır.
  Expo Router ve `react-native-web` projede zaten var. Öğretmenler çoğunlukla bilgisayar ve
  tablet kullanır.
- Yeni tablolar (taslak): `classes`, `class_members`, `assignments`, `assignment_targets`,
  `assignment_progress` (ya da görünüm `v_assignment_progress`). `server/docs/veritabani.md`
  kurallarına uyulur.
- Panel sayıları A0'ın görünümlerinden (`v_student_daily`, `v_student_weekly`) ve
  `v_reading_results_by_type`'tan türetilir.
- Tasarım: "Pırıl'ın Atlası" dili (`docs/tasarim/README.md`, `src/design/`). Panel için
  geniş ekran yerleşimi ayrıca tasarlanır.

## Sıralama

| Görev | İçerik | Ne zaman |
|---|---|---|
| Ö0 | Roller, öğretmen hesabı, sınıf, katılım kodu, öğrencinin "Sınıfa katıl" ekranı | A0'dan sonra, pilottan önce |
| Ö1 | Sınıf ve öğrenci paneli (web ve tablet), hikâye ödevi | Ö0'dan hemen sonra; pilotta kurs merkezinde kullanılır |
| Ö2 | Egzersiz ve soru türü ödevleri, ödev hatırlatmaları | A1'den sonra |
| Ö3 | Yapay zekâ sınıf özeti ve ödev önerisi | A5'ten sonra |
| — | Okul lisansının sınıfa bağlanması | Ödeme aşamasıyla |

Güncel genel sıra: **T03 → T04 → T05 → T06 → A0 → Ö0 → Ö1 → pilot hazırlığı → pilot (kurs
merkezi) → A1a → A1b → Ö2 → A2 → A3 → A4 → A5 → Ö3 → A6 → A7 → ödeme**.
