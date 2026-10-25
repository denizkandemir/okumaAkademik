import { useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

/**
 * Android'in donanım geri tuşunu ekran odaktayken yakalar. `onBack` `true` dönerse varsayılan geri
 * (ekranı kapatma) çalışmaz; `false` dönerse çalışır. `gestureEnabled: false` yalnızca iOS'ta
 * kaydırarak geri dönmeyi engeller, Android geri tuşu için bu hook gerekir. Bir Modal açıkken olay
 * gelmez; geri tuşunu Modal'ın `onRequestClose`'u karşılar.
 */
export function useHardwareBack(onBack: () => boolean) {
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  });

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () =>
        onBackRef.current(),
      );
      return () => subscription.remove();
    }, []),
  );
}
