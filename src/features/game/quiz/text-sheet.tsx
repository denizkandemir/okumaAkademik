import { Modal, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { AppText } from '@/design/components/app-text';
import { SheetHeader } from '@/design/components/sheet-header';
import { colors, readingSize, screenPadding, type } from '@/design/tokens';

type TextSheetProps = {
  visible: boolean;
  title: string;
  paragraphs: string[];
  onClose: () => void;
};

const FONT_SIZE = readingSize.default;

/**
 * "Metne bak": hikâyeyi salt okunur bir alt sayfada gösterir (Literata); kapatınca soruya
 * dönülür. iOS'ta sayfa olarak açılır, Android'de tam ekran; geri tuşu kapatır.
 */
export function TextSheet({ visible, title, paragraphs, onClose }: TextSheetProps) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      <View
        style={[styles.sheet, { paddingTop: Platform.OS === 'ios' ? 8 : insets.top + 8 }]}
        accessibilityViewIsModal>
        <View style={styles.header}>
          <SheetHeader onClose={onClose} closeLabel="Metni kapat" />
          <AppText variant="sheetTitle" accessibilityRole="header" maxFontSizeMultiplier={1.3}>
            {title}
          </AppText>
        </View>
        <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}>
          {paragraphs.map((paragraph, index) => (
            <AppText
              key={index}
              variant="reading"
              color={colors.readingText}
              style={styles.paragraph}>
              {paragraph}
            </AppText>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  header: {
    gap: 4,
    paddingHorizontal: screenPadding,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  content: {
    paddingHorizontal: screenPadding,
    paddingTop: 16,
    gap: 22,
  },
  paragraph: {
    fontSize: FONT_SIZE,
    lineHeight: Math.round(FONT_SIZE * readingSize.lineHeightRatio),
    fontFamily: type.reading.fontFamily,
  },
});
