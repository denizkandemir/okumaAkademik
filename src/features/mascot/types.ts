export type MascotPose =
  'idle' | 'happy' | 'sittingHappy' | 'wave' | 'read' | 'talk' | 'think' | 'celebrate' | 'sleep';

export const MASCOT_POSES: readonly MascotPose[] = [
  'idle',
  'happy',
  'sittingHappy',
  'wave',
  'read',
  'talk',
  'think',
  'celebrate',
  'sleep',
];

export type MascotProps = {
  /** Varsayılan `idle`. */
  pose?: MascotPose;
  /** dp cinsinden genişlik; görseller kare olduğu için yükseklik de aynıdır. Varsayılan 160. */
  size?: number;
  /** Yalnızca `talk` pozunda: `true` olduğu sürece ağız açılıp kapanır. */
  talking?: boolean;
  /** `false` ise animasyon yoktur, pozun temel karesi sabit gösterilir. Varsayılan `true`. */
  animated?: boolean;
  /** Dokunma geri bildirimi (zıplama + titreşim) her zaman çalışır; ardından çağrılır. */
  onPress?: () => void;
  /** Varsayılan "Pırıl". */
  accessibilityLabel?: string;
  /**
   * Sistemin "hareketi azalt" ayarını geçersiz kılar (ör. geliştirici vitrininde denemek için).
   * Verilmezse sistem ayarı kullanılır.
   */
  reduceMotion?: boolean;
};

export type MascotBubbleSide = 'left' | 'right' | 'top';

export type MascotBubbleProps = {
  text: string;
  /**
   * Balonun maskota göre konumu; kuyruk maskota doğru bakar.
   * `right`: balon maskotun sağında (kuyruk solda). Varsayılan `right`.
   */
  side?: MascotBubbleSide;
  /** Daktilo efekti başladığında `true`, bittiğinde `false` ile çağrılır. */
  onTypingChange?: (isTyping: boolean) => void;
  /** Sistemin "hareketi azalt" ayarını geçersiz kılar. */
  reduceMotion?: boolean;
};
