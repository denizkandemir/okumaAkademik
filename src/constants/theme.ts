/**
 * Uygulamanın tüm renkleri ve ölçüleri burada tanımlanır. Açık ve koyu temada metin/zemin
 * kontrastı en az WCAG AA (4.5:1) olacak şekilde seçilmiştir.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#111318',
    textSecondary: '#4A4F5C',
    background: '#FFFFFF',
    backgroundElement: '#F1F3F8',
    backgroundSelected: '#DDE3F0',
    border: '#C9CED8',
    primary: '#1F5FD6',
    onPrimary: '#FFFFFF',
    success: '#1E7B34',
    danger: '#B42318',
    onDanger: '#FFFFFF',
  },
  dark: {
    text: '#F5F7FA',
    textSecondary: '#B8BDC8',
    background: '#0E1014',
    backgroundElement: '#1C1F26',
    backgroundSelected: '#2A2F3A',
    border: '#3A404C',
    primary: '#7AA7FF',
    onPrimary: '#0B1220',
    success: '#6FD08C',
    danger: '#FF8A80',
    onDanger: '#2B0B08',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const Radius = {
  small: 12,
  medium: 16,
  large: 24,
  full: 999,
} as const;

/** Çocuklar için en küçük dokunma alanı (px). */
export const MinTouchSize = 48;
/** Birincil butonlar ve form alanları için yükseklik. */
export const ControlHeight = 56;

/** Okuma ekranındaki yazı boyutu sınırları. */
export const ReadingFont = {
  min: 18,
  max: 36,
  default: 22,
  step: 2,
  lineHeightRatio: 1.6,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
/** Web'de sekme çubuğu üstte yer alır. */
export const TopTabInset = Platform.select({ web: 96 }) ?? 0;
export const MaxContentWidth = 720;
