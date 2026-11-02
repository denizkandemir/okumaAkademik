import { StyleSheet, View } from 'react-native';

import { RewardLayout } from './reward-layout';
import { StarRow } from './star-row';

import { Button } from '@/design/components/button';
import { StatTile } from '@/design/components/stat-tile';
import { Mascot } from '@/features/mascot/mascot';

/** Okuma süresi "2:14" biçiminde. */
export function formatDuration(totalSeconds: number) {
  const seconds = Math.max(0, Math.round(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

export type ResultTile = { value: string; label: string };

type LessonResultViewProps = {
  /** Hikâyenin adı (alt yazının ilk satırı). */
  storyTitle: string;
  /** Büyük başlık, ör. "Hikâyeye iz bıraktın!". */
  heading: string;
  /** Bu okumanın yıldızı; `null` ise yıldız gösterilmez (serbest okuma). */
  stars: number | null;
  tiles: ResultTile[];
  buttonTitle: string;
  buttonLabel: string;
  onContinue: () => void;
};

/**
 * Ders sonucu (12-ders-sonucu): Pırıl, yıldızlar, başlık, istatistik kutuları ve tek ana düğme.
 * Kitaplıktan serbest okumanın bitişinde de (yıldızsız, yalnız okuma süresiyle) kullanılır.
 */
export function LessonResultView({
  storyTitle,
  heading,
  stars,
  tiles,
  buttonTitle,
  buttonLabel,
  onContinue,
}: LessonResultViewProps) {
  return (
    <RewardLayout
      eyebrow="BİR KEŞİF DAHA TAMAMLANDI"
      hero={
        <View style={styles.hero}>
          <Mascot pose={stars === 3 ? 'celebrate' : 'happy'} size={200} />
          {stars != null ? <StarRow filled={stars} /> : null}
        </View>
      }
      title={heading}
      subtitle={[storyTitle, 'Bugün yeni bir şey keşfettin.']}
      actions={
        <Button title={buttonTitle} accessibilityLabel={buttonLabel} onPress={onContinue} />
      }>
      {tiles.length ? (
        <View style={styles.tiles}>
          {tiles.map((tile) => (
            <StatTile key={tile.label} value={tile.value} label={tile.label} align="center" />
          ))}
        </View>
      ) : null}
    </RewardLayout>
  );
}

const styles = StyleSheet.create({
  hero: {
    alignItems: 'center',
    gap: 8,
  },
  tiles: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 9,
  },
});
