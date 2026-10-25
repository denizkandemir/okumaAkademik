# A7 — Quality, safety and effectiveness

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §3 A7. Run this after
A6, then re-run its checks whenever a prompt or model changes.

## 1. Evaluation sets (`server/evals/`)

- For each AI task (`content.generate`, `content.review`, `plan.weekly`, `report.weekly`,
  `feedback.summary`, `qa.text`, `piril.message`), keep a small set of fixed inputs (10-30),
  anonymous and synthetic.
- Each set has a grading rubric:
  - automatic checks: schema, length, readability band, rules
  - an AI grader with a fixed rubric for quality (age fit, accuracy, kindness, groundedness for
    `qa.text`)
- `npm run eval -- --task=<task> [--model=...] [--prompt-version=...]` runs a set and writes a
  report (scores, failures, cost) to `server/evals/reports/<date>-<task>.md`.
- Rule: before changing a prompt version or a task's model (for example moving reports to a
  cheaper model, as in Scenario B of `04-teknoloji-ve-maliyet.md`), run the eval for both
  versions and compare. Document this in `server/evals/README.md`.

## 2. Exercise effectiveness (our own data)

- View `v_exercise_effect`: for each exercise type and band, the change in the child's normal
  reading wpm and comprehension in the 2 weeks after doing that exercise ≥ 3 times, compared with
  similar children who did not. Keep it simple and clearly labelled as observational.
- `npm run report:effect` prints it.
- Note E6's known risk from `01-arastirma.md`: weak transfer to normal reading. Watch it.

## 3. Privacy and children's data (KVKK)

- **Registration:**
  - a short, clear notice ("aydınlatma metni") screen with Pırıl, written for parents
  - a parent consent checkbox for children (store `parent_consent_at`)
  - explain that AI features receive no names and only reading numbers
- **Data rights:**
  - `GET /me/export` (JSON of the child's data)
  - `DELETE /me` (delete the account and all related rows; `ai_requests` keep no personal data)
- **Retention:** settings for how long reading metrics and AI logs are kept; a cleanup job.
- **Review the AI provider's data retention and terms** and write a short summary for me in
  `docs/yapay-zeka/05-gizlilik.md`. State clearly what you verified and what you could not.

## 4. Cost and health dashboard

- Views: `v_ai_cost_monthly` (from A2), `v_ai_failures` (refusal, invalid and error rates by task
  and week), and `v_ai_cost_per_active_student`.
- `npm run ai:health` prints the summary and warns at 80% of the budget or when the failure rate
  is above 5%.
- Update `04-teknoloji-ve-maliyet.md` §5 with the measured cost per active student next to the
  estimate.

## Done when

- Eval sets exist for every task and run in mock and live modes.
- The effect view returns rows for demo data.
- The KVKK screens and endpoints work.
- The dashboards print correct numbers.
