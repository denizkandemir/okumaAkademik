/**
 * Oyun tasarımı yalnızca açık temadır (bkz. docs/tasarim/README.md). Web'de de tarayıcının
 * koyu tema tercihi yok sayılır.
 */
export function useColorScheme() {
  return 'light' as const;
}
