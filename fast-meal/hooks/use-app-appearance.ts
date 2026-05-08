import { useMemo } from "react";

import {
	type AppAppearance,
	darkAppearance,
	lightAppearance,
} from "@/constants/app-appearance";
import { usePreferences } from "@/context";

export const useAppAppearance = (): AppAppearance => {
	const { darkMode } = usePreferences();

	return useMemo(
		() => (darkMode ? darkAppearance : lightAppearance),
		[darkMode],
	);
};
