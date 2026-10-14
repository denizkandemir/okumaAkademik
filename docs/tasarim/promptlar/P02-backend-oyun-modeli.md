# P02 — Backend: journey, lessons, questions, rewards

> Part 3 of 10. Do only this part. Server only (`server/`); no app changes yet.

## Context

Read `docs/tasarim/README.md` → "Oyun kuralları (v1)". These rules are the spec. Look at the
screens to see which numbers the app shows: `03`, `04`, `06`-`10`, `14`, `17`, `18`, `21` in
`docs/tasarim/ekranlar/`.

The server is Fastify + Prisma 7 + PostgreSQL (`server/`). Read `server/docs/veritabani.md`
first and follow its conventions exactly: snake_case tables/columns via `@map`, index/constraint
names, `timestamptz(3)`, Turkish `///` comments on every model and field mirrored as
`COMMENT ON` in a migration, CHECK constraints in migration SQL, readable slug ids, and report
views (`v_*`). I need to be able to read the database easily in Prisma Studio / DBeaver.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Run `npm run lint`, `npm run typecheck` and `npm test` in `server/`.
Write Vitest tests for every new endpoint and rule (follow `server/test/`).

## Data model (Prisma)

Add (names are suggestions; keep the conventions):

- `enum City` → `city`: `ISTANBUL, IZMIR, EFES, ANTALYA, KAPADOKYA, VAN` (API uses lowercase
  ids: `istanbul`, …; convert in one helper like `reading-level.ts`).
- `enum LessonKind` → `lesson_kind`: `STORY, CHEST`.
- `Lesson` → `lessons`: `id` slug (e.g. `istanbul-03-minik-serce`), `city`, `position` (1-10; avoid the
  SQL keyword `order` as a column name),
  `kind`, `title`, `summary` (one sentence shown on the lesson card, e.g. "Rüzgârda yuvası
  düşen minik serçe Pıtır'ın, arkadaşlarıyla yeni bir yuva kurma hikâyesi."), `textId`
  (nullable FK to `texts`, required when `kind = STORY`; CHECK).
  Unique `(city, position)`.
- `Question` → `questions`: `id` cuid, `textId`, `position` (1-3), `prompt`, `options` (text[],
  exactly 3; CHECK), `correctIndex` (0-2; CHECK), `hint` (shown after a wrong answer),
  `explanation` (shown after the right answer). Unique `(text_id, position)`.
- `GlossaryEntry` → `glossary_entries`: `textId`, `word` (as written in the text), `meaning`
  (one kid-friendly sentence). Unique `(text_id, word)`.
- `QuestionAttempt` → `question_attempts`: `userId`, `questionId`, `readingSessionId`,
  `choiceIndex`, `correct`, `createdAt`. Every answer tap is one row.
- `LessonCompletion` → `lesson_completions`: `userId`, `lessonId`, `readingSessionId`
  (nullable, for stories), `stars` (1-3, null for chests), `bestStars`, `completedAt`.
  Unique `(user_id, lesson_id)`: the first completion creates it, replays only raise
  `bestStars`.
- `LokumEntry` → `lokum_entries` (a ledger): `userId`, `amount` (> 0), `reason` enum
  `lokum_reason` (`LESSON, CHEST, LEVEL_UP, CITY_UNLOCK`), optional `lessonId`, optional
  `level`, `createdAt`. Balance = sum of amounts. No balance column on users.
- Report view `v_user_journey`: username, name, grade, completed lessons, level (same formula
  as the code), current city, lokum balance, current streak if feasible in SQL (or best effort
  without streak; document it).

Level, city and streak are **derived** from the data, never stored. Put the rules in
`server/src/lib/journey.ts` as pure, unit-tested functions:
`levelFromCompleted(n)`, `cityForLevel(level)`, `starsFor(firstTryCorrect)`,
`lessonLokum(firstTryCorrect)`, `streakFrom(dates, today)` (Europe/Istanbul days, reuse
`src/lib/time.ts`), plus constants `LESSONS_PER_CITY = 10`, `LESSONS_PER_LEVEL = 2`,
`MAX_LEVEL = 30`, reward amounts from the README.

A lesson is **unlocked** if it is the first lesson of İstanbul, or the previous lesson in the
global order (city order, then lesson position) is completed.

## API (all require auth; validate with zod; Turkish error messages like the existing routes)

1. `GET /me/journey?city=<id>` — default city = current city. Returns:
   ```jsonc
   {
     "level": 3, "maxLevel": 30, "finished": false,
     "currentCity": "istanbul",
     "city": { "id": "istanbul", "no": 1, "levelFrom": 1, "levelTo": 5,
               "lessonsDone": 3, "lessonsTotal": 10 },
     "lessons": [ { "id": "...", "position": 1, "kind": "story", "title": "...",
                    "status": "done" | "current" | "locked", "stars": 3 | null } ],
     "cities": [ { "id": "istanbul", "status": "completed" | "current" | "locked",
                   "lessonsDone": 10 } ],
     "stats": { "lokum": 320, "streak": 6, "streakAtRisk": true, "readToday": false }
   }
   ```
   Requesting a locked city → 403 with a friendly message.
2. `GET /lessons/:id` — lesson (`id, city, position, kind, title, summary, status, bestStars,
   maxLokum`) + (for stories) the text (`id, title, level, estimatedMinutes, paragraphs`),
   glossary and questions **without** `correctIndex`. Locked lesson → 403.
3. `POST /lessons/:id/answers` `{ readingSessionId, questionId, choiceIndex }` → records a
   `QuestionAttempt`; returns `{ correct, hint?, explanation?, lokum }` where `lokum` is 5 only
   if this is the first attempt on that question in this reading session and it is correct
   (display only; real crediting happens at completion). The reading session must belong to
   the user and to the lesson's text.
4. `POST /lessons/:id/complete` `{ readingSessionId? }`:
   - Story: the reading session must be completed and every question must have at least one
     correct attempt in that session. Chest: no body.
   - In **one transaction**: create/update `LessonCompletion`, and on the first completion
     write the `LokumEntry` rows (lesson or chest, level-up for each level gained, city
     unlock if a new city opened).
   - Returns everything the reward screens need:
     ```jsonc
     { "firstTime": true, "stars": 3, "firstTryCorrect": 3, "durationSeconds": 134,
       "lokum": { "lesson": 20, "levelUp": 50, "cityUnlock": 0, "total": 70, "balance": 390 },
       "level": { "before": 3, "after": 4, "leveledUp": true },
       "cityUnlocked": null | "izmir", "finished": false,
       "nextLessonId": "istanbul-05-sandik" | null,
       "streak": 7 }
     ```
   - Completing an already completed lesson: `firstTime: false`, no lokum, may raise
     `bestStars`. Completing a locked lesson → 403.
5. `GET /me/stats` — for profile, badges and reminders: `{ level, lokum, streak, streakAtRisk,
   readToday, bestStreak, todayMinutes, dailyGoalMinutes,
   storiesDone, minutesTotal, week: [{ day: "Pzt", done: true }, … 7 days ending today],
   cities: [{ id, status }], achievements: [{ id, title, description, earned }], lastReadAt,
   finished }`. `description` is the requirement in kid words, e.g. "7 gün art arda oku".
   Achievements v1 (computed, no table): `ilk-hikaye` "İlk hikâye" (1 story),
   `seri-7` "7 gün seri" (best streak ≥ 7), `hikaye-10` "10 hikâye", `uc-yildiz-5`
   "5 kez 3 yıldız", `yeni-sehir` "İlk yeni şehir" (İzmir unlocked).
6. `GET /texts` (library): hide texts that belong to lessons that are still locked for the
   user. `GET /texts/:id` for a locked lesson's text → 403.

## Seed (structure only — real content comes in P03)

- Restructure the seed so content lives in `server/prisma/seed-data/<city>.ts` files, each
  exporting that city's 10 lessons (8 stories with text, glossary and 3 questions, 2 chests at
  orders 5 and 10). For now put a minimal placeholder story in every slot so the whole journey
  is playable end to end; keep the existing 5 texts and place them sensibly
  (`minik-serce` → İstanbul 3, `bahcedeki-domatesler` → İstanbul, `kayip-anahtar` → Efes 3,
  `deniz-feneri` → Antalya, `gokyuzundeki-haritalar` → Kapadokya). Mark placeholders with a
  `// TODO(P03)` comment.
- Demo users (development seed only), password `okuma123`, printed at the end of the seed:
  `demo.istanbul` (4 lessons done → level 3), `demo.izmir` (14 → 8), `demo.efes` (22 → 12),
  `demo.antalya` (32 → 17), `demo.kapadokya` (42 → 22), `demo.van` (54 → 28),
  `demo.final` (60 → 30, finished). Give them completions with stars, matching lokum entries,
  and completed reading sessions on consecutive days so streaks show (e.g. 6, 9, 14, 21, 28,
  35 days). The seed must be idempotent (`npm run db:reset` works).
- Update `server/docs/veritabani.md` (tables, mermaid diagram, views, example queries).

## Done when

- `npm run db:reset` works, Prisma Studio shows readable tables with Turkish comments.
- All endpoints are tested (unlock order, level-up, city unlock at lesson 10, first-time-only
  rewards, replays, 403 for locked, answers validation, streak across midnight in
  Europe/Istanbul). Lint, typecheck and tests pass. One commit, not pushed.
- Report in Turkish with the list of endpoints and the demo users.
