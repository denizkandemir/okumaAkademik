import TimePicker from '@expo/ui/community/datetime-picker';
import { useState } from 'react';
import { Modal, Platform, Pressable, StyleSheet, View } from 'react-native';

import { AppText } from '@/design/components/app-text';
import { Button } from '@/design/components/button';
import { ClockIcon } from '@/design/icons';
import { colors, radius, size } from '@/design/tokens';

type ReminderTimeRowProps = {
  hour: number;
  minute: number;
  onChange: (hour: number, minute: number) => void;
  disabled?: boolean;
};

const pad = (value: number) => String(value).padStart(2, '0');

function dateAt(hour: number, minute: number) {
  const date = new Date();
  date.setHours(hour, minute, 0, 0);
  return date;
}

/**
 * "Okuma saati" satırı: metin alanı görünümünde, dokununca saat seçici açılır. Android'de sistem
 * saat penceresi; iOS'ta alt kısımda tekerlekli seçici ve TAMAM düğmesi.
 */
export function ReminderTimeRow({
  hour,
  minute,
  onChange,
  disabled = false,
}: ReminderTimeRowProps) {
  const [open, setOpen] = useState(false);
  // iOS'ta tekerlek döndükçe değil, TAMAM'a basınca kaydedilir.
  const [draft, setDraft] = useState(() => dateAt(hour, minute));
  const label = `${pad(hour)}:${pad(minute)}`;

  const openPicker = () => {
    setDraft(dateAt(hour, minute));
    setOpen(true);
  };

  return (
    <View style={styles.container}>
      <AppText variant="bodyStrong" color={colors.formLabel}>
        Okuma saati
      </AppText>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Okuma saati, ${label}`}
        accessibilityHint="Saati değiştirmek için saat seçiciyi açar"
        accessibilityState={{ disabled, expanded: open }}
        disabled={disabled}
        onPress={openPicker}
        style={({ pressed }) => [
          styles.field,
          disabled && styles.disabled,
          pressed && styles.pressed,
        ]}>
        <AppText variant="bodyStrong" color={colors.input.text} style={styles.value}>
          {label}
        </AppText>
        <View style={styles.icon}>
          <ClockIcon color={colors.textMuted} />
        </View>
      </Pressable>

      {open && Platform.OS === 'android' ? (
        <TimePicker
          value={dateAt(hour, minute)}
          mode="time"
          is24Hour
          presentation="dialog"
          onValueChange={(_, date) => {
            setOpen(false);
            onChange(date.getHours(), date.getMinutes());
          }}
          onDismiss={() => setOpen(false)}
        />
      ) : null}

      {Platform.OS === 'ios' ? (
        <Modal
          visible={open}
          transparent
          animationType="slide"
          onRequestClose={() => setOpen(false)}>
          <Pressable
            style={styles.backdrop}
            accessibilityRole="button"
            accessibilityLabel="Kapat"
            onPress={() => setOpen(false)}
          />
          <View style={styles.sheet} accessibilityViewIsModal>
            <TimePicker
              value={draft}
              mode="time"
              display="spinner"
              locale="tr_TR"
              themeVariant="light"
              onValueChange={(_, date) => setDraft(date)}
            />
            <Button
              title="TAMAM"
              onPress={() => {
                setOpen(false);
                onChange(draft.getHours(), draft.getMinutes());
              }}
            />
          </View>
        </Modal>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: size.touch + 8,
    backgroundColor: colors.input.background,
    borderWidth: 1,
    borderBottomWidth: size.cardLip,
    borderColor: colors.input.border,
    borderRadius: radius.input,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ translateY: 1 }],
  },
  value: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  icon: {
    width: size.touch,
    height: size.touch,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backdrop: {
    flex: 1,
    backgroundColor: colors.scrim,
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: radius.sheet,
    borderTopRightRadius: radius.sheet,
    padding: 22,
    paddingBottom: 40,
    gap: 12,
  },
});
