# Rules for every AI-phase task (A0-A7)

Every prompt in this folder starts with "Follow `docs/yapay-zeka/promptlar/A-kurallar.md`".
Read this file first, then the task.

## Context to read before you start

- `docs/yapay-zeka/README.md`, then the files the task names. The plan is
  `03-yol-haritasi.md`; exercises and question types are in `02-egzersiz-katalogu.md`; the
  research behind them is `01-arastirma.md`; costs and technologies are in
  `04-teknoloji-ve-maliyet.md`.
- `server/docs/veritabani.md` — database conventions (snake_case via `@map`, constraint names,
  `timestamptz(3)`, Turkish `///` comments mirrored as `COMMENT ON` in migrations, CHECK
  constraints in SQL, report views `v_*`, readable slug ids). Follow them exactly; the owner
  reads the database in Prisma Studio and DBeaver.
- The existing code you build on: `server/src/lib/journey.ts`, `server/src/modules/journey/`,
  `server/prisma/schema.prisma`, `server/prisma/seed*.ts`, `src/features/game/`,
  `src/features/reading/`, `src/app/`. Never guess shapes: read the code.

## Git (CLAUDE.md wins over anything else)

- Stay on the current branch. Do not create branches, do not switch to `main`.
- Do not commit unless I say "commit". Never push.
- At the end, list the files you changed so I can review them.

## Quality bar

- App: check the Expo SDK 57 docs before using any Expo/React Native API; install with
  `npx expo install`; run `npx expo lint` and `npx tsc --noEmit`.
- Server: run `npm run lint`, `npm run typecheck` and `npm test` in `server/`. New rules and
  endpoints get Vitest tests (follow `server/test/`).
- Migrations: create them with `npx prisma migrate dev --name <name>` in `server/`. Never edit an
  existing migration. If a reset is needed, stop and ask me; Prisma blocks AI-run resets.
- Seed must stay idempotent; demo users (`demo.*`, password `okuma123`) must get realistic data
  for every new feature so I can see it on the phone.
- Everything must keep working in Expo Go on iOS and Android. If something needs a development
  build, stop and tell me instead of adding it.

## Product rules

- Users are children aged 7-14. Speed is never rewarded on its own: every reading measure is shown
  together with comprehension (`01-arastirma.md` §1).
- **No personal data goes to the AI.** No name, username, user id or free text that may contain
  them. The AI receives grade band, levels and numbers only. A child's own text (for example a
  summary) is sent only through the guarded path from A2.
- Kid-facing copy is Turkish, warm and short. Touch targets ≥ 48 dp, `accessibilityLabel` on every
  control, loops stop when "reduce motion" is on.
- Grade bands: `G1` = grades 1-2, `G2` = 3-4, `G3` = 5-6, `G4` = 7-8. Put the mapping in one
  helper on the server and one in the app.

## Reporting

Finish with a short report **in Turkish**: what you built, how to try it on the phone (which
demo user, which screen), what you could not do and why, and any decision I need to make.
