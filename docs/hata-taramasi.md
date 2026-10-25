# Hata taraması (P00–P06)

Yapay zekâ aşamasına (`docs/yapay-zeka`) geçmeden önce `src/` ve `server/src/` gerçek hatalar için
tarandı. Gerçek hata şu demek: yanlış sonuç, çökme, veri kaybı, takılan ekran, yanlış ödül ya da
güvenlik açığı.

**Yöntem**
- Üç paralel tarama yapıldı; her bulgu kod okunarak tek tek doğrulandı.
- Sunucu bulguları önce kırmızı bir Vitest testiyle gösterildi, sonra düzeltildi.
- Uygulama tarafında test altyapısı yok; her düzeltme için telefon adımları aşağıda.

**Önem**
- **Kritik:** veri kaybı, yanlış ödül, güvenlik.
- **Yüksek:** çocuk takılıyor.
- **Orta:** kendiliğinden düzelen kötü deneyim; nadir olsa da çocuğu takılı bırakanlar da buraya
  alındı.
- **Düşük:** nadir uç durum.

**Kritik bulgu çıkmadı:** lokum ve yıldız hiçbir senaryoda iki kez yazılmıyor, kullanıcılar
birbirinin verisine erişemiyor.

Önceden bilinen okuma oturumu hatası (`reading-session.ts`: oturum başlatılamazsa bir daha
denenmiyordu) bu taramadan önce düzeltilmişti. Aynı kalıp (kalıcı saklanan hata ya da hiç yeniden
denenmeyen tek atımlık istek) tüm kodda arandı: 1, 2 ve 7 numaralı bulgular bu kalıba giriyor.

## Bulgular

| No | Önem | Dosya | Sorun | Nasıl olur | Durum |
|---|---|---|---|---|---|
| 1 | Yüksek | `server/src/modules/journey/lessons.routes.ts` | Tamamlama yanıtı kaybolup istek yeniden gönderilince sunucu `firstTime:false` dönüyordu. | Son soruda DEVAM ET → sunucu kaydediyor, yanıt kopuyor → tekrar DEVAM ET → lokumsuz "Ders tamamlandı"; seviye, şehir ve final ekranları kalıcı olarak atlanıyor. Sandıkta "daha önce açmıştın" yazıyordu. Bakiye doğruydu. | **Düzeltildi.** Aynı deneme yeniden gelirse (hikâyede aynı okuma, sandıkta 10 dakika içinde) yanıt ilk tamamlamada yazılan `lokum_entries` satırlarından ve `lesson_completions.stars`'tan kuruluyor; yeni satır yazılmıyor. |
| 2 | Yüksek | `src/app/lesson/[id]/chest.tsx` | Sandık ekranı ders bilgisini alamazsa hata göstermiyordu; buton hep pasifti. | Zayıf ağda SANDIĞI AÇ → "Sandığa dokun…" yazıyor ama hiçbir şey olmuyor. | **Düzeltildi.** Hata balonu ve TEKRAR DENE; kilitli ya da bulunamayan derste Tamam. |
| 3 | Yüksek | Ödül ekranları, `chest.tsx` | Android geri tuşu, ve sandık açıldıktan sonra X, ödül akışını yarıda kesiyordu. Finale başka bir yerden açılamadığı için sertifika kalıcı kayboluyordu. | "Ders tamamlandı", sandık ya da seviye ekranında geri → doğrudan ana sayfa. | **Düzeltildi.** Yeni `useHardwareBack` hook'u eklendi; ödül ekranlarında geri = DEVAM ET. Sandıkta açılırken geri yok sayılıyor; açıldıysa X ve geri akışa devam ediyor. |
| 4 | Yüksek | `src/app/lesson/[id]/quiz.tsx` | Android geri tuşu soru ekranını onay sormadan kapatıyordu. | Soruların ortasında geri → ana sayfa; dersi bitirmek için hikâyeyi baştan okumak gerekiyor. | **Düzeltildi.** Geri tuşu onay penceresini açıyor. |
| 5 | Orta | `server/src/modules/progress/progress.routes.ts` | PATCH önce okuyup sonra yazıyordu; eşzamanlı bir `completed:false`, `completed:true`'nun üstüne yazabiliyordu. Testte de gerçekleşti. | Arka plana geçince ara kayıt gidiyor, çocuk hemen BİTİRDİM'e basıyor → oturum bitmemiş kalıyor → sorulardan sonra `READING_NOT_FINISHED`. | **Düzeltildi.** İşlem içinde satır kilidi (`SELECT … FOR UPDATE`); süre artık geri gitmiyor. |
| 6 | Orta | `progress.routes.ts`, `src/features/reading/reading-session.ts` | 4 saati aşan ya da cihaz saati geri gidince negatife düşen süre 400 alıyordu; BİTİRDİM bir daha başarılı olmuyordu. | Kilitlenmeyen tablette okuma ekranı açık unutuluyor → ertesi gün her BİTİRDİM'de hata. | **Düzeltildi.** Sunucu üst sınırda reddetmek yerine kırpıyor; istemci süreyi dilim dilim `Math.max(0, …)` ile topluyor. |
| 7 | Orta | `src/hooks/use-api-query.ts`, `src/app/(tabs)/library.tsx` | Arka plan tazelemesi başarısız olunca ekrandaki veri siliniyordu. Kitaplık, veri varken bile listeyi gizleyip hata gösteriyordu. | Ders bitip ana sayfaya dönerken bağlantı kopuyor → yol kayboluyor, TEKRAR DENE'ye basılana kadar hata kalıyor. | **Düzeltildi.** Hata gelince aynı yolun verisi korunuyor. `useApiQuery` kullanan her ekran kontrol edildi: ana sayfa, ders kartı, soru ve okuma zaten veriyi önce gösteriyordu; kitaplık düzeltildi; sandık ve finaldeki yeni hata dalları veriden sonra geliyor. |
| 8 | Orta | `src/app/(tabs)/library.tsx` | Kitaplık ders bitince tazelenmiyordu. | Yeni açılan hikâyeler uygulama yeniden açılana kadar listede görünmüyordu. | **Düzeltildi.** `refetchOnFocus: true`. |
| 9 | Orta | `src/app/(tabs)/index.tsx` | Ana sayfa odak düğüme yalnızca içerik boyu değişince kayıyordu; her şehirde 10 ders olduğu için boy hiç değişmiyordu. | Yeni şehir açılınca 1. ders ve Pırıl başlığın altında saklı kalıyordu. | **Düzeltildi.** Odak değişince (yol ölçülmüşse) kaydıran bir effect eklendi. |

## Düşük öncelikli bulgular

| No | Dosya | Sorun | Durum |
|---|---|---|---|
| D1 | `reading/[id].tsx`, `quiz.tsx` | Yükleme sürerken X ya da geri ile çıkılırsa istek bitince uygulama kendiliğinden soru veya ders sonu ekranına gidiyordu. | **Düzeltildi.** Yükleme sürerken X ve geri yok sayılıyor. Okumada geri tuşu diğer zamanlarda X ile aynı (ilerleme varsa onay soruyor). Ekran kapandıysa yönlendirme yapılmıyor (iOS kaydırma için). |
| D2 | `lesson/[id]/index.tsx`, `chest.tsx` | Geçmiş yokken (derin bağlantı, web yenileme) `router.back()` hiçbir şey yapmıyordu. | **Düzeltildi.** Geri gidilecek ekran yoksa ana sayfaya gidiliyor. |
| D3 | `(auth)/login.tsx`, `(auth)/register.tsx` | Düğmeye ve klavyedeki "git"e birlikte basılınca iki istek gidiyordu. | **Düzeltildi.** |
| D4 | `(auth)/register.tsx` | Kayıt yanıtı kaybolursa tekrar denemede "kullanıcı adı alınmış" çıkıyor. | Bırakıldı (nadir; çocuk başka bir ad seçebiliyor). |
| D5 | `quiz.tsx` | Cevap yanıtı kaybolursa tekrar denemede "+5 lokum" gösterilmiyor; gerçek ödül doğru. | Bırakıldı (yalnızca gösterim). |
| D6 | `features/auth/auth-context.tsx` | Çıkışta ödül deposu temizlenmiyordu. | **Düzeltildi.** |
| D7 | `finale.tsx` | İstatistik hatası yok sayılıyordu ("–" gösteriliyor, yeniden deneme yok). | **Düzeltildi.** Sertifikanın altında açıklama ve TEKRAR DENE. |
| D8 | `progress.routes.ts` | Bitmiş oturuma gelen geç kayıt `endedAt`'i, dolayısıyla seri gününü kaydırıyordu. | **Düzeltildi.** Bitmiş oturumda `endedAt` korunuyor. |
| D9 | `progress.routes.ts` | Günlük ve toplam dakika, API ile çok sayıda oturum açılarak şişirilebiliyor (lokum etkilenmiyor). | Bırakıldı: **A7'de ele alınacak.** |
| D10 | `plugins/rate-limit.ts`, `auth.routes.ts` | Kullanıcı adı değiştirilerek kayıt/giriş sınırsız denenebiliyordu (her denemede scrypt). | **Düzeltildi.** IP başına ek sınır eklendi: `AUTH_IP_RATE_LIMIT_MAX` (varsayılan 100) ve `AUTH_IP_RATE_LIMIT_WINDOW` (15 dakika). Okul NAT'ı için cömert tutuldu; `server/.env.example`'a eklendi. |
| D11 | `prisma/seed.ts` | Paylaşılan bir veritabanında seed, örnek ve demo hesapların şifresini sıfırlayıp verisini siliyordu. | **Düzeltildi.** Kullanıcılar yalnızca yerel veritabanında (`localhost`, `127.0.0.1`, `::1`) ya da `SEED_DEMO=1` ile yazılıyor, aksi halde bir mesajla atlanıyor. İçerik her zaman eşitleniyor. |
| D12 | `finale.tsx` | Web'de `navigator.share` yoksa paylaş düğmesi sessizce hiçbir şey yapmıyor. | Bırakıldı (yalnızca bazı masaüstü tarayıcılarda). |
| D13 | Çift dokunma | Korumalar state tabanlı; yoldaki düğümde ve OKUMAYA BAŞLA'da hiç koruma yok. | Bırakıldı (sunucu idempotent; 1 numaralı düzeltmeden sonra ödül ekranı da doğru). |

## Şüpheliler ve kararlar

| No | Konu | Durum |
|---|---|---|
| S1 | "İlk deneme" okuma oturumu başına sayılıyordu: yanlış cevap → çık → yeniden oku → hepsi doğru → 3 yıldız. | **Kural değişti.** İlk deneme artık dersin ilk tamamlanmasından önce o soruya verilen ilk cevap; hangi okumada verildiği fark etmiyor. `/answers`'taki lokum ile complete'teki yıldız ve lokum aynı kurala uyuyor. Tekrar okumalar eskisi gibi. Şema açıklaması (yalnızca `COMMENT ON TABLE` içeren bir migration ile) ve `server/docs/veritabani.md` güncellendi. |
| S2 | Ödül akışı sonunda `clearReward` → `<Redirect>`: `dismissTo('/')` ardından bir de `replace('/')` çalışıp sekmeleri yeniden kurabilir. | Telefonda denenecek (aşağıda). |
| S3 | 1. ders şu anki dersken Pırıl'ın balonu sahnenin ya da şehir kartının altında kalabilir. | Telefonda denenecek (aşağıda). |
| S4 | `src/lib/api.ts`: çıkış ile yeni giriş arasında yolda kalan bir 401, yeni kullanıcıyı çıkışa atabilir. | Not: çok sıkı bir zamanlama gerekiyor. |
| S5 | `\u0000` içeren girdi Postgres'te reddedilip 500 dönüyordu. | **Düzeltildi.** Hata işleyici SQLSTATE `22021`'i 400'e çeviriyor. |
| S6 | `src/lib/api.ts`: IPv6 ya da tünel adresinde yanlış URL oluşuyor; release'te `EXPO_PUBLIC_API_URL` yoksa `localhost`'a düşüyor; Android release'te `http` engelli. | Not: EAS aşamasında yapılandırılacak. |
| S7 | `auth-context.tsx`: cihaz depolamasına yazma başarısız olursa giriş başarılıyken hata gösteriliyor. | Not: nadir. |

## Eklenen ve değişen testler (`server/test/`)

Sonuç: 139 testten 151 teste çıkıldı. Yeni testlerin hepsi düzeltmeden önce kırmızıydı.

- **`lessons.test.ts`**
  - Yanıtı kaybolan tamamlama aynı okumayla yeniden gelince aynı ödülü `firstTime:true` ile döner;
    defter ve bakiye değişmez; önceki dersin satırı karışmaz.
  - Sandık 10 dakika içinde tekrar edilirse aynı ödül döner (`cityUnlocked: 'izmir'`). 1 gün sonra
    tekrar sayılır.
  - İlk deneme okumadan bağımsız: yanlış → yeniden oku → hepsi doğru →
    - gösterilen lokum `[0, 5, 5]`;
    - 2 yıldız, 15 lokum;
    - tekrar gönderimde `bestStars` 2 kalır.
  - **Değişti:** "aynı anda gelen iki istek" artık iki yanıtta da `firstTime:true` bekliyor (lokum
    satırı yine 1).
- **`progress.test.ts`**
  - Eşzamanlı PATCH'lerde bitmiş oturum bitmemiş olmaz. Düzeltmeden önce yarış gerçekten oluştu.
  - Geç gelen eski kayıt süreyi düşürmez.
  - 14 401 sn → 200 ve 14 400.
  - Bitmiş oturumda `endedAt` korunur.
- **`auth.test.ts`**
  - IP başına sınır: farklı kullanıcı adlarıyla 100 deneme sonrasında 429 (kayıt ve giriş ortak).
  - `\u0000` → 400.
- **`seed-guard.test.ts` (yeni):** yerel adresler (`[::1]` dahil) izinli, uzak adres yalnızca
  `SEED_DEMO=1` ile, bozuk adres reddedilir.

Seed koruması test veritabanında ayrıca elle çalıştırıldı:
- `127.0.0.2` adresiyle kullanıcılar atlanıyor.
- Aynı adres `SEED_DEMO=1` ile ve `localhost` ile kullanıcılar yazılıyor.

**Kontroller:**
- Kök dizinde `npx expo lint` ve `npx tsc --noEmit` temiz.
- `server/` içinde `npm run typecheck`, `npm run lint` ve `npm test` temiz.

## Telefonda denenecekler

Demo kullanıcıların şifresi `okuma123`. `npm run db:seed` demo verisini sıfırlar.

**Bağlantı kopmasını taklit etmek için:** Postgres kapsayıcısını durdurup sürdürün:
`docker pause okumatik-postgres-1` / `docker unpause okumatik-postgres-1`. Sunucu istekleri
bekletir, uygulama 15 sn sonra "Sunucuya ulaşılamadı" der.

1. **Kaybolan tamamlama yanıtı (1):** `demo.sehir` ile girin.
   - 10. dersi (sandık) açın, sandık ekranına geçin, `docker pause` → sandığa dokunun.
   - 15 sn sonra hata görünür. `docker unpause` → tekrar dokunun.
   - "+30 lokum" görünmeli, "daha önce açmıştın" görünmemeli. DEVAM ET → seviye atladı → İzmir
     açıldı ekranları gelmeli.
   - Aynısını bir hikâyenin son sorusunda DEVAM ET ile deneyin: ders sonunda lokum görünmeli.
2. **Sandık yükleme hatası (2):** `demo.istanbul` ile 5. ders (sandık) kartını açın, uçak modunu
   açın, SANDIĞI AÇ.
   - Sandık ekranında "sandığı getiremedim" balonu ve TEKRAR DENE görünmeli.
   - Uçak modunu kapatıp TEKRAR DENE → SANDIĞI AÇ düğmesi gelmeli, sandık açılmalı.
3. **Android geri, ödül akışı (3, D2):** `demo.sehir` ile 10. sandığı açın.
   - Açılırken geri → hiçbir şey olmamalı.
   - Açıldıktan sonra geri (ya da X) → seviye atladı ekranı gelmeli. Geri → yeni şehir ekranı.
     Geri → ana sayfa.
   - Bir hikâye bitince "Ders tamamlandı"da geri, DEVAM ET gibi davranmalı.
   - Sandık açılmadan X ya da geri → ana sayfa.
4. **Finale geri ve istatistik hatası (3, D7):** `demo.final` kullanıcısının son sandığını geri
   alın:
   ```sql
   DELETE FROM lokum_entries
   WHERE user_id = (SELECT id FROM users WHERE username = 'demo.final') AND lesson_id = 'van-10-sandik';
   DELETE FROM lesson_completions
   WHERE user_id = (SELECT id FROM users WHERE username = 'demo.final') AND lesson_id = 'van-10-sandik';
   ```
   - Van'ın 10. sandığını açın, DEVAM ET'e basmadan uçak modunu açın, sonra DEVAM ET.
   - Finalde "Hikâye ve dakika sayılarını getiremedim" ve TEKRAR DENE görünmeli. Uçak modunu
     kapatıp TEKRAR DENE → sayılar gelmeli.
   - Android geri → ana sayfa (akış biter).
5. **Android geri, sorular (4, D1):** bir hikâyeyi bitirin, bir soruyu cevaplayın.
   - Geri → "Soruları bırakmak istiyor musun?" penceresi. Tekrar geri → pencere kapanmalı, sorular
     kalmalı.
   - Son soruda `docker pause` → DEVAM ET → yüklenirken X ve geri hiçbir şey yapmamalı.
     `docker unpause` sonrası ders sonu ekranı gelmeli; 15 sn dolup hata çıktıysa DEVAM ET'e tekrar
     basın, lokumlu ders sonu ekranı gelmeli.
6. **Okuma ekranı (D1):**
   - Biraz kaydırıp Android geri → "Okumayı bırakmak istiyor musun?" penceresi.
   - Hiç kaydırmadan geri → doğrudan çıkış.
   - `docker pause` → BİTİRDİM → yüklenirken X ve geri hiçbir şey yapmamalı.
   - Serbest okumada bitiş ekranında geri → kitaplık.
7. **Cihaz saati (6):** bir hikâyeyi 1 dakika okuyun.
   - Ayarlardan otomatik saati kapatıp saati 1 saat geri alın → BİTİRDİM hata vermemeli.
   - Sonra saati düzeltin.
8. **Tazeleme hatası (7):** ana sayfa açıkken uçak modunu açın, Kitaplık sekmesine geçip geri
   dönün.
   - Yol ve çipler yerinde kalmalı, hata ekranı çıkmamalı.
   - Kitaplıkta da liste kalmalı.
9. **Kitaplık tazeleme (8):** Kitaplığı bir kez açın, ana sayfada bir hikâye dersini bitirin,
   Kitaplığa dönün → bir sonraki dersin hikâyesi listede olmalı.
10. **Ana sayfa kaydırma (9):** `demo.sehir` ile girin; sayfa 10. sandığa kaymış olmalı.
    - Sandığı açıp akışı bitirin → İzmir yolunda 1. ders ekranın ortasında olmalı.
    - Bir ders daha bitirince yeni şu anki ders ortaya gelmeli.
11. **Derin bağlantı (D2):** uygulama kapalıyken kilitli bir dersi bağlantıyla açın, örneğin Expo
    Go'da:
    ```
    adb shell am start -a android.intent.action.VIEW -d "exp://<bilgisayar-IP>:8081/--/lesson/istanbul-05-sandik"
    ```
    Yeni bir hesapla açın. Kartta "kilitli" mesajı → Tamam → ana sayfa açılmalı.
12. **Çift giriş (D3):** giriş ekranında GİRİŞ'e basıp hemen klavyede "git"e basın → sunucu
    kaydında tek bir `POST /auth/login` görünmeli.
13. **Yeni ilk deneme kuralı (S1):** yeni bir hesapla 1. hikâyeyi okuyun.
    - İlk soruya yanlış cevap verin, X → Bırak.
    - Hikâyeyi yeniden okuyup hepsini doğru cevaplayın: ilk soruda "+5 lokum" görünmemeli, ders
      sonunda 2 yıldız ve 15 lokum olmalı.
14. **S2:** `demo.izmir` ile bir ders bitirip akışı DEVAM ET ile tamamlayın. Ana sayfaya dönerken
    şunlara bakın:
    - Sekme hapı bir an İstanbul rengine dönüyor mu?
    - Sayfa başa sarılıp yeniden yükleniyor mu?
    - Olursa not edin; ayrı bir düzeltme gerekir.
15. **S3:** yeni bir hesap açın (1. ders şu anki ders).
    - Ana sayfada Pırıl'ın balonu görünüyor mu?
    - Kilitli bir derse dokununca "Önce önceki dersi bitirelim!" balonu görünüyor mu?
    - Görünmüyorsa not edin.

## A0 için not

A0'da **ders kimlikleri değişmemeli** (ör. `istanbul-03-minik-serce`). Seed, artık olmayan ders
kimliklerini siler; bu silme, kullanıcıların o dersteki tamamlamalarını da siler (D11).
- Yolculuk zincirinde boşluk oluşur.
- Ders yeniden bitirilince ödüller ikinci kez verilebilir.
- Metin içeriği değişebilir; kimlik aynı kalmalı.
