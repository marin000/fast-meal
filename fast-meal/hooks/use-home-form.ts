import { useRouter } from "expo-router";
import { useMemo, useState } from "react";

import { type QuickFilterOption, quickFilterOptions } from "@/constants/home";
import { usePreferences } from "@/context";

export const useHomeForm = () => {
	const router = useRouter();
	const { lockedQuickFilters, units } = usePreferences();
	const [ingredientsInputValue, setIngredientsInputValue] = useState("");
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
		() => ingredientsInputValue.trim().length > 0,
		[ingredientsInputValue],
	);
	const selectedFiltersWithLocks = useMemo(
		() =>
			[
				...new Set([...selectedFilters, ...lockedQuickFilters]),
			] as QuickFilterOption[],
		[selectedFilters, lockedQuickFilters],
	);

	const submitForm = () => {
		router.push({
			pathname: "/recipes",
			params: {
				ingredients: ingredientsInputValue.trim(),
				preferences: selectedFiltersWithLocks.join(","),
				units,
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
