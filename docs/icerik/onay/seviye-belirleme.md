# Seviye belirleme metinleri: öğretmen onayı

**Durum:** taslak, onay bekliyor · **Hazırlayan:** yapay zekâ destekli taslak (A0) · **Tarih:** 2 Kasım 2026

Bu belge, uygulamaya kayıttan sonra açılan "Pırıl seni tanımak istiyor!" okumasının metinlerini ve
sorularını gözden geçirmeniz için hazırlandı. Çocuk kendi sınıf grubunun **iki metnini** sırayla
okur ve her metinden sonra **üç soru** cevaplar. Bu okumadan çocuğun başlangıç okuma hızı ve anlama
düzeyi çıkar; sonraki gelişimi bu başlangıca göre ölçülür. Çocuğa puan ya da hız gösterilmez.

## Nasıl değerlendirebilirsiniz

Her metin için şunlara bakmanızı rica ederiz:

1. **Dil ve içerik:** Metin sınıf düzeyine uygun mu? Anlaşılmayacak kelime ya da yapı var mı?
2. **Sorular:** Soru açık mı? Doğru cevap metinden tek ve kesin çıkıyor mu? Yanlış şıklar makul
   ama açıkça yanlış mı?
3. **Soru türü ve bilişsel düzey:** Etiket soruya uyuyor mu?
4. **İpucu ve açıklama:** Yanlış cevapta gösterilen ipucu cevabı söylemeden yol gösteriyor mu?

Düzeltmeleri doğrudan bu belgeye not edebilir ya da her metnin altındaki **Onay** satırını
doldurabilirsiniz.

## Ölçütler

- **Uzunluk:** 60-120 kelime.
- **Şık sayısı:** 1-4. sınıflarda 3, 5-8. sınıflarda 4 (LGS biçimi).
- **Okunabilirlik:** Ateşman (1997) puanı, `198,825 − 40,175 × (hece / kelime) − 2,610 × (kelime / cümle)`.
  Puan yükseldikçe metin kolaylaşır: 90-100 çok kolay, 70-89 kolay, 50-69 orta güçlükte, 30-49 zor,
  1-29 çok zor. Sınıf grubu hedef aralıkları (taslak; kendi verimizle ayarlanacak):

| Sınıf grubu | Hedef Ateşman |
|---|---|
| G1 (1-2. sınıf) | 85-100 |
| G2 (3-4. sınıf) | 70-89 |
| G3 (5-6. sınıf) | 60-79 |
| G4 (7-8. sınıf) | 50-69 |

Puanlar uygulamanın okunabilirlik aracıyla (`server/src/lib/readability.ts`) hesaplandı; sekiz
metnin hepsi grubunun hedef aralığında.

## Özet

| Grup | Sıra | Metin | Kelime | Cümle | Ort. cümle | Ateşman | Düzey |
|---|---|---|---|---|---|---|---|
| G1 | 1 | Kayıp Eldiven | 61 | 16 | 3,81 | 91,4 | Çok kolay |
| G1 | 2 | Tosbik Nerede? | 63 | 17 | 3,71 | 94,8 | Çok kolay |
| G2 | 1 | Kütüphanede Bir Gün | 82 | 12 | 6,83 | 76,6 | Kolay |
| G2 | 2 | Balkondaki Fesleğen | 81 | 12 | 6,75 | 84,5 | Kolay |
| G3 | 1 | Leyleklerin Yolculuğu | 88 | 12 | 7,33 | 64,2 | Orta güçlükte |
| G3 | 2 | Takım Kaptanı | 77 | 11 | 7 | 62,1 | Orta güçlükte |
| G4 | 1 | Plastik ve Deniz | 96 | 9 | 10,67 | 55,1 | Orta güçlükte |
| G4 | 2 | Dedemin Saati | 86 | 9 | 9,56 | 64,6 | Orta güçlükte |

## G1 · 1-2. sınıf

### 1. metin: Kayıp Eldiven

Tema: Yardımlaşma · 61 kelime · 16 cümle · ort. cümle 3,81 kelime · **Ateşman 91,4** (çok kolay; hedef 85-100)

> Kar yağıyordu. Hava çok soğuktu. Ece okula gidiyordu. Yolda kırmızı bir eldiven gördü. Eldiven karın üstünde duruyordu.
>
> Ece eldiveni aldı. “Bu kimin acaba?” dedi. Sonra küçük bir çocuk gördü. Çocuğun bir eli çok üşümüştü.
>
> Ece eldiveni çocuğa verdi. Çocuk çok sevindi. “Teşekkür ederim!” dedi. İkisi okula birlikte yürüdü.
>
> Akşam Ece annesine olanları anlattı. Annesi gülümsedi. “Bugün iyi bir iş yaptın,” dedi.

**Soru 1.** Ece yolda ne buldu?

- A) Kırmızı bir eldiven ✔
- B) Mavi bir şapka
- C) Sarı bir top

- Doğru cevap: **A**
- Soru türü: Bilgi (Q1) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Ece okula giderken karın üstünde bir şey gördü.
- Açıklama (doğru cevaptan sonra): Doğru! Ece karın üstünde kırmızı bir eldiven buldu.

**Soru 2.** Ece eldiveni neden çocuğa verdi?

- A) Eldiven ona küçük geldi.
- B) Çocuğun eli üşümüştü. ✔
- C) Annesi öyle istedi.

- Doğru cevap: **B**
- Soru türü: Neden-sonuç (Q4) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): Ece çocuğu görünce çocuğun elinde neyi fark etti?
- Açıklama (doğru cevaptan sonra): Harika! Çocuğun eli üşümüştü, Ece de ona eldiveni verdi.

**Soru 3.** Bu hikâye bize ne anlatıyor?

- A) Kışın kar yağar.
- B) Okula erken gitmeliyiz.
- C) Yardım etmek bizi mutlu eder. ✔

- Doğru cevap: **C**
- Soru türü: Ana fikir (Q6) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Hikâyenin sonunda Ece ve çocuk nasıl hissetti?
- Açıklama (doğru cevaptan sonra): Çok güzel! Ece yardım etti, hem çocuk hem Ece mutlu oldu.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

### 2. metin: Tosbik Nerede?

Tema: Sabır · 63 kelime · 17 cümle · ort. cümle 3,71 kelime · **Ateşman 94,8** (çok kolay; hedef 85-100)

> Deniz’in bir kaplumbağası var. Adı Tosbik. Tosbik çok yavaş yürür. Deniz onu bahçeye çıkardı.
>
> Tosbik çimenlerin arasında kayboldu. Deniz her yere baktı. Ağacın altına baktı. Çiçeklerin yanına baktı. Ama Tosbik yoktu.
>
> Deniz biraz bekledi. Sonra bir marul yaprağı getirdi. Yaprağı yere koydu. Az sonra Tosbik yavaş yavaş geldi.
>
> Deniz güldü. “Sen marulu çok seviyorsun!” dedi. Artık ne yapacağını biliyor. Tosbik kaybolursa marul getirecek.

**Soru 1.** Deniz marul yaprağını ne zaman getirdi?

- A) Tosbik’i bulamayınca ✔
- B) Bahçeye çıkmadan önce
- C) Tosbik uyuyunca

- Doğru cevap: **A**
- Soru türü: Sıralama (Q2) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Deniz önce her yere baktı. Sonra ne yaptı?
- Açıklama (doğru cevaptan sonra): Doğru! Deniz, Tosbik’i bulamayınca marul getirdi.

**Soru 2.** “Tosbik çimenlerin arasında kayboldu.” Burada “kayboldu” ne demek?

- A) Uyudu
- B) Görünmez oldu, bulunamadı ✔
- C) Hızlı koştu

- Doğru cevap: **B**
- Soru türü: Bağlamdan sözcük anlamı (Q3) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Deniz her yere baktı ama Tosbik’i görebildi mi?
- Açıklama (doğru cevaptan sonra): Harika! Kaybolmak, bir yerde bulunamamak demek.

**Soru 3.** Tosbik gelince Deniz nasıl hissetti?

- A) Kızgın
- B) Üzgün
- C) Sevinçli ✔

- Doğru cevap: **C**
- Soru türü: Duygu ve karakter (Q5) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): Tosbik gelince Deniz ne yaptı? Son bölüme bak.
- Açıklama (doğru cevaptan sonra): Çok güzel! Deniz güldü; çünkü sevinmişti.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

## G2 · 3-4. sınıf

### 1. metin: Kütüphanede Bir Gün

Tema: Merak · 82 kelime · 12 cümle · ort. cümle 6,83 kelime · **Ateşman 76,6** (kolay; hedef 70-89)

> Cumartesi sabahı Ali, babasıyla birlikte mahalledeki kütüphaneye gitti. Raflarda yüzlerce renkli kitap vardı.
>
> Ali önce dinozorlarla ilgili bir kitap seçti. Kitapta kocaman resimler ve ilginç bilgiler vardı. Bazı dinozorların bir otobüs kadar uzun olduğunu öğrendi. En çok da uzun boyunlu olanları sevdi.
>
> Kütüphaneci Ali’ye yaklaştı. “Kitapları eve de götürebilirsin,” dedi. Bunun için bir kütüphane kartı gerekiyordu. Babası formu doldurdu ve Ali’nin kartı hemen hazırlandı.
>
> O akşam Ali kitabını yatağında okudu. Uyumadan önce kendine bir söz verdi: Her hafta yeni bir kitap alacaktı.

**Soru 1.** Ali kütüphaneye kiminle gitti?

- A) Annesiyle
- B) Babasıyla ✔
- C) Arkadaşıyla

- Doğru cevap: **B**
- Soru türü: Bilgi (Q1) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Cevap hikâyenin ilk cümlesinde.
- Açıklama (doğru cevaptan sonra): Doğru! Ali kütüphaneye babasıyla gitti.

**Soru 2.** Babası neden form doldurdu?

- A) Kütüphaneden kitap satın almak için
- B) Kütüphanecinin adını öğrenmek için
- C) Ali kitapları eve götürebilsin diye ✔

- Doğru cevap: **C**
- Soru türü: Neden-sonuç (Q4) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): Kütüphaneci Ali’ye ne söyledi? Bunun için ne gerekiyordu?
- Açıklama (doğru cevaptan sonra): Harika! Kitapları eve götürmek için kütüphane kartı gerekiyordu.

**Soru 3.** Bu hikâyenin ana fikri hangisi?

- A) Kitaplar yeni şeyler öğrenmemizi sağlar. ✔
- B) Dinozorlar çok büyük hayvanlardı.
- C) Cumartesi günleri okul yoktur.

- Doğru cevap: **A**
- Soru türü: Ana fikir (Q6) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Ali kitap okuyunca ne oldu? Sonunda kendine ne söz verdi?
- Açıklama (doğru cevaptan sonra): Çok güzel! Ali kitapla yeni şeyler öğrendi ve okumayı sevdi.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

### 2. metin: Balkondaki Fesleğen

Tema: Sorumluluk · 81 kelime · 12 cümle · ort. cümle 6,75 kelime · **Ateşman 84,5** (kolay; hedef 70-89)

> Zeynep’in annesi ona küçük bir saksı fesleğen hediye etti. “Artık bu bitki senin,” dedi. “Ona iyi bakmalısın.”
>
> Zeynep ilk günler fesleğeni her sabah suladı. Ama sonra okul, oyun ve ödevler arasında onu unuttu. Bir hafta sonra fesleğenin yaprakları sararmış, boynunu bükmüştü.
>
> Zeynep çok üzüldü. Hemen saksıyı güneş alan bir köşeye taşıdı ve toprağını suladı. Buzdolabının kapağına da “Fesleğeni sula!” yazan bir not yapıştırdı.
>
> Birkaç gün sonra fesleğen yeniden dikleşti. Mutfağa güzel bir koku yayıldı. Zeynep bitkiye gülümsedi: “Bir daha seni unutmayacağım.”

**Soru 1.** Zeynep fesleğenin solduğunu görünce önce ne yaptı?

- A) Annesinden yeni bir saksı istedi.
- B) Saksıyı güneş alan bir köşeye taşıdı. ✔
- C) Sararan yaprakları kopardı.

- Doğru cevap: **B**
- Soru türü: Sıralama (Q2) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Üçüncü bölümde Zeynep’in “hemen” yaptığı şeye bak.
- Açıklama (doğru cevaptan sonra): Doğru! Zeynep hemen saksıyı güneşli bir köşeye taşıdı.

**Soru 2.** “Fesleğen boynunu bükmüştü.” sözüyle ne anlatılıyor?

- A) Bitki çok büyümüştü.
- B) Bitki çiçek açmıştı.
- C) Bitki solmuş ve eğilmişti. ✔

- Doğru cevap: **C**
- Soru türü: Cümlede anlam (Q9) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Aynı cümlede yaprakların ne olduğu yazıyor.
- Açıklama (doğru cevaptan sonra): Harika! Boynunu bükmek burada solup eğilmek demek.

**Soru 3.** Hikâyenin sonunda Zeynep için ne söyleyebiliriz?

- A) Hatasından ders çıkardı. ✔
- B) Bitkileri hiç sevmiyor.
- C) Sözünü tutmayı bilmiyor.

- Doğru cevap: **A**
- Soru türü: Duygu ve karakter (Q5) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): Zeynep buzdolabına neden not yapıştırdı? Son cümlede ne dedi?
- Açıklama (doğru cevaptan sonra): Çok güzel! Zeynep hatasını anladı ve bir daha unutmamak için önlem aldı.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

## G3 · 5-6. sınıf

### 1. metin: Leyleklerin Yolculuğu

Tema: Doğa · 88 kelime · 12 cümle · ort. cümle 7,33 kelime · **Ateşman 64,2** (orta güçlükte; hedef 60-79)

> Her sonbahar leylekler uzun bir yolculuğa çıkar. Türkiye’den Afrika’ya kadar binlerce kilometre uçarlar. Kuşların mevsime göre yer değiştirmesine göç denir.
>
> Leylekler bu uzun yolda kanatlarını çok az çırparak uçar. Güneşin ısıttığı havanın yükseldiği yerleri bulurlar. Sıcak hava onları yukarı taşır, onlar da süzülerek ilerler. Böylece enerjilerini boşa harcamazlar.
>
> Göç sırasında leylekler kalabalık sürüler oluşturur. Bazı günlerde gökyüzünde binlerce leylek birden görülebilir. İstanbul’un tepeleri, bu yolculuğu izlemek için en güzel yerlerden biridir.
>
> İlkbahar gelince leylekler çoğunlukla aynı yuvalarına döner. Köylerde bacaların üstündeki yuvalarda leylekleri gören insanlar, baharın geldiğini anlar.

**Soru 1.** Leylekler sonbaharda nereye göç eder?

- A) Avrupa’ya
- B) Afrika’ya ✔
- C) Kutuplara
- D) Asya’nın kuzeyine

- Doğru cevap: **B**
- Soru türü: Bilgi (Q1) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Cevap ilk paragrafın ikinci cümlesinde.
- Açıklama (doğru cevaptan sonra): Doğru! Leylekler Türkiye’den Afrika’ya kadar uçar.

**Soru 2.** Leylekler sıcak havanın yükseldiği yerleri neden arar?

- A) Yiyecek bulmak için
- B) Yağmurdan korunmak için
- C) Az kanat çırpıp enerjilerini korumak için ✔
- D) Yuvalarını orada yapmak için

- Doğru cevap: **C**
- Soru türü: Neden-sonuç (Q4) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): İkinci paragraf sıcak havanın leyleklere nasıl yardım ettiğini anlatıyor.
- Açıklama (doğru cevaptan sonra): Harika! Sıcak hava onları taşır, böylece enerjilerini boşa harcamazlar.

**Soru 3.** Bu metne en uygun başlık hangisi olur?

- A) Leyleklerin Uzun Yolculuğu ✔
- B) İstanbul’un Tepeleri
- C) Köydeki Bacalar
- D) Afrika’nın Hayvanları

- Doğru cevap: **A**
- Soru türü: Başlık bulma (Q8) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Metnin her paragrafı aynı konuyu anlatıyor. O konu ne?
- Açıklama (doğru cevaptan sonra): Çok güzel! Metnin tamamı leylek göçünü anlatıyor.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

### 2. metin: Takım Kaptanı

Tema: Arkadaşlık · 77 kelime · 11 cümle · ort. cümle 7 kelime · **Ateşman 62,1** (orta güçlükte; hedef 60-79)

> Okulun voleybol takımı, ilçe turnuvasının finaline kalmıştı. Takım kaptanı Nehir, maçtan önceki gece heyecandan uyuyamadı.
>
> Maç başladığında rakip takım ilk seti kolayca kazandı. Nehir’in arkadaşları omuzlarını düşürmüş, birbirlerine kızmaya başlamışlardı. Nehir mola sırasında herkesi bir araya topladı. “Hata yapan arkadaşımızı suçlamak yerine ona destek olalım,” dedi.
>
> İkinci sette takım daha sakin oynadı. Oyuncular birbirini cesaretlendirdi. Toplar daha isabetli gitti. Maçı az farkla kaybettiler ama tribündeki öğretmenleri onları ayakta alkışladı.
>
> Eve dönerken Nehir kendini üzgün değil, gururlu hissediyordu.

**Soru 1.** Takım hangi turnuvanın finalinde oynadı?

- A) İl turnuvası
- B) Okul turnuvası
- C) Ülke turnuvası
- D) İlçe turnuvası ✔

- Doğru cevap: **D**
- Soru türü: Bilgi (Q1) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Cevap metnin ilk cümlesinde.
- Açıklama (doğru cevaptan sonra): Doğru! Takım ilçe turnuvasının finaline kalmıştı.

**Soru 2.** “Arkadaşları omuzlarını düşürmüştü.” sözüyle anlatılan nedir?

- A) Yorulup yere oturdukları
- B) Morallerinin bozulduğu ✔
- C) Sakatlandıkları
- D) Isınma hareketi yaptıkları

- Doğru cevap: **B**
- Soru türü: Cümlede anlam (Q9) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Takım ilk seti kaybetmişti. Oyuncular nasıl hissediyordu?
- Açıklama (doğru cevaptan sonra): Harika! Omuz düşürmek, morali bozulmak ve umudunu kaybetmek demek.

**Soru 3.** Bu hikâyenin ana fikri hangisidir?

- A) Kazanmak her şeydir.
- B) Voleybol zor bir spordur.
- C) Birbirine destek olmak, sonuçtan daha değerlidir. ✔
- D) Maçtan önce iyi uyumak gerekir.

- Doğru cevap: **C**
- Soru türü: Ana fikir (Q6) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Takım kaybetti ama Nehir neden gururluydu?
- Açıklama (doğru cevaptan sonra): Çok güzel! Takım birbirine destek oldu; Nehir bu yüzden gururluydu.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

## G4 · 7-8. sınıf

### 1. metin: Plastik ve Deniz

Tema: Doğa · 96 kelime · 9 cümle · ort. cümle 10,67 kelime · **Ateşman 55,1** (orta güçlükte; hedef 50-69)

> Her yıl milyonlarca ton plastik atık, akarsular ve rüzgâr aracılığıyla denizlere ulaşıyor. Güneş ışığı ve dalgalar bu atıkları zamanla gözle zor görülen küçük parçalara ayırıyor. Bilim insanları bu parçalara mikroplastik adını veriyor.
>
> Mikroplastikler balıkların ve midyelerin vücuduna girebiliyor. Bu canlılar besin zinciri yoluyla sofralarımıza kadar geldiğinden sorun yalnızca denizlerle sınırlı kalmıyor. Ayrıca kıyıya vuran plastik poşetler, onları yiyecek sanan deniz kaplumbağalarının ölümüne yol açabiliyor.
>
> Bu sorunu çözmek için yalnızca büyük fabrikaların değişmesini beklemek yetmez. Bez çanta kullanmak, pet şişe yerine matara taşımak ve atıkları ayrıştırmak küçük alışkanlıklardır. Ancak milyonlarca insan bunları uyguladığında büyük bir fark yaratabilir.

**Soru 1.** Metinde “mikroplastik” ne anlama geliyor?

- A) Plastikten yapılmış balık ağları
- B) Plastiğin parçalanmasıyla oluşan çok küçük parçalar ✔
- C) Denizde yaşayan küçük canlılar
- D) Geri dönüştürülmüş plastik şişeler

- Doğru cevap: **B**
- Soru türü: Bağlamdan sözcük anlamı (Q3) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): İlk paragrafta güneş ve dalgaların atıklara ne yaptığını oku.
- Açıklama (doğru cevaptan sonra): Doğru! Mikroplastik, plastiğin parçalanmasıyla oluşan minik parçalardır.

**Soru 2.** Metne göre mikroplastik sorunu neden yalnızca denizlerle sınırlı değildir?

- A) Rüzgâr plastikleri şehirlere geri taşıdığı için
- B) Fabrikalar denizlerin yanında kurulduğu için
- C) Plastik yutan deniz canlıları besin olarak sofralarımıza geldiği için ✔
- D) Mikroplastikler deniz suyunu ısıttığı için

- Doğru cevap: **C**
- Soru türü: Neden-sonuç (Q4) · Bilişsel düzey: Çıkarım
- İpucu (yanlış cevaptan sonra): İkinci paragrafta “besin zinciri” geçen cümleye bak.
- Açıklama (doğru cevaptan sonra): Harika! Mikroplastik yutan balıklar ve midyeler sofralarımıza kadar gelir.

**Soru 3.** Yazarın asıl vurgulamak istediği düşünce hangisidir?

- A) Deniz kaplumbağaları poşetleri yiyecek sanır.
- B) Fabrikalar plastik üretimini hemen durdurmalıdır.
- C) Mikroplastikleri yalnızca bilim insanları inceleyebilir.
- D) Plastik kirliliğini azaltmada herkesin küçük alışkanlıkları önemlidir. ✔

- Doğru cevap: **D**
- Soru türü: Ana fikir (Q6) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Son paragraf, sorunun çözümü için ne söylüyor?
- Açıklama (doğru cevaptan sonra): Çok güzel! Yazar, herkesin küçük adımlarının büyük fark yaratacağını söylüyor.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

### 2. metin: Dedemin Saati

Tema: Hatıralar · 86 kelime · 9 cümle · ort. cümle 9,56 kelime · **Ateşman 64,6** (orta güçlükte; hedef 50-69)

> Dedemden bana kalan en değerli eşya, cebinde taşıdığı eski bir köstekli saatti. Saat yıllardır çalışmıyordu; camı çizilmiş, zinciri kararmıştı. Yine de her baktığımda dedemin sıcak sesi kulaklarımda çınlıyordu.
>
> Bir gün saati tamir ettirmeye karar verdim. Çarşının en eski saatçisi, saati büyüteçle uzun uzun inceledikten sonra başını salladı. “Bu saatin parçaları artık üretilmiyor,” dedi, “ama sabredersen bulmaya çalışırım.”
>
> Üç hafta sonra dükkâna döndüğümde saatin tik takları beni karşıladı. Saatçiye teşekkür edip saati dikkatle cebime yerleştirdim. O an anladım ki bazı eşyaların değeri, fiyatlarından değil taşıdıkları anılardan gelir.

**Soru 1.** “Dedemin sıcak sesi kulaklarımda çınlıyordu.” cümlesiyle anlatılmak istenen nedir?

- A) Saat, anlatıcıya dedesini hatırlatıyordu. ✔
- B) Saat çok yüksek sesle çalıyordu.
- C) Anlatıcının kulağı ağrıyordu.
- D) Dedesi ona telefonla sesleniyordu.

- Doğru cevap: **A**
- Soru türü: Cümlede anlam (Q9) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Saat çalışmıyordu. Peki anlatıcı saate bakınca kimi düşünüyordu?
- Açıklama (doğru cevaptan sonra): Doğru! Saate bakınca dedesini hatırlıyor, sesini duyar gibi oluyordu.

**Soru 2.** Anlatıcı, saati kaç hafta sonra tamir edilmiş olarak buldu?

- A) Bir
- B) İki
- C) Üç ✔
- D) Dört

- Doğru cevap: **C**
- Soru türü: Bilgi (Q1) · Bilişsel düzey: Hatırlama
- İpucu (yanlış cevaptan sonra): Son paragrafın ilk cümlesine bak.
- Açıklama (doğru cevaptan sonra): Harika! Üç hafta sonra saatin tik takları onu karşıladı.

**Soru 3.** Bu metinden çıkarılabilecek en doğru yargı hangisidir?

- A) Eski eşyalar atılmalıdır.
- B) Saat tamiri çok pahalıdır.
- C) Saatçiler sabırsız insanlardır.
- D) Eşyaların asıl değeri taşıdıkları anılardadır. ✔

- Doğru cevap: **D**
- Soru türü: Ana fikir (Q6) · Bilişsel düzey: Anlama
- İpucu (yanlış cevaptan sonra): Anlatıcı son cümlede neyi anladığını söylüyor.
- Açıklama (doğru cevaptan sonra): Çok güzel! Saatin değeri, dedesinin anılarını taşımasından geliyor.

**Onay:** ☐ Uygun ☐ Düzeltmeyle uygun ☐ Uygun değil · Not:

## Onaydan sonra

Düzeltmeler `server/prisma/seed-data/placement.ts` dosyasına işlenir ve bu belge de güncellenir
(Ateşman puanları yeniden hesaplanır). Testler (`server/test/seed-data.test.ts`) uzunluk, şık sayısı ve Ateşman
aralığını her değişiklikte denetler.
