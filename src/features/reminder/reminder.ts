import * as Notifications from 'expo-notifications';
import { AndroidImportance, IosAuthorizationStatus } from 'expo-notifications';
import { Platform } from 'react-native';

import * as storage from '@/lib/storage';

/**
 * Günlük okuma hatırlatması: her gün seçilen saatte gelen yerel bildirim (Expo Go'da da çalışır).
 * Ayar yalnızca bu cihazda saklanır; çocuğun adı bildirime cihazda yazılır, sunucuya gitmez.
 */
export type ReminderSettings = { enabled: boolean; hour: number; minute: number };

export const DEFAULT_REMINDER: ReminderSettings = { enabled: false, hour: 19, minute: 30 };

/** Web'de yerel bildirim planlanamaz. */
export const REMINDER_SUPPORTED = Platform.OS !== 'web';

const CHANNEL_ID = 'reading-reminder';
const DAILY_ID = 'okumatik.daily-reminder';

if (REMINDER_SUPPORTED) {
  // Uygulama açıkken gelen bildirim de gösterilsin ("BİLDİRİMİ GÖR" örneği).
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

function content(name: string): Notifications.NotificationContentInput {
  return {
    title: "Pırıl'dan bir davet",
    body: `${name}, bugün hangi hikâyeyi keşfedelim? Kaldığın yer seni bekliyor.`,
  };
}

async function ensureChannel() {
  if (Platform.OS !== 'android') return;
  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Okuma hatırlatması',
    importance: AndroidImportance.DEFAULT,
  });
}

export async function loadReminder(): Promise<ReminderSettings> {
  return (
    (await storage.getJSON<ReminderSettings>(storage.StorageKeys.reminder)) ?? DEFAULT_REMINDER
  );
}

export async function saveReminder(settings: ReminderSettings): Promise<void> {
  await storage.setJSON(storage.StorageKeys.reminder, settings);
}

/** Bildirim izni verilmiş mi (iOS'ta geçici izin de sayılır). */
export async function hasPermission(): Promise<boolean> {
  const permission = await Notifications.getPermissionsAsync();
  return permission.granted || permission.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

/** İzni ister; çocuk daha önce reddettiyse sistem yeniden sormaz ve `false` döner. */
export async function requestPermission(): Promise<boolean> {
  if (await hasPermission()) return true;
  const permission = await Notifications.requestPermissionsAsync();
  return permission.granted || permission.ios?.status === IosAuthorizationStatus.PROVISIONAL;
}

/** Her gün `hour:minute`'te (cihaz saati) tekrarlanan tek bildirimi kurar; öncekinin yerini alır. */
export async function scheduleDaily(name: string, hour: number, minute: number): Promise<void> {
  await cancelDaily();
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    identifier: DAILY_ID,
    content: content(name),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: CHANNEL_ID,
    },
  });
}

export async function cancelDaily(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(DAILY_ID).catch(() => {});
}

/** "BİLDİRİMİ GÖR": 5 saniye sonra örnek bildirim. */
export async function sendSample(name: string): Promise<void> {
  await ensureChannel();
  await Notifications.scheduleNotificationAsync({
    content: content(name),
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: CHANNEL_ID,
    },
  });
}

/** Çıkışta: bildirimi iptal eder ve ayarı siler. */
export async function clearReminder(): Promise<void> {
  if (REMINDER_SUPPORTED) await cancelDaily();
  await storage.removeItem(storage.StorageKeys.reminder);
}
