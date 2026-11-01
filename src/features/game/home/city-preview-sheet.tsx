import { Image } from 'expo-image';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { CITY_IDS, type CityId } from '../theme';

import { CITIES } from '@/design/cities';
import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { Eyebrow } from '@/design/components/eyebrow';
import { SheetHeader } from '@/design/components/sheet-header';
import { colors, radius } from '@/design/tokens';

type CityPreviewSheetProps = {
  /** Önizlenen şehir; `null` ise sayfa kapalı. */
  city: CityId | null;
  /** Şehir henüz kilitliyse "<önceki şehir> bitirince açılır." yazılır. */
  locked: boolean;
  onClose: () => void;
};

/**
 * "Şehri önizle" alt sayfası (panoda yok; ders kartının diliyle): şehrin arka planından küçük bir
 * görsel, adı ve sloganı. Arka perdeye dokunmak ve Android geri tuşu sayfayı kapatır.
 */
export function CityPreviewSheet({ city, locked, onClose }: CityPreviewSheetProps) {
  const insets = useSafeAreaInsets();
  const design = city ? CITIES[city] : null;
  const previous = city ? CITY_IDS[CITY_IDS.indexOf(city) - 1] : undefined;

  return (
    <Modal visible={city !== null} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable
          style={StyleSheet.absoluteFill}
          accessibilityRole="button"
          accessibilityLabel="Kapat"
          onPress={onClose}
        />
        {design && city ? (
          <View
            style={[styles.sheet, { paddingBottom: insets.bottom + 24 }]}
            accessibilityViewIsModal>
            <SheetHeader onClose={onClose} />
            <Image
              source={design.background}
              contentFit="cover"
              recyclingKey={city}
              style={styles.thumbnail}
              accessible={false}
            />
            <Eyebrow>{design.number}. DURAK</Eyebrow>
            <AppText variant="sheetTitle" accessibilityRole="header">
              {design.name}
            </AppText>
            <AppText color={colors.textMuted}>{design.tagline}</AppText>
            {locked && previous ? (
              <AppText variant="bodyStrong" color={colors.accent}>
                {CITIES[previous].accusative} bitirince açılır.
              </AppText>
            ) : null}
            <Button
              title="TAMAM"
              accessibilityLabel="Tamam"
              onPress={onClose}
              style={styles.button}
            />
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.scrim,
  },
  sheet: {
    gap: 8,
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    paddingTop: 10,
    paddingHorizontal: 24,
  },
  thumbnail: {
    height: 150,
    borderRadius: radius.card,
    marginBottom: 8,
  },
  button: {
    marginTop: 12,
  },
});
