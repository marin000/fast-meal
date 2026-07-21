import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { type QuickFilterOption, quickFilterOptions } from "@/constants/home";
import {
	useFeedbackMessage,
	useGenerationQuota,
	useHomeIngredientImage,
	useHomeIngredients,
	usePreferences,
} from "@/context";

export const useHomeForm = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { showMessage } = useFeedbackMessage();
	const { remainingGenerations } = useGenerationQuota();
	const { lockedQuickFilters, units } = usePreferences();
	const {
		ingredients: ingredientsInputValue,
		setIngredients: setIngredientsInputValue,
	} = useHomeIngredients();
	const { image } = useHomeIngredientImage();
	const [selectedFilters, setSelectedFilters] = useState<QuickFilterOption[]>(
		[],
	);

	const toggleFilterOption = (filter: QuickFilterOption) => {
		if (lockedQuickFilters.includes(filter)) return;

		setSelectedFilters((previousFilters) =>
			previousFilters.includes(filter)
				? previousFilters.filter((item) => item !== filter)
				: [...previousFilters, filter],
		);
	};

	const canSubmit = useMemo(
		() => ingredientsInputValue.trim().length > 0 || image !== null,
		[image, ingredientsInputValue],
	);
	const selectedFiltersWithLocks = useMemo(
		() =>
			[
				...new Set([...selectedFilters, ...lockedQuickFilters]),
			] as QuickFilterOption[],
		[selectedFilters, lockedQuickFilters],
	);

	const submitForm = () => {
		if (remainingGenerations !== null && remainingGenerations <= 0) {
			showMessage(t("errors.dailyLimit"), "info");
			return;
		}

		router.push({
			pathname: "/recipes",
			params: {
				ingredients: ingredientsInputValue.trim(),
				preferences: selectedFiltersWithLocks.join(","),
				units,
				hasImage: image ? "1" : "0",
			},
		});
	};

	return {
		ingredientsInputValue,
		setIngredientsInputValue,
		selectedFilters: selectedFiltersWithLocks,
		toggleFilterOption,
		quickFilterOptions,
		lockedQuickFilters,
		canSubmit,
		submitForm,
	};
};
