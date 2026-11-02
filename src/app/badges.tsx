import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { BackIcon } from '@/design/icons';
import { useAuth } from '@/features/auth/auth-context';
import type { StatsResponse } from '@/features/game/types';
import { AchievementRow, sortAchievements } from '@/features/profile/achievement-row';
import { ProfileSummary } from '@/features/profile/profile-summary';
import { useApiQuery } from '@/hooks/use-api-query';

/** Küçük başarılar (23-rozetler): pasaport kartı, istatistikler ve başarıların tamamı. */
export default function BadgesScreen() {
  const { user } = useAuth();
  const { data, error, isLoading, refetch } = useApiQuery<StatsResponse>(
    user ? '/me/stats' : null,
    { refetchOnFocus: true },
  );

  if (!user) return null;

  const goBack = () => {
    if (router.canGoBack()) router.back();
    else router.replace('/profile');
  };

  return (
    <Screen header={<AppHeader />}>
      <IconButton accessibilityLabel="Geri" onPress={goBack} style={styles.back}>
        <BackIcon />
      </IconButton>
      <View style={styles.heading}>
        <Eyebrow>YOLCULUĞUN HATIRALARI</Eyebrow>
        <AppText variant="title" accessibilityRole="header">
          Küçük başarılar
        </AppText>
      </View>

      {/* Tazeleme başarısız olsa da eldeki veri gösterilir; hata yalnızca veri yokken. */}
      <StateView
        isLoading={isLoading}
        error={data ? undefined : error}
        onRetry={refetch}
        loadingLabel="Başarıların hazırlanıyor…"
      />

      {data ? (
        <>
          <ProfileSummary name={user.name} grade={user.grade} stats={data} />
          {sortAchievements(data.achievements).map((achievement) => (
            <AchievementRow key={achievement.id} achievement={achievement} />
          ))}
        </>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: 'flex-start',
  },
  heading: {
    gap: 8,
  },
});
