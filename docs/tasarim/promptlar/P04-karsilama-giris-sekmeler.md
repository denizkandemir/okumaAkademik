# P04 — Welcome, login/register and the floating tab bar

> Part 5 of 10. P00-P03 must be committed. Do only this part.

## Context

Designs: `docs/tasarim/ekranlar/01-karsilama.jpg`, `02-giris.jpg` and the floating tab bar at
the bottom of `03-ana-sayfa-istanbul.jpg`. Sources: `kaynak/S01Karsilama.dc.html`,
`kaynak/S02Giris.dc.html`, the `<nav>` in `kaynak/AnaSayfa.dc.html`.

Current code: `src/app/(auth)/_layout.tsx` (login, register), `src/app/(auth)/login.tsx`,
`register.tsx`, `src/features/auth/grade-picker.tsx`, `src/app/(tabs)/_layout.tsx` →
`src/components/app-tabs.tsx` (NativeTabs) and `app-tabs.web.tsx` (headless `expo-router/ui`
tabs).

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Use the components from `src/features/game/ui/`, `CityScene` from P01 and
`Mascot`/`MascotBubble` from `src/features/mascot/`. Keep all existing auth logic, validation
and error handling; this is a visual change plus one new screen.

## Task

1. **Welcome screen** `src/app/(auth)/welcome.tsx` (first screen of the auth stack, set it as
   the initial route): İstanbul scene on top, "Okumatik" title with the subtitle "Okudukça
   Türkiye'yi gez!", Pırıl `wave` pose large (≈280) overlapping the scene, white speech bubble
   "Merhaba! Ben Pırıl. Memleketim Van'a dönüyorum. Yolda hikâye okumama yardım eder misin?"
   ("Pırıl" in orange), three info chips ("6 şehir", "Yüzlerce hikâye", "Her gün 5 dakika"),
   blue `GameButton` "HADİ BAŞLAYALIM" → register, white button "Zaten hesabım var" → login.
   Small screens: the content must not overlap; scale the mascot down if height < 700.
2. **Login** restyle like `02-giris.jpg`: warm cream gradient background, back button, Pırıl
   `talk` pose with the bubble "Tekrar hoş geldin! Kullanıcı adını yazar mısın?" (mascot
   `talking` while the bubble is typing), white form panel titled "Giriş yap", labelled
   fields, eye toggle on the password, blue "GİRİŞ YAP" button, "Hesabın yok mu? Kayıt ol"
   link. Form errors: Pırıl switches to `think` and the bubble shows the error in friendly
   words.
3. **Register** in the same style (Pırıl `wave`, bubble "Seni tanıyalım! Adın ne, kaçıncı
   sınıftasın?"), restyle the grade picker as big round chips 1-8.
4. Restyle `TextField` usage inside these screens to the design (rounded 16, 2 px border, focus
   border blue `#2453C9` with a soft blue glow). Do not break other users of `TextField`.
5. **Floating tab bar** for all platforms (replace NativeTabs; one implementation using the
   headless `Tabs`/`TabList`/`TabTrigger`/`TabSlot` from `expo-router/ui` — check the SDK 57
   docs): a white rounded bar (radius 26, height 70) floating 14 dp above the safe area, four
   items with icons and labels: **Yol** (`index`), **Kitaplık** (`library`), **Rozetler**
   (new `src/app/(tabs)/badges.tsx`, placeholder for now), **Profil** (`profile`). The active
   item is a rounded pill filled with the **current city's banner gradient** (`CITY_THEMES`);
   until P05 provides the current city, use İstanbul. Update `Screen`'s bottom inset
   (`BottomTabInset`) so content is not hidden behind the bar. Delete `app-tabs.web.tsx` if the
   new implementation works on web too.

## Done when

- Fresh install → welcome → register/login works on iOS and Android; screens match the
  screenshots; keyboard does not cover the form (scroll/keyboard avoiding).
- Tab bar works with VoiceOver/TalkBack (`accessibilityRole="tab"`, selected state).
- Lint and typecheck clean. One commit, not pushed. Report in Turkish.
