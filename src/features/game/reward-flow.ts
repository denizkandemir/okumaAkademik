import { router } from 'expo-router';

import { clearReward, type Reward } from './reward-store';

/** Ders sonundan sonra sırayla açılabilen ödül ekranları (kök rotalar). */
type RewardScreen = 'level-up' | 'city-unlocked' | 'finale';
/** Akışın başladığı ya da bulunduğu ekran. */
export type RewardStep = 'complete' | 'chest' | RewardScreen;

const ORDER: RewardScreen[] = ['level-up', 'city-unlocked', 'finale'];

function isDue(step: RewardScreen, reward: Reward) {
  const { result } = reward;
  if (!result.firstTime) return false;
  if (step === 'level-up') return result.level.leveledUp;
  if (step === 'city-unlocked') return result.cityUnlocked !== null;
  if (step === 'finale') return result.finished;
  return false;
}

/**
 * Ödül akışında `from` ekranından sonrasına geçer: ders sonu ya da sandık → [seviye atladı] →
 * [yeni şehir açıldı] → [final] → ana sayfa. Akış bitince ödül temizlenir, ana sayfaya dönülür
 * (yol odaklanınca tazelenir).
 */
export function continueRewardFlow(from: RewardStep, reward: Reward) {
  const start = from === 'complete' || from === 'chest' ? 0 : ORDER.indexOf(from) + 1;
  const next = ORDER.slice(start).find((step) => isDue(step, reward));
  if (next) {
    router.replace(`/${next}`);
    return;
  }
  clearReward();
  router.dismissTo('/');
}
