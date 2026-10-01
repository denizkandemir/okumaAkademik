import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { QueryState } from '@/components/query-state';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { LevelBadge } from '@/features/reading/level-badge';
import type { ProgressSummary } from '@/features/reading/types';
import { useApiQuery } from '@/hooks/use-api-query';

export default function HomeScreen() {
  const { user } = useAuth();
  // Okuma ekranından dönünce bugünkü dakikalar güncellensin.
  const { data, error, isLoading, refetch } = useApiQuery<ProgressSummary>('/me/progress', {
    refetchOnFocus: true,
  });

  return (
    <Screen withTabBar>
      <View style={styles.greeting}>
        <ThemedText type="title">Merhaba, {user?.name}!</ThemedText>
        <ThemedText themeColor="textSecondary">Bugün ne okumak istersin?</ThemedText>
      </View>

      <QueryState isLoading={isLoading} error={error} onRetry={refetch} />

      {data && !error ? (
        <>
          <DailyGoalCard {...data.dailyGoal} />
          {data.continueReading ? (
            <ContinueReadingCard {...data.continueReading} />
          ) : (
            <Card>
              <ThemedText type="subtitle">Yeni bir metin seç</ThemedText>
              <ThemedText themeColor="textSecondary">
                Kitaplığında seni bekleyen metinler var.
              </ThemedText>
              <Button title="Kitaplığa git" onPress={() => router.navigate('/library')} />
            </Card>
          )}
        </>
      ) : null}
    </Screen>
  );
}

function DailyGoalCard({ goalMinutes, readMinutes }: ProgressSummary['dailyGoal']) {
  const remainingMinutes = Math.max(goalMinutes - readMinutes, 0);

  return (
    <Card>
      <ThemedText type="subtitle">Günlük hedefin</ThemedText>
      <ThemedText>
        Bugün <ThemedText type="smallBold">{readMinutes}</ThemedText> /{' '}
        <ThemedText type="smallBold">{goalMinutes} dakika</ThemedText> okudun.
      </ThemedText>
      <ProgressBar
        progress={goalMinutes > 0 ? readMinutes / goalMinutes : 0}
        accessibilityLabel="Günlük okuma hedefi ilerlemesi"
      />
      <ThemedText themeColor="textSecondary">
        {remainingMinutes > 0
          ? `Hedefe ${remainingMinutes} dakika kaldı. Başarabilirsin!`
          : 'Tebrikler, bugünkü hedefini tamamladın!'}
      </ThemedText>
    </Card>
  );
}

function ContinueReadingCard({
  textId,
  title,
  level,
  progress,
}: NonNullable<ProgressSummary['continueReading']>) {
  return (
    <Card>
      <ThemedText type="subtitle">Okumaya devam et</ThemedText>
      <View style={styles.continueInfo}>
        <ThemedText type="smallBold" style={styles.continueTitle}>
          {title}
        </ThemedText>
        <LevelBadge level={level} />
      </View>
      <ProgressBar progress={progress} accessibilityLabel={`${title} okuma ilerlemesi`} />
      <ThemedText themeColor="textSecondary">%{Math.round(progress * 100)} tamamlandı</ThemedText>
      <Button
        title="Devam et"
        onPress={() => router.push({ pathname: '/reading/[id]', params: { id: textId } })}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  greeting: {
    gap: Spacing.one,
  },
  continueInfo: {
    gap: Spacing.two,
  },
  continueTitle: {
    fontSize: 20,
    lineHeight: 28,
  },
});
