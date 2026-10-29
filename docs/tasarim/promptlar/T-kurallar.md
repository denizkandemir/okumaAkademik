# Rules for every design task (T00-T06)

Every prompt in this folder starts with "Follow `docs/tasarim/promptlar/T-kurallar.md`". Read
this file first, then the task.

## What this is

The app gets a new visual design, "Pırıl'ın Atlası". It replaces the first "game" design
(P00-P06). This is a **visual redesign plus a few new screens**:

- Game rules, API contracts, the reward flow, the reading session logic and the mascot stay as
  they are.
- Keep every behaviour that the bug sweep added. Read `docs/hata-taramasi.md` and keep:
  - the hardware back handling
  - the retry states
  - keeping data on refetch errors
  - the double-tap guards
  - the reading session retry

## Read before you start

- `docs/tasarim/README.md`: decisions, colour table, typography, city data, the Pırıl pose per
  screen, and the game rules. **The README's decisions win over the design board.**
- For every screen you touch, its screenshot in `docs/tasarim/ekranlar/` and its HTML in
  `docs/tasarim/kaynak/ekranlar/` (styles in `kaynak/tasarim.css`). The HTML is a 430 px wide
  web mock-up. Take layout, spacing, proportions, icons and Turkish copy from it, then apply the
  README:
  - the "Uygulama" colours
  - the minimum text sizes
  - Nunito Sans / Literata
- `AGENTS.md` and `CLAUDE.md`. For Expo, read the `expo` major version in `package.json` and
  check that SDK's docs before using any Expo or React Native API.
- The current code of the screen you change: its data hooks, error states, navigation and
  accessibility labels. Never guess API shapes; read `src/features/game/types.ts` and the server
  routes.

## Rules

- **Pırıl** is always the existing `Mascot` component (`src/features/mascot/`) with the pose from
  the README. Never use the board's cat image. Never change mascot assets or animations.
- **Tokens only.** Colours, fonts, text sizes, radii and shadows come from `src/design/` (built in
  T00). No hex values or font names in screen files.
- **Components first.** Use and extend the shared components in `src/design/`. Do not copy the
  same layout twice. New screens never import the old game UI (`GameButton`, `GameText`,
  `Panel`, scenes…); T06 deletes it.
- **Accessibility:**
  - Contrast: text ≥ 4.5:1, large text and icons ≥ 3:1.
  - Touch targets ≥ 48 dp.
  - Every custom control has `accessibilityRole`, `accessibilityLabel` and its state (selected,
    disabled, expanded).
  - Large fonts must work. Use `maxFontSizeMultiplier` only where a layout would break, and never
    below 1.3.
  - "Reduce motion" stops every non-essential animation.
- **Minimum text sizes:** body 15, secondary 13, eyebrow 11, button 15, tab label 12, map labels
  12.
- **Screens:** must work on a small phone (360×640 dp) and a large one (430×932). No horizontal
  scrolling. Respect safe areas. Light theme only.
- **Performance:**
  - City backgrounds are big images: render them with `expo-image` and set `contentFit` and a
    `recyclingKey`. Never load all six at once where one is enough.
  - Animations run on the UI thread with Reanimated.
  - Avoid re-rendering the whole map on every state change.
- **Dependencies:** only the ones a task names. Install with `npx expo install`. Everything must
  run in Expo Go. If something needs a development build, stop and tell me.
- **Server changes** follow `server/docs/veritabani.md`: snake_case via `@map`, Turkish `///`
  comments mirrored as `COMMENT ON`, CHECK constraints in SQL, idempotent seed, Vitest tests.
  Create migrations with `npx prisma migrate dev --name <name>`. If it asks for a reset, stop and
  ask me. API changes must be additive; do not break existing response shapes.

## Git (CLAUDE.md wins over anything else)

- Stay on the current branch. Do not create branches and do not switch to `main`.
- Do not commit unless I say "commit". Never push.

## Before you finish

- Root: `npx expo lint` and `npx tsc --noEmit`.
- If `server/` changed, run `npm run typecheck` and `npm test` there. Start Postgres with
  `npm run db:up` if needed.
- Delete files that your task made unused, after checking that nothing imports them.
- Write the report **in Turkish**:
  - what changed (files)
  - which design details you could not follow and why
  - decisions you made where the design was silent
  - a step-by-step phone test list: demo user, screens, a small phone or large font check, and
    reduce motion
