# A3 — AI content generation

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §3 A3,
`02-egzersiz-katalogu.md` (all of it) and `01-arastirma.md` §4-5. A1b and A2 must be merged.

## Goal

A pipeline that generates texts, questions and exercise content per grade band, checks them
automatically, has a second AI pass review them, and puts them in an approval queue. Children only
ever see `APPROVED` content.

## Pipeline

`request → batch generation → automatic checks → AI review → DRAFT/REVIEW → my approval → APPROVED`

1. **Status and source on content:** `texts`, `questions` and `exercise_items` get
   `status` (`content_status` from A1a) and `source`. Add `generation_request_id` linking to
   `ai_requests` where relevant. All existing content is `SEED` + `APPROVED`. Every public query
   filters on `APPROVED`. Add tests that DRAFT content never leaks through the API.
2. **Generation tasks** (`content.generate`, prompts versioned):
   - The prompt contains the band's readability range, length limits, question type mix, safety
     rules and examples. Keep it stable and cached; the variable part goes last.
   - Output is strictly typed JSON (zod), for example:
     - `{ title, summary, paragraphs[], glossary[], questions[] }`
     - each question: `type`, `cognitiveLevel`, `prompt`, `options`, `correctIndex`, `hint`,
       `explanation`

     3 options for G1-G2, 4 options for G3-G4 with LGS types.
3. **Automatic checks** (`server/src/content/validators.ts`, pure and tested):
   - schema
   - Ateşman score inside the band range (store the ranges in one config; start with
     G1 85-100, G2 70-90, G3 55-80, G4 45-70 and say in a comment they are to be tuned with real
     data)
   - word count limits
   - glossary words appear verbatim
   - exactly one correct answer, balanced option lengths
   - no duplicate texts (normalized hash) and no near-duplicate questions
   - banned topics and words list (violence, fear, brands, politics)
   - for E4 the chunks re-join to the text; for E7 the segmentation re-joins to the word
4. **AI review** (`content.review`): A separate call scores each item 1-5 on age fit, factual
   accuracy about places, single correct answer, natural Turkish, MEB/LGS fit, plus safety flags.
   Reject if any safety flag is set or the average is < 4. Store scores and reasons.
5. **CLI in `server/`:**
   - `npm run content:generate -- --kind=<kind> --band=G1 [--city=istanbul] [--count=N] [--dry-run]`:
     submits a batch and prints the estimated cost first, asking for confirmation.
   - `npm run content:collect`: collects finished batches, runs the checks and the review.
   - `npm run content:review`: an interactive terminal review. It shows each item readably
     (text, questions with the correct one marked, scores). Keys: `a` approve, `r` reject (with
     reason), `s` skip.
   - `npm run content:status`: counts by kind, band and status.
6. **Kinds to support:**
   1. `variant`: G1, G3 and G4 variants of the 48 journey stories. Same city, title idea and
      lesson position; different length, vocabulary and question mix. Linked through
      `lesson_texts`.
   2. `chunks`: E4 chunk markup for any approved text (replaces the deterministic chunker output
      for that text).
   3. `words`: E5 word sets.
   4. `morphology`: E7 items.
   5. `storymap`: E8 story maps and summary choices.
   6. `lgs`: E9 sets for G3-G4.
   7. `chart`: E10 chart data and questions for G2-G4.
   8. `practice`: extra practice texts for the library and training, by band and topic.
7. **Originality rule in the prompt:** never reproduce existing books or real exam questions;
   generate original content in the style of the types.

## Run it carefully

1. Implement and test everything in mock mode.
2. With the real key, run a **small pilot**: `variant` for İstanbul, band G1, 10 items. Show me
   the cost from `ai_requests` and let me review them with `content:review`.
3. Only after I approve the quality, run the rest in steps (one city or kind at a time), reporting
   cost after each step.

## Done when

- Validators and status filtering are tested.
- The pilot is generated and reviewed.
- `content:status` shows the counts.
- I can switch a demo user to G1 and see an approved G1 variant in the journey.
