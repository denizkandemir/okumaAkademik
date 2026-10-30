/**
 * "Pırıl'ın Atlası" ikonları: docs/tasarim/kaynak/ekranlar/*.html içindeki 24×24 çizgi SVG'ler,
 * path'ler birebir. Panoda SVG'si olmayan kapat (panoda "×" karakteri), saat ve göz ikonları aynı
 * çizgi diliyle çizildi.
 *
 * İkonlar süseldir; anlamı her zaman onu saran kontrolün `accessibilityLabel`'ı taşır.
 */
import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

import { colors, size as sizes } from './tokens';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

/** Panodaki `.icon` stili: dolgusuz, yuvarlak uçlu, 1.9 çizgi. */
const DEFAULT_STROKE = 1.9;

function LineIcon({
  size = sizes.icon,
  color = colors.text,
  strokeWidth = DEFAULT_STROKE,
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}>
      {children}
    </Svg>
  );
}

/** Katlanmış harita — "Yolculuk" sekmesi, şehirler düğmesi. */
export function MapIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="m3 5 6-2 6 3 6-2v15l-6 2-6-3-6 2zM9 3v15m6-12v15" />
    </LineIcon>
  );
}

/** Açık kitap — "Kitaplık" sekmesi, aktif hikâye düğümü. */
export function BookIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="M3 4h5q4 0 4 3 0-3 4-3h5v15h-5q-4 0-4 2-1-2-4-2H3zM12 7v14" />
    </LineIcon>
  );
}

/** Kurdeleli rozet — "Pasaport" sekmesi, madalya düğümü. */
export function AwardIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Circle cx="12" cy="8" r="5" />
      <Path d="m8 12-2 9 6-3 6 3-2-9" />
    </LineIcon>
  );
}

/** Kişi — "Profil" sekmesi. */
export function UserIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Circle cx="12" cy="7" r="4" />
      <Path d="M4 21v-3a8 8 0 0 1 16 0v3" />
    </LineIcon>
  );
}

/** Kilit — kilitli düğüm. */
export function LockIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Rect x="5" y="10" width="14" height="11" rx="3" />
      <Path d="M8 10V7a4 4 0 0 1 8 0v3m-4 5v2" />
    </LineIcon>
  );
}

/** Tik — biten düğüm. */
export function CheckIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="m5 12 5 5L20 6" />
    </LineIcon>
  );
}

/** Hediye — sandık düğümü, ödül satırı. */
export function GiftIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="M4 10h16v11H4zM2 6h20v4H2zM12 6v15M12 6C2 6 5-3 12 6c7-9 10 0 0 0" />
    </LineIcon>
  );
}

/** Geri oku. */
export function BackIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="m14 5-7 7 7 7" />
    </LineIcon>
  );
}

/** Kapat (panoda "×" karakteri; aynı çizgi diliyle). */
export function CloseIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="M6 6l12 12M18 6 6 18" />
    </LineIcon>
  );
}

/** Ayar sürgüleri — Ayarlar düğmesi. İç daireler zeminle doldurulur. */
export function SlidersIcon({
  fill = colors.iconButton.face,
  ...props
}: IconProps & { fill?: string }) {
  return (
    <LineIcon {...props}>
      <Path d="M3 6h18M3 12h18M3 18h18" />
      <Circle cx="8" cy="6" r="2" fill={fill} />
      <Circle cx="16" cy="12" r="2" fill={fill} />
      <Circle cx="9" cy="18" r="2" fill={fill} />
    </LineIcon>
  );
}

/** Saat — okuma saati (panoda yok). */
export function ClockIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Circle cx="12" cy="12" r="9" />
      <Path d="M12 7v5l3 2" />
    </LineIcon>
  );
}

/** Göz — şifreyi göster (panoda yok). */
export function EyeIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Circle cx="12" cy="12" r="3" />
    </LineIcon>
  );
}

/** Çizili göz — şifreyi gizle (panoda yok). */
export function EyeOffIcon(props: IconProps) {
  return (
    <LineIcon {...props}>
      <Path d="M10 5.2A10 10 0 0 1 12 5c6.5 0 10 7 10 7a17 17 0 0 1-2.6 3.5M6.6 6.6C3.7 8.4 2 12 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.4-1.6M3 3l18 18M9.9 9.9a3 3 0 0 0 4.2 4.2" />
    </LineIcon>
  );
}

/** Dolu yıldız. */
export function StarIcon({
  size = sizes.icon,
  color = colors.star.fill,
  stroke = colors.star.stroke,
}: Omit<IconProps, 'strokeWidth'> & { stroke?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path
        d="m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z"
        fill={color}
        stroke={stroke}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

/** Dolu alev — seri. Panoda 24×28 viewBox, 20×24 çizilir. */
export function FlameIcon({ size = 20, color = colors.flame }: Omit<IconProps, 'strokeWidth'>) {
  return (
    <Svg width={size} height={(size * 28) / 24} viewBox="0 0 24 28" accessible={false}>
      <Path
        d="M13 1c3 8-4 9-2 14 4-1 5-4 5-6 12 13 1 20-5 18C-1 24 1 15 5 10c-1 7 3 8 3 5C6 9 12 6 13 1"
        fill={color}
      />
    </Svg>
  );
}

/** İki tonlu altıgen — lokum. */
export function LokumIcon({ size = 20 }: Pick<IconProps, 'size'>) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" accessible={false}>
      <Path d="m12 1 10 6v11l-10 5-10-5V7z" fill={colors.lokum.outer} />
      <Path d="m12 5 6 4v6l-6 4-6-4V9z" fill={colors.lokum.inner} />
    </Svg>
  );
}
