import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';

export default function LibraryScreen() {
  return (
    <Screen withTabBar>
      <ThemedText type="title">Kitaplığım</ThemedText>
    </Screen>
  );
}
