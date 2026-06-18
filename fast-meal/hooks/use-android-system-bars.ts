import * as NavigationBar from "expo-navigation-bar";
import * as SystemUI from "expo-system-ui";
import { useEffect } from "react";
import { Platform } from "react-native";
import { usePreferences } from "@/context/preferences-context";
import { useAppAppearance } from "@/hooks/use-app-appearance";

export const useAndroidSystemBars = () => {
	const { darkMode } = usePreferences();
	const { footerBg } = useAppAppearance();

	useEffect(() => {
		if (Platform.OS !== "android") {
			return;
		}

		void NavigationBar.setVisibilityAsync("hidden");
		NavigationBar.setStyle(darkMode ? "light" : "dark");
		void SystemUI.setBackgroundColorAsync(footerBg);
	}, [darkMode, footerBg]);
};
