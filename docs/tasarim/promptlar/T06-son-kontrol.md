# T06 — Final check and clean-up

Follow `docs/tasarim/promptlar/T-kurallar.md`. T05 must be merged. This task closes the redesign
before the AI phase (`docs/yapay-zeka/`).

## 1. Compare with the design

For every row of the screen table in `docs/tasarim/README.md`:
- open the screen on a 390-430 dp wide phone or emulator
- compare it with its screenshot
- fix drift in spacing, sizes, alignment, colours and copy
- keep the README decisions; they are intended differences

In the report, list per screen what still differs and why (for example a README decision, a
platform limit, or a missing API field).

## 2. Remove the old design

Search the whole app and delete everything no screen imports any more. Then run lint and tsc and
make sure nothing references it.

- **The SVG city scenes:** `src/features/scenes/*` and `src/app/dev/scenes.tsx`.
- **The old game UI:**
  - `src/features/game/ui/*` that is unused: `GameButton`, `GameText`, `Panel`, `StatChip`,
    `SquareButton`, `ProgressTrack` and so on
  - the old gradients, palettes and button variants in `src/features/game/theme.ts`
  - keep only game data that is still used, such as city ids; move it to `src/design/` if that
    is cleaner
- **Old fonts:** `@expo-google-fonts/baloo-2` and `@expo-google-fonts/nunito`. Remove them from
  font loading and uninstall them, if nothing uses them.
- **Old components** in `src/components/` that the new design replaced, for example the old
  `Button`, `Card` and `query-state`, if they are unused.
- **Old comments** that point to the old design files (`S04Okuma`, `S03DersKarti`,
  `AnaSayfa.dc.html`, `kaynak/*.dc.html`). Update them to the new screen names in
  `docs/tasarim/README.md`.
- The `dev/game-ui` showcase, if `dev/design` covers it.

## 3. Accessibility pass

- With TalkBack (Android) or VoiceOver (iOS), go through these flows and fix labels, roles,
  states and focus order:
  - welcome → register → home → lesson card → reading → quiz (a wrong and a right answer) →
    result → level up
  - Library, Passport, Profile, Settings
- `npm run design:contrast` passes. Check the colours used outside the token pairs, if any.
- The largest system font on a small phone: nothing is cut off or overlaps, and buttons still
  fit.
- Reduce motion: no looping or decorative animation anywhere, and the mascot is still.
- Every touch target is at least 48 dp.

## 4. Performance pass

- Home map: smooth scrolling on a mid-range Android phone, and no re-renders of the whole map
  while scrolling (check with the React DevTools profiler or logs).
- City backgrounds: decoded once, cached, and the right image size; no six backgrounds mounted at
  once on screens that show one. The Passport thumbnails and seals may share cached sources.
- No JS-thread animations left in the new screens.
- Run `npx expo-doctor` and fix what it reports.

## 5. Documentation

- In `docs/tasarim/README.md`, update the "Uygulamadaki yeri" column to the real file paths, and
  add a short "Durum" note under the table: what was done and what differs on purpose.
- In `docs/hata-taramasi.md`, check that the phone test steps still match the new screens' button
  names ("OKUDUM, HAZIRIM", "KONTROL ET", "ÖDÜLÜMÜ GÖR"…). Update the names if needed.

## Done when

- Lint, tsc, `design:contrast`, `expo-doctor` and the server tests are clean.
- No old design code, fonts or scene files remain.
- The report has the per-screen comparison and a short phone test list covering the full journey
  from registration to the certificate.
