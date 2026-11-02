export type MascotPose =
  'idle' | 'happy' | 'wave' | 'read' | 'talk' | 'think' | 'celebrate' | 'sleep';

export const MASCOT_POSES: readonly MascotPose[] = [
  'idle',
  'happy',
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
   * Süs: yanındaki metin aynı şeyi söylüyorsa ekran okuyucu Pırıl'da durmaz. `onPress` ile
   * birlikte kullanılmaz.
   */
  decorative?: boolean;
  /**
   * Sistemin "hareketi azalt" ayarını geçersiz kılar (ör. geliştirici vitrininde denemek için).
   * Verilmezse sistem ayarı kullanılır.
   */
  reduceMotion?: boolean;
};
