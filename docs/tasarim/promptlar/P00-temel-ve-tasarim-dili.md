# P00 — Foundation: fonts, game theme, shared game UI

> Part 1 of 10 (P00 → P09). Do only this part. The next prompt continues from here.

## Context

Okumatik is an Expo SDK 57 reading app for Turkish primary/middle school students (7-14).
We are turning the app into a game-like journey with the mascot Pırıl (a Van cat) travelling
İstanbul → İzmir → Efes → Antalya → Kapadokya → Van, level by level.

The full design reference is in `docs/tasarim/`:
- `docs/tasarim/README.md` — screen list, game rules, design language. Read it first.
- `docs/tasarim/ekranlar/*.jpg` — screenshots of every screen. Look at them.
- `docs/tasarim/kaynak/*.dc.html` — HTML/CSS source of the design. Take exact colors, sizes,
  radii, shadows and SVG paths from here. These files are a reference only: port them to React
  Native components. Never embed HTML or use a WebView.

The mascot is already implemented in `src/features/mascot/` (`Mascot`, `MascotBubble`,
`Confetti`, `SleepZ`) with the same 8 poses as the design. Reuse it; do not rebuild it.

## Rules for every part

- Follow `CLAUDE.md` / `AGENTS.md`. Before using any Expo or React Native API, check the SDK 57
  docs (https://docs.expo.dev/versions/v57.0.0/). Install packages only with `npx expo install`.
- Work on `main`. Do not create branches. Commit at the end with a clear message. Do NOT push.
- Run `npx expo lint` and `npx tsc --noEmit` before you finish (and `cd server && npm run lint &&
  npm run typecheck && npm test` when the server changes). Fix every error.
- UI copy is Turkish, exactly as in the design unless it comes from data.
- Kids app: touch targets ≥ 48 dp, `accessibilityRole`/`accessibilityLabel` on every control,
  text contrast ≥ 4.5:1, and every looping animation stops when the system "reduce motion"
  setting is on (reuse `useMascotReducedMotion` or Reanimated's `useReducedMotion`).
- Everything must keep working in Expo Go on iOS and Android. If something needs a dev build,
  stop and tell me instead of adding it.

## Task

1. **Prettier/ESLint:** add `docs/tasarim/` to `.prettierignore` and to the ESLint ignores so the
   reference files are never reformatted.
2. **Fonts:** load **Baloo 2** (700, 800) and **Nunito** (600, 700, 800) with
   `@expo-google-fonts/baloo-2` and `@expo-google-fonts/nunito` (check the current Expo font
   docs for the recommended way in SDK 57). Keep the splash screen visible until fonts are
   loaded (see `src/features/auth/splash-screen-controller.tsx`). Do not block forever: if
   fonts fail, continue with the system font.
3. **Light only:** the game design has no dark mode. Set `userInterfaceStyle` to `light` in
   `app.json` and make `useTheme`/`useColorScheme` return the light palette, so existing
   screens stay consistent until they are restyled.
4. **Game theme** — create `src/features/game/theme.ts`:
   - `GameFonts` (font family names for heading 700/800 and body 600/700/800).
   - `GameColors` for shared colors used across the design (text `#1F1B3A`, secondary
     `#5A5478`, cream backgrounds, the button gradient table from the README).
   - `CITY_IDS = ['istanbul','izmir','efes','antalya','kapadokya','van'] as const` and
     `CityId` type.
   - `CITY_THEMES: Record<CityId, CityTheme>` copied exactly from the `C` object at the end of
     `docs/tasarim/kaynak/AnaSayfa.dc.html` (convert each CSS `linear-gradient(...)` to
     `{ colors: [...], start, end }` for `expo-linear-gradient`).
   - `CITY_INFO: Record<CityId, { no, name, upperName, title, levelFrom, levelTo, homePose,
     homeMessage, exploreLabel }>` from the `D` object in the same file (`title` = `baslik`,
     `homePose` = `poz`, `homeMessage` = `mesaj`; levels: 1-5, 6-10, 11-15, 16-20, 21-25,
     26-30; `exploreLabel`: "İSTANBUL'U KEŞFET", "İZMİR'İ KEŞFET", "EFES'İ KEŞFET",
     "ANTALYA'YI KEŞFET", "KAPADOKYA'YI KEŞFET", "VAN'I KEŞFET").
5. **Shared game UI** in `src/features/game/ui/` (install `expo-linear-gradient`; check whether
   RN 0.86 `boxShadow` style works on both platforms in Expo Go, otherwise draw the "lip" as a
   darker view offset below):
   - `GameButton` — the 3D candy button from the README table. Props: `title`, `onPress`,
     `variant: 'blue'|'purple'|'green'|'orange'|'gold'|'teal'|'white'`, `loading`, `disabled`,
     `icon?`. Press animation: moves down 3 dp and the lip shrinks (Reanimated), light haptic.
     Also a `GameLinkButton` variant that works with `Link asChild`.
   - `GameText` — `variant: 'display'|'title'|'heading'|'body'|'label'|'caption'` mapping to
     Baloo 2 / Nunito sizes used in the design (display 72, title 34, heading 24-28, body
     16-18, label 14-15 bold, caption 12-13).
   - `StatChip` — the glass pill on the home screen (icon + value, e.g. "6" with flame,
     "320" with lokum box, "Seviye 3" with star coin). Look at `03-ana-sayfa-istanbul.jpg`.
   - `Panel` — white rounded card (radius 22-24, soft shadow) used on many screens.
   - `ProgressTrack` — rounded progress bar with a gradient fill (used in banner, quiz header,
     level card).
   - `StarRow` — 3 stars, filled/empty, with a pop-in animation when `animate` is true.
   - Icons: use inline SVG (`react-native-svg`, install it) copied from the design (house,
     book, badge, person, map, search, mic, chest, lock, check, flame, star, close). Put them in
     `src/features/game/ui/icons.tsx`. No emoji in the UI.
6. **Dev showcase:** add `src/app/dev/game-ui.tsx` (like `src/app/dev/mascot.tsx`) that shows
   every component and variant, plus a small swatch of each city theme. Only reachable in
   `__DEV__`.

## Done when

- `dev/game-ui` renders all components with the right fonts on iOS and Android (Expo Go).
- Existing screens still work. Lint and typecheck are clean. One commit that also adds the
  `docs/tasarim/` folder, not pushed.
- Tell me in Turkish what you built and anything you could not do.
