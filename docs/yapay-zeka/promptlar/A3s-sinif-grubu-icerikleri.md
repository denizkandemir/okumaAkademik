# A3s — Grade-band versions of the journey stories (static, no API)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. A0 is merged: `lesson_texts`, `grade_band`,
`src/lib/readability.ts`, `src/lib/grade-band.ts` (`ATESMAN_TARGET`) and the question labels
exist.

This task is the static part of A3. You write the content yourself, in this Claude Code
session, into the seed data. There are **no API calls** and no generation CLI; the API pipeline
in `A3-icerik-uretimi.md` comes later.

**One city per session.** I will tell you which city: "Şehir: istanbul". Do only that city.
Do not use subagents.

## Goal

Today every lesson has one text, which is the G2 version. Each of the city's 8 stories gets
three more versions: G1 (grades 1-2), G3 (5-6) and G4 (7-8). A child then reads the story at
their own level.

It is the same story in each version: same lesson, title, theme, characters and events. Only
these change:
- the length
- sentence length and complexity
- vocabulary
- the questions

## Writing rules

| | G1 (1-2) | G2 (3-4, existing) | G3 (5-6) | G4 (7-8) |
|---|---|---|---|---|
| Words | 60-120 | as is | 180-280 | 250-380 |
| Sentences | short, simple, mostly 5-8 words | as is | compound sentences allowed | richer structure, some figurative language |
| Ateşman | `ATESMAN_TARGET.G1` | as is | `ATESMAN_TARGET.G3` | `ATESMAN_TARGET.G4` |
| Options per question | 3 | 3 | 4 | 4 |

General rules:
- **Difficulty within the band:** keep each version inside its band's Ateşman range. Within
  the range, later stories in the journey may be a little harder.
- **Language:** natural, warm Turkish for children. Correct spelling (TDK). No violence, fear,
  brand names or real people. Facts about the city (places, food, history) must be true; if you
  are not sure about a fact, leave it out.
- **Glossary:** 2-4 entries per version. The word must appear in the text exactly as written;
  explain it in child language. G1 may have fewer.
- **`summary`:** belongs to the lesson and stays the same.

## Questions

- **Exactly 3 questions per version.** Stars and lokum assume 3.
- **Each question has:** `type`, `cognitiveLevel`, `hint` (points to the right place in the
  text without giving the answer) and `explanation` (praise plus one sentence). Follow the
  existing style in `seed-data/*.ts`.
- **One clearly correct option.** The other options are plausible but clearly wrong for a
  careful reader. Vary `correctIndex` across questions.
- **Rebalance question types.** Today 40% of the questions are `BILGI` (literal recall) and the
  LGS types are almost missing (A0a report). In the new versions:

  | Band | Types |
  |---|---|
  | G1 | `BILGI`, `NEDEN_SONUC`, `DUYGU_KARAKTER`, `SOZCUK_ANLAMI`. At most 1 `BILGI` per story. |
  | G3 | At most 1 `BILGI` per story. At least 1 of `ANA_FIKIR`, `BASLIK`, `YARDIMCI_FIKIR`, `CUMLEDE_ANLAM`, `NEDEN_SONUC` with inference. |
  | G4 | No `BILGI`. At least 1 of `ANA_FIKIR`, `YARDIMCI_FIKIR` or `BASLIK` per story. Use `CUMLEDE_ANLAM`, `PARAGRAF_YAPISI`, `SOZEL_MANTIK` and `ONCULLU_YORUM` where the text allows (`02-egzersiz-katalogu.md` §3). |

  Across the city, each band should use at least 4 different types.
- **Do not change the existing G2 texts or questions.** Children have attempts on those
  question ids.

## Code

1. Extend `story()` in `server/prisma/seed-data/build.ts` (and the types) so a story can carry
   versions per band:
   - text id: `<slug>-g1`, `<slug>-g3`, `<slug>-g4`
   - the G2 text keeps its current id
   - each version has its own paragraphs, questions and glossary
   - text metrics are computed with `textMetrics` as today
2. The seed links every version in `lesson_texts` and stays idempotent. If the seed needs to
   handle new texts or questions differently, change it minimally and keep D11's guard.
3. Check whether questions and glossary entries attach to texts in the schema. If adding the
   versions needs a migration, create it as A0a did (`migrate diff`, then `migrate deploy`) and
   stop if a reset is needed.
4. **Tests** (`server/test/seed-data.test.ts`), for every version:
   - word count in the band's range
   - Ateşman score in `ATESMAN_TARGET`
   - exactly 3 questions
   - 3 or 4 options by band, and `correctIndex` in range
   - glossary words appear in the text
   - the question type rules above, per story and per city

   The tests must fail before you write content for the city and pass after.
5. Library and journey: a child sees only their band's version. Check that the library does not
   list all four versions of the same story.

## Review document for the teacher

Write `docs/icerik/onay/<şehir>.md` in the same style as `docs/icerik/onay/seviye-belirleme.md`.
Our Turkish teacher reads it without code. For each story and each version (G1, G3, G4):
- title, band, word count, Ateşman score
- the text
- the questions with options, the correct answer marked, type, cognitive level, hint and
  explanation
- the glossary

At the top, add a short summary: the question type counts per band, and any G2 text whose
Ateşman score is outside `ATESMAN_TARGET.G2`. Do not rewrite those; list them for the teacher.

## Applying the teacher's corrections

When I paste the teacher's notes ("Şehir: istanbul, düzeltmeler: …"), apply them to the seed and
to the review document, then rerun the tests.

## Before you finish

- In `server/`: `npm run lint`, `npm run typecheck` and `npm test`.
- If it is needed for me to test on the phone, run `npm run db:seed`, but tell me first.
- Write a short report in Turkish:
  - texts and questions added
  - type counts per band
  - Ateşman range per band
  - anything you were unsure about (facts, words)
  - how I can try it: a demo user in each band, for example a grade 1 user and a grade 7 user;
    if the demo users do not cover every band, add or adjust one in the seed
