import { ThemeProvider } from "@react-navigation/native";
import { type Href, Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import "../  i18n";

import { Footer, Header } from "@/components";
import { ExpirationNotificationSetup } from "@/components/expiration-notification-setup";
import { RootProviders } from "@/components/root-providers";
import type { FooterTab } from "@/constants/nav";
import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
	navigationDarkTheme,
	navigationLightTheme,
} from "@/constants/navigation-theme";
import { usePreferences } from "@/context";
import { useAndroidSystemBars } from "@/hooks/use-android-system-bars";
import { getActiveTab } from "@/utils/helper";
import { initSentry, Sentry } from "@/utils/sentry";

initSentry();

const RootLayoutContent = () => {
	const { darkMode } = usePreferences();
	const { top } = useSafeAreaInsets();
	useAndroidSystemBars();
	const pathname = usePathname();
	const router = useRouter();
	const isDarkMode = darkMode;
	const appBackgroundColor = isDarkMode
		? appDarkBackgroundColor
		: appLightBackgroundColor;

	const isRecipeDetail =
		pathname.startsWith("/recipes/") && pathname !== "/recipes";
	const isSavedRecipeDetail = /^\/saved\/.+/.test(pathname);
	const isFridgeScan = pathname === "/fridge/scan";
	const isFridgeProductDetail = pathname.startsWith("/fridge/product/");
	const hideChrome =
		isRecipeDetail ||
		isSavedRecipeDetail ||
		isFridgeScan ||
		isFridgeProductDetail;
	// Camera scan is edge-to-edge; other chrome-hidden screens still need top inset
	// so back/save controls stay below the status bar / notch.
	const needsTopSafeArea = hideChrome && !isFridgeScan;

	const handleTabPress = (tab: FooterTab) => {
		const active = getActiveTab(pathname);
		if (tab === active) return;

		switch (tab) {
			case "home":
				router.navigate("/");
				break;
			case "settings":
				router.navigate("/settings");
				break;
			case "saved":
				router.navigate("/saved");
				break;
			case "fridge":
				router.navigate("/fridge" as Href);
				break;
			case "shoppingList":
				router.navigate("/shopping-list");
				break;
		}
	};

	return (
		<ThemeProvider
			value={isDarkMode ? navigationDarkTheme : navigationLightTheme}
		>
			<View style={[styles.container, { backgroundColor: appBackgroundColor }]}>
				<ExpirationNotificationSetup />
				{!hideChrome ? (
					<View style={[styles.headerContainer, { paddingTop: top + 10 }]}>
						<Header />
					</View>
				) : null}
				<View
					style={[
						styles.stackContainer,
						isFridgeScan && styles.stackContainerFullscreen,
						needsTopSafeArea && { paddingTop: top },
					]}
				>
					<Stack
						screenOptions={{
							headerShown: false,
							contentStyle: { backgroundColor: appBackgroundColor },
						}}
					>
						<Stack.Screen name="index" />
						<Stack.Screen name="settings" />
						<Stack.Screen name="fridge/index" />
						<Stack.Screen name="fridge/scan" />
						<Stack.Screen name="fridge/product/[code]" />
						<Stack.Screen name="saved" />
						<Stack.Screen name="shopping-list/index" />
					</Stack>
				</View>
				{!hideChrome && (
					<Footer
						activeTab={getActiveTab(pathname)}
						onTabPress={handleTabPress}
					/>
				)}
			</View>
			<StatusBar style={isDarkMode ? "light" : "dark"} />
		</ThemeProvider>
	);
};

const RootLayout = () => {
	return (
		<RootProviders>
			<RootLayoutContent />
		</RootProviders>
	);
};

export default Sentry.wrap(RootLayout);

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
	stackContainerFullscreen: {
		paddingTop: 0,
	},
});
