import { TabList, TabSlot, TabTrigger, Tabs } from 'expo-router/ui';
import { StyleSheet } from 'react-native';

import { TabBar, TabBarItem } from '@/design/components/tab-bar';
import { AwardIcon, BookIcon, MapIcon, UserIcon } from '@/design/icons';

/**
 * Alt sekme çubuğu (docs/tasarim, 01-yolculuk): Yolculuk, Kitaplık, Pasaport, Profil. Tüm
 * platformlarda aynı (expo-router/ui'nin başsız sekmeleri). Çubuk ekranın altına sabitlenir;
 * sekme ekranları altta `BottomTabInset` kadar boşluk bırakır.
 */
export default function AppTabs() {
  return (
    <Tabs style={styles.tabs}>
      <TabSlot style={styles.slot} />
      <TabList asChild>
        <TabBar style={styles.bar}>
          <TabTrigger name="index" href="/" asChild>
            <TabBarItem label="Yolculuk" Icon={MapIcon} />
          </TabTrigger>
          <TabTrigger name="library" href="/library" asChild>
            <TabBarItem label="Kitaplık" Icon={BookIcon} />
          </TabTrigger>
          <TabTrigger name="passport" href="/passport" asChild>
            <TabBarItem label="Pasaport" Icon={AwardIcon} />
          </TabTrigger>
          <TabTrigger name="profile" href="/profile" asChild>
            <TabBarItem label="Profil" Icon={UserIcon} />
          </TabTrigger>
        </TabBar>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flex: 1,
  },
  slot: {
    flex: 1,
  },
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});
