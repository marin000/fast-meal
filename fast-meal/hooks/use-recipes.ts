import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import { DailyLimitError, GenerationTimeoutError, generateRecipe } from "@/api";
import type { QuickFilterOption } from "@/constants/home";
import {
	useDeviceId,
	useFeedbackMessage,
	useGenerationQuota,
	useHomeIngredientImage,
	usePreferences,
} from "@/context";
import type { Recipe, RecipeImagePayload } from "@/interface";
import { coerceParam } from "@/utils/helper";

interface RecipesParams {
	ingredients?: string | string[];
	preferences?: string | string[];
	units?: string | string[];
	hasImage?: string | string[];
}

type FetchErrorKind = "timeout" | "generic";

export const useRecipes = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { deviceId } = useDeviceId();
	const { showMessage } = useFeedbackMessage();
	const { refreshQuota } = useGenerationQuota();
	const { language } = usePreferences();
	const { image, clearImage } = useHomeIngredientImage();
	const imageRef = useRef(image);
	imageRef.current = image;
	const params = useLocalSearchParams() as RecipesParams;
	const [recipes, setRecipes] = useState<Recipe[] | null>(null);
	const [cacheKey, setCacheKey] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [fetchError, setFetchError] = useState<FetchErrorKind | null>(null);
	const [attempt, setAttempt] = useState(0);

	const retry = useCallback(() => {
		setFetchError(null);
		setIsLoading(true);
		setAttempt((current) => current + 1);
	}, []);

	useEffect(() => {
		if (!deviceId) return;
		void attempt;

		const goBack = () => router.back();
		const showAlert = (title: string) => {
			Alert.alert(title, undefined, [{ text: "OK", onPress: goBack }]);
		};

		const fetchRecipes = async () => {
			setIsLoading(true);
			setFetchError(null);

			try {
				const ingredientsInput = coerceParam(params.ingredients);
				const preferencesString = coerceParam(params.preferences);
				const units = coerceParam(params.units);
				const hasImageParam = coerceParam(params.hasImage) === "1";
				const selectedFilters = preferencesString
					.split(",")
					.filter(Boolean) as QuickFilterOption[];

				const currentImage = imageRef.current;
				const imagePayload: RecipeImagePayload | undefined =
					hasImageParam && currentImage
						? {
								base64: currentImage.base64,
								mimeType: currentImage.mimeType,
							}
						: undefined;

				if (hasImageParam && !imagePayload && !ingredientsInput.trim()) {
					showAlert(t("errors.generic"));
					return;
				}

				const response = await generateRecipe({
					deviceId,
					ingredientsInput,
					selectedFilters,
					units: units === "imperial" ? "imperial" : "metric",
					language,
					retryAttempt: attempt + 1,
					image: imagePayload,
				});

				if (response.declined) {
					clearImage();
					showAlert(
						typeof response.message === "string" && response.message.trim()
							? response.message.trim()
							: t("errors.declined"),
					);
					return;
				}

				if (!response.recipes || response.recipes.length === 0) {
					showAlert(t("errors.noRecipes"));
					return;
				}

				clearImage();
				setRecipes(response.recipes);
				setCacheKey(
					typeof response.cacheKey === "string" ? response.cacheKey : null,
				);
				await refreshQuota();
			} catch (error) {
				if (error instanceof DailyLimitError) {
					showMessage(t("errors.dailyLimit"), "info");
					await refreshQuota();
					goBack();
					return;
				}

				if (error instanceof GenerationTimeoutError) {
					setFetchError("timeout");
					return;
				}

				setFetchError("generic");
			} finally {
				setIsLoading(false);
			}
		};

		void fetchRecipes();
	}, [
		attempt,
		clearImage,
		deviceId,
		language,
		params.hasImage,
		params.ingredients,
		params.preferences,
		params.units,
		refreshQuota,
		router,
		showMessage,
		t,
	]);

	return { recipes, cacheKey, isLoading, fetchError, retry };
};
