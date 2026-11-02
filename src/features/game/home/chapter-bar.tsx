import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Eyebrow } from '@/design/components/eyebrow';
import { IconButton } from '@/design/components/icon-button';
import { MapIcon } from '@/design/icons';
import { colors, screenPadding } from '@/design/tokens';

type ChapterBarProps = {
  /** Durak numarası (1-6). */
  number: number;
  name: string;
  /** Kullanıcının seviyesi; yüklenene kadar yok. */
  level?: number;
};

/** Haritanın üstündeki bölüm çubuğu: "1. DURAK · SEVİYE 3", şehir adı ve Pasaport düğmesi. */
export function ChapterBar({ number, name, level }: ChapterBarProps) {
  return (
    <View style={styles.bar}>
      <View style={styles.texts}>
        <Eyebrow>
          {number}. DURAK{level ? ` · SEVİYE ${level}` : ''}
        </Eyebrow>
        <AppText variant="cityTitle" accessibilityRole="header" maxFontSizeMultiplier={1.3}>
          {name}
        </AppText>
      </View>
      <IconButton accessibilityLabel="Pasaport'u aç" onPress={() => router.navigate('/passport')}>
        <MapIcon />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 19,
    paddingBottom: 16,
    paddingHorizontal: screenPadding,
    backgroundColor: colors.chapterBar,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  texts: {
    flex: 1,
    gap: 5,
  },
});
