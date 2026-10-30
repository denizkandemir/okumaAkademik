import { StyleSheet, View } from 'react-native';

import { GameColors } from './theme';
import { GameText } from './ui/game-text';

import { Mascot } from '@/features/mascot/mascot';
import { MascotBubble } from '@/features/mascot/mascot-bubble';

// TODO(T05): Pasaport (şehir atlası). O zamana kadar Pasaport sekmesi bu yer tutucuyu gösterir.
export function JourneyMapPlaceholder() {
  return (
    <>
      <GameText variant="title" color={GameColors.text} accessibilityRole="header">
        Pırıl&apos;ın Yolculuğu
      </GameText>
      <View style={styles.row}>
        <Mascot pose="wave" size={140} />
        <View style={styles.bubble}>
          <MascotBubble tone="game" text="Yolculuk haritası çok yakında burada olacak!" />
        </View>
      </View>
    </>
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
