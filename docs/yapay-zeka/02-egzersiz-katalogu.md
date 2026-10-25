# Egzersiz kataloğu

Uygulamaya eklenecek okuma egzersizleri. Hepsi `01-arastirma.md`'deki kanıtlara dayanır. Her
egzersizin zorluk ayarları (parametreleri) vardır; hangi egzersizin hangi ayarla ne zaman
geleceğine A4 aşamasındaki planlayıcı karar verir.

Sınıf grupları: **G1** = 1-2. sınıf, **G2** = 3-4, **G3** = 5-6, **G4** = 7-8.

## 1. Egzersizler

| Kod | Egzersiz | Kanıt | Sınıf | Neyi geliştirir |
|---|---|---|---|---|
| E1 | Tekrarlı okuma ve hedef grafiği | Güçlü | Hepsi | Akıcılık, anlama |
| E2 | Dinle, sonra oku | Güçlü–Orta | G1-G2 ağırlıklı | Akıcılık, kelime tanıma |
| E3 | Dinlerken oku (karaoke vurgulu) | Orta–Zayıf | G1-G2 | Kelime tanıma, takip |
| E4 | Öbek öbek oku | Orta | G1-G3 | Tonlama, anlamlı okuma |
| E5 | Hızlı kelime ve öbek tanıma | Orta | G1-G2 | Kelime tanıma otomatikliği |
| E6 | Pırıl'ın ışığı (hızlandırılmış okuma) | Orta | G2-G4 | Hız ve anlamayı birlikte |
| E7 | Kök ve ek ustası | Güçlü–Orta | Hepsi | Kelime bilgisi, çözümleme |
| E8 | Anlama stratejileri | Güçlü | Hepsi | Okuduğunu anlama |
| E9 | LGS tarzı paragraf ve sözel mantık | Güçlü (strateji) + sınav uyumu | G3-G4 | Sınav becerileri |
| E10 | Görsel okuma (grafik, tablo, infografik) | Sınav uyumu | G2-G4 | Görsel okuma |

### E1 · Tekrarlı okuma ve hedef grafiği
- **Nasıl:** Aynı kısa metin (60-200 kelime) 2-4 kez okunur. Her okumada süre ölçülür ve
  dakikadaki kelime sayısı bir grafiğe eklenir. Hedef çizgisi ilk okumanın %10-20 üstünde.
  Son okumadan sonra 2-3 anlama sorusu.
- **Ayarlar:** metin uzunluğu, Ateşman puanı, tekrar sayısı (2-4), hedef artış yüzdesi.
- **Ölçüm:** okumalar arası hız artışı, anlama oranı.
- **Not:** Çocuk ilerlemeyi grafikte kendisi görür (hedef ve grafik, motivasyon).

### E2 · Dinle, sonra oku
- **Nasıl:** Pırıl metni okur (cihazdaki Türkçe metin okuma sesi ya da önceden kaydedilmiş ses),
  sonra çocuk aynı metni kendisi okur. E1 ile birleştirilebilir; meta-analizlerde en etkili
  kombinasyon bu.
- **Ayarlar:** dinleme hızı, metin uzunluğu.

### E3 · Dinlerken oku (karaoke vurgulu)
- **Nasıl:** Ses çalarken o an okunan kelime ya da cümle vurgulanır.
- **Ayarlar:** vurgu birimi (kelime ya da cümle; disleksi pilotunda cümle bandı daha iyiydi),
  ses hızı.
- **Teknik not:** Kelimeyle eşzamanlı vurgu için kelime zamanlaması gerekir. Cihazdaki ses
  motorunun kelime sınırı olaylarını verip vermediği SDK 57 belgelerinden kontrol edilmeli;
  vermiyorsa önceden üretilmiş ses ve zaman damgaları kullanılır.

### E4 · Öbek öbek oku
- **Nasıl:** Metin anlamlı öbeklere bölünür ve öbek sınırları ince bir aralık ya da `/` ile
  gösterilir, örneğin: *"Minik serçe / her sabah erkenden / uyanırdı."* İpuçları seviye
  ilerledikçe azalır (önce her öbek, sonra sadece uzun cümleler, sonra hiç). Sonunda kısa anlama
  sorusu.
- **Ayarlar:** ipucu yoğunluğu (tam, yarı, yok).
- **Yapay zekâ rolü:** Öbek sınırlarını yapay zekâ işaretler (virgüller, ad ve fiil öbekleri,
  zarf öbekleri); bir kontrol de öbek birleşiminin orijinal metinle birebir aynı olduğunu
  doğrular.

### E5 · Hızlı kelime ve öbek tanıma
- **Nasıl:** Okunacak metindeki zor ve sık kelimeler, okumadan önce kısa kartlarla gösterilir;
  çocuk okuduğunda dokunur. Süre sınırı yavaş yavaş azalır. Oyun gibi, 1-2 dakika.
- **Ayarlar:** kart süresi, kelime uzunluğu ve hece sayısı, kelime sayısı.
- **Not:** Kelimeler tek başına değil, hemen ardından okunacak metinden seçilir; böylece
  kazanım metne aktarılır.

### E6 · Pırıl'ın ışığı (hızlandırılmış okuma)
- **Senin "hareket eden rengi takip etme" fikrinin kanıtlı biçimi.**
- **Nasıl:**
  1. Çocuk önce metnin bir bölümünü kendi hızında okur; bu onun temel hızıdır.
  2. Sonra yumuşak bir ışık satırları **arkadan** soldurarak ilerler. Çocuğu öne çekmez, okunmuş
     yeri kapatır.
  3. Işığın hızı temel hızın %5-20 üstünde başlar.
  4. Her bölümden sonra 1-2 anlama sorusu sorulur.
  5. Anlama %80'in altına düşerse ışık yavaşlar, üstündeyse çok az hızlanır.
- **Ayarlar:** hız çarpanı (1,05-1,20), soldurma biçimi (satır ya da kelime), bölüm uzunluğu.
- **Sınırlar:**
  - Günde en fazla 5 dakika.
  - Asla tek başına okuma modu değil; diğer egzersizlerle dönüşümlü.
  - G1'de (1-2. sınıf) kullanılmaz.
- **Ölçüm:** ışıklı ve ışıksız okumada hız ve anlama karşılaştırması. Normal okumaya aktarım
  araştırmada zayıf çıktığı için bunu kendi verimizle ayrıca ölçeriz.

### E7 · Kök ve ek ustası
- **Nasıl:** Okunan metinden 3-5 kelime seçilir. Mini oyunlar:
  - Kelimeyi kökü ve eklerine ayır: *göz-lük-çü-ler*.
  - Köke ek ekleyerek yeni kelime kur.
  - Ekin anlamı nasıl değiştirdiğini seç.
  - Bağlamdan anlam çıkar.
- **Ayarlar:** ek sayısı, yapım ve çekim eki oranı, bağlam ipucunun gücü.
- **Neden önemli:** Türkçe eklemeli bir dil; morfoloji çalışmalarının etkisi özellikle zayıf
  okuyucularda belirgin.

### E8 · Anlama stratejileri
Okumadan sonra şu kısa görevlerden biri ya da ikisi:
- **Hikâye haritası:** karakter, yer, sorun ve çözüm kartlarını doğru kutulara sürükle (grafik
  düzenleyici).
- **Pırıl'a bir cümleyle anlat:** çocuk kısa bir özet seçer ya da yazar (G3-G4). Yapay zekâ
  özeti nazikçe değerlendirir: ana fikir var mı, gereksiz ayrıntı var mı.
- **Sen sor:** çocuk metinle ilgili bir soru kurar; Pırıl cevaplar (soru üretme).
- **Durup düşün:** okurken bir noktada "Şimdiye kadar ne oldu?" sorusu çıkar (anlamayı izleme).
- **Ayarlar:** görev türü, ipucu düzeyi.

### E9 · LGS tarzı paragraf ve sözel mantık (G3-G4)
- **Nasıl:** Kısa paragraflar üzerinden LGS soru türleri, 4 seçenekli. Sözel mantıkta önce
  verileri bir tabloya yerleştirme ipucu verilir.
- **Ayarlar:** soru türü, öncül sayısı, paragraf uzunluğu.

### E10 · Görsel okuma
- **Nasıl:** Basit grafik, tablo ya da infografik ve onunla ilgili sorular. Grafikler kodla
  (SVG) çizilir; yapay zekâ veriyi ve soruları üretir, görselleri değil.
- **Ayarlar:** veri noktası sayısı, grafik türü (sütun, çizgi, tablo), adım sayısı.

## 2. Bilinçli olarak eklenmeyenler

| Önerilen | Neden eklenmiyor | Yerine |
|---|---|---|
| Ortası soluk, baş ve son harfleri belirgin kelimeler | Hız ve anlama faydası gösterilemedi; küçük yaşta çözümlemeyi zorlaştırabilir | E5 ve E7 |
| Kelimelerin tek tek yanıp söndüğü hızlı gösterim (RSVP) | Geri dönüp okumayı engelleyip anlamayı bozuyor | E6 (geri dönüşe kısmen izin veren, anlamaya göre ayarlanan hız) |
| Göz egzersizleri, çevresel görüşü genişletme | Pediatri ve göz hekimliği kuruluşları önermiyor | — |
| Çocuğu öne çeken hareketli işaretçi | Göz hareketleri darboğaz değil | E6 (arkadan soldurma) |

## 3. Soru türleri (sınıflandırma)

Her soru bir türle etiketlenir. Raporlar "hangi türde zorlanıyor" bilgisini bu etiketlerden çıkarır.

| Kod | Tür | Sınıf | Örnek |
|---|---|---|---|
| Q1 | Bilgi (kim, ne, nerede, ne zaman) | Hepsi | "Pıtır'ın yuvası nereye düştü?" |
| Q2 | Sıralama | G1-G2 | "Önce ne oldu?" |
| Q3 | Bağlamdan sözcük anlamı | Hepsi | "'Telaşla' kelimesi ne demek?" |
| Q4 | Neden-sonuç çıkarımı | Hepsi | "Yuva neden düştü?" |
| Q5 | Duygu ve karakter | G1-G3 | "Pıtır yuvasını bulunca ne hissetti?" |
| Q6 | Ana fikir / ana duygu | G2-G4 | "Bu metnin ana fikri nedir?" |
| Q7 | Yardımcı fikir | G3-G4 | |
| Q8 | Başlık bulma | G2-G4 | |
| Q9 | Cümlede anlam (mecaz, deyim, amaç-sonuç, koşul) | G3-G4 | |
| Q10 | Paragraf yapısı (akışı bozan cümle, ikiye bölme, boşluk tamamlama) | G3-G4 | |
| Q11 | Sözel mantık (öncüllerden çıkarım) | G3-G4 | |
| Q12 | Görsel okuma (grafik, tablo, infografik) | G2-G4 | |
| Q13 | Öncüllü (I, II, III) yorum | G4 | |

Her soru ayrıca şunlarla etiketlenir:
- **Bilişsel düzey:** hatırlama, anlama, çıkarım, değerlendirme.
- **MEB kazanım kodu:** resmî programdan, varsa.

**Seçenek sayısı:** G1-G2'de 3, G3-G4'te 4 (LGS biçimi). Not: P02'deki veritabanı kısıtı şu an
"tam 3 seçenek" diyor; A0'da 3-4 olarak gevşetilecek.

## 4. Zorluk ayarları (genel)

Her içerik ve egzersiz örneği şu boyutlarla etiketlenir; planlayıcı bunları kullanır:

| Boyut | Örnek değerler |
|---|---|
| Sınıf grubu | G1-G4 |
| Yolculuk seviyesi | 1-30 (şehir ilerledikçe biraz daha zor) |
| Okunabilirlik | Ateşman puanı (G1 ≈ 85-100, G4 ≈ 50-70; kesin aralıklar A0'da verilerle ayarlanır) |
| Uzunluk | kelime sayısı, ortalama cümle uzunluğu |
| Soru dağılımı | türlerin oranı ve bilişsel düzey |
| Egzersiz ayarları | yukarıdaki egzersizlere özel |
