import { router } from 'expo-router';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { TextLink } from '@/design/components/text-link';
import { colors } from '@/design/tokens';
import { CityHeroLayout } from '@/features/game/rewards/city-hero-layout';

/** Karşılama (15-karsilama): uygulamanın ilk ekranı; kayıt ya da girişe götürür. */
export default function WelcomeScreen() {
  return (
    <CityHeroLayout
      city="istanbul"
      header={false}
      heroRatio={0.4}
      mascotMax={220}
      mascotRatio={0.65}
      pose="wave"
      mascotLabel="Pırıl el sallıyor"
      eyebrow="PIRIL'IN ATLASI"
      title={'Birlikte okuyalım.\nDünyayı keşfedelim.'}
      lines={[
        'Ben Pırıl! Evime dönerken altı şehir gezeceğim. Hikâyeler bu yolculukta bize yol gösterecek.',
      ]}
      actions={
        <>
          <Button
            title="YOLCULUĞA BAŞLA"
            accessibilityLabel="Yolculuğa başla"
            accessibilityHint="Kayıt ekranını açar"
            onPress={() => router.push('/register')}
          />
          <TextLink
            title="Zaten bir yolculuğum var"
            accessibilityHint="Giriş ekranını açar"
            onPress={() => router.push('/login')}
          />
          <AppText variant="secondary" color={colors.textMuted} align="center">
            6 şehir · Her gün küçük bir keşif
          </AppText>
        </>
      }
    />
  );
}
