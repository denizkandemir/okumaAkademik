# T04 — Welcome, account, settings, reminder and comeback

Follow `docs/tasarim/promptlar/T-kurallar.md`. T03 must be merged.

Screens:
- `ekranlar/15-karsilama.jpg`, `16-kayit.jpg`, `17-geri-donus.jpg`, `18-bildirim.jpg`,
  `19-ayarlar.jpg`
- their `kaynak/ekranlar/*.html`

Code:
- `src/app/(auth)/*`
- `src/features/auth/*`
- `src/app/(tabs)/profile.tsx` (where logout lives today)
- `src/lib/storage.ts`
- `server/src/modules/auth/*`

## Goal

The new look for the sign-in screens, plus three new things:
- a settings screen, with a server endpoint to change the name
- a real daily reading reminder (local notification)
- the "welcome back" screen

Auth logic, validation, error mapping, the double-submit guards (D3) and secure storage stay as
they are.

## Welcome (`(auth)/welcome.tsx`, `15-karsilama`)

- **Hero:** the İstanbul background, about 40% of the screen height, fading into the screen
  background. Pırıl `wave` stands on it, large.
- Eyebrow "PIRIL'IN ATLASI".
- Title on two lines: "Birlikte okuyalım." / "Dünyayı keşfedelim."
- Text "Ben Pırıl! Evime dönerken altı şehir gezeceğim. Hikâyeler bu yolculukta bize yol
  gösterecek."
- Primary "YOLCULUĞA BAŞLA" opens registration. The text link "Zaten bir yolculuğum var" opens
  login.
- Footnote "6 şehir · Her gün küçük bir keşif".

## Register (`(auth)/register.tsx`, `16-kayit`)

- A back `IconButton`, then Pırıl `wave`, small and centred.
- Eyebrow "YOLA ÇIKMADAN ÖNCE". Title "Sana nasıl seslenelim?". Text "Keşif pasaportunu
  birlikte hazırlayalım."
- Fields as `TextField`s, keeping today's rules and errors:
  - "Adın"
  - "Sınıfın": grades 1-8 as a grid of selectable chips in the option style. The design shows a
    select, but chips are easier for children; keep the current picker's behaviour and
    accessibility.
  - "Kullanıcı adı", with a muted helper line "Giriş yaparken bunu kullanacaksın."
  - "Şifre", with a show/hide toggle
- Primary "PASAPORTUMU HAZIRLA".
- Server errors show in a `FeedbackPanel` (wrong style) or under the field, as today.

## Login (`(auth)/login.tsx`, same language as register)

- Pırıl `wave`. Eyebrow "TEKRAR HOŞ GELDİN". Title "Yolculuğuna devam et".
- Fields "Kullanıcı adı" and "Şifre".
- Primary "YOLA DEVAM ET". The text link "Yeni bir yolculuk başlat" opens registration.

## Settings (`src/app/settings.tsx`, new; `19-ayarlar`)

The profile's settings `IconButton` (sliders) opens it. T05 places that button; until then, add
a temporary entry on the profile screen.

1. A back `IconButton`. Title "Yol arkadaşın". Text "Okuma alışkanlığını kendi ritmine göre
   kur."
2. **Name:**
   - a "Adın" field and the primary "ADI KAYDET"
   - it calls a new `PATCH /me` with `{ name }`
     - same validation as registration, on the server and in the app
     - returns the same user shape as `GET /me`
     - rate-limited like the other auth writes
     - Vitest tests: success, validation error, unauthenticated
   - on success, update the signed-in user in the app, so the header avatar and greetings
     change at once
3. **"Hatırlatma"** section. See the next part for how it works.
   - a `ToggleRow` "Okuma hatırlatması"
   - a time row "Okuma saati", default 19:30, that opens a time picker
   - the secondary "BİLDİRİMİ GÖR", which sends a sample notification in 5 seconds
   - a muted note "Hatırlatma ayarı yalnızca bu cihazda saklanır."
4. **Hesap** section: the secondary "ÇIKIŞ YAP" with the existing logout and its confirmation.
   Remove the old logout entry from the profile, since T05 rebuilds that screen.

## Daily reminder

- Use `expo-notifications`, installed with `npx expo install`, and a time picker that works in
  Expo Go. Check the docs for the `expo` version in `package.json`:
  - the picker could be `@react-native-community/datetimepicker`, or an `@expo/ui` picker if it
    fits
  - check which notification features Expo Go supports on Android and iOS; local scheduled
    notifications are what we need
  - if a platform's Expo Go cannot schedule them, show a friendly note in settings instead of
    failing, and tell me in the report
- **Permission:** ask only when the child turns the switch on. First show a short explanation in
  a `ConfirmDialog`: "Pırıl her gün seçtiğin saatte sana küçük bir okuma daveti göndersin mi?"
  If permission is denied, turn the switch back off and explain how to allow it in the phone's
  settings.
- **Scheduling:** one repeating daily notification at the chosen time, Europe/Istanbul local
  time on the device. Changing the time reschedules it; turning the switch off cancels it.
  Store `{ enabled, hour, minute }` in device storage. Logging out cancels the reminder and
  clears the setting.
- **Content** (from `18-bildirim`):
  - title "Pırıl'dan bir davet"
  - body "<Ad>, bugün hangi hikâyeyi keşfedelim? Kaldığın yer seni bekliyor."

  The name is used only on the device. On Android, use a channel named "Okuma hatırlatması".
- **Tapping the notification** opens the app on the home tab. It goes through the welcome-back
  check below.
- Do not build the `18-bildirim` mock-up as a screen; it is only a preview of the system
  notification.

## Welcome back (`src/app/welcome-back.tsx`, new; `17-geri-donus`)

- **When:** after sign-in is restored at app start, or when the app returns to the foreground,
  show it once per day if:
  - the child has read before (`lastReadAt` in `GET /me/stats`), and
  - the last reading was **2 or more Turkey days ago**

  Store the date it was last shown on the device. It never blocks; on any error, skip it.
- **Layout:**
  - `AppHeader`, then the eyebrow "YENİDEN MERHABA"
  - Pırıl `happy`
  - title "Hikâyen seni bekliyor, <Ad>."
  - text "<Şehir locative> yolculuğumuza küçük bir okuma molasıyla devam edelim mi?", for
    example "İstanbul'daki yolculuğumuza…", with the city locative from `src/design/cities.ts`
  - **Week strip,** from `stats.week`, Monday to Sunday with the initials P S Ç P C C P:
    - read days are sage circles with a check
    - today has a ring
    - future days are dimmed
    - each day has an accessibility label ("Salı, okundu")
  - primary "KALDIĞIM YERDEN DEVAM" opens the current lesson's card
  - secondary "PASAPORTUMA BAK" opens the Pasaport tab
  - a close action, which also responds to hardware back, goes home

## Done when

- A new user registers through the new screens, and an existing demo user logs in.
- The name change shows in the header at once and survives an app restart.
- The reminder can be turned on, the sample notification arrives in Expo Go on the phone,
  turning it off cancels it, and denied permission is handled.
- Welcome back shows for a demo user whose last reading is 2+ days old (adjust demo data in the
  seed if needed, idempotently) and not for one who read today.
- Server tests pass. Lint, tsc, large font and reduce motion are checked.
