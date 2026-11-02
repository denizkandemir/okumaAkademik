import { GradeBand } from '../generated/prisma/enums.js';

/**
 * Sınıf grubu: G1 = 1-2, G2 = 3-4, G3 = 5-6, G4 = 7-8. Sunucudaki tek eşleme budur; uygulamadaki
 * karşılığı aynı kuralı izler.
 */
export function gradeBandOf(grade: number): GradeBand {
  if (grade <= 2) return GradeBand.G1;
  if (grade <= 4) return GradeBand.G2;
  if (grade <= 6) return GradeBand.G3;
  return GradeBand.G4;
}

/** Bir dersin kullanıcının grubunda metni yoksa bu grubun metni okutulur (mevcut 48 hikâye). */
export const DEFAULT_GRADE_BAND = GradeBand.G2;

/**
 * "Acele okuma" tavanı (dakikadaki kelime). Bu hızın üstünde okuyup anlaması %60'ın altında kalan
 * okuma güvenilmez sayılır. Araştırmadaki sınıf aralıklarının üst ucunun yaklaşık 1,5-2 katı
 * (docs/yapay-zeka/01-arastirma.md §4); kendi verimizle ayarlanacak.
 */
export const RUSHED_WPM_CEILING: Record<GradeBand, number> = {
  G1: 120,
  G2: 160,
  G3: 200,
  G4: 240,
};

/**
 * Sınıf grubunun hedef Ateşman aralığı (dahil). Katalogdaki kaba değerlerden (G1 ≈ 85-100,
 * G4 ≈ 50-70; docs/yapay-zeka/02-egzersiz-katalogu.md §4) ve mevcut G2 hikâyelerinin dağılımından
 * (çoğu 70-89) türetildi; kendi verimizle ayarlanacak. Seviye belirleme metinleri bu aralıkta olmalı.
 */
export const ATESMAN_TARGET: Record<GradeBand, { min: number; max: number }> = {
  G1: { min: 85, max: 100 },
  G2: { min: 70, max: 89 },
  G3: { min: 60, max: 79 },
  G4: { min: 50, max: 69 },
};

/** Anlama bu oranın altındaysa (ve hız tavanın üstündeyse) okuma aceleye gelmiş sayılır. */
export const RUSHED_COMPREHENSION_BELOW = 0.6;
