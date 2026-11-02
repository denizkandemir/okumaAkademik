import * as Haptics from 'expo-haptics';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Path, Rect } from 'react-native-svg';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { FeedbackPanel } from '@/design/components/feedback-panel';
import { IconButton } from '@/design/components/icon-button';
import { RewardRow } from '@/design/components/reward-row';
import { CloseIcon, GiftIcon } from '@/design/icons';
import { colors, fonts } from '@/design/tokens';
import { continueRewardFlow, nextRewardStep, nextStepLabel } from '@/features/game/reward-flow';
import { setReward, type Reward } from '@/features/game/reward-store';
import { RewardLayout } from '@/features/game/rewards/reward-layout';
import type {
  CompleteLessonRequest,
  CompleteLessonResponse,
  LessonDetailResponse,
} from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';
import { useApiQuery } from '@/hooks/use-api-query';
import { useHardwareBack } from '@/hooks/use-hardware-back';
import { api, ApiError } from '@/lib/api';
import { getErrorMessage } from '@/lib/errors';

const CHEST_WIDTH = 150;
/** Lokum sayacının sürdüğü süre (ms). */
const COUNT_MS = 700;

type Phase = 'closed' | 'opening' | 'open';

/**
 * Sandık (5. ve 10. ders; panoda yok, seviye ödülünün diliyle): dokun, sandık sallansın, kapak
 * kalksın, lokumlar sayılsın; sonra ödül akışı sürer.
 */
export default function ChestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
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
      lid.set(
        reduceMotion ? 1 : withTiming(1, { duration: 420, easing: Easing.out(Easing.back(1.6)) }),
      );
      setPhase('open');
    } catch (failure) {
      setError(getErrorMessage(failure));
      setPhase('closed');
    }
  };

  const shakeStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${shake.get()}deg` }] }));
  const lidStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -22 * lid.get() }, { rotate: `${-16 * lid.get()}deg` }],
  }));

  const result = reward?.result;
  const firstTime = result?.firstTime ?? data?.lesson.status !== 'done';
  const amount = result?.firstTime ? result.lokum.lesson : 0;
  const counted = useCountUp(phase === 'open' ? amount : 0, reduceMotion);
  const next = reward ? nextRewardStep('chest', reward) : null;
  const nextLabel = nextStepLabel(next);

  const subtitle =
    phase === 'open'
      ? firstTime
        ? 'Vay! Sandıktan lokumlar çıktı!'
        : 'Bu sandığı daha önce açmıştın. Yine de çok güzel!'
      : loadFailed
        ? locked
          ? getErrorMessage(loadError)
          : `Hımm, sandığı getiremedim. ${getErrorMessage(loadError)}`
        : 'Sandığa dokun, bakalım içinden ne çıkacak!';

  return (
    <RewardLayout
      toolbar={
        <IconButton accessibilityLabel="Kapat" onPress={close}>
          <CloseIcon size={20} strokeWidth={2.2} />
        </IconButton>
      }
      eyebrow="BİR SANDIK BULDUN"
      hero={
        <View style={styles.stage}>
          <Mascot
            pose={phase === 'open' ? 'celebrate' : error || loadFailed ? 'think' : 'happy'}
            size={120}
          />
          <View style={styles.chestColumn}>
            <AppText
              color={colors.resultNumber}
              style={[styles.count, phase !== 'open' || amount === 0 ? styles.hidden : null]}
              accessibilityElementsHidden
              importantForAccessibility="no-hide-descendants"
              maxFontSizeMultiplier={1.3}>
              +{counted}
            </AppText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={phase === 'open' ? 'Açık hazine sandığı' : 'Sandığı aç'}
              accessibilityState={{
                disabled: phase !== 'closed' || !data,
                busy: phase === 'opening',
              }}
              disabled={phase !== 'closed' || !data}
              onPress={open}>
              <Animated.View style={[styles.chest, shakeStyle]}>
                <Animated.View style={[styles.lid, lidStyle]}>
                  <ChestLid />
                </Animated.View>
                <ChestBody />
              </Animated.View>
            </Pressable>
          </View>
        </View>
      }
      title="Hazine Sandığı"
      subtitle={[subtitle]}
      actions={
        phase === 'open' && reward ? (
          <Button
            title={nextLabel}
            accessibilityLabel={nextLabel.toLocaleLowerCase('tr-TR')}
            onPress={() => continueRewardFlow('chest', reward)}
          />
        ) : loadFailed ? (
          locked ? (
            <Button title="TAMAM" accessibilityLabel="Tamam" variant="secondary" onPress={close} />
          ) : (
            <Button title="TEKRAR DENE" accessibilityLabel="Tekrar dene" onPress={refetch} />
          )
        ) : (
          <Button
            title="SANDIĞI AÇ"
            accessibilityLabel="Sandığı aç"
            loading={phase === 'opening'}
            disabled={!data}
            onPress={open}
          />
        )
      }>
      {phase === 'open' && result ? (
        result.firstTime ? (
          <RewardRow
            icon={<GiftIcon color={colors.rewardRow.icon} />}
            title={`+${result.lokum.lesson} lokum`}
            subtitle="Sandıktaki lokumlar kumbarana eklendi."
          />
        ) : (
          <RewardRow
            icon={<GiftIcon color={colors.rewardRow.icon} />}
            title="Lokumlarını daha önce almıştın."
          />
        )
      ) : null}
      {error ? <FeedbackPanel tone="wrong" title="Sandık açılmadı" text={error} /> : null}
    </RewardLayout>
  );
}

/** 0'dan `target`'a kısa sürede sayar; hareketi azalt açıksa doğrudan son değeri verir. */
function useCountUp(target: number, reduceMotion: boolean) {
  const [value, setValue] = useState(0);
  const animate = !reduceMotion && target > 0;
  useEffect(() => {
    if (!animate) return;
    const start = Date.now();
    const timer = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / COUNT_MS);
      setValue(Math.round(target * t));
      if (t === 1) clearInterval(timer);
    }, 40);
    return () => clearInterval(timer);
  }, [target, animate]);
  return animate ? value : target;
}

/** Sandığın gövdesi: hardal kutu, ortasından geçen hediye kurdelesi. */
function ChestBody() {
  const { fill, lip, icon } = colors.node.chest;
  return (
    <Svg width={CHEST_WIDTH} height={92} viewBox="0 0 150 92" accessible={false}>
      <Rect x={4} y={10} width={142} height={78} rx={14} fill={lip} />
      <Rect x={4} y={4} width={142} height={76} rx={14} fill={fill} stroke={lip} strokeWidth={3} />
      <Rect x={66} y={4} width={18} height={76} fill={icon} />
      <Rect x={4} y={30} width={142} height={10} fill={icon} opacity={0.35} />
    </Svg>
  );
}

/** Sandığın kapağı ve fiyonk (açılınca kalkar). */
function ChestLid() {
  const { fill, lip, icon } = colors.node.chest;
  return (
    <Svg width={CHEST_WIDTH} height={58} viewBox="0 0 150 58" accessible={false}>
      <Path
        d="M51 20 C38 4 22 8 30 18 C34 23 46 22 66 22 Z M99 20 C112 4 128 8 120 18 C116 23 104 22 84 22 Z"
        fill={icon}
      />
      <Path
        d="M6 54 V36 C6 26 14 20 26 20 H124 C136 20 144 26 144 36 V54 Z"
        fill={fill}
        stroke={lip}
        strokeWidth={3}
      />
      <Rect x={66} y={20} width={18} height={34} fill={icon} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  stage: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 8,
  },
  chestColumn: {
    alignItems: 'center',
  },
  count: {
    fontFamily: fonts.sansBlack,
    fontSize: 34,
    lineHeight: 40,
  },
  hidden: {
    opacity: 0,
  },
  chest: {
    width: CHEST_WIDTH,
    alignItems: 'center',
    paddingTop: 12,
  },
  lid: {
    marginBottom: -4,
    zIndex: 2,
    transformOrigin: 'right bottom',
  },
});
