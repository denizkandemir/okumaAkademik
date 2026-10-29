# A0 — Measurement and data foundation (no AI yet)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §3 A0,
`02-egzersiz-katalogu.md` §3-4 and `01-arastirma.md` §4.

Prerequisite: the new design (T00-T06 in `docs/tasarim/promptlar/`) is merged. Check that
`src/design/` and the restyled `src/app/lesson/` screens exist; if not, stop and tell me.

## Goal

Reliable measurements from every reading and content labelled by difficulty, so later phases (and
the AI) can decide well. This task adds no AI calls.

## Server

1. **Readability utility** `server/src/lib/readability.ts`, pure and unit-tested:
   - Word count, sentence count, average words per sentence, syllable count. Turkish syllables
     equal the number of vowels (a, e, ı, i, o, ö, u, ü, â, î, û); handle uppercase `İ`/`I`
     correctly with `tr-TR` locale.
   - **Ateşman score.** The commonly cited formula is
     `198.825 − 40.175 × (syllables / words) − 2.610 × (words / sentences)`. Verify it against a
     primary or reliable secondary source before coding, cite the source in a code comment, and add
     tests with hand-computed examples.
   - Band label: 90-100 çok kolay, 70-89 kolay, 50-69 orta, 30-49 zor, 1-29 çok zor.
2. **Text metrics** on `texts`: `word_count`, `sentence_count`, `avg_sentence_length`,
   `atesman_score` (computed in the seed for every text; a test checks they match the utility).
3. **Grade-band variants.** Today a lesson has one text (`lessons.text_id`, unique). Change to a
   join table `lesson_texts (lesson_id, grade_band, text_id)`, unique `(lesson_id, grade_band)`,
   with a `grade_band` enum `G1..G4`. Migrate the existing 48 texts as the `G2` variant.
   `GET /lessons/:id` and the reading flow serve the variant for the user's band and fall back to
   `G2` when it is missing. Keep every existing API response shape; add a `gradeBand` field where
   useful. Update tests.
4. **Question labels** on `questions`:
   - `type` enum with the 13 types from `02-egzersiz-katalogu.md` §3 (Turkish enum names, for
     example `BILGI`, `SIRALAMA`, `SOZCUK_ANLAMI`, `NEDEN_SONUC`, `DUYGU_KARAKTER`, `ANA_FIKIR`,
     `YARDIMCI_FIKIR`, `BASLIK`, `CUMLEDE_ANLAM`, `PARAGRAF_YAPISI`, `SOZEL_MANTIK`,
     `GORSEL_OKUMA`, `ONCULLU_YORUM`).
   - `cognitive_level` enum (`HATIRLAMA`, `ANLAMA`, `CIKARIM`, `DEGERLENDIRME`).
   - Optional `meb_outcome_code`.
   - Relax the options CHECK from exactly 3 to 3-4 (`correct_index` within range).
   - Label all existing 144 questions in the seed data by reading them (no guessing in code).
5. **Reading metrics** table `reading_metrics` (1:1 with a completed reading session):
   - `word_count`, `duration_seconds`, `words_per_minute`
   - `questions_total`, `first_try_correct`, `comprehension` (0-1, first-try based)
   - `rushed` flag (`words_per_minute` above a configurable ceiling for the band **and**
     comprehension < 0.6)
   - Written when a lesson is completed (`POST /lessons/:id/complete`, used by the lesson flow) and
     when a library reading finishes (comprehension null there).
   - Per-question-type results are derived from `question_attempts` joined with `questions`; add a
     view `v_reading_results_by_type`.
6. **Placement reading ("Pırıl seni tanımak istiyor!")**:
   - Seed 2 short placement texts per band (60-120 words, 3 questions each, labelled).
   - `GET /placement` returns the user's band texts.
   - `POST /placement/complete` stores a `user_baselines` row: grade, band, wpm, comprehension,
     measured_at. A user may retake it; keep history.
   - `GET /me` (or the existing stats endpoint) exposes `needsPlacement`.
7. **Summary views and endpoint:**
   - `v_student_daily`: Europe/Istanbul day, minutes, texts, median wpm, comprehension, rushed
     count.
   - `v_student_weekly` and `v_student_monthly`: same plus change vs. the previous period and
     vs. the baseline.
   - `GET /me/metrics?period=day|week|month` returning the current and previous period plus the
     baseline. Used by A5; keep it small and documented.
8. **Seed:** give demo users 6 weeks of plausible reading history (wpm trend with noise,
   comprehension by type with a clear weak spot each, for example `demo.izmir` weak at
   `ANA_FIKIR`) and a baseline. Keep it idempotent.
9. Update `server/docs/veritabani.md` (tables, diagram, views, example queries).

## App

1. After registration (and for existing users when `needsPlacement` is true, once), show the
   placement flow in the app's design (`docs/tasarim/README.md`, `src/design/`): Pırıl `talk` → read text 1 → 3 questions → text 2 → 3
   questions → "Seni tanıdım!" with Pırıl `happy`. Reuse the reading and quiz screens or their
   components; do not duplicate logic. It can be skipped ("Sonra yapalım"), and it never blocks the
   journey.
2. Nothing else changes visually in this task.

## Done when

- Tests cover readability, band mapping, variant fallback, metrics calculation, the rushed flag,
  placement and the views.
- In Prisma Studio, `reading_metrics` and `v_student_weekly` show sensible rows for demo users.
- A new user sees the placement flow once; finishing a lesson writes a `reading_metrics` row.
