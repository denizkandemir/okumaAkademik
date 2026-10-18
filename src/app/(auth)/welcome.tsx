import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameColors, GameFonts } from '@/features/game/theme';
import { GameButton } from '@/features/game/ui/game-button';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { SCENE_HEIGHT, SCENE_WIDTH } from '@/features/scenes/scene-kit';
import { CityScene } from '@/features/scenes/city-scene';

/** Tablet ve web'de içerik bu genişlikte ortalanır. */
const MAX_WIDTH = 480;
const SIDE_PADDING = 22;
const INFO_CHIPS = ['6 şehir', 'Yüzlerce hikâye', 'Her gün 5 dakika'];
const GREETING =
  "Merhaba! Ben Pırıl. Memleketim Van'a dönüyorum. Yolda hikâye okumama yardım eder misin?";

/** Maskot boyutu: tasarımda 280; kısa ekranlarda içerik sığsın diye küçülür. */
function mascotSizeFor(width: number, height: number) {
  const byHeight = height < 620 ? 170 : height < 700 ? 210 : 280;
  return Math.min(byHeight, Math.round(width * 0.72));
}

/** Karşılama (S01Karsilama): uygulamanın ilk ekranı; kayıt ya da girişe götürür. */
export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const window = useWindowDimensions();
  const width = Math.min(window.width, MAX_WIDTH);
  const sceneHeight = (width * SCENE_HEIGHT) / SCENE_WIDTH;
  const mascotSize = mascotSizeFor(width, window.height);
  // Tasarımda 280'lik maskotun üst %45'i sahnenin üstüne biner (sahne 340, maskot 214'te başlar).
  const mascotOverlap = Math.round(mascotSize * 0.45);
  const fadeHeight = (80 * sceneHeight) / SCENE_HEIGHT;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={['#FFE9D2', '#FFD8B4']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      <ScrollView
        style={styles.root}
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 34 }]}>
        <View style={[styles.column, { width }]}>
          <View style={{ height: sceneHeight }}>
            <CityScene city="istanbul" width={width} />
            {/* Sahnenin alt kenarı zemine yumuşakça karışır. */}
            <LinearGradient
              colors={['rgba(255,233,210,0)', '#FFE9D2']}
              style={[styles.fade, { height: fadeHeight }]}
            />
            <View style={[styles.titleBlock, { top: insets.top + 12 }]}>
              <Text style={styles.title} accessibilityRole="header">
                Okumatik
              </Text>
              <Text style={styles.subtitle}>Okudukça Türkiye&apos;yi gez!</Text>
            </View>
          </View>

          <View style={[styles.mascot, { marginTop: -mascotOverlap }]}>
            <Mascot pose="wave" size={mascotSize} accessibilityLabel="Pırıl el sallıyor" />
          </View>

          <View style={styles.body}>
            <FloatingBubble />

            <View style={styles.chips}>
              {INFO_CHIPS.map((chip) => (
                <Text key={chip} style={styles.chip}>
                  {chip}
                </Text>
              ))}
            </View>

            <View style={styles.spacer} />

            <View style={styles.buttons}>
              <GameButton
                title="HADİ BAŞLAYALIM"
                accessibilityLabel="Hadi başlayalım"
                accessibilityHint="Kayıt ekranını açar"
                onPress={() => router.push('/register')}
              />
              <GameButton
                title="Zaten hesabım var"
                variant="white"
                size="md"
                accessibilityHint="Giriş ekranını açar"
                onPress={() => router.push('/login')}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/** Pırıl'ın balonu; hafifçe aşağı yukarı süzülür (hareketi azalt açıkken durur). */
function FloatingBubble() {
  const reduceMotion = useReducedMotion();
  const offset = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) return;
    offset.set(
      withRepeat(
        withSequence(withTiming(-8, { duration: 1500 }), withTiming(0, { duration: 1500 })),
        -1,
      ),
    );
    return () => {
      cancelAnimation(offset);
      offset.set(0);
    };
  }, [offset, reduceMotion]);

  const floatStyle = useAnimatedStyle(() => ({ transform: [{ translateY: offset.get() }] }));

  return (
    <Animated.View style={[styles.bubble, floatStyle]}>
      <MascotBubble
        tone="game"
        size="lg"
        side="bottom"
        align="center"
        highlight="Pırıl"
        text={GREETING}
        style={styles.bubbleBox}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    alignItems: 'center',
  },
  column: {
    flexGrow: 1,
  },
  fade: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  titleBlock: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    gap: 2,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 50,
    lineHeight: 58,
    color: GameColors.white,
    textShadowColor: 'rgba(58,43,143,0.55)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 0,
  },
  subtitle: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 16,
    lineHeight: 22,
    color: GameColors.white,
    textShadowColor: 'rgba(30,20,80,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  mascot: {
    alignItems: 'center',
  },
  body: {
    flexGrow: 1,
    paddingHorizontal: SIDE_PADDING,
    paddingTop: 12,
  },
  bubble: {
    alignSelf: 'stretch',
  },
  bubbleBox: {
    alignSelf: 'stretch',
    borderRadius: 22,
    paddingHorizontal: 18,
    paddingVertical: 14,
    boxShadow: '0 12px 28px rgba(201,99,31,0.18)',
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginTop: 20,
  },
  chip: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 13,
    lineHeight: 18,
    color: GameColors.textWarmSecondary,
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 999,
    overflow: 'hidden',
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  spacer: {
    flexGrow: 1,
    minHeight: 24,
  },
  buttons: {
    gap: 12,
  },
});
