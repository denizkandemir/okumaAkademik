# T01 — Yolculuk (home map) and the lesson card

Follow `docs/tasarim/promptlar/T-kurallar.md`. T00 must be merged.

Screens:
- `ekranlar/01`-`06-yolculuk-*.jpg`
- `07-ders-karti.jpg`
- the matching `kaynak/ekranlar/*.html`

Code:
- `src/app/(tabs)/index.tsx`
- `src/features/game/home/*`
- `src/features/game/use-journey.ts`
- `src/features/game/current-city.tsx`
- `src/app/lesson/[id]/index.tsx`

## Goal

The home tab becomes the design's painted city map, and the lesson card becomes the design's
bottom sheet. Data, navigation and rules stay the same: `GET /me/journey` (with `?city=`), the
lesson routes, and the scroll fix from the bug sweep (bulgu 9).

## Home (`src/app/(tabs)/index.tsx`)

From top to bottom:

1. **`AppHeader`** (from T00).
2. **Chapter bar:**
   - eyebrow "`n`. DURAK · SEVİYE `x`"
   - the city name
   - a square map button that opens the Pasaport tab
3. **Map**, full width.
   - The city background (`src/design/cities.ts`) covers the whole map: `contentFit="cover"`,
     centred. The light wash gradient from the HTML sits on top.
   - Map height is about 3.2 × screen width; tune it so 10 nodes have room. The image is scaled
     up; that is fine for this painted style.
   - **Path:** one smooth curve through the 10 node centres with `react-native-svg`. Draw a wide
     light base stroke and the dotted line from the HTML.
   - **Node positions:** for each city, write 10 normalised positions (x 0-1, y as a fraction of
     map height) in a pure, documented `map-layout.ts`.
     - Look at that city's background so the nodes follow the painted sandy road or open
       ground.
     - The map title card, Pırıl and the labels must not cover the main landmarks (Galata, the
       bridge, the clock tower, the library, the harbour, the balloons, the church on the
       island).
     - Keep one pure helper that turns the positions into pixel coordinates and the path for a
       given width.
   - **Nodes** (README "Harita düğümleri"; sizes and lips from the tokens):

     | Node | Look |
     |---|---|
     | done | sage with a check |
     | current | terracotta, a ring with a gentle pulse (off with reduce motion), book icon |
     | locked | beige with a lock |
     | position 5 | chest node with the gift icon |
     | position 10 | medal node with the award icon, the city's last stop |

     A chest that is done shows the done look with its own icon. Each node has a 48 dp hit area
     and a label such as "Ders 3, Galata'nın Minik Misafiri, şu anki ders" or "Ders 1, bitti,
     3 yıldız".
   - **Current node:**
     - Above it, a small label: "HADİ OKUYALIM", or "SANDIĞI AÇ" for a chest.
     - Below it, a tag: "<tema> · `n` dk" for a story, or "+30 lokum" for a chest.
   - **Map title card,** top left:
     - eyebrow "BÖLÜM 0`n`" (city number)
     - the city's chapter title
     - a progress bar
     - "`x` / 10 ders tamamlandı"
   - **Pırıl** stands next to the current node, on the side with more room, with the city's
     pose from the README. A speech bubble from the design:
     - story: "Yeni bir hikâye bizi bekliyor."
     - chest: "Bir sandık buldum! Hadi açalım."
     - viewing a finished city: "Bu şehri bitirdin! Sıradaki durak seni bekliyor."
     - journey finished: "Yolculuğu tamamladık! Sertifikan seni bekliyor." with pose
       `celebrate`

     Tapping Pırıl keeps the mascot's own tap reaction.
   - **Landmark note:** the city's note in Literata italic, in a quiet spot (from the HTML).
4. **"Sonraki durak" card** at the end of the map:
   - eyebrow "SONRAKİ DURAK", the next city's name, and the link "Şehri önizle ↗".
   - The link opens a small sheet with:
     - a thumbnail of that city's background
     - the name and tagline
     - "<Önceki şehir accusative> bitirince açılır." if it is still locked
     - "Tamam"
   - For Van, the card says "SON DURAK · Eve dönüş". When the journey is finished, the link is
     "Sertifikamı gör ↗"; the screen comes in T03, so route to `/certificate` only if it exists
     and otherwise hide the link.

## Behaviour

- **Opening the home tab:** it scrolls so the current node sits in the upper third, using the
  bulgu 9 logic. When the city changes, it scrolls again.
- **Another city:** Pasaport can open another unlocked city (T05), through the existing current
  city context or a route param. While another city is shown, a small chip "Şu anki durağa dön"
  appears under the chapter bar.
- **Taps:**
  - A done or current node opens the lesson card.
  - A locked node shows a short speech bubble from Pırıl: "Önce önceki dersi bitirelim."
- **Loading, error, retry and refetch on focus** keep working and use `StateView`.
- **Performance:**
  - one background image, with the path and nodes memoised by layout and statuses
  - no re-render of the whole map on every scroll event

## Lesson card (`src/app/lesson/[id]/index.tsx`, form sheet as today)

Follow `07-ders-karti`:
- `SheetHeader`
- eyebrow "<ŞEHİR> · DERS `n`"
- the title
- the description from `lesson.summary`. If it is empty, use: "Kısa bir hikâye oku. Pırıl'ın
  üç sorusunu yanıtla. Pasaportunda yeni bir iz bırak."
- chips "`n` dakika", "3 soru", "+`maxLokum` lokum"
- the primary button "OKUMAYA BAŞLA"

States:
- **Done story:** the lokum chip says "Alındı". Show the best stars with token stars, and the
  button says "TEKRAR OKU".
- **Chest:** a mustard chest illustration (gift icon), the text "Sandığı aç, lokumları topla!",
  and the button "SANDIĞI AÇ". A done chest says "Bu sandığı açtın! Lokumların kumbarada." and
  shows "Tamam".
- **Errors and locked lessons:** the same behaviour as today, with the new look.
- **Pırıl:** pose `read`, small, next to the title.

## Clean up

Delete the old home pieces that nothing uses any more, for example the city banner, the old path
and its layout, and the old node. Do not delete the SVG city scenes if another screen still uses
them; T06 does that.

## Done when

- All six cities look like their screenshots, with 10 nodes on the painted road, on a small and
  a large phone.
- The current node is in view after opening the app and after finishing a lesson.
- The lesson card matches the design for a story, a done story, a chest and a done chest.
- Large font and reduce motion are checked.
