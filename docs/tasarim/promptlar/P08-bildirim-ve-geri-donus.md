# P08 — Reminder notifications and the "welcome back" screen

> Part 9 of 10. P00-P07 must be committed. Do only this part.

## Context

Designs: `docs/tasarim/ekranlar/19-bildirim.jpg` (how the reminder looks on the lock screen)
and `20-geri-donus.jpg` (the screen shown when the child comes back). Sources:
`kaynak/S12Bildirim.dc.html`, `kaynak/S13GeriDonus.dc.html`. Data: `GET /me/stats`
(`streak`, `streakAtRisk`, `week`, `lastReadAt`) and `GET /me/journey` (current lesson).

There is no push server. Reminders are **local scheduled notifications** on the device.

## Rules

Same rules as P00 (read "Rules for every part" in
`docs/tasarim/promptlar/P00-temel-ve-tasarim-dili.md`). Install `expo-notifications` with `npx expo install` and read the SDK 57
docs first, especially the Expo Go limitations, the Android notification channel, and
permissions. If local notifications cannot work in Expo Go on a platform, keep the feature
behind a capability check, make the rest work, and tell me exactly what needs a dev build.
Children's app: never ask for notification permission on first launch.

## Task

1. **`src/features/reminders/`**:
   - Settings stored on the device (add keys to `src/lib/storage.ts`): `enabled` (default
     off), `time` (default 19:30).
   - `scheduleReminders(stats)`: cancel our scheduled notifications and schedule one-off
     reminders for the next 7 days at the chosen time, **skipping today if the child already
     read today**. Text:
     - streak ≥ 2: title "Serin bugün bitmesin!", body "<N> günlük serini korumak için tek
       hikâye yeter."
     - otherwise: title "Pırıl seni özledi!", body "Uyuyakaldım, beni bir hikâyeyle
       uyandırır mısın? Sadece 5 dakika!"
     Android: a channel named "Okuma hatırlatıcısı". Notification data contains
     `{ screen: 'welcome-back' }`.
   - Reschedule on app start (after login), after every completed lesson or reading, and when
     settings change. Cancel all on sign-out.
2. **Opt-in UI:** a card on the Profile screen with Pırıl `sleep` (small), "Pırıl her akşam
   sana hatırlatsın mı?", a switch, and time chips (17:00, 18:00, 19:00, 19:30, 20:00). Turning
   it on asks for permission; if denied, show a friendly explanation and a button that opens
   the system settings. Also show this card once on the lesson complete screen after the
   child's first finished lesson (dismissible, never again).
3. **Welcome back** `src/app/welcome-back.tsx` like `20-geri-donus.jpg`: soft peach gradient,
   "Seni çok özledim!" (Baloo 2, orange-red), Pırıl `wave` with floating hearts (stop with
   reduce motion), text "Kaldığımız yerden devam edelim mi? <current lesson title>
   hikâyesini çok merak ediyorum.", streak card ("<N> günlük serin hâlâ devam ediyor" /
   "Bugün okursan <N+1> gün olacak"; if the streak is broken: "Yeni bir seri başlatalım!")
   with the 7-day strip (done days orange with checks, today dashed "?"), blue
   "HİKÂYEYE DEVAM ET" → current lesson card, "Ana sayfaya git".
   Show it when (a) the app is opened from our notification, or (b) the app becomes active,
   the child has not read for 2+ days (`lastReadAt`), and it was not shown today.
4. Handle notification taps when the app is killed, in the background and in the foreground
   (foreground: do not show a system alert while the app is open).

## Done when

- On a real device: enabling the reminder schedules 7 notifications (log them in `__DEV__`),
  reading today removes today's, the notification opens "welcome back".
- Permission denied/blocked paths are friendly. Lint and typecheck clean. One commit, not
  pushed. Report in Turkish, including any Expo Go limitation you found.
