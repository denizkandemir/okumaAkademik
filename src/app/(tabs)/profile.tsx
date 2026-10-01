import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/button';
import { Card } from '@/components/card';
import { Screen } from '@/components/screen';
import { ThemedText } from '@/components/themed-text';
import { Radius, Spacing } from '@/constants/theme';
import { useAuth } from '@/features/auth/auth-context';
import { useTheme } from '@/hooks/use-theme';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const theme = useTheme();
  const [signingOut, setSigningOut] = useState(false);

  if (!user) return null;

  const initial = user.name.trim().charAt(0).toLocaleUpperCase('tr-TR') || '?';

  return (
    <Screen withTabBar>
      <ThemedText type="title">Profil</ThemedText>

      <View style={styles.identity}>
        <View
          accessibilityElementsHidden
          importantForAccessibility="no-hide-descendants"
          style={[styles.avatar, { backgroundColor: theme.primary }]}>
          <ThemedText type="title" style={{ color: theme.onPrimary }}>
            {initial}
          </ThemedText>
        </View>
        <ThemedText type="subtitle">{user.name}</ThemedText>
      </View>

      <Card>
        <InfoRow label="Kullanıcı adı" value={user.username} />
        <InfoRow label="Sınıf" value={user.grade ? `${user.grade}. sınıf` : 'Belirtilmedi'} />
      </Card>

      <Button
        title="Çıkış yap"
        variant="danger"
        loading={signingOut}
        onPress={() => {
          setSigningOut(true);
          void signOut();
        }}
      />
    </Screen>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <ThemedText themeColor="textSecondary">{label}</ThemedText>
      <ThemedText type="smallBold" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  identity: {
    alignItems: 'center',
    gap: Spacing.two,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  value: {
    fontSize: 18,
  },
});
