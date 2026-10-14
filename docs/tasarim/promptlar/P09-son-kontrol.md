# P09 — Final pass: polish, performance, accessibility, cleanup

> Part 10 of 10. P00-P08 must be committed. Do only this part.

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`).

## Task

1. **Visual check:** for every screen in `docs/tasarim/README.md` (table "Ekran listesi"),
   open it on a phone (use the `demo.*` users) and compare with its screenshot in
   `docs/tasarim/ekranlar/`. Fix differences in spacing, colors, fonts, radii, shadows and
   copy. Check a small phone (375×667) and a large one: nothing overlaps or gets cut off, and
   text does not overflow at the system's largest font size (cap with `maxFontSizeMultiplier`
   where the layout would break, never below 1.3).
2. **Motion:** with "reduce motion" on, no looping animation runs anywhere (scenes, path dots,
   pulse, BAŞLA bubble, rays, hearts, confetti, mascot). With it off, everything animates on
   the UI thread. Make sure animations stop when a screen loses focus (tabs) and
   `cancelAnimation` runs on unmount.
3. **Performance (Android, Expo Go):** home screen at a steady frame rate while the scene
   animates and the path scrolls; the map and badges screens with six static thumbnails must
   not stutter. Use React DevTools profiler / the perf monitor; memoize heavy SVGs; no
   unnecessary re-renders of `CityScene` and `Mascot`.
4. **Accessibility:** go through every screen with TalkBack and VoiceOver: logical order,
   labels in Turkish, buttons announced as buttons, path nodes announce state, quiz options
   as radio buttons with selected state, reward screens announce the main result.
5. **Errors and offline:** the app has no offline mode, but every screen must show a friendly
   Pırıl error with a retry when the server is unreachable, and never crash.
6. **Cleanup:** dev routes (`src/app/dev/*`) redirect home outside `__DEV__`; remove dead code
   from the old design (old cards, unused components, `app-tabs.web.tsx` if replaced); keep
   `docs/tasarim/` as the design reference.
7. Run `npx expo-doctor`, `npx expo lint`, `npx tsc --noEmit`, and in `server/`
   `npm run lint`, `npm run typecheck`, `npm test`. Fix everything.
8. Update `README.md` with a short "Oyun yapısı" section (cities, levels, lessons, rewards,
   demo users) and how to run the seed.

## Done when

- All checks pass, every screen matches its design, and a fresh user can play from the
  welcome screen to İzmir. One commit, not pushed.
- Report in Turkish: what changed, what you could not match exactly and why, and a list of
  ideas for the next phase (voice reading with the mic, word hunt lessons, AI-generated
  stories per grade, parent view).
