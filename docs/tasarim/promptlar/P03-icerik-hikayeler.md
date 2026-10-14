# P03 — Content: 48 city stories with questions and glossary

> Part 4 of 10. Do only this part. Only `server/prisma/seed-data/` changes (plus tests if needed).

## Context

P02 created the lesson structure with placeholder stories marked `// TODO(P03)`. Replace every
placeholder with real content. Each city has 8 stories (orders 1-4 and 6-9; 5 and 10 are
chests). The journey is shared by all grades, so write for **2nd-4th grade** readers in
İstanbul and İzmir and get gradually richer towards Van (Efes/Antalya `ORTA`, Kapadokya/Van
`ORTA` or `ILERI`). Set `minGrade: 1`, `maxGrade: 8` for journey texts.

Pırıl is a white Van cat with one amber and one blue eye, wearing a blue bandana with an evil
eye bead. She is travelling home to Van and the child helps her by reading. Pırıl may appear in
some stories, but most stories are about the places, their people, animals and small
everyday adventures.

## City themes and fixed titles

Keep the titles marked "fixed" (they appear in the design); invent the others.

- **İstanbul — "Boğaz'ın Hikâyeleri":** vapur, martılar, simit, Kız Kulesi, Galata, Boğaz
  köprüsü, Kapalıçarşı. Order 3 is the existing **"Minik Serçe"** (fixed, keep the text).
  Keep "Bahçedeki Domatesler" at a fitting order.
- **İzmir — "Kordon'un Rüzgârı":** Kordon, Saat Kulesi, boyoz, Kemeraltı, tramvay, imbat
  rüzgârı. Order 3: **"Kordon'da Bisiklet"** (fixed).
- **Efes — "Antik Kentin Sırları":** Celsus Kütüphanesi, antik tiyatro, mozaikler, arkeolog,
  eski yazılar. Order 3: the existing **"Kayıp Anahtar"** (fixed, keep the text).
- **Antalya — "Portakal Kokulu Sahil":** portakal bahçeleri, Kaleiçi, gulet, deniz kaplumbağası,
  Düden şelalesi. Order 4: **"Portakal Bahçesi"** (fixed). Keep "Deniz Feneri Bekçisi".
- **Kapadokya — "Balonlar Yükselirken":** sıcak hava balonları, peri bacaları, yeraltı şehri,
  çömlekçilik. Order 2: **"Uçan Balon"** (fixed). Keep "Gökyüzündeki Haritalar".
- **Van — "Pırıl'ın Memleketi":** Van Gölü, Akdamar Adası, Van Kalesi, Van kedileri, Van
  kahvaltısı, inci kefali. Order 9 (last story): **"Eve Dönüş"** (fixed) — Pırıl arrives home
  and thanks the child; warm ending.

## Each lesson

- Every lesson (stories and chests) gets a one-sentence `summary` for the lesson card.
  Chests are titled "Hazine Sandığı" with a short playful summary.

## Each story

- 4-6 short paragraphs, 90-180 words in total (shorter in İstanbul, longer in Van);
  `estimatedMinutes` realistic (2-5).
- Correct, natural Turkish with full diacritics (ç, ğ, ı, İ, ö, ş, ü, â). Short sentences,
  concrete words, a small problem and a kind resolution. No violence, no scary content, no
  brands, no politics or religion beyond naming landmarks. Facts about places must be true
  and simple (e.g. Celsus Kütüphanesi is in Efes; Van kedilerinin gözleri farklı renkte
  olabilir).
- **3 questions**: one literal ("ne oldu?"), one vocabulary/inference, one about feelings or
  the lesson of the story. Exactly 3 options, one correct, plausible distractors of similar
  length, correct answer position varied across questions. `hint` points the child back to
  the right part of the text without giving the answer ("İpucu: Hikâyede rüzgârın çok güçlü
  olduğu yazıyor. Böyle bir rüzgârda yuva ne olur?"). `explanation` praises and explains in
  one sentence.
- **2-3 glossary words** that appear exactly as written in the text, with one-sentence,
  kid-friendly meanings.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Split the work city by city: after each city run `npm run db:reset` and the
tests, then continue. Add a seed validation test (or a check in the seed) that fails if any
story has ≠ 3 questions, ≠ 3 options, an out-of-range `correctIndex`, a glossary word not
found in its text, or a duplicate id.

## Done when

- No `TODO(P03)` left. All 48 stories, 144 questions and glossary entries are in place.
- Seed and tests pass. One commit, not pushed. Report in Turkish with the list of titles per
  city so I can review them.
