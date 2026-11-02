import * as Notifications from 'expo-notifications';
import { router, usePathname } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

import { useAuth } from '@/features/auth/auth-context';
import type { StatsResponse } from '@/features/game/types';
import { markPlacementOffered, shouldOfferPlacement } from '@/features/placement/placement-offer';
import { REMINDER_SUPPORTED } from '@/features/reminder/reminder';
import { api } from '@/lib/api';
import * as storage from '@/lib/storage';
import { turkeyDayKey, turkeyDayNumber } from '@/lib/turkey-day';

/** Son okumadan bu kadar Türkiye günü geçtiyse "Yeniden merhaba" gösterilir. */
const AWAY_DAYS = 2;

/**
 * Ders ve ödül akışı ekranları: bildirim ya da geri dönüş ekranı bunların üstünden eve götürmez,
 * yoksa okuma, sorular ya da ödül akışı onaysız kapanır (2. hata taraması, bulgu 1).
 */
function isFlowScreen(pathname: string) {
  return (
    pathname.startsWith('/reading/') ||
    pathname.startsWith('/lesson/') ||
    pathname === '/level-up' ||
    pathname === '/city-unlocked' ||
    pathname === '/finale' ||
    pathname === '/placement'
  );
}

/**
 * "Yeniden merhaba" gösterilmeli mi? Günde en fazla bir kez; çocuk daha önce okumuş ve son okuması
 * 2+ Türkiye günü önceyse. Gün, ekran gerçekten açılınca kaydedilir (bkz. `WelcomeBackGate`).
 */
async function shouldShowWelcomeBack(): Promise<boolean> {
  const now = new Date();
  const today = turkeyDayKey(now);
  if ((await storage.getItem(storage.StorageKeys.welcomeBackShownOn)) === today) return false;

  const stats = await api.get<StatsResponse>('/me/stats', { timeoutMs: 8_000 });
  if (!stats.lastReadAt) return false;
  return turkeyDayNumber(now) - turkeyDayNumber(new Date(stats.lastReadAt)) >= AWAY_DAYS;
}

/**
 * Oturum açıkken çizilir; ekranı yoktur. Açılışta ve uygulama öne geldiğinde önce seviye
 * belirlemeyi (kullanıcı başına bir kez), o önerilmezse geri dönüş kontrolünü yapar; hatırlatma
 * bildirimine dokunulunca Yolculuk sekmesini açar. Hiçbir şeyi bekletmez; hata
 * olursa sessizce geçer.
 */
export function WelcomeBackGate() {
  const { user } = useAuth();
  // Kapı yalnızca oturum açıkken çizilir (çıkışta kaldırılır).
  const userId = user?.id ?? '';
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  useEffect(() => {
    pathnameRef.current = pathname;
  });
  const checking = useRef(false);

  useEffect(() => {
    /** Seviye belirleme (bir kez) önerildiyse `true`; o açılışta geri dönüş ekranı gösterilmez. */
    const offerPlacement = async () => {
      const current = pathnameRef.current;
      if (isFlowScreen(current) || current === '/welcome-back') return false;
      if (!(await shouldOfferPlacement(userId))) return false;
      await markPlacementOffered(userId);
      router.push('/placement');
      return true;
    };

    const check = () => {
      if (checking.current) return;
      checking.current = true;
      offerPlacement()
        .catch(() => false)
        .then((offered) => (offered ? false : shouldShowWelcomeBack()))
        .then(async (show) => {
          const current = pathnameRef.current;
          // Akış ekranındaysa gösterilmez; gün kaydedilmediği için sonraki öne gelişte yeniden denenir.
          if (!show || current === '/welcome-back' || isFlowScreen(current)) return;
          await storage.setItem(storage.StorageKeys.welcomeBackShownOn, turkeyDayKey(new Date()));
          router.push('/welcome-back');
        })
        .catch(() => {})
        .finally(() => {
          checking.current = false;
        });
    };

    check();
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') check();
    });
    return () => subscription.remove();
  }, [userId]);

  return REMINDER_SUPPORTED ? <ReminderTapHandler pathnameRef={pathnameRef} /> : null;
}

/** Bildirime dokunulunca (uygulama kapalıyken de) Yolculuk sekmesine gider. */
function ReminderTapHandler({ pathnameRef }: { pathnameRef: { current: string } }) {
  const response = Notifications.useLastNotificationResponse();

  useEffect(() => {
    if (!response || response.actionIdentifier !== Notifications.DEFAULT_ACTION_IDENTIFIER) return;
    // Bir sonraki açılışta aynı dokunuş yeniden işlenmesin.
    Notifications.clearLastNotificationResponse();
    // Geri dönüş ekranı zaten açıldıysa onun üstünden eve dönülmez; o da eve götürür. Çocuk
    // okuyor, soru çözüyor ya da ödül akışındaysa yerinde kalır.
    const current = pathnameRef.current;
    if (current !== '/' && current !== '/welcome-back' && !isFlowScreen(current)) {
      router.navigate('/');
    }
  }, [response, pathnameRef]);

  return null;
}
