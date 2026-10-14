# Okumatik oyun tasarımı (referans)

Bu klasör, uygulamanın "oyun gibi" yeni tasarımının referansıdır. Kod değildir; ekranları
React Native'e taşırken bakılacak kaynaktır.

- `ekranlar/` — her ekranın 2x ekran görüntüsü (390×844 tasarım, 780×1688 piksel).
- `kaynak/` — tasarımın HTML/CSS kaynağı (`.dc.html`). Renkleri, ölçüleri, gölgeleri ve SVG
  çizimlerini **birebir** buradan al. Bu dosyalar uygulamaya gömülmez (WebView yok); React
  Native bileşenlerine çevrilir. Maskot görselleri `assets/mascot/optimized/…` yollarıyla
  işaretlidir; uygulamada zaten `src/features/mascot/` içindeki `Mascot` bileşeni kullanılır.
- `promptlar/` — tasarımı uygulamaya geçiren görevler (P00 → P09 sırasıyla).

Canlı tasarım tuvali: https://claude.ai/artifact/MS5TatX4u8LQBKRbWwfeZu

## Promptlar nasıl kullanılır

Sırayla, her biri ayrı bir Claude Code oturumunda (ya da `/clear` sonrası) çalıştırılır.
Claude Code'a şunu yazmak yeterli:

> `docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md` dosyasındaki görevi yap.

Her görev bitince uygulamayı telefonda dene, sonucu kontrol et, sonra bir sonrakine geç.
Her görev kendi commit'ini atar; push'u sen yaparsın.

| Sıra | Dosya | Ne yapar |
|---|---|---|
| P00 | `P00-temel-ve-tasarim-dili.md` | Yazı tipleri, şehir temaları, 3B butonlar ve ortak oyun bileşenleri |
| P01 | `P01-sehir-sahneleri.md` | 6 şehir sahnesinin SVG çizimi ve hareketli parçaları |
| P02 | `P02-backend-oyun-modeli.md` | Dersler, sorular, seviye, lokum, seri; yeni API'ler ve demo kullanıcılar |
| P03 | `P03-icerik-hikayeler.md` | 6 şehir × 8 hikâye, 144 soru, kelime anlamları |
| P04 | `P04-karsilama-giris-sekmeler.md` | Karşılama, giriş/kayıt ve yüzen sekme çubuğu |
| P05 | `P05-ana-sayfa-yolculuk.md` | Şehir temalı ana sayfa, ders yolu ve ders kartı |
| P06 | `P06-ders-akisi-ve-oduller.md` | Okuma, sorular, ders sonu, seviye atlama, yeni şehir, final, sandık |
| P07 | `P07-harita-rozetler-profil.md` | Yolculuk haritası, rozetler, profil, kitaplık görünümü |
| P08 | `P08-bildirim-ve-geri-donus.md` | Akşam hatırlatıcısı ve "Seni çok özledim" ekranı |
| P09 | `P09-son-kontrol.md` | Tasarımla karşılaştırma, performans, erişilebilirlik, temizlik |

## Ekran listesi

| # | Ekran | Görüntü | Kaynak | Uygulamadaki yeri | Prompt |
|---|---|---|---|---|---|
| 0 | Pırıl'ın 8 pozu | `00-pirilin-pozlari.jpg` | `Pose.dc.html` | `src/features/mascot/` (hazır) | — |
| 1 | Karşılama | `01-karsilama.jpg` | `S01Karsilama.dc.html` | `src/app/(auth)/welcome.tsx` (yeni) | P04 |
| 2 | Giriş | `02-giris.jpg` | `S02Giris.dc.html` | `src/app/(auth)/login.tsx`, `register.tsx` | P04 |
| 3 | Ana sayfa · İstanbul | `03-ana-sayfa-istanbul.jpg` | `AnaSayfa.dc.html` | `src/app/(tabs)/index.tsx` | P05 |
| 4 | Ders kartı | `04-ders-karti.jpg` | `S03DersKarti.dc.html` | `src/app/lesson/[id]/index.tsx` (alt sayfa) | P05 |
| 5 | Okuma | `05-okuma.jpg` | `S04Okuma.dc.html` | `src/app/reading/[id].tsx` | P06 |
| 6 | Anlama sorusu | `06-soru.jpg` | `S05Soru.dc.html` | `src/app/lesson/[id]/quiz.tsx` | P06 |
| 7 | Yanlış cevap | `07-yanlis-cevap.jpg` | `S06Yanlis.dc.html` | aynı ekran, ipucu paneli | P06 |
| 8 | Doğru cevap | `08-dogru-cevap.jpg` | `S07Dogru.dc.html` | aynı ekran, doğru paneli | P06 |
| 9 | Ders tamamlandı | `09-ders-tamamlandi.jpg` | `S08Tamamlandi.dc.html` | `src/app/lesson/[id]/complete.tsx` | P06 |
| 10 | Seviye atladı | `10-seviye-atladi.jpg` | `S09SeviyeAtladi.dc.html` | `src/app/level-up.tsx` | P06 |
| 11-13, 15, 16 | Ana sayfa · diğer 5 şehir | `11-13`, `15`, `16-ana-sayfa-*.jpg` | `AnaSayfa.dc.html` (`sehir`) | `src/app/(tabs)/index.tsx` (temalar) | P05 |
| 14 | Yeni şehir açıldı | `14-sehir-acildi-kapadokya.jpg` | `S10SehirAcildi.dc.html` | `src/app/city-unlocked.tsx` | P06 |
| 17 | Final · Van | `17-final-van.jpg` | `S15VanFinal.dc.html` | `src/app/finale.tsx` | P06 |
| 18 | Yolculuk haritası | `18-yolculuk-haritasi.jpg` | `S11Harita.dc.html` | `src/app/journey-map.tsx` | P07 |
| 19 | Bildirim | `19-bildirim.jpg` | `S12Bildirim.dc.html` | yerel bildirim (expo-notifications) | P08 |
| 20 | Geri dönüş | `20-geri-donus.jpg` | `S13GeriDonus.dc.html` | `src/app/welcome-back.tsx` | P08 |
| 21 | Profil ve rozetler | `21-profil.jpg` | `S14Profil.dc.html` | `(tabs)/profile.tsx` + `(tabs)/badges.tsx` | P07 |

Şehir sahneleri (ana sayfanın üstündeki çizimler) `kaynak/Sahne.dc.html` içindedir: her şehir
bir `<sc-if>` bloğunda, 390×340 `viewBox`'lı tek bir SVG. P01 bunları `react-native-svg`'ye taşır.

## Oyun kuralları (v1)

- **6 durak (şehir), sırayla:** İstanbul → İzmir → Efes → Antalya → Kapadokya → Van (Pırıl'ın
  memleketi). Her şehir 5 seviyedir: İstanbul 1-5, İzmir 6-10, Efes 11-15, Antalya 16-20,
  Kapadokya 21-25, Van 26-30.
- **Her şehirde 10 ders** (yoldaki düğümler, sıra 1-10). 5. ve 10. ders **sandık**, diğer 8'i
  **hikâye** (metni oku + 3 anlama sorusu).
- **Dersler sırayla açılır.** Bir şehrin ilk dersi, önceki şehrin 10. dersi bitince açılır.
- **Seviye** = 1 + ⌊tamamlanan ders sayısı / 2⌋, en fazla 30. Yani her 2 ders 1 seviye; bir
  şehrin 10 dersi bitince seviye bir sonraki şehrin ilk seviyesine geçer ve şehir açılır.
- **Yıldız (hikâye):** 3 soru da ilk denemede doğru → 3 yıldız; 2'si → 2; diğer → 1.
- **Lokum:** hikâye bitince 5 + ilk denemede doğru her soru için 5 (en fazla 20). Sandık 30.
  Seviye atlama 50, yeni şehir 100. Ödül yalnızca dersin **ilk** tamamlanışında verilir;
  tekrar okumak serbesttir, en iyi yıldız saklanır.
- **Seri:** Türkiye saatine göre art arda, en az bir okumanın bitirildiği gün sayısı. Bugün
  henüz okunmadıysa seri dünden sayılır ve "tehlikede" sayılır.
- **Kitaplık:** yolculukta henüz kilitli olan derslerin metinleri kitaplıkta görünmez.

## Tasarım dili

- **Yazı tipleri:** Başlık ve sayılar için **Baloo 2** (700/800), metin ve etiketler için
  **Nunito** (600/700/800). Ekrandaki başlıklar 22-34 px, seviye rakamı 72 px.
- **3B "şeker" buton:** yükseklik 56-60, köşe 18-20, yukarıdan aşağı gradyan, üstte 2 px açık
  iç parlama, altta 5-6 px koyu "dudak" (gölge rengi), ayrıca yumuşak düşen gölge. Basınca
  2-4 px aşağı iner, dudak incelir.

  | Renk | Gradyan (üst → alt) | Dudak |
  |---|---|---|
  | Mavi (ana) | `#4F7BF2 → #2453C9` | `#183A99` |
  | Mor (okuma, soru) | `#9B6BFF → #5B34D6` | `#3F22A0` |
  | Yeşil (doğru) | `#3FCB7E → #1E9E57` | `#13703D` |
  | Turuncu (ipucu) | `#F59A45 → #C9581A` | `#8F3C0E` |
  | Altın (seviye) | `#FFE07A → #FFB020` | `#B87800` |
  | Turkuaz (Kapadokya) | `#1FC7B6 → #0B8578` | `#075E56` |

- **Şehir temaları:** her şehrin zemin gradyanı, başlık kartı, yol düğümleri ve sekme rengi
  `kaynak/AnaSayfa.dc.html` dosyasının sonundaki `C` nesnesindedir (`ground`, `banner`,
  `d1-d3` biten düğüm, `a1-a3` aktif düğüm, `l1-l3` kilitli düğüm, `done`/`todo` yol rengi).
  Metinler (`baslik`, Pırıl'ın mesajı ve pozu) aynı dosyadaki `D` nesnesindedir.
- **Pırıl pozları:** `idle`, `happy`, `wave`, `read`, `talk`, `think`, `celebrate`, `sleep`.
  Ana sayfada şehir başına: İstanbul `idle`, İzmir `wave`, Efes `read`, Antalya `happy`,
  Kapadokya `think`, Van `talk`.
- **Hareket:** aktif düğümde nabız halkası, biten yolda akan beyaz noktalar, "BAŞLA!" balonu
  hafifçe zıplar, sahnelerde vapur/balon/martı gibi birkaç hareketli parça. Sistemin "hareketi
  azalt" ayarı açıksa hepsi durur.
- Tasarım yalnızca açık temadır; oyun ekranları sabit renklerini kullanır.
