# P05 — Home: the city journey path and the lesson card

> Part 6 of 10. P00-P04 must be committed. Do only this part.

## Context

This is the heart of the app. Designs: `docs/tasarim/ekranlar/03-ana-sayfa-istanbul.jpg`,
`11`-`13`, `15`, `16` (the same screen themed for each city) and `04-ders-karti.jpg` (lesson
card). Source: `kaynak/AnaSayfa.dc.html` (layout, node styles, `C` theme and `D` texts) and
`kaynak/S03DersKarti.dc.html`.

Data: `GET /me/journey` and `GET /lessons/:id` from P02 (read `server/src/modules/` for the
exact response shapes and write matching types in `src/features/game/types.ts`). Use the
existing `useApiQuery` hook with `refetchOnFocus: true`.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Use `src/features/game/ui/`, `CityScene`, `Mascot`, `MascotBubble`,
`CITY_THEMES`, `CITY_INFO`.

## Task

1. **`src/features/game/use-journey.ts`** — fetches `/me/journey`, exposes the data and the
   current city theme. Provide the current city to the tab bar (P04) through a small context
   so the active tab pill uses the city's banner gradient.
2. **Home screen** `src/app/(tabs)/index.tsx` (replace the current content), top to bottom:
   - Background: the city's `ground` gradient.
   - `CityScene` full width (animated) at the top.
   - Over the scene, 14 dp from the top safe area: `StatChip`s — left "Seviye N" (gold star
     coin), right streak (flame, number) and lokum (lokum box, number formatted `tr-TR`,
     e.g. "1.980"). Tapping streak/lokum shows a short Pırıl tip, not a new screen.
   - **City banner** overlapping the bottom of the scene (like the design, 82 dp above the
     scene's bottom edge): banner gradient with the 6 dp lip, "N. DURAK · ŞEHİR",
     the city title (Baloo 2, 23), `ProgressTrack` (lessons done / 10) and "x/10 ders", and a
     map button (46×46, "Yolculuk haritasını aç") that opens `/journey-map` (P07; until then a
     placeholder route).
   - **Lesson path**: all 10 lessons of the city in a vertical zig-zag (x alternates around
     the center by about ±60 dp, ~92 dp between nodes). Draw the connecting curve with SVG
     behind the nodes: done part thick in `done` color with a darker under-stroke and moving
     white dots (dash offset animation), remaining part translucent `todo` color with dashes.
     Nodes (72 dp; current 80 dp) are round "3D" buttons drawn like the design (radial
     highlight → base → dark edge, inner shadow, bottom lip):
     - done: `d1-d3` colors with a check icon; small stars under it (best stars).
     - current: `a1-a3` colors with a book icon (or chest icon for chests), a pulsing ring
       (scale 1 → 1.8, fade out, 1.8 s) and the "BAŞLA!" bubble next to it bobbing gently.
     - locked: `l1-l3` colors with the lesson-type icon (book/chest) in `lIcon` color.
     Every node has an accessibility label like "Ders 3, Minik Serçe, sıradaki ders" /
     "…, tamamlandı, 3 yıldız" / "…, kilitli".
   - **Pırıl** (150 dp) beside the current node on the free side, pose and message from
     `CITY_INFO` (`homePose`, `homeMessage`) in a white bubble above her. If the child already
     read today, say "Bugün harika okudun!"; if the streak is at risk, say "Serini korumak
     için bir hikâye yeter!".
   - The path scrolls under the fixed scene/banner header; on open, auto-scroll so the
     current node is visible. Leave space for the floating tab bar.
   - Loading: skeleton of banner + 4 grey nodes and Pırıl `think`. Error: Pırıl `think`,
     friendly message and a retry `GameButton`.
3. **Tapping nodes:**
   - current or done story/chest → open the lesson card.
   - locked → small shake + haptic and Pırıl says "Önce önceki dersi bitirelim!".
4. **Lesson card** `src/app/lesson/[id]/index.tsx` presented as a bottom sheet (Expo Router
   `formSheet` with detents — check SDK 57 docs; on web a modal is fine), like
   `04-ders-karti.jpg`: Pırıl `read` peeking above the sheet's top right, chip "OKUMA" (purple)
   and "Ders N / 10", title (Baloo 2, 30), `summary`, three info tiles ("2 dk" süre, level
   label "Kolay/Orta/Zor" seviye, "+20" lokum), the three steps with numbered circles
   ("Hikâyeyi oku", "Pırıl'ın 3 sorusunu cevapla", "Yıldızlarını topla"), purple
   `GameButton` "OKUMAYA BAŞLA" → `/reading/[textId]?lessonId=…` (P06 handles the rest).
   For a done lesson show the best stars and the button "TEKRAR OKU". For a chest show a
   chest illustration, the text "Sandığı aç, lokumları topla!" and the gold button
   "SANDIĞI AÇ" (P06 implements opening; for now call the complete endpoint and refetch).
5. Remove the old daily-goal cards from home (keep the backend endpoint; P07 shows today's
   minutes on the profile).
6. Use the `demo.*` users from the seed to check every city theme.

## Done when

- Logged in as each `demo.*` user, home matches the corresponding screenshot (scene, colors,
  banner, nodes, Pırıl pose and message), the current node is visible on open and the path
  scrolls smoothly on Android.
- Locked/done/current states and accessibility labels are correct. Lint and typecheck clean.
  One commit, not pushed. Report in Turkish.
