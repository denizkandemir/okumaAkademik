/**
 * Oyun tasarımının ortak değerleri. Kaynak: docs/tasarim/ (README "Tasarım dili" ve
 * kaynak/*.dc.html). Renkler tasarımdan birebir alınmıştır; değiştirmeden önce kaynağa bakın.
 */
import type { MascotPose } from '@/features/mascot/types';

/** expo-linear-gradient'e doğrudan verilebilen gradyan. */
export type Gradient = {
  colors: readonly [string, string, ...string[]];
  locations?: readonly [number, number, ...number[]];
  start: { x: number; y: number };
  end: { x: number; y: number };
};

/** Dikey (yukarıdan aşağı) iki renkli gradyan; CSS'teki `linear-gradient(180deg, a, b)`. */
export const vertical = (top: string, bottom: string): Gradient => ({
  colors: [top, bottom],
  start: { x: 0.5, y: 0 },
  end: { x: 0.5, y: 1 },
});

/** Yatay (soldan sağa) iki renkli gradyan; CSS'teki `linear-gradient(90deg, a, b)`. */
export const horizontal = (left: string, right: string): Gradient => ({
  colors: [left, right],
  start: { x: 0, y: 0.5 },
  end: { x: 1, y: 0.5 },
});

/**
 * Yazı tipi aileleri (useFonts'a verilen adlar). Özel yazı tiplerinde her kalınlık ayrı bir
 * ailedir; `fontWeight` kullanmayın, doğru aileyi seçin.
 */
export const GameFonts = {
  /** Baloo 2 · 700 — başlıklar */
  heading: 'Baloo2_700Bold',
  /** Baloo 2 · 800 — büyük başlıklar ve sayılar */
  headingHeavy: 'Baloo2_800ExtraBold',
  /** Nunito · 600 — metin */
  body: 'Nunito_600SemiBold',
  /** Nunito · 700 — vurgulu metin */
  bodyBold: 'Nunito_700Bold',
  /** Nunito · 800 — etiketler, butonlar */
  bodyHeavy: 'Nunito_800ExtraBold',
} as const;

export type GameFontFamily = (typeof GameFonts)[keyof typeof GameFonts];

export const GameColors = {
  /** Ana metin (harita, profil gibi mor-krem ekranlarda). */
  text: '#1F1B3A',
  /** İkincil metin; beyaz üzerinde 7,1:1. */
  textSecondary: '#5A5478',
  /** Sıcak ana metin (ana sayfa, giriş, okuma gibi krem ekranlarda). */
  textWarm: '#2B1E16',
  /** Sıcak ikincil metin; #FFF4E8 üzerinde 6,4:1. */
  textWarmSecondary: '#6B5647',
  /** Soru ve ipucu ekranlarındaki ikincil metin; #F1EBFF üzerinde 5,4:1. */
  textLilacSecondary: '#6B5A7A',
  white: '#FFFFFF',
  /** Krem zeminler */
  cream: '#FFF4E8',
  creamLight: '#FFF9EF',
  creamDeep: '#FFE2C6',
  lilacLight: '#F6F1FF',
  /** Giriş alanı */
  inputBackground: '#FFFBF6',
  inputBorder: '#EADBCB',
  inputFocusBackground: '#F6F8FF',
  inputFocusBorder: '#4F7BF2',
  /** Yıldız (boş yıldız tasarımda yok; krem kenarlık renklerinden türetildi) */
  starFill: '#FFC23A',
  starStroke: '#D99400',
  starEmptyFill: '#F1E6D6',
  starEmptyStroke: '#D8C3A8',
  /** Üst çubuktaki cam haplar */
  chipBackground: 'rgba(255,255,255,0.86)',
  chipText: '#2B1E16',
  chipStreakText: '#B8461A',
  chipLokumText: '#A33B5A',
  /** Gölgeler (boxShadow) */
  panelShadow: '0 12px 26px rgba(91,52,214,0.14)',
  panelShadowWarm: '0 10px 22px rgba(201,99,31,0.15)',
  chipShadow: '0 6px 16px rgba(30,20,60,0.16)',
} as const;

/** Ekran zeminleri (kaynak/*.dc.html'deki 390×844 dış kap). */
export const GameBackgrounds = {
  /** Okuma, soru, ders kartı */
  lilacCream: vertical('#F1EBFF', '#FFF4E8'),
  /** Giriş */
  cream: vertical('#FFF3E2', '#FFE2C6'),
  /** Yolculuk haritası */
  morning: vertical('#FFF7EC', '#EEF3FF'),
} as const;

export const GAME_BUTTON_VARIANTS = [
  'blue',
  'purple',
  'green',
  'orange',
  'gold',
  'teal',
  'white',
] as const;
export type GameButtonVariant = (typeof GAME_BUTTON_VARIANTS)[number];

export type GameButtonPalette = {
  face: Gradient;
  /** Altta görünen koyu "dudak" */
  lip: string;
  text: string;
  /** Üst kenardaki açık iç parlama (2 dp) */
  highlight: string;
  /** Yumuşak düşen gölge; tasarımdaki `0 <offsetY>px <blur>px <color>` (yüz katmanına göre). */
  glow: { offsetY: number; blur: number; color: string };
};

/**
 * 3B "şeker" butonun renkleri: README'deki tablo ve kaynaklardaki buton stilleri. Yeşil, turuncu
 * ve turkuaz yüz gradyanları beyaz yazının kontrastı için tasarımdakinden koyudur (dudaklar aynı).
 */
export const GameButtonColors: Record<GameButtonVariant, GameButtonPalette> = {
  blue: {
    face: vertical('#4F7BF2', '#2453C9'),
    lip: '#183A99',
    text: '#FFFFFF',
    highlight: 'rgba(255,255,255,0.35)',
    glow: { offsetY: 14, blur: 24, color: 'rgba(36,83,201,0.3)' },
  },
  purple: {
    face: vertical('#9B6BFF', '#5B34D6'),
    lip: '#3F22A0',
    text: '#FFFFFF',
    highlight: 'rgba(255,255,255,0.35)',
    glow: { offsetY: 14, blur: 24, color: 'rgba(91,52,214,0.3)' },
  },
  green: {
    face: vertical('#2DA663', '#19864A'),
    lip: '#13703D',
    text: '#FFFFFF',
    highlight: 'rgba(255,255,255,0.3)',
    glow: { offsetY: 12, blur: 22, color: 'rgba(19,112,61,0.25)' },
  },
  orange: {
    face: vertical('#E4750C', '#C25519'),
    lip: '#8F3C0E',
    text: '#FFFFFF',
    highlight: 'rgba(255,255,255,0.3)',
    glow: { offsetY: 12, blur: 22, color: 'rgba(143,60,14,0.25)' },
  },
  gold: {
    face: vertical('#FFE07A', '#FFB020'),
    lip: '#B87800',
    text: '#4A2A00',
    highlight: 'rgba(255,255,255,0.5)',
    glow: { offsetY: 14, blur: 30, color: 'rgba(255,176,32,0.35)' },
  },
  teal: {
    face: vertical('#1AA597', '#0B8578'),
    lip: '#075E56',
    text: '#FFFFFF',
    highlight: 'rgba(255,255,255,0.35)',
    glow: { offsetY: 14, blur: 24, color: 'rgba(7,94,86,0.3)' },
  },
  white: {
    face: vertical('#FFFFFF', '#FFFFFF'),
    lip: '#F0D3B8',
    text: '#2453C9',
    highlight: 'rgba(255,255,255,0)',
    glow: { offsetY: 10, blur: 20, color: 'rgba(201,99,31,0.12)' },
  },
};

export const CITY_IDS = ['istanbul', 'izmir', 'efes', 'antalya', 'kapadokya', 'van'] as const;
export type CityId = (typeof CITY_IDS)[number];

/**
 * Şehir teması; anahtarlar AnaSayfa.dc.html'deki `C` nesnesiyle birebir aynıdır.
 * Yol düğümleri: d* = biten, a* = aktif, l* = kilitli (1 açık → 3 koyu; Sh = dudak/gölge).
 */
export type CityTheme = {
  /** Ekran zemini */
  ground: Gradient;
  /** Zemin üzerindeki metin */
  tx: string;
  /** Başlık kartı ve seçili sekme */
  banner: Gradient;
  bannerSh: string;
  d1: string;
  d2: string;
  d3: string;
  dSh: string;
  dIcon: string;
  a1: string;
  a2: string;
  a3: string;
  aSh: string;
  l1: string;
  l2: string;
  l3: string;
  lSh: string;
  lIcon: string;
  /** Biten yol çizgisi ve gölgesi */
  done: string;
  doneSh: string;
  /** Henüz yürünmemiş yol ve noktaları */
  todo: string;
  todoDash: string;
};

/** AnaSayfa.dc.html'deki `C` nesnesinden birebir. */
export const CITY_THEMES: Record<CityId, CityTheme> = {
  istanbul: {
    ground: { colors: ['#FFE6CF', '#F9CFDE'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#2A1B3D',
    banner: { colors: ['#FF8A5B', '#E0457B'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#A8305A',
    d1: '#FFF2C4',
    d2: '#FFC23A',
    d3: '#E0920A',
    dSh: '#A86A00',
    dIcon: '#5A3A00',
    a1: '#E2D2FF',
    a2: '#9B6BFF',
    a3: '#5B34D6',
    aSh: '#3F22A0',
    l1: '#FFFFFF',
    l2: '#F8ECF2',
    l3: '#E4CFDB',
    lSh: '#CDB2C2',
    lIcon: '#9C7F92',
    done: '#FFC23A',
    doneSh: '#E0920A',
    todo: '#FFFFFF',
    todoDash: '#C9A3B8',
  },
  izmir: {
    ground: { colors: ['#E6F7FF', '#F7EAD2'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#0E2A3B',
    banner: { colors: ['#12B5E0', '#0A6FB8'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#07528A',
    d1: '#D2F8FF',
    d2: '#36C5E8',
    d3: '#0E8DB8',
    dSh: '#0A6A8C',
    dIcon: '#04324A',
    a1: '#FFD6C9',
    a2: '#FF7E5F',
    a3: '#D9432A',
    aSh: '#A8321F',
    l1: '#FFFFFF',
    l2: '#EAF4F8',
    l3: '#D0E2EA',
    lSh: '#AFC6D2',
    lIcon: '#6A8698',
    done: '#36C5E8',
    doneSh: '#0A6FB8',
    todo: '#FFFFFF',
    todoDash: '#9FB6C3',
  },
  efes: {
    ground: { colors: ['#2A1F6E', '#17123F'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#FFFFFF',
    banner: { colors: ['#FF6FB5', '#7B4DFF'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#4E2AA8',
    d1: '#D4FFF0',
    d2: '#3BE8B0',
    d3: '#12A57E',
    dSh: '#0B7558',
    dIcon: '#053D2C',
    a1: '#FFD1EA',
    a2: '#FF6FB5',
    a3: '#C42A78',
    aSh: '#8C1A55',
    l1: '#7A6ED0',
    l2: '#4A3F98',
    l3: '#2E2770',
    lSh: '#1C1650',
    lIcon: '#C9C2F7',
    done: '#7CFFD4',
    doneSh: '#12A57E',
    todo: '#4A3F98',
    todoDash: '#9E95E0',
  },
  antalya: {
    ground: { colors: ['#FFF0CF', '#FFDDA0'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#3A2208',
    banner: { colors: ['#FFA41C', '#F2541B'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#B8420C',
    d1: '#CFFBFF',
    d2: '#22D3EE',
    d3: '#0891B2',
    dSh: '#0E6C85',
    dIcon: '#053845',
    a1: '#FFE6B8',
    a2: '#FFA41C',
    a3: '#D9660A',
    aSh: '#A84E05',
    l1: '#FFFFFF',
    l2: '#FFF4DA',
    l3: '#F2DDB0',
    lSh: '#D9BE86',
    lIcon: '#A07E44',
    done: '#22D3EE',
    doneSh: '#0891B2',
    todo: '#FFFFFF',
    todoDash: '#D6B98A',
  },
  kapadokya: {
    ground: { colors: ['#FFE7CC', '#F3C9A0'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#3A1F0B',
    banner: { colors: ['#1FC7B6', '#0E8FD9'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#0A6E86',
    d1: '#FFE3B8',
    d2: '#FF9A3C',
    d3: '#E0670F',
    dSh: '#B0500A',
    dIcon: '#4A1F00',
    a1: '#C8FFF6',
    a2: '#22C3B0',
    a3: '#0B8578',
    aSh: '#075E56',
    l1: '#FFFFFF',
    l2: '#FFF1E2',
    l3: '#EBD2B6',
    lSh: '#D3B28E',
    lIcon: '#9A7652',
    done: '#FF9A3C',
    doneSh: '#E0670F',
    todo: '#FFFFFF',
    todoDash: '#C99A70',
  },
  van: {
    ground: { colors: ['#E3F6D8', '#C9E9B8'], start: { x: 0.5, y: 0 }, end: { x: 0.5, y: 1 } },
    tx: '#14301F',
    banner: { colors: ['#4F7BF2', '#2453C9'], start: { x: 0, y: 0 }, end: { x: 1, y: 1 } },
    bannerSh: '#183A99',
    d1: '#DCE6FF',
    d2: '#5B85F5',
    d3: '#1E44B8',
    dSh: '#14307F',
    dIcon: '#FFFFFF',
    a1: '#FFE0B8',
    a2: '#F5A04B',
    a3: '#C9581A',
    aSh: '#8F3C0E',
    l1: '#FFFFFF',
    l2: '#EFF8EA',
    l3: '#D2E8C6',
    lSh: '#AFCDA0',
    lIcon: '#6C8F5E',
    done: '#5B85F5',
    doneSh: '#1E44B8',
    todo: '#FFFFFF',
    todoDash: '#8DB57C',
  },
};

export type CityInfo = {
  /** Durak numarası, 1-6 */
  no: number;
  name: string;
  upperName: string;
  /** Başlık kartındaki şehir başlığı */
  title: string;
  levelFrom: number;
  levelTo: number;
  /** Ana sayfadaki Pırıl pozu */
  homePose: MascotPose;
  /** Ana sayfadaki Pırıl mesajı */
  homeMessage: string;
  exploreLabel: string;
};

/** AnaSayfa.dc.html'deki `D` nesnesinden (no, ad, baslik, poz, mesaj); seviyeler README'den. */
export const CITY_INFO: Record<CityId, CityInfo> = {
  istanbul: {
    no: 1,
    name: 'İstanbul',
    upperName: 'İSTANBUL',
    title: "Boğaz'ın Hikâyeleri",
    levelFrom: 1,
    levelTo: 5,
    homePose: 'idle',
    homeMessage: "Merhaba! Boğaz'da bir hikâye okuyalım mı?",
    exploreLabel: "İSTANBUL'U KEŞFET",
  },
  izmir: {
    no: 2,
    name: 'İzmir',
    upperName: 'İZMİR',
    title: "Kordon'un Rüzgârı",
    levelFrom: 6,
    levelTo: 10,
    homePose: 'wave',
    homeMessage: "İzmir'e hoş geldin! Kordon'da okuyalım mı?",
    exploreLabel: "İZMİR'İ KEŞFET",
  },
  efes: {
    no: 3,
    name: 'Efes',
    upperName: 'EFES',
    title: 'Antik Kentin Sırları',
    levelFrom: 11,
    levelTo: 15,
    homePose: 'read',
    homeMessage: 'Bu antik kitaplıkta neler saklı? Hadi okuyalım!',
    exploreLabel: "EFES'İ KEŞFET",
  },
  antalya: {
    no: 4,
    name: 'Antalya',
    upperName: 'ANTALYA',
    title: 'Portakal Kokulu Sahil',
    levelFrom: 16,
    levelTo: 20,
    homePose: 'happy',
    homeMessage: 'Önce bir hikâye, sonra denize!',
    exploreLabel: "ANTALYA'YI KEŞFET",
  },
  kapadokya: {
    no: 5,
    name: 'Kapadokya',
    upperName: 'KAPADOKYA',
    title: 'Balonlar Yükselirken',
    levelFrom: 21,
    levelTo: 25,
    homePose: 'think',
    homeMessage: 'Hangi balon en yükseğe çıkar dersin?',
    exploreLabel: "KAPADOKYA'YI KEŞFET",
  },
  van: {
    no: 6,
    name: 'Van',
    upperName: 'VAN',
    title: "Pırıl'ın Memleketi",
    levelFrom: 26,
    levelTo: 30,
    homePose: 'talk',
    homeMessage: 'Neredeyse evdeyiz! Son hikâyeler seni bekliyor.',
    exploreLabel: "VAN'I KEŞFET",
  },
};

/** Seviyenin (1-30) ait olduğu şehir. */
export function cityForLevel(level: number): CityId {
  const index = Math.min(Math.max(Math.ceil(level / 5), 1), CITY_IDS.length) - 1;
  return CITY_IDS[index];
}
