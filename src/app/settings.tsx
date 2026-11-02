import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { ConfirmDialog } from '@/design/components/confirm-dialog';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { TextField } from '@/design/components/text-field';
import { ToggleRow } from '@/design/components/toggle-row';
import { BackIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import { useAuth } from '@/features/auth/auth-context';
import { hasErrors, pickFieldErrors, validateName } from '@/features/auth/validation';
import {
  DEFAULT_REMINDER,
  REMINDER_SUPPORTED,
  cancelDaily,
  hasPermission,
  loadReminder,
  requestPermission,
  saveReminder,
  scheduleDaily,
  sendSample,
  type ReminderSettings,
} from '@/features/reminder/reminder';
import { ReminderTimeRow } from '@/features/reminder/reminder-time-row';
import { ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

/** İzin penceresinden sonra yapılacak iş: hatırlatmayı açmak ya da örnek bildirim göndermek. */
type PendingAction = 'enable' | 'sample';

type Notice = { tone: 'right' | 'wrong'; title: string; text: string };

const PERMISSION_DENIED: Notice = {
  tone: 'wrong',
  title: 'Bildirim izni kapalı',
  text: 'Hatırlatmayı açmak için telefonunun Ayarlar uygulamasında Bildirimler bölümünden bu uygulamaya izin ver, sonra yeniden dene.',
};

/** Ayarlar (19-ayarlar): ad, okuma hatırlatması ve çıkış. */
export default function SettingsScreen() {
  const { user, updateName, signOut } = useAuth();

  const [name, setName] = useState(user?.name ?? '');
  const [nameError, setNameError] = useState<string | undefined>();
  const [nameNotice, setNameNotice] = useState<Notice | null>(null);
  const [savingName, setSavingName] = useState(false);

  const [reminder, setReminder] = useState<ReminderSettings>(DEFAULT_REMINDER);
  const [reminderNotice, setReminderNotice] = useState<Notice | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [busy, setBusy] = useState(false);

  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    loadReminder()
      .then(setReminder)
      .catch(() => {});
  }, []);

  if (!user) return null;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  const handleSaveName = async () => {
    if (savingName) return;
    const errors = validateName(name);
    setNameError(errors.name);
    setNameNotice(null);
    if (hasErrors(errors)) return;

    setSavingName(true);
    try {
      const trimmed = name.trim();
      await updateName(trimmed);
      setName(trimmed);
      setNameNotice({
        tone: 'right',
        title: 'Kaydedildi',
        text: `Sana artık ${trimmed} diyeceğim.`,
      });
      // Açık hatırlatma yeni adla yeniden kurulur.
      if (reminder.enabled && REMINDER_SUPPORTED) {
        await scheduleDaily(trimmed, reminder.hour, reminder.minute).catch(() => {});
      }
    } catch (error) {
      const fieldErrors = pickFieldErrors(
        error instanceof ApiError ? error.fieldErrors : undefined,
        ['name'] as const,
      );
      if (fieldErrors) setNameError(fieldErrors.name);
      else setNameNotice({ tone: 'wrong', title: 'Hımm, olmadı!', text: getErrorMessage(error) });
    } finally {
      setSavingName(false);
    }
  };

  const updateReminder = async (next: ReminderSettings) => {
    setReminder(next);
    await saveReminder(next);
    if (next.enabled) await scheduleDaily(user.name, next.hour, next.minute);
    else await cancelDaily();
  };

  /** İzin varsa işi hemen yapar; yoksa önce açıklama penceresini gösterir. */
  const runWithPermission = async (action: PendingAction) => {
    if (busy) return;
    setReminderNotice(null);
    if (await hasPermission().catch(() => false)) await perform(action);
    else setPending(action);
  };

  const perform = async (action: PendingAction) => {
    setBusy(true);
    try {
      if (action === 'enable') {
        await updateReminder({ ...reminder, enabled: true });
      } else {
        await sendSample(user.name);
        setReminderNotice({
          tone: 'right',
          title: 'Bildirim yolda',
          text: "5 saniye içinde Pırıl'ın davetini göreceksin.",
        });
      }
    } catch {
      setReminderNotice({
        tone: 'wrong',
        title: 'Hımm, olmadı!',
        text: 'Bildirim kurulamadı. Biraz sonra tekrar dene.',
      });
    } finally {
      setBusy(false);
    }
  };

  const handlePermissionAccepted = async () => {
    const action = pending;
    setPending(null);
    if (!action) return;
    const granted = await requestPermission().catch(() => false);
    // İzin verilmezse anahtar kapalı kalır.
    if (granted) await perform(action);
    else setReminderNotice(PERMISSION_DENIED);
  };

  const handleToggle = (enabled: boolean) => {
    if (enabled) void runWithPermission('enable');
    else {
      setReminderNotice(null);
      void updateReminder({ ...reminder, enabled: false }).catch(() => {});
    }
  };

  const handleTimeChange = (hour: number, minute: number) => {
    void updateReminder({ ...reminder, hour, minute }).catch(() => {
      setReminderNotice({
        tone: 'wrong',
        title: 'Hımm, olmadı!',
        text: 'Saat kaydedilemedi. Tekrar dene.',
      });
    });
  };

  return (
    <Screen header={<AppHeader />}>
      <IconButton accessibilityLabel="Geri" onPress={goBack} style={styles.back}>
        <BackIcon />
      </IconButton>
      <View style={styles.heading}>
        <AppText variant="title" accessibilityRole="header">
          Yol arkadaşın
        </AppText>
        <AppText color={colors.textMuted}>Okuma alışkanlığını kendi ritmine göre kur.</AppText>
      </View>

      <TextField
        label="Adın"
        placeholder="Adını yaz"
        maxLength={40}
        value={name}
        onChangeText={(value) => {
          setName(value);
          setNameNotice(null);
        }}
        error={nameError}
        autoCapitalize="words"
        autoComplete="given-name"
        textContentType="givenName"
        returnKeyType="done"
        onSubmitEditing={handleSaveName}
      />
      <Button
        title="ADI KAYDET"
        accessibilityLabel="Adı kaydet"
        onPress={handleSaveName}
        loading={savingName}
        disabled={name.trim() === user.name}
      />
      {nameNotice ? <FeedbackPanel {...nameNotice} /> : null}

      <AppText variant="heading" accessibilityRole="header" style={styles.section}>
        Hatırlatma
      </AppText>
      {REMINDER_SUPPORTED ? (
        <>
          <ToggleRow
            label="Okuma hatırlatması"
            value={reminder.enabled}
            onValueChange={handleToggle}
            disabled={busy}
          />
          <ReminderTimeRow
            hour={reminder.hour}
            minute={reminder.minute}
            onChange={handleTimeChange}
            disabled={busy}
          />
          <Button
            title="BİLDİRİMİ GÖR"
            accessibilityLabel="Bildirimi gör"
            accessibilityHint="5 saniye sonra örnek bir bildirim gönderir"
            variant="secondary"
            onPress={() => void runWithPermission('sample')}
            disabled={busy}
          />
          {reminderNotice ? <FeedbackPanel {...reminderNotice} /> : null}
        </>
      ) : (
        <AppText color={colors.textMuted}>
          Okuma hatırlatması bu cihazda kullanılamıyor. Telefonda dene.
        </AppText>
      )}
      <AppText variant="secondary" color={colors.textMuted}>
        Hatırlatma ayarı yalnızca bu cihazda saklanır.
      </AppText>

      <AppText variant="heading" accessibilityRole="header" style={styles.section}>
        Hesap
      </AppText>
      <Button
        title="ÇIKIŞ YAP"
        accessibilityLabel="Çıkış yap"
        variant="secondary"
        loading={signingOut}
        onPress={() => setConfirmSignOut(true)}
      />

      <ConfirmDialog
        visible={pending !== null}
        title="Pırıl her gün seçtiğin saatte sana küçük bir okuma daveti göndersin mi?"
        stayLabel="EVET, GÖNDERSİN"
        leaveLabel="ŞİMDİ DEĞİL"
        onStay={() => void handlePermissionAccepted()}
        onLeave={() => setPending(null)}
        onDismiss={() => setPending(null)}
      />
      <ConfirmDialog
        visible={confirmSignOut}
        title="Çıkış yapmak istiyor musun?"
        message="Okuma hatırlatması da bu cihazda kapanır."
        stayLabel="KAL"
        leaveLabel="ÇIKIŞ YAP"
        onStay={() => setConfirmSignOut(false)}
        onLeave={() => {
          setConfirmSignOut(false);
          setSigningOut(true);
          void signOut();
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: 'flex-start',
  },
  heading: {
    gap: 10,
  },
  section: {
    marginTop: 12,
  },
});
