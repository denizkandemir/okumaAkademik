import { router } from 'expo-router';

import { Button } from '@/design/components/button';
import { CityHeroLayout } from '@/design/components/city-hero-layout';
import { continueRewardFlow } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/**
 * Eve dönüş (24-eve-donus): Pırıl Van'a, evine döndü. Ödül akışında `finished` ise açılır.
 * KEŞİF SERTİFİKAM sertifikayı açar; YENİDEN KEŞFET akışı bitirip ana sayfaya döner.
 */
export default function FinaleScreen() {
  const reward = useReward();

  const close = () => {
    if (reward?.result.finished) continueRewardFlow('finale', reward);
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };
  // Android geri tuşu YENİDEN KEŞFET ile aynı (ödül akışındaysa akışı bitirir).
  useHardwareBack(() => {
    close();
    return true;
  });

  return (
    <CityHeroLayout
      city="van"
      pose="celebrate"
      mascotLabel="Pırıl evinde, çok mutlu"
      eyebrow="PIRIL EVE DÖNDÜ"
      title="Birlikte ne çok hikâye biriktirdik."
      lines={["İstanbul'dan Van'a uzanan bu yolculuğun en güzel yanı, seninle okumaktı."]}
      actions={
        <>
          <Button
            title="KEŞİF SERTİFİKAM"
            accessibilityLabel="Keşif sertifikamı gör"
            onPress={() => router.push('/certificate')}
          />
          <Button
            variant="secondary"
            title="YENİDEN KEŞFET"
            accessibilityLabel="Yeniden keşfet, ana sayfaya dön"
            onPress={close}
          />
        </>
      }
    />
  );
}
