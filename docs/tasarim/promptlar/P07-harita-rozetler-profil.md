# P07 — Journey map, badges, profile and library style

> Part 8 of 10. P00-P06 must be committed. Do only this part.

## Context

Designs: `docs/tasarim/ekranlar/18-yolculuk-haritasi.jpg` and `21-profil.jpg`. Sources:
`kaynak/S11Harita.dc.html`, `kaynak/S14Profil.dc.html`. Data: `GET /me/journey` (cities) and
`GET /me/stats` from P02. The library (`src/app/(tabs)/library.tsx`) has no dedicated design:
restyle it with the same game components.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). City thumbnails use `CityScene` with `animated={false}`.

## Task

1. **Journey map** `src/app/journey-map.tsx` (opened from the map button on the home banner;
   push with a back button), like `18-yolculuk-haritasi.jpg`: header "Pırıl'ın Yolculuğu" and
   "Seviye atladıkça yeni şehir açılır"; six city cards in order, each with a 112 dp static
   scene thumbnail (rounded), "N. DURAK · SEVİYE a-b", city name, and status:
   - completed: green check badge on the thumbnail, "Tamamlandı · 10 ders".
   - current: highlighted card (2 dp border in the city color, soft glow), "Buradasın ·
     Seviye N", a progress bar, and Pırıl `wave` (≈82) peeking at the card's top right.
   - locked: thumbnail grayscale + dimmed (use a semi-transparent overlay; grayscale filters
     are not reliable on all platforms), lock badge, "Seviye X'te açılır"; Van says "Final:
     Pırıl'ın memleketi".
   Tapping a completed or current city opens that city's path (home screen in "view city"
   mode via `GET /me/journey?city=…`, with a "Şu anki şehrime dön" button); locked → Pırıl
   tip "Bu şehir Seviye X'te açılacak!".
2. **Profile** `src/app/(tabs)/profile.tsx` like the top half of `21-profil.jpg`: blue header
   with the initial avatar, name, "Seviye N · K. sınıf", Pırıl `happy` with the bubble
   "Seninle gurur duyuyorum!"; four stat tiles ("gün seri", "lokum", "hikâye", "dakika");
   below: today's reading minutes vs. daily goal (small `ProgressTrack`), "Sertifikam" entry
   (only when finished → `/finale`), and the existing sign-out action restyled. Keep the
   existing sign-out logic.
3. **Badges tab** `src/app/(tabs)/badges.tsx` (created as a placeholder in P04), like the bottom
   half of `21-profil.jpg`: "ŞEHİR ROZETLERİ" — six round badges (88 dp, border-box ring:
   gold for reached cities, grey for locked; the city scene thumbnail cropped inside the
   circle; locked ones dimmed) with names; "BAŞARILAR" — achievement tiles from
   `/me/stats` (earned ones colored with an icon, not earned ones grey with a lock and the
   requirement text, e.g. "7 gün seri yap"); the "BU HAFTA" streak strip (7 day circles like
   `20-geri-donus.jpg`). Nothing may overlap on a 375×667 screen.
4. **Library** `src/app/(tabs)/library.tsx`: same data and behavior, new look — cream
   background, title "Kitaplık" (Baloo 2), cards as white `Panel`s with the title, level chip,
   minutes and a purple "OKU" button; empty state with Pırıl `read`.
5. Make sure the tab bar's active pill and the screens use the current city theme where the
   design shows it.

## Done when

- Map, profile, badges and library match the designs for `demo.izmir` and `demo.van`, work
  on small screens, and have proper accessibility labels.
- Lint and typecheck clean. One commit, not pushed. Report in Turkish.
