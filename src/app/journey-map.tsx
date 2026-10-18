import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { GameColors } from '@/features/game/theme';
import { GameText } from '@/features/game/ui/game-text';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';

// TODO(P07): yolculuk haritası (S11Harita). Şimdilik ana sayfadaki harita düğmesinin hedefi.
export default function JourneyMapScreen() {
  return (
    <Screen>
      <GameText variant="title" color={GameColors.text} accessibilityRole="header">
        Pırıl&apos;ın Yolculuğu
      </GameText>
      <View style={styles.row}>
        <Mascot pose="wave" size={140} />
        <View style={styles.bubble}>
          <MascotBubble tone="game" text="Yolculuk haritası çok yakında burada olacak!" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    flex: 1,
  },
});
