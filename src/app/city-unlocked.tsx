import { Redirect } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { CITIES, CITY_UNLOCK_LINE } from '@/design/cities';
import { Button } from '@/design/components/button';
import { Chip } from '@/design/components/chip';
import { continueRewardFlow } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { CityHeroLayout } from '@/features/game/rewards/city-hero-layout';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/** Şehir açılışı (14-sehir-acilisi). Yalnızca ödül akışında `cityUnlocked` varsa açılır. */
export default function CityUnlockedScreen() {
  const reward = useReward();

  const city = reward?.result.cityUnlocked;
  // Android geri tuşu ŞEHRİ KEŞFET ile aynı: akış yarıda kalmasın.
  useHardwareBack(() => {
    if (!reward || !city) return false;
    continueRewardFlow('city-unlocked', reward);
    return true;
  });

  if (!reward || !city) return <Redirect href="/" />;
  const design = CITIES[city];
  const lokum = reward.result.lokum.cityUnlock;

  return (
    <CityHeroLayout
      city={city}
      pose="wave"
      mascotLabel="Pırıl el sallıyor"
      eyebrow="PASAPORTUNDA YENİ BİR SAYFA"
      title={`Merhaba, ${design.name}!`}
      lines={[design.tagline, CITY_UNLOCK_LINE]}
      actions={
        <Button
          title="ŞEHRİ KEŞFET"
          accessibilityLabel={`${design.name} şehrini keşfet`}
          onPress={() => continueRewardFlow('city-unlocked', reward)}
        />
      }>
      <View style={styles.chips}>
        <Chip label="Yeni şehir" />
        {lokum > 0 ? <Chip label={`+${lokum} lokum`} /> : null}
      </View>
    </CityHeroLayout>
  );
}

const styles = StyleSheet.create({
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    marginTop: 8,
  },
});
