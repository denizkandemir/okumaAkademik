import { LinearGradient } from 'expo-linear-gradient';
import { Redirect } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, { ZoomIn } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

import { darkenForWhiteText } from '@/features/game/color';
import { continueRewardFlow } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { Sparkle } from '@/features/game/rewards/celebration';
import { LightRays } from '@/features/game/rewards/light-rays';
import { CITY_IDS, CITY_INFO, GameColors, GameFonts, cityForLevel } from '@/features/game/theme';
import { GameButton } from '@/features/game/ui/game-button';
import { BookIcon, LokumIcon } from '@/features/game/ui/icons';
import { ProgressFills, ProgressTrack, ProgressTracks } from '@/features/game/ui/progress-track';
import { Mascot } from '@/features/mascot/mascot';

const MAX_LEVEL = 30;
/** "SEVİYE ATLADIN!" kurdelesi; beyaz yazı okunsun diye tasarımdaki pembeden koyulaştırılmış. */
const RIBBON = darkenForWhiteText(['#FF6FB5', '#D63384'] as const);

/** Seviye atladı (S09SeviyeAtladi). Yalnızca ödül akışında `level.leveledUp` ise açılır. */
export default function LevelUpScreen() {
  const reward = useReward();
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();

  if (!reward?.result.level.leveledUp) return <Redirect href="/" />;
  const { result } = reward;
  const level = result.level.after;
  const city = cityForLevel(level);
  const info = CITY_INFO[city];
  const nextCity = CITY_IDS[CITY_IDS.indexOf(city) + 1];
  const levelsLeft = nextCity ? CITY_INFO[nextCity].levelFrom - level : MAX_LEVEL - level;
  const cityProgress = (level - info.levelFrom + 1) / (info.levelTo - info.levelFrom + 1);
  const mascotSize = window.height < 700 ? 170 : 220;

  return (
    <View style={styles.root}>
      <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
        <Defs>
          <RadialGradient id="level-bg" cx="50%" cy="28%" r="75%">
            <Stop offset="0" stopColor="#6A4FE0" />
            <Stop offset="0.45" stopColor="#3A2B9E" />
            <Stop offset="1" stopColor="#1E1660" />
          </RadialGradient>
        </Defs>
        <Rect width="100%" height="100%" fill="url(#level-bg)" />
      </Svg>
      <View style={[styles.rays, { top: insets.top - 120 }]}>
        <LightRays size={700} opacity={0.14} periodMs={26000} />
      </View>
      <Sparkle x={48} y={insets.top + 110} size={22} />
      <Sparkle x={window.width - 70} y={insets.top + 80} size={18} color="#FFE07A" delay={600} />
      <Sparkle x={window.width - 60} y={insets.top + 290} size={20} delay={1200} />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 28 },
        ]}>
        <Text style={styles.congrats}>TEBRİKLER!</Text>

        <Animated.View entering={ZoomIn.springify().damping(9)} style={styles.medal}>
          <Svg width={160} height={160} style={StyleSheet.absoluteFill}>
            <Defs>
              <RadialGradient id="medal" cx="35%" cy="28%" r="75%">
                <Stop offset="0" stopColor="#FFF6CF" />
                <Stop offset="0.5" stopColor="#FFC23A" />
                <Stop offset="1" stopColor="#D98A00" />
              </RadialGradient>
            </Defs>
            <Rect width={160} height={160} rx={80} fill="url(#medal)" />
          </Svg>
          <View style={styles.medalInner} />
          <Text style={styles.medalLabel}>SEVİYE</Text>
          <Text style={styles.medalNumber} accessibilityLabel={`Seviye ${level}`}>
            {level}
          </Text>
        </Animated.View>

        <View style={styles.ribbon}>
          <LinearGradient colors={RIBBON} style={[StyleSheet.absoluteFill, styles.ribbonFill]} />
          <Text style={styles.ribbonText} accessibilityRole="header">
            SEVİYE ATLADIN!
          </Text>
        </View>

        <Mascot pose="happy" size={mascotSize} accessibilityLabel="Pırıl çok mutlu" />

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>KAZANDIKLARIN</Text>
          {result.lokum.levelUp > 0 ? (
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#F7A3B5' }]}>
                <LokumIcon size={24} />
              </View>
              <Text style={styles.rowText}>+{result.lokum.levelUp} lokum</Text>
            </View>
          ) : null}
          {result.nextLessonTitle ? (
            <View style={styles.row}>
              <View style={[styles.rowIcon, { backgroundColor: '#2453C9' }]}>
                <BookIcon size={22} color={GameColors.white} />
              </View>
              <Text style={styles.rowText}>Yeni hikâye: {result.nextLessonTitle}</Text>
            </View>
          ) : null}
          <View style={styles.progress}>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>
                {nextCity ? `${CITY_INFO[nextCity].toName} kadar` : 'Yolculuğun sonuna kadar'}
              </Text>
              <Text style={styles.progressText}>
                {levelsLeft > 0 ? `${levelsLeft} seviye kaldı` : 'Son seviyedesin!'}
              </Text>
            </View>
            <ProgressTrack
              progress={cityProgress}
              height={12}
              fill={ProgressFills.mint}
              trackColor={ProgressTracks.onDark}
              accessibilityLabel={`${info.name} ilerlemesi`}
            />
          </View>
        </View>

        <View style={styles.spacer} />
        <GameButton
          variant="gold"
          title="SÜPER!"
          accessibilityLabel="Süper"
          onPress={() => continueRewardFlow('level-up', reward)}
          style={styles.button}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#1E1660',
  },
  rays: {
    position: 'absolute',
    alignSelf: 'center',
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    gap: 14,
  },
  congrats: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 15,
    letterSpacing: 2,
    color: '#FFE07A',
  },
  medal: {
    width: 160,
    height: 160,
    borderRadius: 80,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 0 0 8px rgba(255,255,255,0.15), 0 0 50px rgba(255,194,58,0.6)',
  },
  medalInner: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 80,
    boxShadow: 'inset 0 -10px 16px rgba(120,60,0,0.35), inset 0 8px 12px rgba(255,255,255,0.6)',
    pointerEvents: 'none',
  },
  medalLabel: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    letterSpacing: 1.4,
    color: '#6B3F00',
  },
  medalNumber: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 72,
    lineHeight: 76,
    color: '#5A3400',
  },
  ribbon: {
    marginTop: -26,
    minWidth: 220,
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 5px 0 #8C1A55',
  },
  ribbonFill: {
    borderRadius: 10,
  },
  ribbonText: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 20,
    lineHeight: 26,
    letterSpacing: 0.8,
    color: GameColors.white,
  },
  panel: {
    alignSelf: 'stretch',
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.22)',
    padding: 16,
    gap: 12,
  },
  panelTitle: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    letterSpacing: 1,
    color: '#D9D1FF',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  rowIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: {
    flex: 1,
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 17,
    lineHeight: 23,
    color: GameColors.white,
  },
  progress: {
    gap: 6,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  progressText: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 14,
    color: '#D9D1FF',
  },
  spacer: {
    flexGrow: 1,
    minHeight: 8,
  },
  button: {
    alignSelf: 'stretch',
  },
});
