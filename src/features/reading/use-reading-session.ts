import { useEffect, useRef } from 'react';

import { startReadingSession, type ReadingSessionController } from './reading-session';

/**
 * `textId` verildiğinde okuma oturumu başlatır, ekrandan çıkınca kaydeder.
 * Metin henüz yüklenmediyse `undefined` geçilebilir.
 */
export function useReadingSession(textId: string | undefined) {
  const controllerRef = useRef<ReadingSessionController | null>(null);

  useEffect(() => {
    if (!textId) return;
    const controller = startReadingSession(textId);
    controllerRef.current = controller;
    return () => {
      controller.dispose();
      if (controllerRef.current === controller) controllerRef.current = null;
    };
  }, [textId]);

  return {
    reportProgress: (progress: number) => controllerRef.current?.reportProgress(progress),
    finish: async () => {
      if (!controllerRef.current) throw new Error('Okuma oturumu henüz başlamadı.');
      await controllerRef.current.finish();
    },
  };
}
