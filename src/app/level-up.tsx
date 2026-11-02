import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';
import Animated, { ZoomIn, useReducedMotion } from 'react-native-reanimated';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { RewardRow } from '@/design/components/reward-row';
import { AwardIcon, GiftIcon } from '@/design/icons';
import { colors, fonts } from '@/design/tokens';
import { continueRewardFlow, nextRewardStep, nextStepLabel } from '@/features/game/reward-flow';
import { useReward } from '@/features/game/reward-store';
import { RewardLayout } from '@/features/game/rewards/reward-layout';
import { useHardwareBack } from '@/hooks/use-hardware-back';

/** .levelmedal: 140 × 140, üstte 30, altta 20 boşluk. */
const MEDAL_SIZE = 140;

/** Seviye ödülü (13-seviye-odulu). Yalnızca ödül akışında `level.leveledUp` ise açılır. */
export default function LevelUpScreen() {
  const reward = useReward();
  const reduceMotion = useReducedMotion();
  // Android geri tuşu ana düğmeyle aynı: akış yarıda kalmasın.
  useHardwareBack(() => {
    if (!reward?.result.level.leveledUp) return false;
    continueRewardFlow('level-up', reward);
    return true;
  });

  if (!reward?.result.level.leveledUp) return <Redirect href="/" />;
  const { result } = reward;
  const level = result.level.after;
  // Bu adım bir şehri de bitirdiyse (yeni şehir açıldı ya da yolculuk bitti) o şehrin mührü.
  const cityDone = result.cityUnlocked !== null || result.finished;
  const label = nextStepLabel(nextRewardStep('level-up', reward));

  return (
    <RewardLayout
      eyebrow="KÜÇÜK ADIMLAR, BÜYÜK KEŞİFLER"
      hero={
        <Animated.View
          entering={reduceMotion ? undefined : ZoomIn.springify().damping(12)}
          style={styles.medal}
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Seviye ${level}`}>
          {/* Madalyanın boyutu sabit; en büyük yazıda içine sığsın diye 1,3 ile sınırlı. */}
          <AppText variant="eyebrow" color={colors.medal.text} maxFontSizeMultiplier={1.3}>
            SEVİYE
          </AppText>
          <AppText color={colors.medal.text} style={styles.number} maxFontSizeMultiplier={1.3}>
            {level}
          </AppText>
        </Animated.View>
      }
      title="Bir adım daha ileri!"
      subtitle={['Her hikâyeyle biraz daha güçleniyorsun.']}
      actions={
        <Button
          title={label}
          onPress={() => continueRewardFlow('level-up', reward)}
          accessibilityLabel={label.toLocaleLowerCase('tr-TR')}
        />
      }>
      {result.lokum.levelUp > 0 ? (
        <RewardRow
          icon={<GiftIcon color={colors.rewardRow.icon} />}
          title={`+${result.lokum.levelUp} lokum`}
          subtitle="Seviye atladın."
        />
      ) : null}
      {cityDone ? (
        <RewardRow
          icon={<AwardIcon color={colors.rewardRow.icon} />}
          title={`${CITIES[reward.city].name} mührü`}
          subtitle="Pasaportuna eklendi."
        />
      ) : null}
    </RewardLayout>
  );
}

const styles = StyleSheet.create({
  medal: {
    width: MEDAL_SIZE,
    height: MEDAL_SIZE,
    borderRadius: MEDAL_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.medal.face,
    borderWidth: 8,
    borderColor: colors.medal.ring,
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 0, spreadDistance: 2, color: colors.medal.edge },
      { offsetX: 0, offsetY: 8, blurRadius: 0, spreadDistance: 0, color: colors.medal.lip },
    ],
    marginTop: 22,
    marginBottom: 12,
  },
  number: {
    fontFamily: fonts.sansBlack,
    fontSize: 55,
    lineHeight: 60,
  },
});
