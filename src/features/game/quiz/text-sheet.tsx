import { Modal, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { GameColors, GameFonts } from '../theme';
import { CloseIcon } from '../ui/icons';
import { SquareButton } from '../ui/square-button';

import { ReadingFont } from '@/constants/theme';

type TextSheetProps = {
  visible: boolean;
  title: string;
  paragraphs: string[];
  onClose: () => void;
};

/** "Metne bak": hikâyeyi salt okunur bir sayfada gösterir; kapatınca soruya dönülür. */
export function TextSheet({ visible, title, paragraphs, onClose }: TextSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View style={styles.sheet}>
        <View style={styles.header}>
          <Text style={styles.title} accessibilityRole="header" numberOfLines={2}>
            {title}
          </Text>
          <SquareButton accessibilityLabel="Metni kapat" onPress={onClose}>
            <CloseIcon size={20} color={GameColors.textWarmSecondary} />
          </SquareButton>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {paragraphs.map((paragraph, index) => (
            <Text key={index} style={styles.paragraph}>
              {paragraph}
            </Text>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: '#FFF9EF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 8,
  },
  title: {
    flex: 1,
    fontFamily: GameFonts.headingHeavy,
    fontSize: 26,
    lineHeight: 32,
    color: GameColors.warm,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 8,
    gap: 14,
  },
  paragraph: {
    fontFamily: GameFonts.body,
    fontSize: ReadingFont.default,
    lineHeight: Math.round(ReadingFont.default * ReadingFont.lineHeightRatio),
    color: GameColors.warm,
  },
});
