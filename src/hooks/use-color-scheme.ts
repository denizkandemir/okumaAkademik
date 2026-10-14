/**
 * Oyun tasarımı yalnızca açık temadır (bkz. docs/tasarim/README.md). Sistem koyu temada olsa
 * da uygulama açık paleti kullanır; app.json'da `userInterfaceStyle: "light"`.
 */
export function useColorScheme() {
  return 'light' as const;
}
