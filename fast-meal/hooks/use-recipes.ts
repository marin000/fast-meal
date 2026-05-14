import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { generateRecipe } from "@/api";
import type { QuickFilterOption } from "@/constants/home";
import { useDeviceId, usePreferences } from "@/context";
import type { Recipe } from "@/interface";
import { coerceParam } from "@/utils/helper";

interface RecipesParams {
	ingredients?: string | string[];
	preferences?: string | string[];
	units?: string | string[];
}

export const useRecipes = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { deviceId } = useDeviceId();
	const { language } = usePreferences();
	const params = useLocalSearchParams() as RecipesParams;
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const [cacheKey, setCacheKey] = useState<string | null>(null);
	const hasRunRef = useRef(false);

	useEffect(() => {
		if (!deviceId) return;
		if (hasRunRef.current) return;
		hasRunRef.current = true;

		const goBack = () => router.back();
		const showAlert = (titleKey: string) => {
			Alert.alert(t(titleKey), undefined, [{ text: "OK", onPress: goBack }]);
		};

		const fetchRecipes = async () => {
			try {
				const ingredientsInput = coerceParam(params.ingredients);
				const preferencesString = coerceParam(params.preferences);
				const units = coerceParam(params.units);
				const selectedFilters = preferencesString
					.split(",")
					.filter(Boolean) as QuickFilterOption[];

				const response = await generateRecipe({
					deviceId,
					ingredientsInput,
					selectedFilters,
					units: units === "imperial" ? "imperial" : "metric",
					language,
				});

				if (response.declined) {
					showAlert("errors.declined");
					return;
				}

				if (!response.recipes || response.recipes.length === 0) {
					showAlert("errors.noRecipes");
					return;
				}

				setRecipes(response.recipes);
				setCacheKey(
					typeof response.cacheKey === "string" ? response.cacheKey : null,
				);
			} catch (error) {
				const detail =
					error instanceof Error ? error.message : t("message.unknownError");
				const isDailyLimit =
					error instanceof Error && /limit/i.test(error.message);
				Alert.alert(
					isDailyLimit ? t("errors.dailyLimit") : t("errors.generic"),
					detail,
					[{ text: "OK", onPress: goBack }],
				);
			}
		};

		void fetchRecipes();
	}, [deviceId, language, params, router, t]);

	return { recipes, cacheKey };
};
