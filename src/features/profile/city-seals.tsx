import { StyleSheet, View } from 'react-native';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { CityImage } from '@/design/components/city-image';
import { colors } from '@/design/tokens';
import { CITY_IDS } from '@/features/game/theme';
import type { StatsResponse } from '@/features/game/types';

/** Mührün görsel çapı (panoda 78). */
const SEAL_SIZE = 78;
/** İç açık halka ve dış altın halka (panoda 4 px kenar + 2 px outline). */
const RING = 4;
const OUTLINE = 2;

/**
 * "Şehir mühürlerin" (22-profil): 3×2 yuvarlak mühür. Şehir bitince mühür kazanılır ve tam
 * renklidir; kazanılmamışsa gri tonlu ve soluktur.
 */
export function CitySeals({ cities }: { cities: StatsResponse['cities'] }) {
  return (
    <View style={styles.grid}>
      {CITY_IDS.map((city) => {
        const earned = cities.find((entry) => entry.id === city)?.status === 'completed';
        const name = CITIES[city].name;
        return (
          <View
            key={city}
            style={styles.seal}
            accessible
            accessibilityLabel={`${name} mührü, ${earned ? 'kazanıldı' : 'henüz kazanılmadı'}`}>
            <View style={[styles.outline, !earned && styles.outlineMuted]}>
              <CityImage city={city} muted={!earned} style={styles.image} />
            </View>
            <AppText variant="mapLabel" align="center">
              {name}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

const OUTER = SEAL_SIZE + OUTLINE * 2;

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    rowGap: 18,
  },
  seal: {
    width: '33.33%',
    alignItems: 'center',
    gap: 9,
  },
  outline: {
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    borderWidth: OUTLINE,
    borderColor: colors.seal.outline,
  },
  outlineMuted: {
    borderColor: colors.seal.outlineMuted,
  },
  image: {
    width: SEAL_SIZE,
    height: SEAL_SIZE,
    borderRadius: SEAL_SIZE / 2,
    borderWidth: RING,
    borderColor: colors.seal.ring,
  },
});
