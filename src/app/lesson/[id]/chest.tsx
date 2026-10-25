import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, {
  Easing,
  ZoomIn,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path, Rect } from 'react-native-svg';

import { continueRewardFlow } from '@/features/game/reward-flow';
import { setReward, type Reward } from '@/features/game/reward-store';
import { GameBackgrounds, GameColors, GameFonts } from '@/features/game/theme';
import type {
  CompleteLessonRequest,
  CompleteLessonResponse,
  LessonDetailResponse,
} from '@/features/game/types';
import { GameButton } from '@/features/game/ui/game-button';
import { CloseIcon, LokumIcon } from '@/features/game/ui/icons';
import { SquareButton } from '@/features/game/ui/square-button';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const CHEST_WIDTH = 170;
/** Kapaktan fışkıran lokumların gidiş yönleri (dp). */
const BURST = [
  { x: -90, y: -110 },
  { x: -40, y: -150 },
  { x: 10, y: -170 },
  { x: 60, y: -140 },
  { x: 100, y: -100 },
  { x: -110, y: -50 },
  { x: 115, y: -45 },
];

type Phase = 'closed' | 'opening' | 'open';

/** Sandık (5. ve 10. ders): dokun, sandık sallansın, kapak açılsın, lokumlar fışkırsın. */
export default function ChestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const {
    data,
    error: loadError,
    refetch,
  } = useApiQuery<LessonDetailResponse>(id ? `/lessons/${encodeURIComponent(id)}` : null);
  const [phase, setPhase] = useState<Phase>('closed');
  const [reward, setLocalReward] = useState<Reward | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Ders bilgisi alınamadıysa: kilitli ya da yoksa yalnızca çıkılır, diğer hatalarda yeniden denenir.
  const loadFailed = !data && !!loadError;
  const locked =
    loadError instanceof ApiError && (loadError.status === 403 || loadError.status === 404);

  /** Kapat: açılırken bir şey yapmaz; açıldıysa ödül akışına devam eder (X ve Android geri). */
  const close = () => {
    if (phase === 'opening') return;
    if (phase === 'open' && reward) continueRewardFlow('chest', reward);
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  useHardwareBack(() => {
    close();
    return true;
  });

  const shake = useSharedValue(0);
  const lid = useSharedValue(0);
  const burst = useSharedValue(0);

  const open = async () => {
    if (!data || phase !== 'closed') return;
    setPhase('opening');
    setError(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
    if (!reduceMotion) {
      shake.set(
        withSequence(...[-8, 8, -6, 6, -3, 0].map((deg) => withTiming(deg, { duration: 70 }))),
      );
    }
    try {
      const body: CompleteLessonRequest = {};
      const result = await api.post<CompleteLessonResponse>(
        `/lessons/${encodeURIComponent(data.lesson.id)}/complete`,
        body,
      );
      const next: Reward = {
        lessonId: data.lesson.id,
        lessonTitle: data.lesson.title,
        kind: 'chest',
        city: data.lesson.city,
        result,
      };
      setReward(next);
      setLocalReward(next);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      if (!reduceMotion) {
        lid.set(withTiming(1, { duration: 420, easing: Easing.out(Easing.back(1.6)) }));
        burst.set(withTiming(1, { duration: 900, easing: Easing.out(Easing.cubic) }));
      } else {
        lid.set(1);
      }
      setPhase('open');
    } catch (failure) {
      setError(getErrorMessage(failure));
      setPhase('closed');
    }
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${shake.get()}deg` }] }));
  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -18 * lid.get() }, { rotate: `${-28 * lid.get()}deg` }],
  }));

  const result = reward?.result;
  const firstTime = result?.firstTime ?? data?.lesson.status !== 'done';
  const bubble =
    phase === 'open'
      ? firstTime
        ? 'Vay! Sandıktan lokumlar çıktı!'
        : 'Bu sandığı daha önce açmıştın. Yine de çok güzel!'
      : error
        ? `Hımm, sandık açılmadı. ${error}`
        : loadFailed
          ? locked
            ? getErrorMessage(loadError)
            : `Hımm, sandığı getiremedim. ${getErrorMessage(loadError)}`
          : 'Sandığa dokun, bakalım içinden ne çıkacak!';

  return (
    <View style={[styles.root, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <LinearGradient {...GameBackgrounds.cream} style={StyleSheet.absoluteFill} />

      <View style={styles.header}>
        <SquareButton accessibilityLabel="Kapat" onPress={close}>
          <CloseIcon size={20} color={GameColors.textWarmSecondary} />
        </SquareButton>
        <Text style={styles.title} accessibilityRole="header">
          Hazine Sandığı
        </Text>
      </View>

      <View style={styles.bubble}>
        <MascotBubble tone="game" side="bottom" align="center" text={bubble} />
      </View>

      <View style={styles.stage}>
        <Mascot
          pose={phase === 'open' ? 'celebrate' : error || loadFailed ? 'think' : 'happy'}
          size={140}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={phase === 'open' ? 'Açık hazine sandığı' : 'Sandığı aç'}
          accessibilityState={{ disabled: phase !== 'closed' || !data, busy: phase === 'opening' }}
          disabled={phase !== 'closed' || !data}
          onPress={open}
          style={styles.chestPress}>
          <Animated.View style={[styles.chest, shakeStyle]}>
            {BURST.map((target, index) => (
              <LokumPiece key={index} target={target} progress={burst} />
            ))}
            <Animated.View style={[styles.lid, lidStyle]}>
              <ChestLid />
            </Animated.View>
            <ChestBody />
          </Animated.View>
        </Pressable>
      </View>

      {phase === 'open' && result ? (
        <Animated.View entering={ZoomIn.springify()} style={styles.prize}>
          {result.firstTime ? (
            <Text style={styles.prizeText}>+{result.lokum.lesson} lokum</Text>
          ) : (
            <Text style={styles.prizeSmall}>Lokumlarını daha önce almıştın.</Text>
          )}
        </Animated.View>
      ) : null}

      <View style={styles.spacer} />
      {phase === 'open' && reward ? (
        <GameButton
          title="DEVAM ET"
          accessibilityLabel="Devam et"
          onPress={() => continueRewardFlow('chest', reward)}
        />
      ) : loadFailed ? (
        locked ? (
          <GameButton variant="white" size="md" title="Tamam" onPress={close} />
        ) : (
          <GameButton title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={refetch} />
        )
      ) : (
        <GameButton
          variant="gold"
          title="SANDIĞI AÇ"
          accessibilityLabel="Sandığı aç"
          loading={phase === 'opening'}
          disabled={!data}
          onPress={open}
        />
      )}
    </View>
  );
}

function LokumPiece({
  target,
  progress,
}: {
  target: { x: number; y: number };
  progress: SharedValue<number>;
}) {
  const style = useAnimatedStyle(() => {
    const t = progress.get();
    return {
      opacity: t === 0 ? 0 : 1 - Math.max(0, t - 0.6) / 0.4,
      transform: [
        { translateX: target.x * t },
        { translateY: target.y * t + 60 * t * t },
        { rotate: `${target.x * 2 * t}deg` },
      ],
    };
  });
  return (
    <Animated.View style={[styles.piece, style]}>
      <LokumIcon size={26} />
    </Animated.View>
  );
}

/** Sandığın gövdesi (ahşap, altın şeritler, kilit). */
function ChestBody() {
  return (
    <Svg width={CHEST_WIDTH} height={100} viewBox="0 0 170 100">
      <Rect
        x={4}
        y={4}
        width={162}
        height={92}
        rx={14}
        fill="#B8732A"
        stroke="#7A4612"
        strokeWidth={4}
      />
      <Rect x={4} y={34} width={162} height={12} fill="#FFC23A" />
      <Rect x={30} y={4} width={12} height={92} fill="#E0A126" />
      <Rect x={128} y={4} width={12} height={92} fill="#E0A126" />
      <Rect
        x={70}
        y={22}
        width={30}
        height={34}
        rx={6}
        fill="#FFE07A"
        stroke="#B87800"
        strokeWidth={3}
      />
      <Rect x={82} y={34} width={6} height={12} rx={3} fill="#7A4612" />
    </Svg>
  );
}

/** Sandığın kapağı (açılınca geriye devrilir). */
function ChestLid() {
  return (
    <Svg width={CHEST_WIDTH} height={56} viewBox="0 0 170 56">
      <Path
        d="M8 52 V30 C8 14 22 4 40 4 H130 C148 4 162 14 162 30 V52 Z"
        fill="#C9822B"
        stroke="#7A4612"
        strokeWidth={4}
      />
      <Rect x={30} y={6} width={12} height={46} fill="#E0A126" />
      <Rect x={128} y={6} width={12} height={46} fill="#E0A126" />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingHorizontal: 20,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 28,
    lineHeight: 34,
    color: GameColors.warm,
  },
  bubble: {
    marginTop: 12,
  },
  stage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
    marginTop: 40,
  },
  chestPress: {
    paddingTop: 50,
  },
  chest: {
    width: CHEST_WIDTH,
    alignItems: 'center',
  },
  lid: {
    marginBottom: -6,
    zIndex: 2,
    transformOrigin: 'right bottom',
  },
  piece: {
    position: 'absolute',
    top: 40,
    left: CHEST_WIDTH / 2 - 13,
    zIndex: 1,
  },
  prize: {
    alignSelf: 'center',
    borderRadius: 999,
    backgroundColor: GameColors.white,
    paddingVertical: 10,
    paddingHorizontal: 20,
    boxShadow: GameColors.panelShadowWarm,
  },
  prizeText: {
    fontFamily: GameFonts.headingHeavy,
    fontSize: 30,
    lineHeight: 36,
    color: '#A33B5A',
  },
  prizeSmall: {
    fontFamily: GameFonts.bodyHeavy,
    fontSize: 16,
    color: GameColors.textWarmSecondary,
  },
  spacer: {
    flexGrow: 1,
  },
});
