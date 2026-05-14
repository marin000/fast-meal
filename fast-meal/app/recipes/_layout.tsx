import { Stack } from "expo-router";

import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
} from "@/constants/navigation-theme";
import { useDeviceId, usePreferences } from "@/context";
import { LoadingScreen } from "@/features/recipes";
import { useRecipes } from "@/hooks/use-recipes";
import { RecipesProvider } from "@/store/use-recipes-context";

const RecipesLayout = () => {
	const { recipes, cacheKey } = useRecipes();
	const { deviceId } = useDeviceId();
	const { darkMode } = usePreferences();
	const appBackgroundColor = darkMode
		? appDarkBackgroundColor
		: appLightBackgroundColor;

	if (!recipes || deviceId === null) {
		return <LoadingScreen />;
	}

	return (
		<RecipesProvider recipes={recipes} cacheKey={cacheKey} deviceId={deviceId}>
			<Stack
				screenOptions={{
					headerShown: false,
					contentStyle: { backgroundColor: appBackgroundColor },
				}}
			/>
		</RecipesProvider>
	);
};

export default RecipesLayout;
