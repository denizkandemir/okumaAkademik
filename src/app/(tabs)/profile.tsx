import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { TextLink } from '@/design/components/text-link';
import { SlidersIcon } from '@/design/icons';
import { useAuth } from '@/features/auth/auth-context';
import type { StatsResponse } from '@/features/game/types';
import type { MeResponse } from '@/features/placement/types';
import { AchievementRow, sortAchievements } from '@/features/profile/achievement-row';
import { CitySeals } from '@/features/profile/city-seals';
import { ProfileSummary } from '@/features/profile/profile-summary';
import { useApiQuery } from '@/hooks/use-api-query';

/** Profilde gösterilen başarı sayısı; tamamı Küçük başarılar ekranında. */
const ACHIEVEMENT_PREVIEW = 3;

/** Profil sekmesi (22-profil): pasaport kartı, istatistikler, şehir mühürleri, başarılar. */
export default function ProfileScreen() {
  const { user } = useAuth();
  // Ders bitip dönünce yeni mühür ve başarılar görünsün diye her odaklanmada tazelenir.
  const { data, error, isLoading, refetch } = useApiQuery<StatsResponse>(
    user ? '/me/stats' : null,
    { refetchOnFocus: true },
  );
  // Seviye belirleme bitince bağlantı metni değişsin diye o da odaklanmada tazelenir.
  const me = useApiQuery<MeResponse>(user ? '/me' : null, { refetchOnFocus: true });

  if (!user) return null;

  return (
    <Screen withTabBar header={<AppHeader />}>
      <View style={styles.head}>
        <View style={styles.headText}>
          <Eyebrow>SENİN YOLCULUĞUN</Eyebrow>
          <AppText variant="title" accessibilityRole="header">
            Merhaba, {user.name}!
          </AppText>
        </View>
        <IconButton accessibilityLabel="Ayarlar" onPress={() => router.push('/settings')}>
          <SlidersIcon />
        </IconButton>
      </View>

      {/* Tazeleme başarısız olsa da eldeki veri gösterilir; hata yalnızca veri yokken. */}
      <StateView
        isLoading={isLoading}
        error={data ? undefined : error}
        onRetry={refetch}
        loadingLabel="Pasaportun hazırlanıyor…"
      />

      {data ? (
        <>
          <ProfileSummary name={user.name} grade={user.grade} stats={data} />

          <AppText variant="heading" accessibilityRole="header" style={styles.section}>
            Şehir mühürlerin
          </AppText>
          <CitySeals cities={data.cities} />

          <AppText variant="heading" accessibilityRole="header" style={styles.section}>
            Küçük büyük başarılar
          </AppText>
          {sortAchievements(data.achievements)
            .slice(0, ACHIEVEMENT_PREVIEW)
            .map((achievement) => (
              <AchievementRow key={achievement.id} achievement={achievement} />
            ))}
          <TextLink title="Tümünü gör" onPress={() => router.push('/badges')} />

          <Button
            title="SERTİFİKAYI ÖNİZLE"
            accessibilityLabel="Sertifikayı önizle"
            variant="secondary"
            onPress={() => router.push('/certificate')}
          />
        </>
      ) : null}

      {/* Seviye belirleme kendiliğinden bir kez önerilir; sonra yalnızca buradan açılır. */}
      {me.data ? (
        <TextLink
          title={me.data.needsPlacement ? 'Seviyemi belirle' : 'Seviyemi yeniden ölç'}
          accessibilityRole="button"
          onPress={() => router.push('/placement')}
        />
      ) : null}

      {__DEV__ ? (
        <View>
          <TextLink
            title="Maskot vitrini (geliştirici)"
            onPress={() => router.push('/dev/mascot')}
          />
          <TextLink
            title="Tasarım vitrini (geliştirici)"
            onPress={() => router.push('/dev/design')}
          />
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  head: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headText: {
    flex: 1,
    gap: 8,
  },
  section: {
    marginTop: 8,
  },
});
