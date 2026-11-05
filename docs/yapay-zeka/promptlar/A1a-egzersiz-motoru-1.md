# A1a — Exercise engine, part 1 (no AI yet)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `02-egzersiz-katalogu.md` (E1, E4, E5, E6
and E11 in detail) and `03-yol-haritasi.md` §3 A1. A0 and A3s must be merged; E11 needs the G1
versions of the stories.

## Goal

A shared exercise framework and the first five exercises, reachable from a "Bugünün antrenmanı"
card on the home screen. Content comes from existing texts, including the A3s grade-band versions;
AI-made content arrives later.

## Server

1. **Data model** (follow `veritabani.md`):
   - Enum `exercise_type`: `TEKRARLI_OKUMA` (E1), `DINLE_SONRA_OKU` (E2), `DINLERKEN_OKU` (E3),
     `OBEK_OKUMA` (E4), `HIZLI_KELIME` (E5), `PIRIL_ISIGI` (E6), `KOK_EK` (E7),
     `ANLAMA_STRATEJI` (E8), `LGS_PARAGRAF` (E9), `GORSEL_OKUMA` (E10), `HECE_TOPU` (E11). Declare
     all eleven now.
   - `exercise_items` (content):
     - slug `id`, `type`, `grade_band`
     - optional `text_id`
     - `params` (jsonb, validated per type with zod)
     - `data` (jsonb, per type)
     - `status` enum `content_status` (`DRAFT`, `REVIEW`, `APPROVED`, `REJECTED`; seeded = `APPROVED`)
     - `source` enum (`SEED`, `AI`)
     - timestamps
   - `exercise_sessions`:
     - `user_id`, `item_id`
     - `params_used` (jsonb), `started_at`, `finished_at`, `duration_seconds`
     - readable numeric columns: `wpm_first`, `wpm_last`, `comprehension`, `score`
     - `details` (jsonb)
2. **Per-type param/data schemas** in `server/src/modules/exercises/types/` (one file per type,
   zod). Example E6 params: `speedFactor` 1.05-1.20, `segmentWords`, `fadeUnit` (`line` | `word`).
3. **Endpoints**:
   - `GET /me/training/today` returns 1-3 approved items for the user's band. Pick them with
     simple rules for now:
     - no E6 for `G1`
     - E11 only for `G1` (A4 may later give it to very slow G2 readers)
     - no E6 when the last 5 comprehension values average < 0.6
     - no same type twice in a row
     - total ≈ 5-10 minutes

     A4 will replace this picker; keep it behind one function.
   - `POST /exercises/:itemId/sessions` starts a session and returns the item with effective
     params.
   - `PATCH /exercise-sessions/:id` finishes it with metrics; the server re-validates and caps
     values the same way reading sessions do.
4. **Rewards and streak:** a finished exercise counts as a reading day for the streak and gives +3
   lokum (new `lokum_reason` `EXERCISE`, at most 3 rewarded exercises per day). Exercises never
   change level or city progress. Update the journey rules tests.
5. **Seed items from existing texts** (`source = SEED`):
   - **E1:** 2 items per band from short texts.
   - **E4:** chunk markup made by a deterministic Turkish chunker (`server/src/lib/chunker.ts`):
     split at punctuation and before common conjunctions (ve, ama, çünkü, fakat, ile, için, gibi);
     no chunk longer than ~4 words. Tested, and the chunks must re-join to the original text
     exactly. A3 will replace these with AI chunks.
   - **E5:** word lists picked from the text: glossary words plus long words (≥ 3 syllables), with
     distractors of similar length from other texts of the same band.
   - **E6:** whole text with its existing questions at the end.
   - **E11:** for `G1` only, 2 items per city from the G1 story versions (40-100 words), with 1-2
     of the version's easiest questions. Syllables come from a deterministic Turkish syllabifier,
     `server/src/lib/syllables.ts`:
     - one vowel per syllable
     - one consonant between vowels goes to the next syllable ("ka-pı")
     - with two consonants, the first stays and the second goes ("kar-deş")
     - with three, the last one goes ("Türk-çe", "kork-tu")
     - keep apostrophes and punctuation attached
     - lowercase with `tr-TR`

     Unit-test it with real Turkish words, including İ/I, loanword clusters ("tren", "spor") and
     words with circumflex vowels. The syllables of a word must re-join to the word exactly.
     Store syllables per word in `data` so the app does no splitting.

## App

1. **"Bugünün antrenmanı" card** on the home screen, between the chapter bar and the map, compact
   and in the app's design (`docs/tasarim/README.md`, `src/design/`). Shows the 1-3 exercises with icons and minutes and a "BAŞLA" button. When everything is
   done: Pırıl `happy` with "Bugünkü antrenman tamam!". It must not hide the lesson path; collapse
   it to a chip when scrolled.
2. Shared exercise shell `src/features/exercises/`: header with close and progress, Pırıl helper,
   finish screen with the result and lokum, and an API client for sessions.
3. **E1 Tekrarlı okuma:**
   - Read the same text 2-4 times; time each read.
   - After each read, a small line chart of words per minute, drawn with `react-native-svg`, with
     a goal line at first read +10-20%.
   - After the last read, the text's questions.
   - The result says "Hız +18%, anlama 3/3" — always both.
4. **E4 Öbek öbek oku:**
   - Show chunk boundaries as a thin gap plus a subtle `/` marker; three cue levels (full, half,
     none).
   - After reading, one or two questions.
5. **E5 Hızlı kelime:**
   - A word flashes for N ms, then the child picks it among 3-4 similar options.
   - N shrinks with success.
   - Leads directly into reading the text the words came from.
6. **E6 Pırıl'ın ışığı:**
   - The child reads the first segment at their own pace (baseline).
   - Then a soft light fades already-read lines **behind** the reader at baseline × `speedFactor`,
     animated with Reanimated on the UI thread.
   - A pause button is always available. Questions follow at the end.
   - `speedFactor` for the next session moves ±0.03 based on comprehension (≥ 0.8 up, < 0.8 down,
     clamped 1.05-1.20). Store it in session details.
   - With reduce motion on, the fade is replaced by a static progress marker.
   - Max 5 minutes per day.
7. **E11 Hece hece oku (zıplayan top):**
   - Show the text with syllable boundaries as a thin gap and an alternating subtle colour; follow
     the reading tokens.
   - A small ball (or Pırıl's paw) hops from syllable to syllable on a smooth arc with Reanimated
     on the UI thread; the child reads aloud. No audio in this version.
   - **Pace:** in syllables per second. Start at about 90-100% of the child's own pace from the
     baseline (word wpm × the text's average syllables per word ÷ 60). If there is no baseline,
     use a calm band default. "Yavaş / Normal" switch, pause and resume. Tapping a word restarts
     the ball at that word. Store the pace used in session details.
   - The pace never pushes the child: after a session the next pace changes by at most ±5%, and
     only upward when comprehension is ≥ 0.8.
   - **Reduce motion:** no hopping; the current syllable is highlighted by colour only.
   - One or two questions at the end. Max 5 minutes per day.
   - Never call it an eye exercise in the copy. Pırıl says something like: "Topu takip et, heceleri
     sesli oku!"
8. Each exercise has clear Turkish instructions read by Pırıl in a bubble on first use. E6 is
   introduced as a reading-pace exercise, never as an eye exercise (`02-egzersiz-katalogu.md`
   E6 "Tanıtım dili").

## Done when

- `demo.izmir` sees a training card, can play E1, E4, E5 and E6, and the sessions appear in
  Prisma Studio with sensible metrics.
- A grade 1-2 user (for example `elif`) gets E11 and can play it; the ball follows the syllables
  at the child's pace.
- `G1` users never get E6, and only `G1` users get E11.
- The syllabifier tests pass.
- Lint, typecheck and tests pass.
