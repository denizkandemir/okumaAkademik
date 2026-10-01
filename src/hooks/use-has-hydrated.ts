import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

/**
 * Statik render (web) sırasında `false`, istemcide hidrasyondan sonra `true` döner.
 * Sunucuda bilinemeyen değerlere (renk şeması, pencere genişliği) bağlı arayüz için kullanılır.
 */
export function useHasHydrated() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
