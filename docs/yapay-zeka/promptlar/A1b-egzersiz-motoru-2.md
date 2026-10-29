# A1b — Exercise engine, part 2 (no AI yet)

Follow `docs/yapay-zeka/promptlar/A-kurallar.md`. Read `02-egzersiz-katalogu.md` (E2, E3, E7, E8,
E9, E10). A1a must be merged; reuse its framework, endpoints and shell.

## 1. E2 Dinle, sonra oku and E3 Dinlerken oku

- Use `expo-speech` (install with `npx expo install`). First check the docs of the SDK in `package.json` for:
  - Turkish voice availability on iOS and Android
  - rate control
  - whether word-boundary events exist on each platform
- **E2:** Pırıl reads the text aloud (`talk` pose while speaking), then the child reads it
  (timed, like E1 read 1). Can be combined with E1 as its first step (`params.withPreview`).
- **E3:** Highlight while the audio plays.
  - If word-boundary events work on a platform, highlight words.
  - Otherwise highlight whole sentences using estimated timing from the speech rate.
  - The research favours sentence bands for struggling readers, so make `sentence` the default
    unit and `word` optional.
- If no Turkish voice is installed, explain kindly and skip the exercise (the picker must not
  offer it again on that device; store a capability flag locally).

## 2. E7 Kök ve ek ustası

- Seed ~10 items per band (written by you, correct Turkish morphology, words from existing
  texts).
- Mini games:
  - split a word into root and suffixes (tap boundaries)
  - build a word by adding suffixes
  - choose how a suffix changes meaning
  - meaning from context
- `data` contains the word, the correct segmentation, and per-game options.
- Add a validator test: each segmentation re-joins to the word.

## 3. E8 Anlama stratejileri (no free text yet)

- **Hikâye haritası:** drag cards (karakter, yer, sorun, çözüm) into boxes. Seed data for 10 texts.
- **En iyi özet hangisi?:** choose the best one-sentence summary among 3 (G2+).
- **Durup düşün:** a short check mid-text ("Şimdiye kadar ne oldu?") while reading, as a
  multiple-choice question.
- Free-text summary feedback and "Sen sor" come in A6 (they need AI).

## 4. E9 LGS paragraf and E10 Görsel okuma (G3-G4)

- Question renderer for 4-option LGS-style items, using the question types from A0. For premise
  questions, show "I, II, III" premises clearly. For verbal logic, provide an optional "tabloya
  yerleştir" helper grid.
- E10: simple bar, line and table charts drawn with `react-native-svg` from `data` (never images),
  with an accessible text description, plus questions.
- Seed ~6 E9 items and ~6 E10 items per band G3 and G4 (original content, never copied exam
  questions).

## 5. Picker update

Include the new types in `GET /me/training/today`:

- E2/E3 mainly for `G1`/`G2`
- E9/E10 for `G3`/`G4` with a weekly share that grows with grade
- E7/E8 when comprehension is low

## Done when

- Every exercise type E1-E10 can be played by the matching demo users.
- Sessions are stored with metrics.
- Lint, typecheck and tests pass.
