import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function ProfileScreen() {
  return (
    <Screen withTabBar>
      <ThemedText type="title">Profil</ThemedText>
    </Screen>
  );
}
