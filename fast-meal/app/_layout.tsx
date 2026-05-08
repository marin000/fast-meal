import { ThemeProvider } from "@react-navigation/native";
import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../  i18n";

import { Footer, Header } from "@/components";
import type { FooterTab } from "@/constants/nav";
import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
	navigationDarkTheme,
	navigationLightTheme,
} from "@/constants/navigation-theme";
import { PreferencesProvider, usePreferences } from "@/context";

const RootLayoutContent = () => {
	const { darkMode } = usePreferences();
	const { top } = useSafeAreaInsets();
	const pathname = usePathname();
	const router = useRouter();
	const isDarkMode = darkMode;
	const appBackgroundColor = isDarkMode
		? appDarkBackgroundColor
		: appLightBackgroundColor;

	const getActiveTab = (): FooterTab => {
		if (pathname.startsWith("/saved")) return "saved";
		if (pathname.startsWith("/settings")) return "settings";
		return "home";
	};

	const isRecipeDetail =
		pathname.startsWith("/recipes/") && pathname !== "/recipes";
	const handleTabPress = (tab: FooterTab) => {
		if (tab === getActiveTab()) return;
		if (tab === "home") {
			router.push("/");
			return;
		}

		if (tab === "settings") {
			router.push("/settings");
		}
	};

	return (
		<ThemeProvider
			value={isDarkMode ? navigationDarkTheme : navigationLightTheme}
		>
			<View style={[styles.container, { backgroundColor: appBackgroundColor }]}>
				<View style={[styles.headerContainer, { paddingTop: top + 10 }]}>
					<Header />
				</View>
				<View style={styles.stackContainer}>
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor: appBackgroundColor },
						}}
					>
						<Stack.Screen name="index" />
						<Stack.Screen name="settings" />
					</Stack>
				</View>
				{!isRecipeDetail && (
					<Footer activeTab={getActiveTab()} onTabPress={handleTabPress} />
				)}
			</View>
			<StatusBar style={isDarkMode ? "light" : "dark"} />
		</ThemeProvider>
	);
};

const RootLayout = () => {
	return (
		<PreferencesProvider>
			<RootLayoutContent />
		</PreferencesProvider>
	);
};

export default RootLayout;

const styles = StyleSheet.create({
	container: {
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
