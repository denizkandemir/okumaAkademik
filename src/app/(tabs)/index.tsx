import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { ProgressBar } from '@/components/progress-bar';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { LevelBadge } from '@/features/reading/level-badge';
import { getReadingText, mockContinueReading, mockDailyGoal } from '@/features/reading/mock-data';

export default function HomeScreen() {
  const { user } = useAuth();
  const { goalMinutes, readMinutes } = mockDailyGoal;
  const remainingMinutes = Math.max(goalMinutes - readMinutes, 0);
  const continueText = getReadingText(mockContinueReading.textId);

  return (
    <Screen withTabBar>
      <View style={styles.greeting}>
        <ThemedText type="title">Merhaba, {user?.name}!</ThemedText>
        <ThemedText themeColor="textSecondary">Bugün ne okumak istersin?</ThemedText>
      </View>

      <Card>
        <ThemedText type="subtitle">Günlük hedefin</ThemedText>
        <ThemedText>
          Bugün <ThemedText type="smallBold">{readMinutes}</ThemedText> /{' '}
          <ThemedText type="smallBold">{goalMinutes} dakika</ThemedText> okudun.
        </ThemedText>
        <ProgressBar
          progress={readMinutes / goalMinutes}
          accessibilityLabel="Günlük okuma hedefi ilerlemesi"
        />
        <ThemedText themeColor="textSecondary">
          {remainingMinutes > 0
            ? `Hedefe ${remainingMinutes} dakika kaldı. Başarabilirsin!`
            : 'Tebrikler, bugünkü hedefini tamamladın!'}
        </ThemedText>
      </Card>

      {continueText ? (
        <Card>
          <ThemedText type="subtitle">Okumaya devam et</ThemedText>
          <View style={styles.continueInfo}>
            <ThemedText type="smallBold" style={styles.continueTitle}>
              {continueText.title}
            </ThemedText>
            <LevelBadge level={continueText.level} />
          </View>
          <ProgressBar
            progress={mockContinueReading.progress}
            accessibilityLabel={`${continueText.title} okuma ilerlemesi`}
          />
          <ThemedText themeColor="textSecondary">
            %{Math.round(mockContinueReading.progress * 100)} tamamlandı
          </ThemedText>
          <Button
            title="Devam et"
            onPress={() =>
              router.push({ pathname: '/reading/[id]', params: { id: continueText.id } })
            }
          />
        </Card>
      ) : null}
    </Screen>
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
