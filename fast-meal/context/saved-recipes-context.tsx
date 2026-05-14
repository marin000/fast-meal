import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	deleteSavedRecipeOnBackend,
	fetchSavedRecipes,
} from "@/api/saved-recipes";
import { useDeviceId } from "@/context/device-id-context";
import type { SavedRecipeListItem } from "@/interface/recipe";

interface SavedRecipesListContextValue {
	items: SavedRecipeListItem[];
	isLoading: boolean;
	reload: () => Promise<void>;
	removeById: (id: string) => Promise<void>;
}

const SavedRecipesListContext = createContext<
	SavedRecipesListContextValue | undefined
>(undefined);

export const SavedRecipesProvider = ({ children }: { children: ReactNode }) => {
	const { deviceId } = useDeviceId();
	const [items, setItems] = useState<SavedRecipeListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const reload = useCallback(async () => {
		if (!deviceId) {
			setItems([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const list = await fetchSavedRecipes(deviceId);
			setItems(list);
		} catch {
			setItems([]);
		} finally {
			setIsLoading(false);
		}
	}, [deviceId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	const removeById = useCallback(
		async (id: string) => {
			if (!deviceId) return;
			await deleteSavedRecipeOnBackend(deviceId, id);
			setItems((prev) => prev.filter((x) => x.id !== id));
		},
		[deviceId],
	);

	const value: SavedRecipesListContextValue = {
		items,
		isLoading,
		reload,
		removeById,
	};

	return (
		<SavedRecipesListContext.Provider value={value}>
			{children}
		</SavedRecipesListContext.Provider>
	);
};

export const useSavedRecipesList = (): SavedRecipesListContextValue => {
	const ctx = useContext(SavedRecipesListContext);
	if (ctx === undefined) {
		throw new Error(
			"useSavedRecipesList must be used within SavedRecipesProvider",
		);
	}
	return ctx;
};
