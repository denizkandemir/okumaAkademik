import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { continueRewardFlow } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { ConfettiLayer } from '@/features/game/rewards/celebration';
import {
  CITY_INFO,
  CITY_THEMES,
  GameColors,
  GameFonts,
  READABLE_BANNERS,
  type CityId,
  type GameButtonVariant,
} from '@/features/game/theme';
import { GameButton } from '@/features/game/ui/game-button';
import { Mascot } from '@/features/mascot/mascot';
import { CityScene } from '@/features/scenes/city-scene';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/features/scenes/scene-kit';
import { useHardwareBack } from '@/hooks/use-hardware-back';

const MAX_WIDTH = 520;
/** Şehrin "keşfet" düğmesi: başlık rengine en yakın 3B buton. */
const BUTTON_VARIANTS: Record<CityId, GameButtonVariant> = {
  istanbul: 'orange',
  izmir: 'blue',
  efes: 'purple',
  antalya: 'orange',
  kapadokya: 'teal',
  van: 'blue',
};
/** Her şehirdeki hikâye sayısı (10 dersin 8'i hikâye). */
const STORIES_PER_CITY = 8;

/** Yeni şehir açıldı (S10SehirAcildi). Yalnızca ödül akışında `cityUnlocked` varsa açılır. */
export default function CityUnlockedScreen() {
  const reward = useReward();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  const city = reward?.result.cityUnlocked;
  // Android geri tuşu keşfet düğmesiyle aynı: akış yarıda kalmasın.
  useHardwareBack(() => {
    if (!reward || !city) return false;
    continueRewardFlow('city-unlocked', reward);
    return true;
  });

  if (!reward || !city) return <Redirect href="/" />;
  const info = CITY_INFO[city];
  const theme = CITY_THEMES[city];
  const width = Math.min(window.width, MAX_WIDTH);
  const sceneHeight = (width * SCENE_HEIGHT) / SCENE_WIDTH;
  const mascotSize = window.height < 700 ? 180 : 230;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#7CC8F5', '#7CC8F5', theme.ground.colors[0], theme.ground.colors[1]]}
        locations={[0, 0.18, 0.6, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.scene, { top: insets.top + 130, width }]}>
        <CityScene city={city} width={width} />
      </View>
      <ConfettiLayer top={insets.top} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: insets.bottom + 28 },
        ]}>
        <View style={[styles.column, { width: width - 40 }]}>
          <View style={styles.titles}>
            <PulsingChip city={city} />
            <Text
              style={[styles.name, { textShadowColor: theme.bannerSh }]}
              accessibilityRole="header">
              {info.name}
            </Text>
            <Text style={styles.stop}>
              {info.no}. Durak · {info.title}
            </Text>
          </View>

          <View style={[styles.mascot, { marginTop: Math.max(24, sceneHeight - 120) }]}>
            <Mascot
              pose="celebrate"
              size={mascotSize}
              accessibilityLabel="Pırıl sevinçle zıplıyor"
            />
          </View>

          <Text style={[styles.message, { color: theme.tx }]}>{info.unlockMessage}</Text>
          <View style={styles.chips}>
            {reward.result.lokum.cityUnlock > 0 ? (
              <Text style={[styles.chip, { color: '#A33B5A' }]}>
                +{reward.result.lokum.cityUnlock} lokum
              </Text>
            ) : null}
            <Text style={[styles.chip, { color: '#0B6E7E' }]}>{STORIES_PER_CITY} yeni hikâye</Text>
            <Text style={[styles.chip, { color: '#B8461A' }]}>{info.name} rozeti</Text>
          </View>

          <View style={styles.spacer} />
          <GameButton
            variant={BUTTON_VARIANTS[city]}
            title={info.exploreLabel}
            accessibilityLabel={`${info.name} şehrini keşfet`}
            onPress={() => continueRewardFlow('city-unlocked', reward)}
          />
        </View>
      </ScrollView>
    </View>
  );
}

/** "YENİ ŞEHİR AÇILDI" çipi; hafifçe büyüyüp küçülür (hareketi azalt açıkken durur). */
function PulsingChip({ city }: { city: CityId }) {
  const reduceMotion = useReducedMotion();
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    const half = { duration: 1100, easing: Easing.inOut(Easing.quad) };
    pulse.set(withRepeat(withSequence(withTiming(1, half), withTiming(0, half)), -1));
    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);

  const style = useAnimatedStyle(() => ({ transform: [{ scale: 1 + 0.06 * pulse.get() }] }));
  const banner = READABLE_BANNERS[city];

  return (
    <Animated.View
      style={[styles.badge, { boxShadow: `0 4px 0 ${CITY_THEMES[city].bannerSh}` }, style]}>
      <LinearGradient
        colors={banner.colors}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={[StyleSheet.absoluteFill, styles.badgeFill]}
      />
      <Text style={styles.badgeText}>YENİ ŞEHİR AÇILDI</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  scene: {
    position: 'absolute',
    alignSelf: 'center',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    flexGrow: 1,
    gap: 10,
  },
  titles: {
    alignItems: 'center',
    gap: 6,
  },
  badge: {
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  badgeFill: {
    borderRadius: 999,
  },
  badgeText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    letterSpacing: 1.4,
    color: GameColors.white,
  },
  name: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 54,
    lineHeight: 60,
    color: GameColors.white,
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 1,
    textAlign: 'center',
  },
  stop: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 16,
    lineHeight: 22,
    color: '#0B3A5C',
    textAlign: 'center',
  },
  mascot: {
    alignItems: 'center',
  },
  message: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 16,
    lineHeight: 22,
    textAlign: 'center',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  chip: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    backgroundColor: GameColors.white,
    borderRadius: 999,
    overflow: 'hidden',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 16,
  },
});
