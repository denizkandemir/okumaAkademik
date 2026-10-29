# T03 — Rewards, homecoming and certificate

Follow `docs/tasarim/promptlar/T-kurallar.md`. T02 must be merged.

Screens:
- `ekranlar/12-ders-sonucu.jpg`, `13-seviye-odulu.jpg`, `14-sehir-acilisi.jpg`,
  `24-eve-donus.jpg`, `25-sertifika.jpg`
- their `kaynak/ekranlar/*.html`

Code:
- `src/app/lesson/[id]/complete.tsx`, `src/app/lesson/[id]/chest.tsx`
- `src/app/level-up.tsx`, `src/app/city-unlocked.tsx`, `src/app/finale.tsx`
- `src/features/game/reward-flow.ts`, `src/features/game/reward-store.ts`
- `src/features/game/rewards/*`

## Goal

The new look for the reward flow, and a new certificate screen. The flow logic stays exactly as
it is: complete → level up → city unlocked → finale, `continueRewardFlow`, retries returning
`firstTime: true` (bulgu 1), and hardware back (bulgu 3). Read the reward flow first and keep its
order.

## Lesson result (`complete.tsx`, `12-ders-sonucu`)

- Eyebrow "BİR KEŞİF DAHA TAMAMLANDI".
- Pırıl: `celebrate` for 3 stars, `happy` otherwise; large, about 200 dp.
- The star row: filled and empty token stars, with a short pop-in that is off with reduce motion.
- Title "Hikâyeye iz bıraktın!". Subtitle: the lesson title on one line, "Bugün yeni bir şey
  keşfettin." on the next.
- Three `StatTile`s:
  - "+`n`" over "lokum"
  - "`k`/3" over "ilk denemede doğru"
  - "m:ss" over "okuma süresi"
- **Buttons:**
  - If the flow has a next reward step, show only the primary "ÖDÜLÜMÜ GÖR". There is no "map"
    button, so a level up or a new city can never be skipped by accident.
  - Otherwise, show the primary "HARİTAYA DÖN".
- **Repeat reading** (`firstTime: false`):
  - title "Yeniden okudun!"
  - the lokum tile shows the best stars as text instead ("En iyi: 3 yıldız")
- **Free reading finish view** (the component the library reading uses): the same layout with no
  stars, lokum or first-try tile; only "okuma süresi". Title "Bir hikâye daha bitti!", button
  "KİTAPLIĞA DÖN".

## Level reward (`level-up.tsx`, `13-seviye-odulu`)

- Eyebrow "KÜÇÜK ADIMLAR, BÜYÜK KEŞİFLER".
- The medal: a coin with "SEVİYE" and the new level number, using the medal tokens. It does a
  small scale-in, off with reduce motion.
- Title "Bir adım daha ileri!". Subtitle "Her hikâyeyle biraz daha güçleniyorsun."
- `RewardRow`s:
  - "+50 lokum · Seviye atladın." (use the real amount from the reward)
  - when this step also finishes a city: "<Şehir> mührü · Pasaportuna eklendi."
- The primary button follows the next step: "SONRAKİ ŞEHRİ KEŞFET" before a city unlock,
  "EVE DÖNELİM" before the finale, "DEVAM ET" otherwise.

## City unlocked (`city-unlocked.tsx`, `14-sehir-acilisi`)

- **Hero:** the top part of the city background, about 45% of the screen height, fading into
  the screen background. Pırıl `wave` stands on it.
- Eyebrow "PASAPORTUNDA YENİ BİR SAYFA".
- Title "Merhaba, <Şehir>!" with the city name from `src/design/cities.ts`.
- Text: the tagline, then "Yeni sokaklar, yeni hikâyeler, yeni arkadaşlar."
- Chips "Yeni şehir" and "+100 lokum" (the real amount).
- Primary "ŞEHRİ KEŞFET".

## Chest (`chest.tsx`, no screen in the design)

Use the level reward layout.
- Eyebrow "BİR SANDIK BULDUN".
- Pırıl `happy`, then `celebrate` once the chest is open.
- A mustard chest drawn with `react-native-svg`: a box, a lid and a gift ribbon, with the chest
  node colours.
- Primary "SANDIĞI AÇ".
- **Opening:** the lid lifts and "+30" counts up (off with reduce motion). Then a `RewardRow`
  "+30 lokum · Sandıktaki lokumlar kumbarana eklendi." appears, with the next-step button as on
  the level screen.
- Keep the phases, the error and retry state, and the back handling from the bug sweep.

## Homecoming (`finale.tsx`, `24-eve-donus`)

- **Hero:** the Van background with Pırıl `celebrate`.
- Eyebrow "PIRIL EVE DÖNDÜ".
- Title "Birlikte ne çok hikâye biriktirdik."
- Text "İstanbul'dan Van'a uzanan bu yolculuğun en güzel yanı, seninle okumaktı."
- Primary "KEŞİF SERTİFİKAM" opens `/certificate`. Secondary "YENİDEN KEŞFET" finishes the flow
  and goes home.
- Keep the stats loading and retry from the bug sweep (D7), if the screen still shows stats.

## Certificate (`src/app/certificate.tsx`, new; `25-sertifika`)

- A back `IconButton`, then the certificate card:
  - double gold border
  - "OKUMATİK"
  - a sparkle
  - "OKUMA KAŞİFİ SERTİFİKASI"
  - the child's name in Literata italic (`certificateName`)
  - "Pırıl'la altı şehrin hikâyelerini keşfetmeye, merak etmeye ve öğrenmeye adım attın."
  - a second sparkle
  - the six city names on two lines
  - the finishing date in Turkish ("27 Ekim 2026"); use the date of the last lesson if
    available, otherwise today
- **"SERTİFİKAYI İNDİR":** capture the card as a PNG and open the share sheet so the family can
  save or send it.
  - Check in the docs for the `expo` version in `package.json` which capture and sharing
    modules work in Expo Go (for example `react-native-view-shot` and `expo-sharing`), and
    install them with `npx expo install`.
  - If capture is not available in Expo Go, stop and tell me.
- **Before the journey is finished:**
  - the card shows a diagonal "ÖNİZLEME" ribbon
  - the button is disabled
  - a line says "Altı şehri bitirince senin olacak."
- The name comes from the signed-in user on the device. It is never sent anywhere new.

## Clean up

Delete the old reward visuals that are no longer imported, for example light rays, the old
celebration, the old lesson complete view and the old star row.

## Done when

- Every step of the flow works with the demo users:
  - a story with 3 stars and with 1 star, a level up, a chest (`demo.istanbul`)
  - a city unlock at the 10th lesson (`demo.sehir`)
  - the finale (`demo.van`, then `demo.final` for the finished state)
- Repeat readings and the free reading finish view work.
- The certificate can be shared from Expo Go on Android and iOS, and the preview state shows
  before the finale.
- Hardware back is checked on every step, and so are large font and reduce motion.
