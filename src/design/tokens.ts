/**
 * "Pırıl'ın Atlası" tasarım token'ları (docs/tasarim/README.md, "Tasarım dili").
 *
 * Renkler README renk tablosunun "Uygulama" sütunudur; panodan farklı olanlar kontrast içindir.
 * Yazı boyutları README'deki en küçük boyutlara (gövde 15, ikincil 13, üst başlık 11, düğme 15,
 * sekme ve harita etiketi 12) yükseltilmiştir.
 *
 * Bu dosya hiçbir şey import etmez: `scripts/check-contrast.mjs` onu Node ile doğrudan okur.
 * Bu yüzden yalnızca Node'un silebildiği TypeScript sözdizimi kullanılır (enum, namespace yok).
 */

export const colors = {
  /** Ekran zemini. */
  background: '#FBF7EF',
  /** Kart, alt çubuk, alt sayfa, ikincil düğme. */
  surface: '#FFFDF7',
  /** Seçenek kartı, istatistik kutusu, ödül satırı, metin alanı. */
  surfaceRaised: '#FFFEFA',
  /** Haritanın üstündeki bölüm çubuğu. */
  chapterBar: '#F8F2E7',
  /** Bilgi hapı zemini. */
  chip: '#F1EEE3',
  /** Yuvarlak kapat düğmesi zemini. */
  closeButton: '#F0EEE5',
  /** Alt sayfa tutamacı. */
  handle: '#DDDCD1',
  /** Alt sayfa arka perdesi. */
  scrim: '#263B4366',

  /** Çizgi ve ince kenarlıklar. */
  border: '#EAE6DC',
  /** Alt çubuğun üst çizgisi. */
  borderSoft: '#E5E4DA',
  /** Kartın kenarı ve dokunulabilir kartın alt "dudağı". */
  cardBorder: '#E1DFD0',
  cardLip: '#D9D9C8',

  /** Ana metin (10,7:1). */
  text: '#303B42',
  /** Soluk metin: açıklama, alt yazı (tüm zeminlerde ≥ 4,6:1). */
  textMuted: '#676D5A',
  /** Üst başlık (eyebrow). */
  eyebrow: '#7E6950',
  /** Form etiketi. */
  formLabel: '#5F705D',
  /** Vurgu metni: bağlantı, aktif sekme, "HADİ OKUYALIM". */
  accent: '#9C523B',
  /** Hata metni (panoda yok; vurgu ailesinden, ≥ 4,5:1). */
  danger: '#A13D2D',
  /** Okuma metni. */
  readingText: '#495445',
  /** Haritadaki italik yer notu. */
  landmark: '#806B4E',
  /** Logodaki "matik" (logo, kontrast kuralı dışında). */
  logoAccent: '#D47A5B',
  /** Büyük sonuç sayıları (büyük yazı, ≥ 3:1). */
  resultNumber: '#B77854',

  primary: {
    face: '#AF6044',
    lip: '#8B4A33',
    text: '#FFFDF7',
  },
  secondary: {
    face: '#FFFDF7',
    border: '#DDDCCD',
    lip: '#DDDCCD',
    text: '#68796B',
  },
  iconButton: {
    face: '#FFFDF6',
    border: '#E0E1D4',
    icon: '#303B42',
  },
  tab: {
    active: '#9C523B',
    inactive: '#707770',
    pill: '#F5E3D7',
  },
  progress: {
    fill: '#719A83',
    track: '#DDDCCA',
  },
  node: {
    done: { fill: '#71978B', lip: '#4A7165', icon: '#FFFFFF' },
    current: { fill: '#D07E5E', lip: '#AA5B40', icon: '#FFFFFF', ring: '#FFFAF1' },
    locked: { fill: '#E7E4D6', lip: '#C5CAB9', icon: '#808476' },
    chest: { fill: '#E6B966', lip: '#B68B44', icon: '#7D653E' },
    medal: { fill: '#F1D49B', lip: '#C0A06D', icon: '#9B713A' },
    /** Düğümlerin 3 px yarı saydam beyaz kenarı. */
    edge: '#FFFFFF88',
  },
  themeTag: {
    background: '#E8EEE0',
    text: '#5B6F55',
  },
  feedback: {
    wrong: { background: '#F8EBD2', text: '#856633' },
    right: { background: '#E8F0DD', text: '#58734F' },
  },
  option: {
    default: { border: '#E4E4D7', lip: '#D9DDCC', background: '#FFFEFA' },
    selected: { border: '#D29874', lip: '#D29874', background: '#FCF0E1' },
    correct: { border: '#9BBB89', lip: '#9BBB89', background: '#ECF4E3' },
    wrong: { border: '#DDB87B', lip: '#DDB87B', background: '#FFF2D9' },
    badge: '#F1F2E8',
  },
  input: {
    border: '#D9DFCF',
    background: '#FFFEFA',
    text: '#3D5144',
    placeholder: '#676D5A',
  },
  /** Onay kutusu / anahtar (panoda adaçayı onay kutusu). */
  toggle: {
    on: '#5F7F62',
    off: '#FFFEFA',
    border: '#808476',
    check: '#FFFFFF',
  },
  statTile: {
    border: '#E4E1D2',
    lip: '#DADDCB',
  },
  rewardRow: {
    border: '#E3E3D3',
    icon: '#9B713A',
  },
  star: {
    fill: '#D6A04B',
    stroke: '#A87A2E',
  },
  medal: {
    face: '#F4D79A',
    ring: '#FAE8BA',
    edge: '#D7B879',
    lip: '#C9A866',
    text: '#755A2F',
  },
  avatar: {
    background: '#E6ECDF',
    text: '#517062',
  },
  /** Seri alevi ve lokum altıgeni (ikon, metin değil). */
  flame: '#D99959',
  lokum: {
    outer: '#D5AD66',
    inner: '#F7E3A8',
  },
  notification: {
    background: '#EFF2E9',
    text: '#64725B',
  },
  certificate: {
    border: '#D1B274',
    outer: '#F7ECD5',
    background: '#FFFDF5',
    name: '#A27C47',
  },
  /** Konuşma balonu ("HADİ OKUYALIM" çerçevesi). */
  bubble: {
    background: '#FFFAF0',
    border: '#E4BDA1',
  },
  white: '#FFFFFF',
} as const;

/** Yüklenen yazı tipi aileleri (useFonts'a verilen adlar). */
export const fonts = {
  sans: 'NunitoSans_400Regular',
  sansSemiBold: 'NunitoSans_600SemiBold',
  sansBold: 'NunitoSans_700Bold',
  sansExtraBold: 'NunitoSans_800ExtraBold',
  sansBlack: 'NunitoSans_900Black',
  serif: 'Literata_400Regular',
  serifItalic: 'Literata_400Regular_Italic',
  serifSemiBold: 'Literata_600SemiBold',
} as const;

export type TypeStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase';
};

/** Adlandırılmış yazı ölçeği. `lineHeight` piksel cinsindendir. */
export const type = {
  /** Logo "okumatik". */
  brand: { fontFamily: fonts.sansBlack, fontSize: 25, lineHeight: 30, letterSpacing: -1.3 },
  /** Karşılama gibi büyük başlıklar. */
  display: { fontFamily: fonts.sansBlack, fontSize: 33, lineHeight: 37, letterSpacing: -1.3 },
  /** Ekran başlığı. */
  title: { fontFamily: fonts.sansBlack, fontSize: 29, lineHeight: 34, letterSpacing: -1.2 },
  /** Bölüm çubuğundaki şehir adı. */
  cityTitle: { fontFamily: fonts.sansExtraBold, fontSize: 25, lineHeight: 30, letterSpacing: -1 },
  /** Alt sayfa başlığı. */
  sheetTitle: {
    fontFamily: fonts.sansExtraBold,
    fontSize: 25,
    lineHeight: 30,
    letterSpacing: -0.8,
  },
  /** Anlama sorusu. */
  question: {
    fontFamily: fonts.sansExtraBold,
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: -0.6,
  },
  /** Bölüm başlığı, kart başlığı. */
  heading: { fontFamily: fonts.sansExtraBold, fontSize: 17, lineHeight: 23, letterSpacing: -0.5 },
  body: { fontFamily: fonts.sans, fontSize: 15, lineHeight: 24 },
  bodyStrong: { fontFamily: fonts.sansBold, fontSize: 15, lineHeight: 22 },
  /** Açıklama, alt yazı. */
  secondary: { fontFamily: fonts.sans, fontSize: 13, lineHeight: 20 },
  eyebrow: {
    fontFamily: fonts.sansExtraBold,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  button: { fontFamily: fonts.sansExtraBold, fontSize: 15, lineHeight: 20, letterSpacing: 0.6 },
  tab: { fontFamily: fonts.sansExtraBold, fontSize: 12, lineHeight: 16 },
  /** Harita etiketleri ("Arkadaşlık · 2 dk"). */
  mapLabel: { fontFamily: fonts.sansExtraBold, fontSize: 12, lineHeight: 16 },
  /** Okuma metni; A−/A+ ile 18-28 arası değişir (bkz. readingSize). */
  reading: { fontFamily: fonts.serif, fontSize: 21, lineHeight: 39 },
  /** Haritadaki italik yer notu. */
  landmark: { fontFamily: fonts.serifItalic, fontSize: 13, lineHeight: 17 },
  certificateName: { fontFamily: fonts.serifItalic, fontSize: 31, lineHeight: 40 },
} as const satisfies Record<string, TypeStyle>;

export type TypeVariant = keyof typeof type;

/** Okuma metni boyutu ve satır yüksekliği oranı. */
export const readingSize = {
  min: 18,
  max: 28,
  default: 21,
  step: 1,
  lineHeightRatio: 1.85,
} as const;

export const space = {
  xxs: 4,
  xs: 8,
  sm: 12,
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
} as const;

/** Ekranın yan boşluğu (panoda 22-23). */
export const screenPadding = 22;

export const radius = {
  tag: 6,
  badge: 7,
  chip: 9,
  pill: 10,
  input: 12,
  button: 13,
  card: 14,
  cardLarge: 16,
  sheet: 25,
  full: 999,
} as const;

export const size = {
  /** En küçük dokunma alanı. */
  touch: 48,
  buttonHeight: 52,
  /** Düğmelerin alt "dudağı" ve basınca inme payı. */
  buttonLip: 4,
  buttonPressDepth: 2,
  /** Dokunulabilir kartın, metin alanının ve istatistik kutusunun alt kenarı. */
  cardLip: 3,
  optionLip: 4,
  iconButton: 48,
  icon: 24,
  tabIcon: 22,
  tabBar: 70,
  tabPill: { width: 47, height: 32 },
  header: 64,
  avatar: 34,
  /** Tablette içerik bu genişlikte ortalanır. */
  maxContentWidth: 720,
  progress: 6,
  node: {
    done: { width: 67, height: 59, lip: 6 },
    current: { width: 78, height: 68, lip: 7 },
    locked: { width: 67, height: 59, lip: 5 },
    chest: { width: 60, height: 53, lip: 5 },
    medal: { width: 67, height: 59, lip: 6 },
    edge: 3,
  },
} as const;

export const motion = {
  /** Ekranın hafifçe belirmesi. */
  appear: 200,
  /** Düğmeye basma / bırakma. */
  pressIn: 70,
  pressOut: 120,
  /** İlerleme çubuğu. */
  progress: 400,
} as const;
