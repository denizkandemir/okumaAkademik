import { Colors } from '@/constants/theme';

/**
 * Uygulamanın renk paleti. Oyun tasarımı yalnızca açık temadır (bkz. docs/tasarim/README.md);
 * koyu palet yeni tasarıma geçilene kadar `Colors.dark` içinde duruyor ama kullanılmıyor.
 */
export function useTheme() {
  return Colors.light;
}
