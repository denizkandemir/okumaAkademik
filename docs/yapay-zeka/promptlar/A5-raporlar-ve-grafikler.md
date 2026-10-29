# A5 — Reports and charts ("Gelişimim")

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `03-yol-haritasi.md` §3 A5 and
`01-arastirma.md` §1 and §4. A4 must be merged.

## Goal

Daily, weekly and monthly feedback for the child, and a progress screen with charts.

## 1. Reports

- **Daily** (no AI): a template from `v_student_daily`. Example: "Bugün 12 dakika okudun, 2 hikâye
  bitirdin. Anlaman 3/3!" Speed is always shown together with comprehension.
- **Weekly** (AI, batch): extend A4's Sunday job so **one request** returns both the plan and the
  report (this is how `04-teknoloji-ve-maliyet.md` costs it). The report schema:
  - `highlights[]` (strengths with evidence from numbers, for example "neden-sonuç sorularında
    %90")
  - `focus[]` (1-2 things to improve, matching the plan's weekly focus)
  - `kidSummary` (≤ 3 short Turkish sentences, Pırıl's voice, encouraging, never shaming)
  - `poseHint`: one of the 8 mascot poses
- **Monthly** (AI, batch, first day of the month): progress vs. baseline and the previous month,
  goals reached, and next month's goal. It also triggers a re-plan.
- Store reports in `reports` (user, period type, period start, metrics snapshot, AI fields,
  `source`, `ai_request_id`). If AI is unavailable, generate a rule-based report so the screen is
  never empty.
- `GET /me/reports?period=week|month&limit=` and `GET /me/reports/latest`.

## 2. "Gelişimim" screen

Opened from Profile and from the training card.

- **Top:** Pırıl with the latest weekly `kidSummary` in a bubble.
- **Charts** with `react-native-svg`, simple and readable for children, consistent colors, no
  chart library unless it works in Expo Go:
  1. Words per minute over the last 8 weeks, with the baseline line and the child's goal band.
     Comprehension is shown on the same chart as dot color (green ≥ 80%, orange < 80%), with a
     legend.
  2. Comprehension by question type (horizontal bars, Turkish type names, strongest on top).
  3. Reading minutes per day this week (bars with the daily goal line).
  4. Exercise mix this week (small stacked bar or icon counts).
- Each chart has a one-sentence text summary under it, which is also its accessibility label.
- Period switch: Bu hafta / Bu ay.
- Empty state: Pırıl `read`: "Biraz daha okuyalım, sonra gelişimini birlikte görelim!"

## 3. Notifications hook

The weekly report can be announced with a local notification on Monday ("Pırıl haftalık
karneni hazırladı!"). Reuse the reminder code and settings screen from T04 (opt-in, its own
switch on the "Yol arkadaşın" settings screen).

## Done when

- Demo users show meaningful charts from seeded history.
- Weekly and monthly reports exist in mock mode and, after a live test on one demo user, with real
  AI text.
- Costs are visible in `npm run ai:cost`.
- The screen works on small phones and with large fonts.
