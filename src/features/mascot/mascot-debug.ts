import { createContext } from 'react';

import type { MascotPose } from './types';

export type MascotFrameKind = 'base' | 'overlay';

export type MascotFrameEvent =
  | { pose: MascotPose; frame: MascotFrameKind; status: 'loaded'; width: number; height: number }
  | { pose: MascotPose; frame: MascotFrameKind; status: 'error'; message: string };

export type MascotDebug = {
  /**
   * iOS: expo-image'in Apple (ImageIO) WebP çözücüsü. Maskot varsayılan olarak libwebp kullanır;
   * bu anahtar yalnızca vitrinde karşılaştırma için.
   */
  useAppleWebpCodec: boolean;
  /** Eski pivot yöntemi (transformOrigin stili); yalnızca vitrinde karşılaştırma için. */
  legacyTransformOrigin: boolean;
  /** `true` ise görseller önbelleğe alınmaz; çözücü değişince her kare yeniden çözülür. */
  disableImageCache: boolean;
  /** Her kare yüklendiğinde ya da yüklenemediğinde çağrılır. */
  onFrameEvent?: (event: MascotFrameEvent) => void;
};

export const DEFAULT_MASCOT_DEBUG: MascotDebug = {
  useAppleWebpCodec: false,
  legacyTransformOrigin: false,
  disableImageCache: false,
};

/** Geliştirici vitrini maskotun davranışını bununla değiştirir; uygulama ekranları kullanmaz. */
export const MascotDebugContext = createContext<MascotDebug>(DEFAULT_MASCOT_DEBUG);
