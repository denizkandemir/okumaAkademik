# Okumatik tasarımı v2: "Pırıl'ın Atlası" (referans)

Bu klasör uygulamanın yeni, sakin "atlas" tasarımının referansıdır ve ilk "oyun" tasarımının
(P00-P09) yerini alır. Burada kod yoktur. Ekranları React Native'e taşırken bakılacak kaynaktır.
Oyun kuralları, API ve Pırıl maskotu **değişmez**; yalnızca görünüm ve bazı yeni ekranlar gelir.

- `ekranlar/`: 25 ekranın görüntüsü (430 px tasarım, 2x). Panodaki örnek kedi yerine
  uygulamadaki Pırıl konuldu.
- `kaynak/Okumatik-Tasarim-Panosu.html`: tasarım panosunun aslı. 65 ekran ve 6 arka plan
  içerir. Tarayıcıda açılabilir.
- `kaynak/ekranlar/*.html` ve `kaynak/tasarim.css`: 25 ekranın HTML/CSS'i. Ölçü, boşluk, renk
  ve metinleri buradan al. HTML, 430 px genişlikte bir web taslağıdır. Uygulamaya gömülmez
  (WebView yok); React Native bileşenlerine çevrilir. Tarayıcıda açınca görseller proje
  kökündeki `assets/` klasöründen gelir.
- `promptlar/`: tasarımı uygulamaya geçiren görevler (T00 → T06) ve ortak kurallar
  (`T-kurallar.md`).
- Uygulama varlıkları: `assets/cities/<şehir>.webp`. 6 şehir arka planı, 1024×1536, arayüzsüz.

Panodaki şehir akışları (ders kartı → okuma → soru → … → şehir açılışı) 6 şehirde aynıdır;
yalnızca metin ve arka plan değişir. Bu yüzden `ekranlar/` içinde İstanbul akışı vardır.

## Promptlar nasıl kullanılır

Önce şunlar main'de olmalı: hata taraması (`fix-hata-taramasi`) ve SDK 58 yükseltmesi.

Her görev için:

1. main'den yeni bir branch aç (ör. `git checkout main`, `git pull`,
   `git checkout -b t00-temel`).
2. Claude Code'u **Plan mode**'da aç ve şunu yaz:
   > `docs/tasarim/promptlar/T00-temel.md` dosyasındaki görevi yap.
3. Planı oku, onayla ve **auto-accept edits** moduna geç.
4. Raporu oku, telefonda dene, sonra commit, push, PR ve merge sırasıyla ilerle.

| Sıra | Dosya | Ne yapar |
|---|---|---|
| T00 | `T00-temel.md` | Renkler, yazı tipleri, ikonlar, ortak bileşenler, 4 sekmeli alt çubuk, şehir verileri, hikâye teması (sunucu) |
| T01 | `T01-yolculuk.md` | Yolculuk ana sayfası: arka planlı harita, 10 düğümlü yol, Pırıl, sonraki durak; ders kartı |
| T02 | `T02-okuma-ve-sorular.md` | Okuma ekranı ve sorular (seç → KONTROL ET → geri bildirim) |
| T03 | `T03-oduller-ve-final.md` | Ders sonucu, seviye ödülü, şehir açılışı, sandık, eve dönüş, sertifika |
| T04 | `T04-karsilama-hesap-hatirlatma.md` | Karşılama, kayıt, giriş, ayarlar, okuma hatırlatması, geri dönüş ekranı |
| T05 | `T05-kitaplik-pasaport-profil.md` | Kitaplık, Pasaport (şehir atlası), Profil, Küçük başarılar |
| T06 | `T06-son-kontrol.md` | Ekranları tasarımla karşılaştırma, eski tasarım kodunu silme, erişilebilirlik ve performans |

## Ekran listesi

| # | Ekran | Görüntü / HTML | Uygulamadaki yeri | Pırıl | Prompt |
|---|---|---|---|---|---|
| 1-6 | Yolculuk (6 şehir) | `01`-`06-yolculuk-*` | `src/app/(tabs)/index.tsx` | şehre göre (aşağıda) | T01 |
| 7 | Ders kartı | `07-ders-karti` | `src/app/lesson/[id]/index.tsx` (alt sayfa) | `read` | T01 |
| 8 | Okuma | `08-okuma` | `src/app/reading/[id].tsx` | sözlük kartında `talk` | T02 |
| 9 | Anlama sorusu | `09-soru` | `src/app/lesson/[id]/quiz.tsx` | `think` | T02 |
| 10 | Yanlış yanıt | `10-yanlis-cevap` | aynı ekran | `think` | T02 |
| 11 | Doğru yanıt | `11-dogru-cevap` | aynı ekran | `happy` | T02 |
| 12 | Ders sonucu | `12-ders-sonucu` | `src/app/lesson/[id]/complete.tsx` | 3 yıldızda `celebrate`, diğer durumda `happy` | T03 |
| 13 | Seviye ödülü | `13-seviye-odulu` | `src/app/level-up.tsx` | (madalya, kedi yok) | T03 |
| 14 | Şehir açılışı | `14-sehir-acilisi` | `src/app/city-unlocked.tsx` | `wave` | T03 |
| — | Sandık (panoda yok) | 13'ün diliyle | `src/app/lesson/[id]/chest.tsx` | `happy` → `celebrate` | T03 |
| 24 | Eve dönüş | `24-eve-donus` | `src/app/finale.tsx` | `celebrate` | T03 |
| 25 | Sertifika | `25-sertifika` | `src/app/certificate.tsx` (yeni) | — | T03 |
| 15 | Karşılama | `15-karsilama` | `src/app/(auth)/welcome.tsx` | `wave` | T04 |
| 16 | Kayıt | `16-kayit` | `src/app/(auth)/register.tsx` (+ `login.tsx` aynı dille) | `wave` | T04 |
| 19 | Ayarlar | `19-ayarlar` | `src/app/settings.tsx` (yeni) | — | T04 |
| 18 | Bildirim | `18-bildirim` | gerçek yerel bildirim (ekran yapılmaz) | — | T04 |
| 17 | Geri dönüş | `17-geri-donus` | `src/app/welcome-back.tsx` (yeni) | `happy` | T04 |
| 20 | Kitaplık | `20-kitaplik` | `src/app/(tabs)/library.tsx` | boş durumda `read` | T05 |
| 21 | Pasaport | `21-pasaport` | `src/app/(tabs)/passport.tsx` (yeni sekme) | — | T05 |
| 22 | Profil | `22-profil` | `src/app/(tabs)/profile.tsx` | `idle` | T05 |
| 23 | Küçük başarılar | `23-rozetler` | `src/app/badges.tsx` (sekme değil) | `idle` | T05 |

## Kararlar (tasarımdan farklı olan ya da tasarımda olmayan)

1. **Oyun modeli değişmez.** Panoda bir şehirde 6 ders, bir sandık ve bir madalya düğümü
   görünür. Uygulamada her şehirde yine **10 ders** vardır: 8 hikâye, 5. sırada sandık
   (panodaki "hediye" düğümü) ve 10. sırada sandık (panodaki altın "madalya" düğümü; şehrin
   son durağı). Harita kartında "x / 10 ders tamamlandı" yazar.
2. **Pırıl:** her yerde uygulamadaki animasyonlu `Mascot` bileşeni (8 poz) kullanılır.
   Panodaki tek kedi görseli (pati desenli bandana) kullanılmaz. Maskot görsellerine ve
   animasyonlarına dokunulmaz.
3. **Yazı tipleri:** panoda telefonlarda bulunmayan sistem yazı tipleri (Trebuchet MS,
   Georgia) var. Onların yerine uygulamada:
   - arayüz için **Nunito Sans** (400, 600, 700, 800, 900)
   - okuma metni, yer notları ve sertifika adı için **Literata** (400, 400 italik, 600)

   Eski Baloo 2 ve Nunito, T06'da kaldırılır.
4. **Erişilebilirlik için renk düzeltmeleri.** Panodaki bazı açık renkler çocukların okuması
   için yetersiz kontrastta (WCAG: metin ≥ 4,5:1, büyük metin ve ikon ≥ 3:1). Tasarıma en
   yakın, yeterli tonlar aşağıdaki tabloda. Örneğin ana düğme `#D67F5D` üstünde beyaz yazı
   yalnızca 2,9:1 veriyor, bu yüzden uygulamada `#AF6044` kullanılır.
5. **En küçük yazı boyutları.** Pano bir web önizlemesi olduğu için bazı yazılar 9-12 px.
   Uygulamada en az şu boyutlar kullanılır: gövde 15, ikincil 13, üst başlık (büyük harf) 11,
   düğme 15, sekme etiketi 12, harita etiketleri 12. Oranlar korunur.
6. **Hikâye teması** ("Arkadaşlık", "Merak", "Keşif"…) yeni bir alandır. Sunucuda her metne
   bir tema eklenir (T00) ve haritada, okuma ekranında ve kitaplıkta gösterilir.
7. **Sekmeler:** Yolculuk, Kitaplık, Pasaport, Profil. Eski "Rozetler" sekmesi kalkar;
   rozetler Profil'de özetlenir, tam liste ayrı bir ekrandadır. Eski "Yolculuk haritası"
   ekranının yerini Pasaport sekmesi alır.
8. **Kayıt:** panodaki demo yalnızca ad ve sınıf soruyor. Uygulamada kullanıcı adı ve şifre de
   kalır. Sınıf seçimi 1-8'dir. Panodaki "Tasarım demosu…" gibi açıklama notları uygulamaya
   taşınmaz.
9. **İçerik:** panodaki örnek hikâyeler ("Galata'nın Minik Misafiri" vb.) kullanılmaz;
   P03'teki 48 hikâye ve 144 soru kalır. Ekran metinleri (başlıklar, düğmeler, Pırıl'ın
   cümleleri) panodan alınır.
10. **Sandık ekranı** panoda yok. Seviye ödülü ekranının diliyle yapılır: madalya yerine
    hardal renkli sandık, açılınca +30 lokum.
11. **"Şehri önizle"** (harita altındaki "Sonraki durak" kartı) kilitli şehrin arka planını,
    adını ve sloganını gösteren bir alt sayfa açar: "İstanbul'u bitirince açılır."
12. **Sertifika** yalnızca 6 şehir bitince indirilebilir. Öncesinde "ÖNİZLEME" şeridiyle
    gösterilir. Çocuğun adı yalnızca cihazda kullanılır.
13. **Bildirim:** panodaki bildirim ekranı, işletim sisteminin bildiriminin önizlemesidir.
    Uygulamada gerçek, yerel, her gün aynı saatte gelen bir hatırlatma olur. Ayar cihazda
    saklanır. Ayarlar'daki "BİLDİRİMİ GÖR" düğmesi 5 saniye sonra örnek bir bildirim gönderir.
14. **Hareket:** sakin ve kısa. Ekranlar hafifçe belirir, alt sayfalar kayarak gelir, aktif
    düğümde yumuşak bir halka atar, Pırıl kendi animasyonlarını yapar. "Hareketi azalt" açıksa
    hepsi durur.
15. Yalnızca açık tema vardır.

## Şehir verileri

| No | Şehir | Bölüm başlığı | Slogan (şehir açılışı) | Yer notu (harita) | Pırıl (harita) | Bulunma | Belirtme | Arka plan |
|---|---|---|---|---|---|---|---|---|
| 1 | İstanbul | Galata'dan Boğaz'a | İki kıta, binbir hikâye. | Boğaz'a doğru | `idle` | İstanbul'daki | İstanbul'u | `istanbul.webp` |
| 2 | İzmir | Kordon'da bir gün | Biraz deniz, biraz merak. | Kordon boyunca | `wave` | İzmir'deki | İzmir'i | `izmir.webp` |
| 3 | Efes | Antik kentin izleri | Taşların sakladığı öyküler. | Mermer yol | `read` | Efes'teki | Efes'i | `efes.webp` |
| 4 | Antalya | Kaleiçi'nde bir sabah | Güneşe açılan bir kapı. | Limana inen yol | `happy` | Antalya'daki | Antalya'yı | `antalya.webp` |
| 5 | Kapadokya | Vadinin üstünde | Gökyüzüne uzanan hayaller. | Peribacalarına doğru | `think` | Kapadokya'daki | Kapadokya'yı | `kapadokya.webp` |
| 6 | Van | Pırıl'ın memleketi | Her yol bir hikâyeye çıkar. | Göl kıyısında | `talk` | Van'daki | Van'ı | `van.webp` |

Şehir açılışında slogandan sonra her şehirde aynı cümle gelir: "Yeni sokaklar, yeni
hikâyeler, yeni arkadaşlar."

## Oyun kuralları (değişmedi)

- **6 durak (şehir), sırayla:** İstanbul → İzmir → Efes → Antalya → Kapadokya → Van (Pırıl'ın
  memleketi). Her şehir 5 seviyedir: İstanbul 1-5, İzmir 6-10, Efes 11-15, Antalya 16-20,
  Kapadokya 21-25, Van 26-30.
- **Her şehirde 10 ders** (sıra 1-10). 5. ve 10. ders **sandık**, diğer 8'i **hikâye** (metni
  oku ve 3 anlama sorusunu cevapla).
- **Dersler sırayla açılır.** Bir şehrin ilk dersi, önceki şehrin 10. dersi bitince açılır.
- **Seviye** = 1 + ⌊tamamlanan ders / 2⌋, en fazla 30.
- **Yıldız (hikâye):** 3 soru da ilk denemede doğruysa 3 yıldız, 2'si doğruysa 2, diğer
  durumlarda 1. "İlk deneme", dersin ilk tamamlanmasından önce o soruya verilen ilk cevaptır
  (hata taramasında S1).
- **Lokum:** hikâye 5 + ilk denemede doğru her soru için 5 (en fazla 20). Sandık 30, seviye
  atlama 50, yeni şehir 100. Ödül yalnızca dersin **ilk** tamamlanışında verilir.
- **Seri:** Türkiye saatine göre art arda okunan gün sayısı.
- **Kitaplık:** yolculukta henüz kilitli olan derslerin metinleri görünmez.

## Tasarım dili

### Renkler

"Tasarım" sütunu panodaki renktir. Uygulamada **"Uygulama"** sütunundaki değer kullanılır.
Değer farklıysa sebebi kontrasttır (karar 4).

| Rol | Tasarım | Uygulama | Not |
|---|---|---|---|
| Ekran zemini | `#FBF7EF` | `#FBF7EF` | |
| Kart, alt çubuk, ikincil düğme | `#FFFDF7` | `#FFFDF7` | |
| Seçenek kartı | `#FFFEFA` | `#FFFEFA` | |
| Bölüm çubuğu (haritanın üstü) | `#F8F2E7` | `#F8F2E7` | |
| Çizgi / kenarlık | `#EAE6DC`, `#E5E4DA` | aynı | |
| İkincil düğme kenarı ve dudağı | `#DDDCCD` | `#DDDCCD` | |
| Ana metin | `#303B42` | `#303B42` | 10,7:1 |
| Soluk metin (açıklama, alt yazı) | `#8B8D7D`, `#8D947E`, `#929984` | `#676D5A` | tüm zeminlerde ≥ 4,6:1 |
| Üst başlık (eyebrow) | `#9B8164` | `#7E6950` | |
| Form etiketi | `#6D806B` | `#5F705D` | |
| Ana düğme yüzü | `#D67F5D` | `#AF6044` | beyaz yazıyla 4,5:1 |
| Ana düğme dudağı | `#AD5B3D` | `#8B4A33` | |
| Ana düğme yazısı | `#FFFDF7` | `#FFFDF7` | |
| İkincil düğme yazısı | `#6D7F70` | `#68796B` | |
| Vurgu metni (bağlantı, aktif sekme, "HADİ OKUYALIM") | `#AC583D`, `#A56545`, `#9C5D42` | `#9C523B` | |
| Aktif sekme hapı | `#F5E3D7` | `#F5E3D7` | |
| Pasif sekme | `#8A948A` | `#707770` | |
| Logo "matik" | `#D47A5B` | `#D47A5B` | logo, kontrast kuralı dışında |
| Adaçayı (biten düğüm) | `#71978B` / dudak `#4A7165` | aynı | beyaz ikon 3,2:1 |
| İlerleme çubuğu | `#719A83` üstünde `#DDDCCA` | aynı | |
| Aktif düğüm | `#DC8866` / dudak `#AA5B40` | `#D07E5E` / `#AA5B40` | beyaz ikon 3:1 |
| Kilitli düğüm | `#E7E4D6` / dudak `#C5CAB9`, ikon `#A8AC9B` | ikon `#808476` | |
| Sandık düğümü | `#E6B966` / dudak `#B68B44`, ikon `#FFFBE9` | ikon `#7D653E` | |
| Madalya düğümü (10. sandık) | `#F1D49B` / dudak `#C0A06D`, ikon `#AF8147` | ikon `#9B713A` | |
| Tema etiketi | zemin `#E8EEE0`, yazı `#6A8263` | yazı `#5B6F55` | |
| Yanlış geri bildirim | zemin `#F8EBD2`, yazı `#967339` | yazı `#856633` | |
| Yanlış seçenek | kenar `#DDB87B`, zemin `#FFF2D9` | aynı | |
| Doğru geri bildirim | zemin `#E8F0DD`, yazı `#5C7952` | yazı `#58734F` | |
| Doğru seçenek | kenar `#9BBB89`, zemin `#ECF4E3` | aynı | |
| Seçili seçenek | kenar `#D29874`, zemin `#FCF0E1` | aynı | |
| Yıldız | `#D6A04B` | `#D6A04B` + kenar `#A87A2E` | |
| Büyük sonuç sayıları | `#B77854` | `#B77854` | büyük yazı, ≥ 3:1 |
| Madalya | `#F4D79A`, halka `#FAE8BA`, kenar `#D7B879`, dudak `#C9A866` | aynı; "SEVİYE" yazısı `#755A2F` | |
| Avatar | zemin `#E6ECDF`, harf `#547667` | harf `#517062` | |
| Seri alevi / lokum ikonu | `#D99959` / `#D5AD66` + `#F7E3A8` | aynı | |
| Bildirim kartı | zemin `#EFF2E9`, yazı `#6C7A62` | yazı `#64725B` | |
| Sertifika | kenar `#D1B274`, dış `#F7ECD5`, zemin `#FFFDF5`, ad `#A27C47` | aynı | ad büyük italik |
| Yer notu (harita, italik) | `#8D7656` | `#806B4E` | |
| Alt sayfa arka perdesi | `#263B4366` | aynı | |

### Yazı ve şekiller

- **Logo:** "oku" ana metin rengi, "matik" `#D47A5B`; Nunito Sans 900, 25-26, harf aralığı
  -1,3.
- **Başlıklar:** Nunito Sans 800-900. Ekran başlığı 29-33 (harf aralığı -1,2), şehir adı 25,
  alt sayfa başlığı 25, soru 21.
- **Üst başlık (eyebrow):** 11, büyük harf, harf aralığı 1,8, kalınlık 800.
- **Okuma metni:** Literata 21, satır yüksekliği 1,85, renk `#495445`. A−/A+ ile 18-28
  arasında değişir.
- **Düğmeler:** yükseklik ≥ 52, köşe 13, büyük harf 15/800, harf aralığı 0,6, altta 4 px
  dudak. Basınca 2 px aşağı iner ve dudak incelir. İkincil düğme açık zeminli ve kenarlıklıdır.
- **Kartlar:** köşe 14-17, 1 px kenar. Dokunulan kartlarda altta 3-4 px kalın kenar.
- **Etiket hapları:** köşe 6-9.
- **Harita düğümleri:** biten 67×59 (adaçayı, tik), aktif 78×68 (halkalı, kitap ikonu),
  kilitli 67×59 (kilit), sandık 60×53 yuvarlak köşeli kare (hediye), madalya 67×59
  (rozet ikonu). Hepsinde 3 px yarı saydam beyaz kenar ve altta 5-7 px dudak var.
- **Üst çubuk:** 60-67 yükseklik, zemin rengi, alt çizgi. Solda logo; sağda seri (alev),
  lokum (altıgen) ve ad baş harfli avatar (dokununca Profil).
- **Alt çubuk:** 70 + güvenli alan. 4 öğe, ikon 22 ve etiket 12. Aktif öğe vurgu renginde ve
  açık hapın içinde.
- **İkonlar:** `kaynak/ekranlar/*.html` içindeki 24×24 çizgi SVG'ler (harita, kitap,
  pasaport/rozet, kişi, kilit, tik, hediye, alev, altıgen, geri, kapat, ayar, saat).
  `react-native-svg` ile çizilir.
