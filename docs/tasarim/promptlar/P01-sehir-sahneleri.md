# P01 — City scenes (SVG illustrations)

> Part 2 of 10. P00 must be committed first. Do only this part.

## Context

Read `docs/tasarim/README.md`. Every home screen starts with an illustrated city scene. All six
scenes are in `docs/tasarim/kaynak/Sahne.dc.html`: each city is one `<sc-if value="{{is.<city>}}">`
block containing a single SVG with `viewBox="0 0 390 340"`. They also appear as small thumbnails
on the journey map and the profile badges (see `ekranlar/18-yolculuk-haritasi.jpg` and
`ekranlar/21-profil.jpg`).

- İstanbul: sunset, Bosphorus bridge, mosque with minarets, Galata tower, Maiden's Tower, moving
  ferry, gulls.
- İzmir: clock tower with a rotating hand, Yalı mosque, Kordon palms, ferry, sailboat, tram.
- Efes: night, Celsus library, theatre, columns, moon, stars, lanterns, fireflies.
- Antalya: Beydağları, Yivli Minare, Hıdırlık tower, Kaleiçi houses, gulet, beach, orange tree.
- Kapadokya: sunrise, fairy chimneys, six hot-air balloons.
- Van: snowy mountains, lake, Akdamar island, Van castle with Turkish flag, bunting, Van cats.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`).

## Task

1. Create `src/features/scenes/` with one component per city (`istanbul-scene.tsx`, …) and a
   `CityScene` entry component:
   ```ts
   type CitySceneProps = { city: CityId; width: number; animated?: boolean };
   // height = width * 340 / 390; animated defaults to true
   ```
   Use `CityId` from `src/features/game/theme.ts`.
2. Port each SVG from `Sahne.dc.html` to `react-native-svg` **faithfully**: same shapes, paths,
   colors, gradients and layer order. Convert attribute names to props (`stroke-width` →
   `strokeWidth`, etc.). Gradients become `<Defs><LinearGradient/RadialGradient>` with ids
   unique per city.
3. **Animation:** the design uses SMIL `<animate>`. Do not try to animate dozens of SVG nodes.
   Split each scene into a static background `Svg` and at most **5 animated sprites** (small
   separate `Svg`s inside `Animated.View`s moved with Reanimated transforms on the UI thread).
   Pick the ones that matter most:
   - İstanbul: ferry crossing, 2 gulls, slow clouds.
   - İzmir: clock hand rotation, ferry, sailboat bob, tram.
   - Efes: star twinkle (one group opacity), floating fireflies, moon glow.
   - Antalya: gulet bob, sun rays rotation, clouds.
   - Kapadokya: balloons floating up and down at different speeds.
   - Van: flag wave, bunting sway, cat tail.
   With `animated={false}` or reduce motion, render the static frame only (no Reanimated
   loops at all). Use `cancelAnimation` on unmount.
4. **Performance:** scenes are drawn on the home screen (one at a time) and as thumbnails
   (up to 6 on one screen). Thumbnails must be static and cheap: memoize the components and do
   not mount sprite animations when `animated` is false. Measure the JS frame rate on Android
   with the home scene animating; it must stay smooth.
5. Accessibility: the scene is decorative (`accessible={false}`,
   `importantForAccessibility="no-hide-descendants"`).
6. Dev showcase `src/app/dev/scenes.tsx`: all six scenes full width (animated) and a row of six
   112 px thumbnails (static), with a toggle for animation.

## Done when

- Each scene matches its screenshot in `docs/tasarim/ekranlar/` (top 340 px of the home screens
  `03`, `11`-`13`, `15`, `16`). Compare side by side and fix differences.
- Smooth on a mid-range Android phone in Expo Go. Lint and typecheck clean. One commit, not
  pushed. Report in Turkish.
