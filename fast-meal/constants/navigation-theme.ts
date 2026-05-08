import { DarkTheme, DefaultTheme } from "@react-navigation/native";

import { darkAppearance, lightAppearance } from "@/constants/app-appearance";

export const appLightBackgroundColor = lightAppearance.background;
export const appDarkBackgroundColor = darkAppearance.background;

export const navigationLightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: lightAppearance.background,
		card: lightAppearance.background,
		text: lightAppearance.text,
		border: lightAppearance.border,
		primary: lightAppearance.primary,
	},
};

export const navigationDarkTheme = {
	...DarkTheme,
	colors: {
		...DarkTheme.colors,
		background: darkAppearance.background,
		card: darkAppearance.background,
		text: darkAppearance.text,
		border: darkAppearance.border,
		primary: darkAppearance.primary,
	},
};
