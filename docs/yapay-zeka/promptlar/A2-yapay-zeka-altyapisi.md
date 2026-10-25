# A2 — AI infrastructure (server only)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §1 and §3 A2, and
`04-teknoloji-ve-maliyet.md`. A0 must be merged (A1 is not required).

## Goal

One safe, measurable, cheap way for the server to call Claude. Every later phase uses it. No app
changes in this task.

## Before coding

- If the `claude-api` skill is available to you, load it. Otherwise read the official Anthropic
  docs. **Do not guess SDK usage**: method names, params and types must come from the docs or the
  SDK's types.
- Points that are easy to get wrong:
  - Package `@anthropic-ai/sdk`.
  - Default model `claude-opus-5-5`. On this model:
    - Thinking cannot be disabled; do not send `thinking: { type: "disabled" }`.
    - Control depth with `output_config.effort`; the default is `medium`, use `low` for short
      tasks.
  - Do not send `temperature`, `top_p` or `top_k`.
  - Structured output: `output_config.format` with a JSON schema, or the SDK's `messages.parse`
    with zod.
  - Batches:
    - Create with `client.messages.batches.create`, poll with `retrieve`, then read `results`.
    - Results arrive in any order: key them by `custom_id`.
    - Batches cost 50% less.
  - Prompt caching: put stable content first and mark it with `cache_control`. Verify with
    `usage.cache_read_input_tokens`.
  - Refusals: always check `stop_reason === "refusal"` before reading `content`. Live calls may use
    the server-side `fallbacks` option. Check the current docs for the exact beta header; it is
    not available on the Batches API.

## Build

1. **Config** (`server/src/config.ts`, zod):
   - `ANTHROPIC_API_KEY` (optional in dev and test)
   - `AI_MODE` = `live` | `mock` (default `mock` when there is no key)
   - `AI_MONTHLY_BUDGET_USD`
   - per-task model overrides, for example `AI_MODEL_REPORT`; all default to `claude-opus-5-5`

   Update `server/.env.example`. The key must never reach the app or the logs.
2. **Module `server/src/ai/`:**
   - `client.ts`: one SDK client, timeouts, retries.
   - `tasks.ts`: a registry of AI tasks (`content.generate`, `content.review`, `plan.weekly`,
     `report.weekly`, `report.monthly`, `piril.message`, `feedback.summary`, `qa.text`). Each task
     has:
     - model and effort
     - `max_tokens`
     - a prompt file under `server/src/ai/prompts/<task>.v1.md` (versioned; the version is
       logged)
     - a zod output schema
   - `run.ts`: `runTask(task, input)` for live calls. It returns typed, schema-validated output
     or a typed failure (`refused`, `invalid_output`, `budget_exceeded`, `error`); it never
     throws to callers.
   - `batch.ts`:
     - `submitBatch(task, items[])`, `pollBatches()`, `collectResults(batchId)`
     - persists batches in `ai_batches` (id, task, status, counts, created and ended times)
     - maps each result to its `custom_id`
     - failed and refused items are recorded and retried once
   - `pricing.ts`: per-model prices as a dated table (from `04-teknoloji-ve-maliyet.md` §3) and a
     function that turns `usage` (input, output, cache read, cache write; batch discount) into USD.
3. **`ai_requests` table** (readable, with comments):
   - `task`, `prompt_version`, `model`, `effort`, `mode` (live/batch), `batch_id`
   - tokens: `input_tokens`, `output_tokens`, `cache_read_tokens`, `cache_write_tokens`
   - `cost_usd`, `latency_ms`
   - `status` (`ok`, `refused`, `invalid_output`, `error`, `budget_exceeded`), `error_code`
   - `subject` (for example `report:user-week`, never personal data), `created_at`
   - plus a view `v_ai_cost_monthly` (by month and task)
4. **Budget guard:** before every call, estimate the cost. If the month-to-date total plus the
   estimate exceeds `AI_MONTHLY_BUDGET_USD`, return `budget_exceeded`. Also a per-user daily cap
   for live tasks (config). Log a warning at 80% of the budget.
5. **Privacy guard:** inputs are built only by dedicated builder functions that take grade band,
   levels and numbers. A guard rejects any payload that contains the user's `name` or `username`
   (case-insensitive, Turkish-aware). Free text written by a child is passed only to tasks marked
   `acceptsChildText` (A6) and is length-limited. Add tests.
6. **Mock mode:** deterministic fake outputs that satisfy each schema, so tests and local
   development work without a key or network.
7. **CLI:**
   - `npm run ai:ping`: one tiny live call that prints the model, latency and cost (fails clearly
     without a key).
   - `npm run ai:cost`: prints this month's cost per task from the view.
8. Update `server/docs/veritabani.md` for `ai_requests` and `ai_batches`.

## Done when

- `npm test` passes in mock mode, covering budget, privacy, schema validation, refusal handling,
  batch result mapping and pricing math.
- With my API key in `server/.env`, `npm run ai:ping` prints a cost and a row appears in
  `ai_requests`.

## Tell me

How to get and set the API key (Anthropic Console → API keys → `server/.env`), and that it must
never be committed.
