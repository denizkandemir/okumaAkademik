import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITY_IDS, CITY_INFO, GameColors } from '@/features/game/theme';
import { GameText } from '@/features/game/ui/game-text';
import { CityScene } from '@/features/scenes/city-scene';

const HEADER_OPTIONS = {
  headerShown: true,
  // SDK 58'de iOS 26+ başlığı varsayılan saydam; opak kalsın.
  headerTransparent: false,
  title: 'Şehir sahneleri',
  headerBackTitle: 'Geri',
};

const THUMBNAIL_WIDTH = 112;

/** Geliştirici vitrini: 6 şehir sahnesi (tam genişlik) ve statik küçük resimler. Yalnızca __DEV__. */
export default function ScenesShowcaseScreen() {
  if (!__DEV__) {
    return (
      <View style={styles.unavailable}>
        <Stack.Screen options={{ ...HEADER_OPTIONS, title: '' }} />
        <GameText>Bu sayfa kullanılamıyor.</GameText>
      </View>
    );
  }
  return <Showcase />;
}

function Showcase() {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [animated, setAnimated] = useState(true);
  // Ana sayfadaki gibi tek sahne hareket etsin (JS kare hızını ölçmek için).
  const [onlyFirst, setOnlyFirst] = useState(false);

  return (
    <View style={styles.flex}>
      <Stack.Screen options={HEADER_OPTIONS} />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
        <View
          style={[
            styles.controls,
            { marginLeft: insets.left + 16, marginRight: insets.right + 16 },
          ]}>
          <ToggleRow label="Animasyon" value={animated} onChange={setAnimated} />
          <ToggleRow
            label="Yalnızca ilk sahne hareketli"
            value={onlyFirst}
            onChange={setOnlyFirst}
          />
          <JsFpsMeter />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.thumbnails,
            { paddingLeft: insets.left + 16, paddingRight: insets.right + 16 },
          ]}>
          {CITY_IDS.map((city) => (
            <View key={city} style={styles.thumbnail}>
              <View style={styles.thumbnailFrame}>
                <CityScene city={city} width={THUMBNAIL_WIDTH} animated={false} />
              </View>
              <GameText variant="caption" color={GameColors.textSecondary}>
                {CITY_INFO[city].name}
              </GameText>
            </View>
          ))}
        </ScrollView>

        {CITY_IDS.map((city, index) => (
          <View key={city} style={styles.scene}>
            <GameText
              variant="label"
              color={GameColors.textSecondary}
              style={{ marginLeft: insets.left + 16 }}>
              {CITY_INFO[city].no}. {CITY_INFO[city].upperName}
            </GameText>
            <CityScene
              city={city}
              width={width}
              animated={animated && (!onlyFirst || index === 0)}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ToggleRow({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.toggleRow}>
      <GameText style={styles.toggleLabel}>{label}</GameText>
      <Switch value={value} onValueChange={onChange} accessibilityLabel={label} />
    </View>
  );
}

/**
 * JS thread'in saniyedeki kare sayısı (requestAnimationFrame). Sahne animasyonları UI thread'de
 * çalıştığı için bu değer 60'ta (ya da ekranın yenileme hızında) kalmalı.
 */
function JsFpsMeter() {
  const [fps, setFps] = useState<number | null>(null);
  useEffect(() => {
    let frames = 0;
    let start = performance.now();
    let handle = requestAnimationFrame(function tick(now) {
      frames += 1;
      if (now - start >= 1000) {
        setFps(Math.round((frames * 1000) / (now - start)));
        frames = 0;
        start = now;
      }
      handle = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(handle);
  }, []);
  return (
    <GameText variant="caption" color={GameColors.textSecondary}>
      JS kare hızı: {fps ?? '…'} fps
    </GameText>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: GameColors.creamLight,
  },
  unavailable: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingTop: 16,
    gap: 24,
  },
  controls: {
    gap: 4,
  },
  toggleRow: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  toggleLabel: {
    flex: 1,
  },
  thumbnails: {
    gap: 12,
  },
  thumbnail: {
    alignItems: 'center',
    gap: 6,
  },
  thumbnailFrame: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  scene: {
    gap: 8,
  },
});
