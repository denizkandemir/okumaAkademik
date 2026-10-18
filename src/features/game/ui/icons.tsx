/**
 * Tasarımdaki satır içi SVG ikonlar (docs/tasarim/kaynak/*.dc.html), 24×24 viewBox ile birebir.
 * Çizgi ikonlarda `color` çizgi rengidir; çizgi kalınlıkları tasarımdaki varsayılanlardır.
 * İkonlar süseldir ve metin içermez; anlamı her zaman onu saran kontrolün `accessibilityLabel`'ı
 * taşır (erişilebilir kontrol çocuklarını gruplar).
 */
import type { ReactNode } from 'react';
import Svg, { Circle, Path, Rect } from 'react-native-svg';

export type IconProps = {
  size?: number;
  color?: string;
  strokeWidth?: number;
};

type LineIconProps = IconProps & { children: ReactNode; defaultStroke: number };

function LineIcon({
  size = 24,
  color = '#1F1B3A',
  strokeWidth,
  defaultStroke,
  children,
}: LineIconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth ?? defaultStroke}
      strokeLinecap="round"
      strokeLinejoin="round">
      {children}
    </Svg>
  );
}

/** Ev — "Yol" sekmesi */
export function HouseIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z" />
    </LineIcon>
  );
}

/** Açık kitap — "Kitaplık" sekmesi, hikâye dersi */
export function BookIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Path d="M3 5h6a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H3z" />
      <Path d="M21 5h-6a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h7z" />
    </LineIcon>
  );
}

/** Rozet — "Rozetler" sekmesi */
export function BadgeIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Circle cx={12} cy={9} r={5} />
      <Path d="M9 13.5L7 21l5-3 5 3-2-7.5" />
    </LineIcon>
  );
}

/** Kişi — "Profil" sekmesi */
export function PersonIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Circle cx={12} cy={8} r={4} />
      <Path d="M4 21a8 8 0 0 1 16 0" />
    </LineIcon>
  );
}

/** Katlanmış harita — yolculuk haritası */
export function MapIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2}>
      <Path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" />
      <Path d="M9 4v14" />
      <Path d="M15 6v14" />
    </LineIcon>
  );
}

/** Büyüteç — kelime avı */
export function SearchIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.6}>
      <Circle cx={10.5} cy={10.5} r={6} />
      <Path d="M15 15l5 5" />
    </LineIcon>
  );
}

/** Mikrofon — sesli okuma */
export function MicIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.4}>
      <Rect x={9} y={3} width={6} height={12} rx={3} />
      <Path d="M5 11a7 7 0 0 0 14 0" />
      <Path d="M12 18v3" />
    </LineIcon>
  );
}

/** Hazine sandığı */
export function ChestIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Path d="M3 10a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z" />
      <Path d="M3 11h18" />
      <Rect x={10.5} y={9.5} width={3} height={4} rx={1} />
    </LineIcon>
  );
}

/** Kilit */
export function LockIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={3}>
      <Rect x={5} y={11} width={14} height={10} rx={2} />
      <Path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </LineIcon>
  );
}

/** Onay işareti */
export function CheckIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={3}>
      <Path d="M5 13l5 5L19 7" />
    </LineIcon>
  );
}

/** Kapat (çarpı) */
export function CloseIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.8}>
      <Path d="M6 6l12 12M18 6L6 18" />
    </LineIcon>
  );
}

/** Geri oku */
export function BackIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.6}>
      <Path d="M15 5l-7 7 7 7" />
    </LineIcon>
  );
}

/** Göz — şifreyi göster (S02Giris) */
export function EyeIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Circle cx={12} cy={12} r={3} />
    </LineIcon>
  );
}

/** Üstü çizili göz — şifreyi gizle (tasarımda yok; göz ikonuna çapraz çizgi eklendi) */
export function EyeOffIcon(props: IconProps) {
  return (
    <LineIcon {...props} defaultStroke={2.2}>
      <Path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
      <Circle cx={12} cy={12} r={3} />
      <Path d="M4 4l16 16" />
    </LineIcon>
  );
}

type FilledIconProps = { size?: number };

function FilledSvg({ size = 24, children }: FilledIconProps & { children: ReactNode }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {children}
    </Svg>
  );
}

/** Seri alevi (iki tonlu). `color` dış alev, `accent` iç alev. */
export function FlameIcon({
  size,
  color = '#F0662C',
  accent = '#FFC23A',
}: FilledIconProps & { color?: string; accent?: string }) {
  return (
    <FilledSvg size={size}>
      <Path
        d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-7 0 2 1 3 2 3 0-3-1-5 1-8z"
        fill={color}
      />
      <Path d="M12 13c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1 1-2 1-3 1 1 2 0 2-2z" fill={accent} />
    </FilledSvg>
  );
}

const STAR_PATH = 'M12 2.5l2.9 6 6.6.8-4.9 4.5 1.3 6.5L12 17l-5.9 3.3 1.3-6.5L2.5 9.3l6.6-.8z';

/** Yıldız. Ders sonu yıldızları: dolgu #FFC23A, kenar #D99400; seviye rozetinde beyaz. */
export function StarIcon({
  size,
  fill = '#FFC23A',
  stroke,
  strokeWidth = 1.2,
}: FilledIconProps & { fill?: string; stroke?: string; strokeWidth?: number }) {
  return (
    <FilledSvg size={size}>
      <Path
        d={STAR_PATH}
        fill={fill}
        stroke={stroke}
        strokeWidth={stroke ? strokeWidth : 0}
        strokeLinejoin="round"
      />
    </FilledSvg>
  );
}

/** Lokum kutusu (üst çubuktaki lokum sayacı) */
export function LokumIcon({ size }: FilledIconProps) {
  return (
    <FilledSvg size={size}>
      <Rect
        x={3}
        y={5}
        width={18}
        height={15}
        rx={4}
        fill="#F7A3B5"
        stroke="#C25B76"
        strokeWidth={1.6}
      />
      <Path d="M3 10h18" stroke="#FFD3DE" strokeWidth={2} />
      <Circle cx={8} cy={8} r={1} fill="#FFFFFF" />
      <Circle cx={15} cy={7.5} r={1} fill="#FFFFFF" />
    </FilledSvg>
  );
}
