# T05 — Library, Passport, Profile and achievements

Follow `docs/tasarim/promptlar/T-kurallar.md`. T04 must be merged.

Screens:
- `ekranlar/20-kitaplik.jpg`, `21-pasaport.jpg`, `22-profil.jpg`, `23-rozetler.jpg`
- their `kaynak/ekranlar/*.html`

Code:
- `src/app/(tabs)/library.tsx`, `passport.tsx`, `profile.tsx`
- `src/app/badges.tsx`, `src/app/journey-map.tsx`
- `server/src/modules/texts/*`
- `GET /me/stats` (achievements, cities, week)

## Goal

The last three tabs in the new design, and the achievements screen. Data comes from the existing
endpoints. The only server change is one additive field.

## Library (`(tabs)/library.tsx`, `20-kitaplik`)

- `AppHeader`, eyebrow "HİKÂYE ÇANTAN", title "Bir sayfa daha?", text "Sevdiğin bir yere
  yeniden uğra."
- **Filter chips:** "Tüm hikâyeler" and "Okuduklarım". Use the selected style, with
  `accessibilityState.selected`.
  - "Okuduklarım" needs to know which texts the child has finished. Add `read: boolean` to the
    items of `GET /texts`: true when the user has a completed reading session for that text.
    The field is additive and gets a test.
- **Story cards:**
  - a thumbnail, which is a crop of the city background: `contentFit="cover"`, cached; use one
    image source per city
  - the title
  - "<Şehir> · `n` dakika"
  - the theme as `ThemeTag`
  - a small sage check when the story is read

  A tap opens free reading, as today.
- Stories are grouped or ordered by journey order, as today. Locked texts stay hidden.
- **Empty "Okuduklarım":** Pırıl `read` with "Henüz bitirdiğin bir hikâye yok. Haritadan ilk
  hikâyeni seçelim mi?" and a primary "YOLCULUĞA GİT".
- Keep refetch on focus (bulgu 8) and showing data on errors (bulgu 7).

## Passport (`(tabs)/passport.tsx`, `21-pasaport`)

- `AppHeader`, eyebrow "ALTI ŞEHİR, BİR BÜYÜK MACERA", title "Keşif pasaportun", text "Her
  şehirde bir hikâye. Her hikâyede yeni bir iz."
- **City cards** in a 2-column grid of 6, in journey order. Each has the city background as a
  thumbnail (positioned near the top, as in the HTML), "`0n` · DURAK" and the name. Status comes
  from `GET /me/journey` or `/me/stats` cities:

  | Status | Look |
  |---|---|
  | current | accent border, status "ŞU ANDA BURADASIN" |
  | done | status "TAMAMLANDI" with a small seal check |
  | locked | thumbnail greyscale and dimmed, a lock icon, status "KİLİTLİ" |

- **Taps:**
  - An open or done city switches the Yolculuk tab to that city (T01's mechanism) and goes
    there.
  - A locked city shows a small sheet: "<Önceki şehir accusative> bitirince açılır." and
    "Tamam".
- The old journey map screen (`journey-map.tsx`) is now unused. Delete it and redirect any links
  to the Pasaport tab.

## Profile (`(tabs)/profile.tsx`, `22-profil`)

- `AppHeader`, then a row: eyebrow "SENİN YOLCULUĞUN", title "Merhaba, <Ad>!", and the settings
  `IconButton` (sliders), which opens `/settings`. Remove the temporary entry from T04.
- **Passport card:**
  - Pırıl `idle`, small
  - the name
  - "<UNVAN> · `n`. SINIF", where the title depends on the current city:

    | City | Title |
    |---|---|
    | İstanbul | Yeni kaşif |
    | İzmir | Meraklı okur |
    | Efes | Bilge gezgin |
    | Antalya | Cesur kaşif |
    | Kapadokya | Hayalperest okur |
    | Van | Usta kaşif |
    | finished | Okuma kaşifi |

  - the line "OKUMATİK / KEŞİF PASAPORTU" in the eyebrow style
- **Three `StatTile`s:** "hikâye okundu" (`storiesDone`), "lokum", and "günlük seri" (current
  streak). The design's "örnek gün serisi" is a demo label.
- **"Şehir mühürlerin":** a 3×2 grid of round seals.
  - Each seal is a circular crop of the city background with the gold double ring from the
    HTML, and the city name under it.
  - Earned (city done): full colour.
  - Not earned: greyscale and faded.
  - Each has a label such as "İstanbul mührü, kazanıldı".
- **"Küçük büyük başarılar":** the first 3 achievements from `stats.achievements`, earned ones
  first.
  - Each is a row with an icon, a title, and a description or progress ("0 / 6 şehir
    hikâyesi").
  - Then a text link "Tümünü gör" that opens `/badges`.
- **Secondary "SERTİFİKAYI ÖNİZLE"** opens `/certificate` (T03).

## Achievements (`src/app/badges.tsx`, `23-rozetler`)

- A back `IconButton`, eyebrow "YOLCULUĞUN HATIRALARI", title "Küçük başarılar".
- The same passport card and stat tiles as the profile, using a shared component.
- **The full achievement list:**
  - earned achievements first, with the date if the API has it
  - then the rest with their progress
  - not-earned icons are muted, but the text still meets contrast

## Clean up

Delete the old profile, badges, library and map pieces that are no longer imported.

## Done when

- All four screens match their screenshots for `demo.istanbul` (early) and a late demo user
  (many seals and achievements), on a small and a large phone.
- Switching city from the Passport works, and locked cities explain themselves.
- The library filter works, and the `read` field has a passing test.
- Lint, tsc, server tests, large font and reduce motion are checked.
