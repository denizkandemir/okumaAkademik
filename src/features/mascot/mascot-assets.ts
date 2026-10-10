import type { ImageSource } from 'expo-image';

import type { MascotPose } from './types';

/*
 * Yalnızca optimize edilmiş WebP'ler (assets/mascot/optimized/) kullanılır. Kaynak PNG'ler
 * değiştiğinde `npm run mascot:optimize` çalıştırın.
 */
const frames = {
  sitting: require('@/assets/mascot/optimized/mascot_sitting.webp'),
  sittingEyesClosed: require('@/assets/mascot/optimized/mascot_sitting_eyes_closed.webp'),
  happy: require('@/assets/mascot/optimized/mascot_happy.webp'),
  handWaving: require('@/assets/mascot/optimized/mascot_hand_waving.webp'),
  handWavingTilted: require('@/assets/mascot/optimized/mascot_hand_waving_tilted.webp'),
  reading: require('@/assets/mascot/optimized/mascot_reading.webp'),
  readingEyesClosed: require('@/assets/mascot/optimized/mascot_reading_eyes_closed.webp'),
  talking: require('@/assets/mascot/optimized/mascot_talking.webp'),
  talkingMouthClosed: require('@/assets/mascot/optimized/mascot_talking_mouth_closed.webp'),
  thinking: require('@/assets/mascot/optimized/mascot_thinking.webp'),
  thinkingEyesClosed: require('@/assets/mascot/optimized/mascot_thinking_eyes_closed.webp'),
  celebration: require('@/assets/mascot/optimized/mascot_celebration.webp'),
  sleepy: require('@/assets/mascot/optimized/mascot_sleepy.webp'),
  sleepyMouthClosed: require('@/assets/mascot/optimized/mascot_sleepy_mouth_closed.webp'),
} satisfies Record<string, ImageSource>;

export type PoseArt = {
  /** Temel kare; animasyon kapalıyken yalnızca bu görünür. */
  base: ImageSource;
  /** Aynı tuvalde hizalı ikinci kare (göz kırpma, ağız, el sallama). */
  overlay?: ImageSource;
  /**
   * Ayakların (yer gölgesinin) tuvaldeki dikey konumu, 0-1. Gövde bu noktadan ölçeklenir ve döner.
   * Değerler görsellerin saydam olmayan alt sınırından ölçüldü.
   */
  ground: number;
  /** Yer gölgesinin genişliği, boyuta oranla. */
  shadow: number;
};

export const POSE_ART: Record<MascotPose, PoseArt> = {
  idle: { base: frames.sitting, overlay: frames.sittingEyesClosed, ground: 0.985, shadow: 0.55 },
  happy: { base: frames.happy, ground: 0.985, shadow: 0.5 },
  wave: { base: frames.handWaving, overlay: frames.handWavingTilted, ground: 0.98, shadow: 0.55 },
  read: { base: frames.reading, overlay: frames.readingEyesClosed, ground: 0.975, shadow: 0.6 },
  talk: { base: frames.talkingMouthClosed, overlay: frames.talking, ground: 0.98, shadow: 0.5 },
  think: { base: frames.thinking, overlay: frames.thinkingEyesClosed, ground: 0.965, shadow: 0.45 },
  // Kutlama görselinde Pırıl zaten havada; gölge ayakların biraz altında durur.
  celebrate: { base: frames.celebration, ground: 0.97, shadow: 0.42 },
  sleep: { base: frames.sleepyMouthClosed, overlay: frames.sleepy, ground: 0.89, shadow: 0.8 },
};
