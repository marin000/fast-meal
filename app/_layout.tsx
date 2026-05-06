import { ThemeProvider } from '@react-navigation/native';
import { Stack, usePathname, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import '../  i18n';

import { Footer, Header } from '@/components';
import type { FooterTab } from '@/constants/nav';
import { appBackgroundColor, navigationDarkTheme, navigationLightTheme } from '@/constants/navigation-theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

const RootLayout = () => {
  const colorScheme = useColorScheme();
  const { top } = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();

  const getActiveTab = (): FooterTab => {
    if (pathname.startsWith('/saved')) return 'saved';
    if (pathname.startsWith('/settings')) return 'settings';
    return 'home';
  };

  return (
    <ThemeProvider value={colorScheme === 'dark' ? navigationDarkTheme : navigationLightTheme}>
      <View style={styles.container}>
        <View style={[styles.headerContainer, { paddingTop: top + 10 }]}>
          <Header />
        </View>
        <View style={styles.stackContainer}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: appBackgroundColor } }}>
            <Stack.Screen name="index" />
          </Stack>
        </View>
        <Footer activeTab={getActiveTab()} onHomePress={() => router.push('/')} />
      </View>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
};

export default RootLayout;

const styles = StyleSheet.create({
  container: {
    backgroundColor: appBackgroundColor,
    flex: 1,
  },
  headerContainer: {
    paddingHorizontal: 20,
  },
  stackContainer: {
    flex: 1,
    paddingTop: 8,
  },
});
