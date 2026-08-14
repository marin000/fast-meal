import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import { useTranslation } from "react-i18next";

import {
	deleteSavedRecipeOnBackend,
	fetchSavedRecipes,
	saveRecipeToBackend,
} from "@/api/saved-recipes";
import { useFeedbackMessage } from "@/context/feedback-message-context";
import type { Recipe } from "@/interface";
import type { SavedRecipeListItem } from "@/interface/recipe";
import {
	ANALYTICS_EVENTS,
	captureAppException,
	trackProductEvent,
} from "@/utils/sentry";

const matchSavedListItemId = (
	recipe: Recipe,
	generationCacheKey: string | null,
	list: SavedRecipeListItem[],
): string | null => {
	const hit = list.find((s) => {
		if (s.recipe.title !== recipe.title) return false;
		if (generationCacheKey && s.cacheKey) {
			return s.cacheKey === generationCacheKey;
		}
		if (generationCacheKey && !s.cacheKey) return false;
		return true;
	});
	return hit?.id ?? null;
};

interface RecipesContextValue {
	recipes: Recipe[];
	cacheKey: string | null;
	deviceId: string;
	getSavedBackendIdForIndex: (index: number) => string | null;
	isBusyForIndex: (index: number) => boolean;
	saveRecipeAtIndex: (index: number) => Promise<void>;
	removeSavedRecipeAtIndex: (index: number) => Promise<void>;
}

const RecipesContext = createContext<RecipesContextValue | null>(null);

interface RecipesProviderProps {
	recipes: Recipe[];
	cacheKey: string | null;
	deviceId: string;
	children: ReactNode;
}

export const RecipesProvider = ({
	recipes,
	cacheKey,
	deviceId,
	children,
}: RecipesProviderProps) => {
	const { t } = useTranslation();
	const { showMessage } = useFeedbackMessage();
	const [savedBackendIds, setSavedBackendIds] = useState<(string | null)[]>(
		() => recipes.map(() => null),
	);
	const [busyIndex, setBusyIndex] = useState<number | null>(null);

	useEffect(() => {
		setSavedBackendIds(recipes.map(() => null));
		let cancelled = false;
		void (async () => {
			try {
				const list = await fetchSavedRecipes(deviceId);
				if (cancelled) return;
				setSavedBackendIds(
					recipes.map((r) => matchSavedListItemId(r, cacheKey, list)),
				);
			} catch {
				if (!cancelled) {
					setSavedBackendIds(recipes.map(() => null));
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [deviceId, recipes, cacheKey]);

	const getSavedBackendIdForIndex = useCallback(
		(index: number) => savedBackendIds[index] ?? null,
		[savedBackendIds],
	);

	const isBusyForIndex = useCallback(
		(index: number) => busyIndex === index,
		[busyIndex],
	);

	const saveRecipeAtIndex = useCallback(
		async (index: number) => {
			const recipe = recipes[index];
			if (!recipe) return;
			if (savedBackendIds[index]) return;
			setBusyIndex(index);
			try {
				const id = await saveRecipeToBackend({
					deviceId,
					recipe,
					cacheKey: cacheKey ?? undefined,
				});
				setSavedBackendIds((prev) => {
					const next = [...prev];
					next[index] = id;
					return next;
				});
				trackProductEvent(ANALYTICS_EVENTS.recipeSaved);
				showMessage(t("saved.toast.saved"), "success");
			} catch (error) {
				captureAppException(error, { feature: "recipe_save" });
				showMessage(t("saved.toast.saveFailed"), "error");
			} finally {
				setBusyIndex(null);
			}
		},
		[recipes, savedBackendIds, deviceId, cacheKey, showMessage, t],
	);

	const removeSavedRecipeAtIndex = useCallback(
		async (index: number) => {
			const id = savedBackendIds[index];
			if (!id) return;
			setBusyIndex(index);
			try {
				await deleteSavedRecipeOnBackend(deviceId, id);
				setSavedBackendIds((prev) => {
					const next = [...prev];
					next[index] = null;
					return next;
				});
				showMessage(t("saved.toast.deleted"), "success");
			} catch {
				showMessage(t("saved.toast.deleteFailed"), "error");
			} finally {
				setBusyIndex(null);
			}
		},
		[savedBackendIds, deviceId, showMessage, t],
	);

	const value: RecipesContextValue = {
		recipes,
		cacheKey,
		deviceId,
		getSavedBackendIdForIndex,
		isBusyForIndex,
		saveRecipeAtIndex,
		removeSavedRecipeAtIndex,
	};

	return (
		<RecipesContext.Provider value={value}>{children}</RecipesContext.Provider>
	);
};

export const useRecipesContext = () => {
	const value = useContext(RecipesContext);

	if (!value) {
		throw new Error("useRecipesContext must be used within a RecipesProvider");
	}

	return value;
};
