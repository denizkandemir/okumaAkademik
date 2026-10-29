# A6 — Pırıl's AI conversations

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §3 A6. A2 and A5 must
be merged.

## Goal

Pırıl's celebrations and tips feel fresh and personal, safely and cheaply. Most messages come from
reviewed pools; only two features call the AI live.

## 1. Message pools

- `piril_messages` table:
  - `situation` enum: `DERS_SONU`, `SEVIYE_ATLADI`, `SEHIR_ACILDI`, `SERI`, `SERI_TEHLIKEDE`,
    `GERI_DONUS`, `ZORLANMA`, `ANTRENMAN_BASLANGIC`, `ANTRENMAN_BITTI`, `HAFTALIK_IPUCU`
  - `grade_band`, nullable `city`
  - `text` with slots such as `{sehir}`, `{seri}`, `{dakika}` (never a name slot from the
    server; the app may prepend the child's name on the device)
  - `pose` (one of the 8), `status`, `source`
- Generation through A3's pipeline (new kind `piril`): 15-20 variants per situation × band (and per
  city where it fits), with automatic checks (length ≤ 140 characters, allowed slots only, banned
  words) and review in `content:review`.
- `GET /piril/message?situation=...&city=...` returns a random approved message for the user's
  band, avoiding the user's last 10 messages (store recent ids).
- Replace the hard-coded texts in the matching places: lesson complete, level up, city unlocked,
  streak, comeback, training start and end, home bubble. Keep the current texts as the fallback
  when the endpoint fails.

## 2. Live feature 1: summary feedback (E8 "Pırıl'a bir cümleyle anlat", G3-G4)

- The child writes a one-sentence summary (max 200 characters).
- Task `feedback.summary` (`acceptsChildText`). Input: the text (from our database), the
  summary, and the band.
- **Output:** `{ hasMainIdea: boolean, tooMuchDetail: boolean, feedback: string (≤ 2 sentences),
  pose }`. The feedback is encouraging, concrete, never shaming, and never repeats any personal
  information the child may have typed.
- Before sending, mask anything that looks like a name, phone number, address or e-mail in the
  child's text. If the text is empty, off-topic or unsafe, return a kind pool message instead.
- Rate limit: 5 per day per child. Show the AI feedback in Pırıl's bubble with the returned pose.

## 3. Live feature 2: "Sen sor" (child asks Pırıl about the text)

- Task `qa.text`, grounded strictly in the text.
- **Output:** `{ answerable: boolean, answer: string (≤ 2 sentences), quote?: string }`.
- If the question is not about the text, Pırıl kindly redirects to the story. Never answer
  general questions (no general chatbot).
- Same masking and limits as the summary feedback (5 per day).

## 4. Fallbacks and safety

Any failure (`refused`, `budget_exceeded`, `error`, invalid output) shows a pool message for the
situation. Add tests for masking, limits and fallbacks in mock mode.

## Done when

- Pools are generated, reviewed and served on all listed screens.
- Summary feedback and "Sen sor" work live on a demo G3 user within limits.
- Costs are visible in `npm run ai:cost`.
