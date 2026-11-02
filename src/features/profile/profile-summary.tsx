import { StyleSheet, View } from 'react-native';

import { explorerTitle } from './explorer-title';

import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { StatTile } from '@/design/components/stat-tile';
import { colors, radius } from '@/design/tokens';
import type { StatsResponse } from '@/features/game/types';
import { Mascot } from '@/features/mascot/mascot';

type ProfileSummaryProps = {
  name: string;
  grade: number;
  stats: StatsResponse;
};

/**
 * Profil ve Küçük başarılar ekranlarının üstü (22-profil, 23-rozetler): keşif pasaportu kartı ve
 * üç istatistik kutusu.
 */
export function ProfileSummary({ name, grade, stats }: ProfileSummaryProps) {
  const title = `${explorerTitle(stats)} · ${grade}. sınıf`.toLocaleUpperCase('tr-TR');

  return (
    <>
      <View style={styles.passport} accessible accessibilityLabel={`${name}. ${title}`}>
        <View style={styles.innerBorder} pointerEvents="none" />
        <Mascot pose="idle" size={88} />
        <AppText variant="question" align="center">
          {name}
        </AppText>
        <Eyebrow align="center">{title}</Eyebrow>
        <Eyebrow align="center" color={colors.textMuted} style={styles.passNumber}>
          OKUMATİK / KEŞİF PASAPORTU
        </Eyebrow>
      </View>

      <View style={styles.stats}>
        <StatTile value={stats.storiesDone} label="hikâye okundu" />
        <StatTile value={stats.lokum.toLocaleString('tr-TR')} label="lokum" />
        <StatTile value={stats.streak} label="günlük seri" />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  passport: {
    alignItems: 'center',
    gap: 8,
    padding: 20,
    backgroundColor: colors.passport.background,
    borderWidth: 1,
    borderColor: colors.passport.border,
    borderRadius: 17,
  },
  innerBorder: {
    position: 'absolute',
    top: 7,
    right: 7,
    bottom: 7,
    left: 7,
    borderWidth: 1,
    borderColor: colors.passport.innerBorder,
    borderRadius: radius.pill,
  },
  passNumber: {
    marginTop: 4,
  },
  stats: {
    flexDirection: 'row',
    gap: 9,
  },
});
