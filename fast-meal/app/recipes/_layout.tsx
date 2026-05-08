import { Stack } from "expo-router";

import {
	appDarkBackgroundColor,
	appLightBackgroundColor,
} from "@/constants/navigation-theme";
import { usePreferences } from "@/context";
import { LoadingScreen } from "@/features/recipes";
import { useRecipes } from "@/hooks/use-recipes";
import { RecipesProvider } from "@/store/use-recipes-context";

const RecipesLayout = () => {
	const { recipes } = useRecipes();
	const { darkMode } = usePreferences();
	const appBackgroundColor = darkMode
		? appDarkBackgroundColor
		: appLightBackgroundColor;

	if (!recipes) {
		return <LoadingScreen />;
	}

	return (
		<RecipesProvider recipes={recipes}>
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
