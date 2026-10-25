# Yapay zekâ aşaması

Okumatik'in yapay zekâ aşamasının istekleri, araştırması ve planı.

| Dosya | İçerik |
|---|---|
| `00-istekler.md` | İsteklerin olduğu gibi kaydı ve maddeler halinde listesi |
| `01-arastirma.md` | Hızlı okuma, akıcı okuma ve okuduğunu anlama araştırması (kaynaklı) |
| `02-egzersiz-katalogu.md` | Uygulamaya eklenecek 10 egzersiz, soru türleri, zorluk ayarları |
| `03-yol-haritasi.md` | A0-A7 aşamaları, sıralama, maliyet özeti, açık kararlar |
| `04-teknoloji-ve-maliyet.md` | Kullanılacak teknolojiler, istek sayıları, öğrenci sayısına göre maliyet |

## Kısaca

- **Hedef "hızlı okuma" değil, "akıcı okuma":** hız ve anlama birlikte. Araştırmalar anlamayı
  korurken hızı katlamanın mümkün olmadığını gösteriyor.
- **Eklenen 10 egzersiz:** tekrarlı okuma ve hedef grafiği, dinle-sonra-oku, dinlerken oku,
  öbek öbek oku, hızlı kelime tanıma, Pırıl'ın ışığı (hızlandırılmış okuma), kök ve ek ustası,
  anlama stratejileri, LGS tarzı paragraf ve sözel mantık, görsel okuma.
- **Eklenmeyenler:** ortası soluk harfler (Bionic Reading benzeri), kelimelerin tek tek yanıp
  söndüğü gösterim (RSVP), göz egzersizleri. Kontrollü çalışmalarda faydaları gösterilemedi.
- **Sıra:** P06 → A0 → A1 → A2 → A3 → A4 → A5 → P07 → A6 → P08 → P09.
- **Her aşamanın promptu,** bir önceki aşama bittikten sonra kodun son hali görülerek
  `promptlar/` klasörüne yazılacak.

## Promptlar (`promptlar/`)

Her biri ayrı bir Claude Code oturumunda, sırayla çalıştırılır. Ortak kurallar
`promptlar/A-kurallar.md` dosyasında; her prompt önce onu okutur.

| Sıra | Dosya | Ne yapar | Plan modu |
|---|---|---|---|
| A0 | `A0-olcum-ve-veri-temeli.md` | Okunabilirlik puanı, sınıf grubu varyantları, soru türleri, okuma ölçümleri, seviye belirleme okuması, özet görünümler | Evet |
| A1a | `A1a-egzersiz-motoru-1.md` | Egzersiz altyapısı, "Bugünün antrenmanı", E1 tekrarlı okuma, E4 öbek, E5 hızlı kelime, E6 Pırıl'ın ışığı | Evet |
| A1b | `A1b-egzersiz-motoru-2.md` | E2/E3 seslendirme, E7 kök-ek, E8 anlama stratejileri, E9 LGS, E10 görsel okuma | Evet |
| A2 | `A2-yapay-zeka-altyapisi.md` | Claude API katmanı, `ai_requests`, bütçe ve gizlilik korumaları, toplu işlem, sahte mod | Evet |
| A3 | `A3-icerik-uretimi.md` | Üretim → kontrol → yapay zekâ incelemesi → senin onayın; sınıf varyantları ve egzersiz içerikleri | Evet |
| A4 | `A4-uyarlanabilir-plan.md` | Kurallar + yapay zekâ haftalık plan, "Yol haritam" ekranı | Evet |
| A5 | `A5-raporlar-ve-grafikler.md` | Günlük, haftalık, aylık rapor ve "Gelişimim" grafik ekranı | Hayır |
| A6 | `A6-piril-konusmalari.md` | Pırıl mesaj havuzları, özet geri bildirimi, "Sen sor" | Evet |
| A7 | `A7-kalite-ve-guvenlik.md` | Değerlendirme setleri, egzersiz etkinliği, KVKK, maliyet paneli | Hayır |

Sıra: **P06 → A0 → A1a → A1b → A2 → A3 → A4 → A5 → P07 → A6 → P08 → P09**, A7 en sonda ve
istem ya da model her değiştiğinde. A2, A0'dan hemen sonra da yapılabilir (A1'e bağlı değil).

Claude Code'a yazılacak mesaj (örnek A0):

> `docs/yapay-zeka/promptlar/A0-olcum-ve-veri-temeli.md` dosyasındaki görevi yap.

Her görev bitince telefonda dene; uygunsa "commit" de, push ve Pull Request'i sen yap.
