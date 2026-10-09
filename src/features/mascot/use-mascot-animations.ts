import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import {
  cancelAnimation,
  Easing,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';

import type { MascotPose } from './types';

/** Hareket genlikleri 160 dp'lik maskota göre verilir ve boyutla orantılı büyür/küçülür. */
export const MASCOT_BASE_SIZE = 160;
/** Kutlama zıplamasının en yüksek noktası (160 dp için); gölge buna göre küçülür. */
export const JUMP_HEIGHT = 28;

type Breath = { period: number; scale: number; lift: number };

/** Nefes alma: scaleY 1 → 1 + scale, translateY 0 → -lift. `null`: nefes yok. */
export const BREATH: Record<MascotPose, Breath | null> = {
  idle: { period: 2800, scale: 0.02, lift: 3 },
  happy: { period: 2800, scale: 0.02, lift: 3 },
  sittingHappy: { period: 2800, scale: 0.02, lift: 3 },
  wave: { period: 2800, scale: 0.02, lift: 3 },
  read: { period: 3400, scale: 0.02, lift: 3 },
  talk: { period: 2800, scale: 0.02, lift: 3 },
  think: null,
  celebrate: null,
  sleep: { period: 4000, scale: 0.03, lift: 2 },
};

export type MascotMotion = {
  /** Nefes döngüsü, 0-1. */
  breathe: SharedValue<number>;
  /** Gövde dönüşü, derece. */
  rotate: SharedValue<number>;
  /** Dikey kayma, dp (negatif = yukarı). */
  lift: SharedValue<number>;
  squashX: SharedValue<number>;
  squashY: SharedValue<number>;
  /** İkinci karenin (göz kırpma, ağız, el) görünürlüğü, 0-1. */
  overlay: SharedValue<number>;
};

const easeInOut = Easing.inOut(Easing.sin);
const random = (min: number, max: number) => min + Math.random() * (max - min);
/** Kareyi anında değiştirir (geçiş yok). */
const snap = (value: number) => withTiming(value, { duration: 0 });
const snapAfter = (ms: number, value: number) => withDelay(ms, snap(value));
const timing = (value: number, duration: number, easing = easeInOut) =>
  withTiming(value, { duration, easing });

/** Ekran odakta ve uygulama ön plandayken `true`; aksi halde döngüler durdurulur. */
export function useMascotCanAnimate(): boolean {
  const [focused, setFocused] = useState(false);
  useFocusEffect(
    useCallback(() => {
      setFocused(true);
      return () => setFocused(false);
    }, []),
  );

  const [appActive, setAppActive] = useState(() => isActiveState(AppState.currentState));
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) =>
      setAppActive(isActiveState(state)),
    );
    return () => subscription.remove();
  }, []);

  return focused && appActive;
}

function isActiveState(state: AppStateStatus | null | undefined) {
  return state !== 'background' && state !== 'inactive';
}

/** Sistemin "hareketi azalt" ayarı; `override` verilirse o kullanılır. */
export function useMascotReducedMotion(override?: boolean): boolean {
  const system = useReducedMotion();
  return override ?? system;
}

type PoseAnimationOptions = {
  /** `false` iken tüm döngüler durur ve maskot dinlenme hâline döner. */
  active: boolean;
  talking: boolean;
  /** size / MASCOT_BASE_SIZE */
  unit: number;
};

/**
 * Bir pozun döngü animasyonlarını yönetir. Tüm döngüler UI thread'de Reanimated ile çalışır;
 * yalnızca seyrek rastgele olaylar (göz kırpma, esneme) JS zamanlayıcısıyla tetiklenir.
 * Kare başına React render'ı yoktur.
 */
export function usePoseAnimation(
  pose: MascotPose,
  { active, talking, unit }: PoseAnimationOptions,
): MascotMotion {
  const breathe = useSharedValue(0);
  const rotate = useSharedValue(0);
  const lift = useSharedValue(0);
  const squashX = useSharedValue(1);
  const squashY = useSharedValue(1);
  const overlay = useSharedValue(0);

  useEffect(() => {
    const all = [breathe, rotate, lift, squashX, squashY, overlay];
    if (!active) {
      // Döngü durunca dinlenme hâline yumuşakça dön (temel kare görünür).
      all.forEach(cancelAnimation);
      breathe.set(timing(0, 200));
      rotate.set(timing(0, 200));
      lift.set(timing(0, 200));
      squashX.set(timing(1, 200));
      squashY.set(timing(1, 200));
      overlay.set(snap(0));
      return;
    }

    breathe.set(0);
    rotate.set(0);
    lift.set(0);
    squashX.set(1);
    squashY.set(1);
    overlay.set(0);

    const timers = new Set<ReturnType<typeof setTimeout>>();
    const later = (ms: number, run: () => void) => {
      const timer = setTimeout(() => {
        timers.delete(timer);
        run();
      }, ms);
      timers.add(timer);
    };
    /** Rastgele aralıklarla tekrar eden seyrek olay. */
    const every = (min: number, max: number, run: () => void) => {
      const tick = () =>
        later(random(min, max), () => {
          run();
          tick();
        });
      tick();
    };
    const blink = (doubleChance: number) => {
      overlay.set(
        Math.random() < doubleChance
          ? withSequence(snap(1), snapAfter(110, 0), snapAfter(120, 1), snapAfter(110, 0))
          : withSequence(snap(1), snapAfter(110, 0)),
      );
    };
    /** Ortası 0 olan salınım: 0 → amplitude → -amplitude → amplitude … */
    const sway = (amplitude: number, period: number) =>
      rotate.set(
        withSequence(
          timing(amplitude, period / 4, Easing.out(Easing.sin)),
          withRepeat(timing(-amplitude, period / 2), -1, true),
        ),
      );

    const breath = BREATH[pose];
    if (breath) breathe.set(withRepeat(timing(1, breath.period / 2), -1, true));

    switch (pose) {
      case 'idle':
        sway(1.5, 5000);
        every(2500, 5500, () => blink(0.2));
        break;
      case 'happy':
        sway(2.5, 3000);
        break;
      case 'sittingHappy':
        lift.set(
          withRepeat(
            withSequence(
              withDelay(3700, timing(-6 * unit, 150, Easing.out(Easing.quad))),
              timing(0, 150, Easing.in(Easing.quad)),
            ),
            -1,
          ),
        );
        break;
      case 'wave': {
        // 200 ms'de bir 6 kare değişimi (A→B→…→A), ardından 2,5 sn dinlenme. Döngü: 3,5 sn.
        overlay.set(
          withRepeat(
            withSequence(
              snap(1),
              snapAfter(200, 0),
              snapAfter(200, 1),
              snapAfter(200, 0),
              snapAfter(200, 1),
              snapAfter(200, 0),
              snapAfter(2500, 0),
            ),
            -1,
          ),
        );
        // Gövde salınımı aynı ritimde; toplam süre yine 3,5 sn olduğundan senkron kalır.
        rotate.set(
          withRepeat(
            withSequence(
              timing(2, 200),
              timing(-2, 200),
              timing(2, 200),
              timing(-2, 200),
              timing(2, 200),
              timing(0, 200),
              snapAfter(2300, 0),
            ),
            -1,
          ),
        );
        break;
      }
      case 'read':
        every(3000, 6000, () => blink(0));
        break;
      case 'think':
        rotate.set(-2);
        rotate.set(withRepeat(timing(2, 2000), -1, true));
        every(3000, 6000, () => blink(0));
        break;
      case 'celebrate': {
        // 1,1 sn: hazırlık (bas) → yüksel → düş → iniş (bas) → toparlan → dinlen.
        const up = Easing.out(Easing.quad);
        const down = Easing.in(Easing.quad);
        lift.set(
          withRepeat(
            withSequence(
              withDelay(150, timing(-JUMP_HEIGHT * unit, 300, up)),
              timing(0, 300, down),
              snapAfter(350, 0),
            ),
            -1,
          ),
        );
        const squash = (takeOff: number, air: number) =>
          withRepeat(
            withSequence(
              timing(takeOff, 150),
              timing(air, 150),
              timing(1, 300),
              timing(takeOff, 100),
              timing(1, 150),
              snapAfter(250, 1),
            ),
            -1,
          );
        squashX.set(squash(1.06, 0.97));
        squashY.set(squash(0.94, 1.04));
        break;
      }
      case 'sleep':
        every(6000, 9000, () =>
          overlay.set(withSequence(timing(1, 150), withDelay(1200, timing(0, 150)))),
        );
        break;
      case 'talk':
        // Ağız ve baş hareketi `talking`e bağlı; aşağıdaki effect yönetir.
        break;
    }

    return () => {
      timers.forEach(clearTimeout);
      all.forEach(cancelAnimation);
    };
  }, [pose, active, unit, breathe, rotate, lift, squashX, squashY, overlay]);

  const isTalking = pose === 'talk' && active && talking;
  useEffect(() => {
    if (!isTalking) return;
    // Ağız açık başlar, 100-180 ms'lik düzensiz adımlarla kapanıp açılır (12 adımlık desen döner).
    const steps = Array.from({ length: 12 }, (_, index) =>
      snapAfter(random(100, 180), index % 2 === 0 ? 0 : 1),
    );
    overlay.set(withSequence(snap(1), withRepeat(withSequence(...steps), -1)));
    rotate.set(withRepeat(withSequence(timing(1, 260), timing(-1, 260)), -1, false));
    return () => {
      cancelAnimation(overlay);
      cancelAnimation(rotate);
      // Konuşma bitince ağız kapalı kalır.
      overlay.set(snap(0));
      rotate.set(timing(0, 150));
    };
  }, [isTalking, unit, overlay, rotate]);

  return { breathe, rotate, lift, squashX, squashY, overlay };
}
