# P06 — Lesson flow: reading, questions, rewards, level up, new city, finale

> Part 7 of 10. P00-P05 must be committed. Do only this part.

## Context

Designs (look at all of them): `docs/tasarim/ekranlar/05-okuma.jpg`, `06-soru.jpg`,
`07-yanlis-cevap.jpg`, `08-dogru-cevap.jpg`, `09-ders-tamamlandi.jpg`, `10-seviye-atladi.jpg`,
`14-sehir-acildi-kapadokya.jpg`, `17-final-van.jpg`. Sources: `kaynak/S04Okuma.dc.html` …
`S10SehirAcildi.dc.html`, `S15VanFinal.dc.html`.

Existing code: `src/app/reading/[id].tsx`, `src/features/reading/` (`useReadingSession`,
`reading-session.ts`, `reading-complete.tsx`). API from P02: `GET /lessons/:id`,
`POST /lessons/:id/answers`, `POST /lessons/:id/complete`, existing reading-session endpoints.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Keep the existing reading-session logic (progress reporting, duration,
retry on error). Free reading from the library (no `lessonId`) must keep working: it shows the
same new reading design and ends with the completion screen without questions or rewards.

## Flow

`lesson card → reading (BİTİRDİM) → quiz (3 questions) → complete → [level-up] → [city
unlocked] → [finale] → home`. Chest: `lesson card → chest opening → complete → [level-up] →
[city unlocked] → home`.

Keep the result of `POST /lessons/:id/complete` in a small reward store
(`src/features/game/reward-store.ts`, `useSyncExternalStore`) that the reward screens read. If
a reward screen opens without data (deep link, reload), redirect to home. After the flow,
`router.dismissTo('/')` and refetch the journey so the path shows the new state.

## Task

1. **Reading** `src/app/reading/[id].tsx` (optional `lessonId` search param), like `05-okuma.jpg`:
   cream background, custom header (close X → confirm "Okumayı bırakmak istiyor musun?" when
   progress > 0, purple `ProgressTrack` for scroll progress, "Aa" button that opens a small
   font-size popover with A− / A+ using `ReadingFont`), small caption "İSTANBUL · DERS 3",
   title (Baloo 2, 30), paragraphs in Nunito 18-22 with line height 1.6. Glossary words are
   highlighted (purple, dotted underline) and tappable: Pırıl's bubble at the bottom shows
   the meaning (default bubble: "Mor kelimelere dokun, anlamını söyleyeyim!"). Bottom bar:
   Pırıl `read` (72) with the bubble, purple `GameButton` "BİTİRDİM". Do not show the mic
   button yet (voice reading is a later phase). The button stays enabled; finishing marks the
   session complete as today.
2. **Quiz** `src/app/lesson/[id]/quiz.tsx` like `06`-`08`: header with close and three segment
   progress (green done, purple current, grey next) and "2/3"; Pırıl with a bubble "PIRIL
   SORUYOR" + the question; three answer buttons with A/B/C badges (radio semantics);
   purple "KONTROL ET" enabled after a choice.
   - Wrong (`07`): the chosen option turns orange with "Tekrar dene", Pırıl `think`, orange
     bottom panel "Hmm, bir daha düşünelim!" + the `hint` + buttons "Metne bak" (opens the
     text in a sheet, read-only) and "TEKRAR DENE". Never say "yanlış" harshly.
   - Right (`08`): option green with a check, other options fade, Pırıl `happy`, green panel
     "Harika, doğru!" + `explanation` + "+5 lokum" pill (only when the API returns lokum),
     green "DEVAM ET". Light success haptic.
   - After the third correct answer call `complete` and go on.
3. **Lesson complete** `src/app/lesson/[id]/complete.tsx` like `09-ders-tamamlandi.jpg`: warm
   background with slowly rotating light rays, confetti (`Confetti`), Pırıl `celebrate` (250),
   "Harika okudun!", "<Başlık> hikâyesini bitirdin.", three stat tiles (+lokum, duration
   m:ss "dakika", "x/3 doğru cevap"), `StarRow` animating in one by one, Pırıl's note card
   (one friendly sentence about the story; use the last question's explanation or a generic
   line), blue "DEVAM ET". For replays (`firstTime: false`) show stars only, no lokum.
4. **Level up** `src/app/level-up.tsx` like `10-seviye-atladi.jpg` (only when
   `level.leveledUp`): purple radial background with rays and sparkles, "TEBRİKLER!", gold
   medallion with "SEVİYE" and the new number (Baloo 2, 72) popping in, pink ribbon
   "SEVİYE ATLADIN!", Pırıl `happy`, "KAZANDIKLARIN" panel (+50 lokum, the next lesson's
   title as "Yeni hikâye: …"), progress to the next city ("Efes'e kadar · 2 seviye kaldı"),
   gold "SÜPER!".
5. **City unlocked** `src/app/city-unlocked.tsx` like `14-sehir-acildi-kapadokya.jpg` (when
   `cityUnlocked`): the new city's `CityScene` as the full background, chip "YENİ ŞEHİR
   AÇILDI", big city name, "N. Durak · <title>", Pırıl `celebrate`, a line about the city,
   reward chips ("+100 lokum", "8 yeni hikâye", "<Şehir> rozeti"), city-colored button →
   home. The label is `CITY_INFO[city].exploreLabel` (Turkish suffixes are stored, not
   generated).
6. **Finale** `src/app/finale.tsx` like `17-final-van.jpg` (when `finished`): Van scene, ribbon
   title "Eve hoş geldin, Pırıl!", falling confetti, Pırıl `happy`, certificate card
   "OKUMA KÂŞİFİ SERTİFİKASI" with the child's name and totals (6 şehir, stories, minutes from
   `/me/stats`), blue "SERTİFİKAMI AİLEME GÖNDER" → React Native `Share` with a short Turkish
   text, and "Yeni macera yakında: Pırıl'ın arkadaşları!". Also reachable later from Profile.
7. **Chest** `src/app/lesson/[id]/chest.tsx`: Pırıl next to a closed chest; tap → shake,
   lid opens, lokum pieces burst out, "+30 lokum", then the same complete → level-up/city
   flow.
8. Register all new routes inside the authenticated `Stack.Protected` in `src/app/_layout.tsx`
   with fitting presentations (reward screens as full-screen modals without header, no
   swipe-back during the quiz).
9. Delete `src/features/reading/reading-complete.tsx` if nothing uses it anymore.

## Done when

- With `demo.istanbul`: play lesson 5 (chest) and lesson 6 → level-up appears. Add a seed
  user `demo.sehir` with 9 İstanbul lessons done: finishing lesson 10 → level-up + İzmir
  unlocked. With `demo.van`, play to the last Van lesson → finale. Wrong answers show hints; lokum and stars on screen match the API.
- Library reading still works. Back/close behave sensibly; no double submits.
- Lint and typecheck clean; server tests still pass. One commit, not pushed. Report in Turkish.
