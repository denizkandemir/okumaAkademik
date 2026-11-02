import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { CloseIcon } from '@/design/icons';
import { colors } from '@/design/tokens';
import { useAuth } from '@/features/auth/auth-context';
import type { JourneyResponse, StatsResponse } from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { WeekStrip } from '@/features/welcome-back/week-strip';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';

const goHome = () => router.navigate('/');

/** Yeniden merhaba (17-geri-donus): 2+ gündür okumayan çocuğu günde bir kez karşılar. */
export default function WelcomeBackScreen() {
  const { user } = useAuth();
  const stats = useApiQuery<StatsResponse>('/me/stats');
  const journey = useApiQuery<JourneyResponse>('/me/journey');

  useHardwareBack(() => {
    goHome();
    return true;
  });

  const continueReading = () => {
    const current = journey.data?.lessons.find((lesson) => lesson.status === 'current');
    goHome();
    if (current) router.push({ pathname: '/lesson/[id]', params: { id: current.id } });
  };

  const openPassport = () => router.navigate('/passport');

  const statsData = stats.data;
  const journeyData = journey.data;

  return (
    <Screen header={<AppHeader profileLink={false} />}>
      <IconButton
        accessibilityLabel="Kapat"
        accessibilityHint="Yolculuk haritasına döner"
        shape="round"
        onPress={goHome}
        style={styles.close}>
        <CloseIcon />
      </IconButton>

      {statsData && journeyData && user ? (
        <>
          <View style={styles.hero}>
            <Eyebrow align="center">YENİDEN MERHABA</Eyebrow>
            <Mascot pose="happy" size={170} accessibilityLabel="Pırıl sevinçle bekliyor" />
            <AppText variant="display" align="center" accessibilityRole="header">
              {`Hikâyen seni bekliyor, ${user.name}.`}
            </AppText>
            <AppText color={colors.textMuted} align="center">
              {`${CITIES[journeyData.currentCity].locative} yolculuğumuza küçük bir okuma molasıyla devam edelim mi?`}
            </AppText>
          </View>
          <WeekStrip week={statsData.week} />
          <View style={styles.actions}>
            <Button
              title="KALDIĞIM YERDEN DEVAM"
              accessibilityLabel="Kaldığım yerden devam"
              onPress={continueReading}
            />
            <Button
              title="PASAPORTUMA BAK"
              accessibilityLabel="Pasaportuma bak"
              variant="secondary"
              onPress={openPassport}
            />
          </View>
        </>
      ) : (
        <StateView
          isLoading={!stats.error && !journey.error}
          error={stats.error ?? journey.error}
          onRetry={() => {
            stats.refetch();
            journey.refetch();
          }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  close: {
    alignSelf: 'flex-end',
  },
  hero: {
    alignItems: 'center',
    gap: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
