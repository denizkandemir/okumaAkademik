import { TextTheme } from '../generated/prisma/enums.js';

/**
 * Veritabanında hikâye teması `text_theme` enum'u olarak saklanır; API sözleşmesinde ise Türkçe
 * adıdır (ör. "Arkadaşlık"). Dönüşüm yalnızca burada yapılır.
 */
export const THEME_LABELS = {
  [TextTheme.ARKADASLIK]: 'Arkadaşlık',
  [TextTheme.MERAK]: 'Merak',
  [TextTheme.KESIF]: 'Keşif',
  [TextTheme.PAYLASMAK]: 'Paylaşmak',
  [TextTheme.CESARET]: 'Cesaret',
  [TextTheme.YARDIMLASMA]: 'Yardımlaşma',
  [TextTheme.SABIR]: 'Sabır',
  [TextTheme.DOGA]: 'Doğa',
  [TextTheme.AILE]: 'Aile',
  [TextTheme.HATIRALAR]: 'Hatıralar',
  [TextTheme.SORUMLULUK]: 'Sorumluluk',
  [TextTheme.IYILIK]: 'İyilik',
} as const satisfies Record<TextTheme, string>;

export type ApiTextTheme = (typeof THEME_LABELS)[TextTheme];

export function toApiTheme(theme: TextTheme): ApiTextTheme {
  return THEME_LABELS[theme];
}

/** Sorgu sonucundaki `theme` alanını API'nin beklediği Türkçe ada çevirir. */
export function withApiTheme<T extends { theme: TextTheme }>(
  row: T,
): Omit<T, 'theme'> & { theme: ApiTextTheme } {
  return { ...row, theme: toApiTheme(row.theme) };
}
