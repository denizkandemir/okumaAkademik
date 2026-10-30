import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/screen';
import { GameColors } from '@/features/game/theme';
import { GameText } from '@/features/game/ui/game-text';
import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';

// TODO(P07): şehir rozetleri ve başarılar (GET /me/stats). Şimdilik yer tutucu.
export default function BadgesScreen() {
  return (
    <Screen>
      <GameText variant="title" color={GameColors.text} accessibilityRole="header">
        Rozetler
      </GameText>
      <View style={styles.mascotRow}>
        <Mascot pose="think" size={140} />
        <View style={styles.bubble}>
          <MascotBubble tone="game" text="Rozetlerin çok yakında burada olacak!" />
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mascotRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bubble: {
    flex: 1,
  },
});
