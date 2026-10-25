# A4 — Adaptive plan (learning roadmap)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §1 (principle 3) and
§3 A4, and `02-egzersiz-katalogu.md`. A3 must be merged.

## Goal

Decide **which exercise, at which difficulty, on which day** for each child, and re-plan every
week. The AI proposes; hard rules in code decide what is allowed.

## 1. Rule layer

`server/src/modules/training/rules.ts`: pure, fully unit-tested, no AI.

- **Input:** a `StudentSnapshot` built from A0 data (band, grade, journey level, baseline, last
  4 weeks of wpm and comprehension, results by question type, exercise history with outcomes,
  rushed count, device capabilities such as TTS).
- **Output:** `PlanConstraints`, listing the allowed exercise types with min and max params, daily
  minutes, weekly quotas and forbidden combinations. Rules from `03-yol-haritasi.md` §3 A4:
  - comprehension < 0.6 (last 5): no E6; prefer E8, E7 and easier texts
  - comprehension ≥ 0.8 and flat wpm: E1, E4, E6 (E6 only for G2+)
  - G1 slow with low comprehension: E2, E3, E5
  - G3-G4: E9/E10 weekly share grows with grade
  - daily training 10-15 minutes max; no type more than twice in a row; E6 ≤ 5 minutes per day
- `validatePlan(plan, constraints)` returns errors, and `repairPlan` fixes or replaces invalid
  items with rule-picked ones.
- `rulePlan(snapshot)` makes a full rule-only plan. This is the fallback when the AI is not
  available, over budget, or refuses.

## 2. AI planner

Task `plan.weekly` from A2:

- **Input:** the snapshot (no personal data), the constraints, and the catalog summary of
  exercise types.
- **Output (zod):**
  - 7 days × 1-3 items, each with `type`, `params`, `contentTags` (band, difficulty, question
    types to target) and a short internal `reason`
  - a `weeklyFocus` (for example "ana fikir bulma")
  - `kidMessage`: 1-2 warm Turkish sentences from Pırıl explaining the focus. No names; the app
    inserts the name.
- The server picks concrete approved `exercise_items` matching each item's type, tags and band;
  it avoids items the child already did recently.
- Store everything:
  - `learning_plans` (user, week start in Europe/Istanbul, status, weekly_focus, kid_message,
    `source` `AI` | `RULES`, `ai_request_id`)
  - `plan_items` (plan, date, position, exercise_type, item_id, params, reason, `done_at`)

## 3. When to plan

- **Weekly:** Sunday night for every child active in the last 14 days, through the Batches API.
  Use `pg-boss` (a PostgreSQL job queue, check its current docs) or another approach that needs no
  extra infrastructure. Also add a CLI: `npm run plan:run -- --user=demo.izmir [--live]`.
- **Re-plan with a live call** when the child levels up into a new city, or comprehension changes
  by more than 0.2 vs. the plan's snapshot. At most once per day per child.
- A new user gets a rule plan right after placement (A0).

## 4. API and app

- `GET /me/training/today` now comes from today's plan items (A1's picker remains the fallback).
- `GET /me/plan/week` returns the week, `weeklyFocus` and `kidMessage`.
- New **"Yol haritam"** screen, opened from the training card:
  - the 7 days as a horizontal strip of cards (done, today, upcoming)
  - each day's exercises with icons
  - Pırıl with the week's message

  It follows the game style and is accessible.

## Done when

- Rules, validation and repair are tested, including that AI output breaking rules is repaired.
- In mock mode every demo user gets a plan.
- With the real key, `npm run plan:run -- --user=demo.izmir --live` creates a sensible AI plan
  and shows its cost.
- The phone shows today's training from the plan and the "Yol haritam" screen.
