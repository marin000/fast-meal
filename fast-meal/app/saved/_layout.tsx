import { Stack } from "expo-router";

import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
} from "@/constants/navigation-theme";
import { usePreferences } from "@/context";
import { SavedRecipesProvider } from "@/context/saved-recipes-context";

const SavedLayout = () => {
	const { darkMode } = usePreferences();
	const appBackgroundColor = darkMode
		? appDarkBackgroundColor
		: appLightBackgroundColor;

	return (
		<SavedRecipesProvider>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: appBackgroundColor },
				}}
			/>
		</SavedRecipesProvider>
	);
};

export default SavedLayout;
