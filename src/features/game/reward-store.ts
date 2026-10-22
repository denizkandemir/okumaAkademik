import { useSyncExternalStore } from 'react';

import type { CityId } from './theme';
import type { CompleteLessonResponse, LessonKind } from './types';

/**
 * Son ders tamamlamanın sonucu ve ödül ekranlarının ihtiyaç duyduğu bağlam. `POST
 * /lessons/:id/complete` yanıtı burada tutulur; ders sonu, seviye atlama, yeni şehir ve final
 * ekranları buradan okur. Bellekte durur: uygulama yeniden açılınca boştur (ekranlar ana sayfaya
 * yönlendirir).
 */
export type Reward = {
  lessonId: string;
  lessonTitle: string;
  kind: LessonKind;
  city: CityId;
  result: CompleteLessonResponse;
  /** Pırıl'ın ders sonu notu (ör. son sorunun açıklaması). */
  note?: string;
};

let current: Reward | null = null;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

const getSnapshot = () => current;

export function setReward(reward: Reward) {
  current = reward;
  emit();
}

/** Ödül akışı bitince çağrılır; eski sonuç bir sonraki derse taşınmaz. */
export function clearReward() {
  current = null;
  emit();
}

/** Son ödül; yoksa `null`. */
export function useReward(): Reward | null {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
