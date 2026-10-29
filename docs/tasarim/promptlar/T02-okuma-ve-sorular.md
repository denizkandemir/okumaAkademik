# T02 — Reading and questions

Follow `docs/tasarim/promptlar/T-kurallar.md`. T01 must be merged.

Screens:
- `ekranlar/08-okuma.jpg`, `09-soru.jpg`, `10-yanlis-cevap.jpg`, `11-dogru-cevap.jpg`
- their `kaynak/ekranlar/*.html`

Code:
- `src/app/reading/[id].tsx`
- `src/app/lesson/[id]/quiz.tsx`
- `src/features/reading/*`
- `src/features/game/quiz/*`

## Goal

The new look for the reading screen and the quiz, plus one interaction change in the quiz: choose
an answer first, then check it.

Keep everything else as it is:
- the reading session logic (start, progress, retry, finish, save on leave)
- the hardware back and leave confirmation from the bug sweep (bulgu 3-4, D1)
- the answer API and first-try counting
- the text sheet, the glossary and the free reading path from the library

## Reading screen

Follow `08-okuma`.

1. **Header:** `AppHeader`. Under it, a row with:
   - the back `IconButton`, which behaves like today's close: it asks to confirm if the child
     has made progress
   - the reading `ProgressBar` (scroll progress, as today)
   - two `IconButton`s, "A−" and "A+", instead of the old font menu. They change the reading
     font size within the existing `ReadingFont` limits, in steps of 2, and are disabled at the
     limits. Labels: "Yazıyı küçült" and "Yazıyı büyüt".
2. **Above the text:**
   - eyebrow "<ŞEHİR> · OKUMA `0n`" (`n` is the lesson position). In free reading the eyebrow
     is "<ŞEHİR> · KİTAPLIK".
   - the title in the `title` style
   - the theme as `ThemeTag`
3. **Story text:** Literata, the `reading` style, colour `readingText`. Paragraph spacing comes
   from the HTML.
4. **Glossary words** stay tappable. They get a dotted underline in the accent text colour (no
   purple any more). A tap opens a small card at the bottom with Pırıl `talk`, the word in bold,
   and its meaning, and it closes with a tap or the close button. This replaces the old speech
   bubble at the top. If the story has glossary words, a small muted line under the theme tag
   says "Altı noktalı kelimelere dokun, anlamını söyleyeyim."
5. **Footer:** a divider, the small text "Acele etme. Hikâyeyi anlamaya odaklan.", and the
   primary button:
   - in a lesson: "OKUDUM, HAZIRIM"
   - in free reading: "BİTİRDİM"

   The button stays enabled like today's BİTİRDİM. Error messages show in a `FeedbackPanel`
   above it.
6. The leave confirmation uses the new `ConfirmDialog`.

## Quiz

Follow `09`, `10` and `11`.

1. **Top:** `AppHeader`, then a row with the back `IconButton` (confirm as today), a
   `ProgressBar` with the answered share, and "`i` / `n`".
2. **Question:** eyebrow "PIRIL MERAK EDİYOR". Below it, a row with Pırıl (pose `think`, then
   `happy` after a right answer, about 96 dp) and the question in the `question` style.
3. **Options:** one `OptionCard` per option, lettered A, B, C (and D when there are 4; A0 will
   add them).
4. **New interaction:**
   - Tapping an option selects it (`selected`). The primary "KONTROL ET" is disabled until
     something is selected.
   - "KONTROL ET" sends the answer, as the old tap did, with the same API call and guards.
   - **Wrong:**
     - the chosen option turns `wrong` and stays disabled for this question
     - a `FeedbackPanel` (`wrong`) says "Bir daha bakalım mı?" followed by the API hint, or
       "İpucunu metinde bulabilirsin. Her deneme öğrenmenin bir parçası." if there is none
     - the primary "TEKRAR DENE" clears the selection
     - under it, the text link "Metne bak" opens the existing text sheet with the new look
   - **Right:**
     - the option turns `correct` and the others are disabled
     - a `FeedbackPanel` (`right`) says "Evet, tam da öyle!" followed by the API explanation
     - when the API gives lokum for a first-try answer, the panel adds a small line
       "+5 lokum"
     - the primary "SONRAKİ SORU", or "DEVAM ET" on the last question, which completes the
       lesson exactly as today
5. **Screen readers:** announce the result ("Doğru!" or "Tekrar deneyelim"). Focus moves to the
   feedback panel.
6. **Text sheet** ("Metne bak"): a form sheet with `SheetHeader`, the title and the story in
   Literata.

## Clean up

Delete the old quiz pieces that are no longer imported, for example the old answer option and
feedback panel, and the old reading header and font menu.

## Done when

- Reading and quiz match the screenshots on a small and a large phone, with the largest font
  size and large system font.
- A full lesson works: read, a wrong answer, "Metne bak", a right answer, the next question, and
  completion.
- Free reading from the library still works and ends on its finish view, which T03 restyles.
- Hardware back, leave confirmation, retry states and reduce motion are checked.
