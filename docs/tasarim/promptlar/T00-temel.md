# T00 — Design foundation

Follow `docs/tasarim/promptlar/T-kurallar.md`. Read `docs/tasarim/README.md` completely, look at
all 25 screenshots in `docs/tasarim/ekranlar/`, and skim `docs/tasarim/kaynak/tasarim.css`.

The `expo` version in `package.json` must be 58 or newer, because the phone's Expo Go needs it.
If it is still 57, stop and tell me.

## Goal

Build everything the next tasks share: tokens, fonts, icons, base components, the new 4-tab bar,
city data and the story theme on the server. Do not restyle other screens yet, apart from the tab
bar. Mixed old and new looks until T05 are expected.

## App

1. **Fonts.** Install `@expo-google-fonts/nunito-sans` and `@expo-google-fonts/literata` with
   `npx expo install`.
   - Load Nunito Sans 400, 600, 700, 800 and 900, and Literata 400, 400 italic and 600, where the
     fonts load today. The splash screen keeps waiting for fonts.
   - Keep the old fonts for now; T06 removes them.
   - Take the exact export names from the installed packages.
2. **Tokens** in `src/design/tokens.ts`. The file is self-contained, with no imports, so a Node
   script can read it.
   - Colours: one semantic name per role in the README colour table, always the "Uygulama"
     value. Examples: `background`, `surface`, `text`, `textMuted`, `eyebrow`,
     `primary.face/lip/text`, `node.done/current/locked/chest/medal` with fill, lip and icon,
     `feedback.wrong/right`, `option.*`, `star`, `tab.*`, `readingText`.
   - Font family names.
   - A named type scale following the README sizes: `brand`, `display`, `title`, `cityTitle`,
     `sheetTitle`, `question`, `heading`, `body`, `bodyStrong`, `secondary`, `eyebrow`, `button`,
     `tab`, `mapLabel`, `reading`, `landmark`, `certificateName`.
   - Spacing, radii, and the button and node "lip" sizes.
3. **Contrast check.** Add `scripts/check-contrast.mjs` and `npm run design:contrast`.
   - It reads the colour pairs used for text and icons (list them in the script, referencing
     token names) and fails below 4.5:1 for text, or 3:1 for large text and icons.
   - Use no dependency. Run it with Node 22, using `--experimental-strip-types` if you import
     the TS file.
4. **City data** in `src/design/cities.ts`, one entry per city from the README "Şehir verileri"
   table:
   - number, name, chapter title, tagline, landmark note, home pose, locative and accusative
     forms
   - `background: require('@/assets/cities/<city>.webp')` (the files are already in
     `assets/cities/`)

   Reuse the existing `CityId` type. Where the old `CITY_INFO` duplicates these fields, new code
   reads `src/design/cities.ts`.
5. **Icons** in `src/design/icons.tsx`: 24×24 stroke icons with `react-native-svg`, copied from
   the SVG paths in `docs/tasarim/kaynak/ekranlar/*.html`. Props: `size`, `color`, `strokeWidth`.
   - map, book, award (passport), user, lock, check, gift, back chevron, close, sliders
     (settings), clock
   - the filled flame and hexagon (lokum)
6. **Components** in `src/design/components/`. Each is accessible and uses tokens only.
   - `AppText`: `variant` from the type scale.
   - `Screen`: background, safe area, optional scroll, and a short "appear" animation that is off
     with reduce motion.
   - `AppHeader`: logo, streak, lokum, and an avatar with the name's first letter that opens the
     Profile tab.
     - It reads data from the existing hooks. If no hook gives streak, lokum and name together,
       add one small shared hook that refetches on focus.
     - Numbers have accessibility labels ("9 günlük seri", "560 lokum").
   - `TabBar`: 4 items with icon and label, and an active pill. See the next step.
   - `Button`:
     - `primary` and `secondary` variants
     - pressed, disabled and loading states
     - the lip pressed effect with Reanimated
     - haptics like the old `GameButton`
     - full width by default
   - `IconButton`: square 44-48 dp, for back, close and settings.
   - `Card`, `Chip` (info chip), `ThemeTag`, `Eyebrow`, `ProgressBar`.
   - `OptionCard`: letter badge and states `default`, `selected`, `correct`, `wrong`,
     `disabled`.
   - `FeedbackPanel`: `wrong` and `right`, with a title, text and optional extra line.
   - `SheetHeader`: handle and close button, for form sheets.
   - `StatTile`, `RewardRow`, `SpeechBubble` (with a tail side), `TextField` (label, error,
     secure toggle), `ToggleRow`, `ConfirmDialog`.
   - `StateView`: Pırıl `think` with a message and "TEKRAR DENE", for errors and empty states.
     It has the same API as the current query state component, so screens can switch.
7. **Tabs.** Replace the floating tab bar with the new `TabBar`. Use the same headless tabs
   approach as today, and check the docs for the SDK.
   - Tabs in order:
     - Yolculuk (`index`)
     - Kitaplık (`library`)
     - Pasaport (new `src/app/(tabs)/passport.tsx`)
     - Profil (`profile`)
   - Until T05, Pasaport renders the existing journey map content. Reuse its component; do not
     copy it.
   - "Rozetler" leaves the tab bar. Move it to a stack route `src/app/badges.tsx` (content
     unchanged until T05) and link to it from the profile screen. Keep old links working, or
     redirect them.
8. **Developer showcase** at `src/app/dev/design.tsx`, reachable from the existing dev menu
   (`__DEV__` only, like the other dev screens). It shows:
   - colour swatches with their contrast values
   - the type scale
   - every component in every state
   - all icons
   - the six city cards with their backgrounds

## Server: story theme

The design shows a theme on each story ("Arkadaşlık", "Merak", "Keşif"…), on the map, the reading
screen and the library.

1. Add an enum `TextTheme` with Turkish ids and labels. Start from: Arkadaşlık, Merak, Keşif,
   Paylaşmak, Cesaret, Yardımlaşma, Sabır, Doğa, Aile, Hatıralar, Sorumluluk. Add at most 3
   more if the stories need them, as words a 7-year-old knows.
2. Add a `texts.theme` column, `NOT NULL`. In the migration:
   - add the column as nullable
   - `UPDATE` the 48 existing texts by id with the same mapping as the seed data
   - set it to `NOT NULL`

   A fresh database runs the migration before the seed, so the updates touch no rows there.
   Add the Turkish comment.
3. Label all 48 texts in the seed data **by reading each story**. Choose the theme a child would
   recognise. Do not guess in code. A test checks that every seeded text has a theme.
4. Add `theme` (the Turkish label) to these responses, as additive fields only:
   - `GET /texts`
   - `GET /texts/:id`
   - the `text` in `GET /lessons/:id`
   - story lessons in `GET /me/journey`. Also add `estimatedMinutes` there, for the map tag
     "Arkadaşlık · 2 dk".

   Update the app types and the tests.
5. Update `server/docs/veritabani.md`.

## Done when

- The showcase shows every token and component correctly on the phone, including large font and
  reduce motion.
- The 4-tab bar works: Rozetler opens from Profil, and Pasaport shows the old map for now.
- `npm run design:contrast`, lint, tsc and the server tests pass.
