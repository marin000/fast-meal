import { ThemeProvider } from "@react-navigation/native";
import { type Href, Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { StyleSheet, View } from "react-native";
import {
	initialWindowMetrics,
	SafeAreaProvider,
	useSafeAreaInsets,
} from "react-native-safe-area-context";
import "../  i18n";

import { Footer, Header } from "@/components";
import { ExpirationNotificationSetup } from "@/components/expiration-notification-setup";
import type { FooterTab } from "@/constants/nav";
import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
	navigationDarkTheme,
	navigationLightTheme,
} from "@/constants/navigation-theme";
import {
	DeviceIdProvider,
	FeedbackMessageProvider,
	FridgeProductsProvider,
	GenerationQuotaProvider,
	HomeIngredientsProvider,
	HouseholdProvider,
	PreferencesProvider,
	ShoppingListProvider,
	usePreferences,
} from "@/context";
import { useAndroidSystemBars } from "@/hooks/use-android-system-bars";

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

	const getActiveTab = (): FooterTab | null => {
		if (pathname.startsWith("/saved")) return "saved";
		if (pathname.startsWith("/fridge")) return "fridge";
		if (pathname.startsWith("/shopping-list")) return "shoppingList";
		if (pathname.startsWith("/settings")) return "settings";
		if (pathname === "/" || pathname === "/index" || pathname === "") {
			return "home";
		}
		return null;
	};

	const isRecipeDetail =
		pathname.startsWith("/recipes/") && pathname !== "/recipes";
	const isSavedRecipeDetail = /^\/saved\/.+/.test(pathname);
	const handleTabPress = (tab: FooterTab) => {
		const active = getActiveTab();
		if (tab === active) return;
		if (tab === "home") {
			router.navigate("/");
			return;
		}

		if (tab === "settings") {
			router.navigate("/settings");
			return;
		}

		if (tab === "saved") {
			router.navigate("/saved");
			return;
		}

		if (tab === "fridge") {
			router.navigate("/fridge" as Href);
			return;
		}

		if (tab === "shoppingList") {
			router.navigate("/shopping-list");
			return;
		}
	};

	return (
		<ThemeProvider
			value={isDarkMode ? navigationDarkTheme : navigationLightTheme}
		>
			<View style={[styles.container, { backgroundColor: appBackgroundColor }]}>
				<ExpirationNotificationSetup />
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
						<Stack.Screen name="fridge/index" />
						<Stack.Screen name="saved" />
						<Stack.Screen name="shopping-list/index" />
					</Stack>
				</View>
				{!isRecipeDetail && !isSavedRecipeDetail && (
					<Footer activeTab={getActiveTab()} onTabPress={handleTabPress} />
				)}
			</View>
			<StatusBar style={isDarkMode ? "light" : "dark"} />
		</ThemeProvider>
	);
};

const RootLayout = () => {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<PreferencesProvider>
				<DeviceIdProvider>
					<HouseholdProvider>
						<GenerationQuotaProvider>
							<FridgeProductsProvider>
								<HomeIngredientsProvider>
									<ShoppingListProvider>
										<FeedbackMessageProvider>
											<RootLayoutContent />
										</FeedbackMessageProvider>
									</ShoppingListProvider>
								</HomeIngredientsProvider>
							</FridgeProductsProvider>
						</GenerationQuotaProvider>
					</HouseholdProvider>
				</DeviceIdProvider>
			</PreferencesProvider>
		</SafeAreaProvider>
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
