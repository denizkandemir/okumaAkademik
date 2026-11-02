import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { CITIES } from '@/design/cities';
import { AppHeader } from '@/design/components/app-header';
import { AppText } from '@/design/components/app-text';
import { Card } from '@/design/components/card';
import { CityImage } from '@/design/components/city-image';
import { Eyebrow } from '@/design/components/eyebrow';
import { Screen } from '@/design/components/screen';
import { StateView } from '@/design/components/state-view';
import { CheckIcon, LockIcon } from '@/design/icons';
import { colors, radius } from '@/design/tokens';
import { CityPreviewSheet } from '@/features/game/home/city-preview-sheet';
import { CITY_IDS, type CityId } from '@/features/game/theme';
import type { CityStatus } from '@/features/game/types';
import { useJourney } from '@/features/game/use-journey';

const STATUS_TEXT: Record<CityStatus, string> = {
  current: 'ŞU ANDA BURADASIN',
  completed: 'TAMAMLANDI',
  locked: 'KİLİTLİ',
};

/**
 * Pasaport sekmesi (21-pasaport): altı şehrin kartı. Açık ya da biten şehre dokununca Yolculuk
 * sekmesi o şehrin haritasını açar (`?city=`, T01); kilitli şehirde "… bitirince açılır." sayfası.
 */
export default function PassportScreen() {
  const { data, error, isLoading, refetch } = useJourney();
  const [lockedCity, setLockedCity] = useState<CityId | null>(null);

  const statusOf = (city: CityId): CityStatus =>
    data?.cities.find((entry) => entry.id === city)?.status ?? 'locked';

  const open = (city: CityId) => {
    if (statusOf(city) === 'locked') setLockedCity(city);
    else router.navigate({ pathname: '/', params: { city } });
  };

  return (
    <Screen withTabBar header={<AppHeader />}>
      <View style={styles.intro}>
        <Eyebrow>ALTI ŞEHİR, BİR BÜYÜK MACERA</Eyebrow>
        <AppText variant="title" accessibilityRole="header">
          Keşif pasaportun
        </AppText>
        <AppText variant="secondary" color={colors.textMuted}>
          Her şehirde bir hikâye. Her hikâyede yeni bir iz.
        </AppText>
      </View>

      {/* Tazeleme başarısız olsa da eldeki kartlar gösterilir; hata yalnızca veri yokken. */}
      <StateView
        isLoading={isLoading}
        error={data ? undefined : error}
        onRetry={refetch}
        loadingLabel="Pasaportun hazırlanıyor…"
      />

      {data ? (
        <View style={styles.grid}>
          {CITY_IDS.map((city) => (
            <CityCard key={city} city={city} status={statusOf(city)} onPress={() => open(city)} />
          ))}
        </View>
      ) : null}

      <CityPreviewSheet
        city={lockedCity}
        locked={lockedCity !== null}
        onClose={() => setLockedCity(null)}
      />
    </Screen>
  );
}

type CityCardProps = {
  city: CityId;
  status: CityStatus;
  onPress: () => void;
};

function CityCard({ city, status, onPress }: CityCardProps) {
  const design = CITIES[city];
  const stop = String(design.number).padStart(2, '0');
  const statusLabel = STATUS_TEXT[status].toLocaleLowerCase('tr-TR');

  return (
    <Card
      accessibilityLabel={`${design.name}, ${design.number}. durak, ${statusLabel}`}
      onPress={onPress}
      style={[styles.card, status === 'current' && styles.current]}>
      <CityImage city={city} muted={status === 'locked'} style={styles.thumbnail} />
      {status === 'locked' ? (
        <View style={styles.lock}>
          <LockIcon size={20} color={colors.node.locked.icon} />
        </View>
      ) : null}
      <View style={styles.info}>
        <Eyebrow color={colors.textMuted}>{stop} · DURAK</Eyebrow>
        <AppText variant="heading">{design.name}</AppText>
        <View style={styles.statusRow}>
          {status === 'completed' ? (
            <View style={styles.seal}>
              <CheckIcon size={12} color={colors.medal.text} strokeWidth={3} />
            </View>
          ) : null}
          <Eyebrow
            color={status === 'current' ? colors.accent : colors.textMuted}
            style={styles.statusText}>
            {STATUS_TEXT[status]}
          </Eyebrow>
        </View>
      </View>
    </Card>
  );
}

const SEAL_SIZE = 20;
const LOCK_SIZE = 36;

const styles = StyleSheet.create({
  intro: {
    gap: 8,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 13,
  },
  card: {
    flexGrow: 1,
    flexBasis: '40%',
    padding: 0,
    overflow: 'hidden',
    borderRadius: radius.cardLarge,
  },
  current: {
    borderColor: colors.cityCard.activeBorder,
    borderBottomColor: colors.cityCard.activeBorder,
  },
  thumbnail: {
    height: 125,
  },
  lock: {
    position: 'absolute',
    top: 125 / 2 - LOCK_SIZE / 2,
    alignSelf: 'center',
    width: LOCK_SIZE,
    height: LOCK_SIZE,
    borderRadius: LOCK_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.node.locked.fill,
  },
  info: {
    gap: 4,
    paddingTop: 13,
    paddingHorizontal: 12,
    paddingBottom: 15,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusText: {
    flexShrink: 1,
    letterSpacing: 0.7,
  },
  seal: {
    width: SEAL_SIZE,
    height: SEAL_SIZE,
    borderRadius: SEAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.medal.face,
    borderWidth: 1,
    borderColor: colors.medal.edge,
  },
});
