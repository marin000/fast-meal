import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import type { Recipe } from "@/interface";
import type { ShoppingListItem } from "@/interface/shopping-list";
import { mergeRecipeIngredientsIntoList } from "@/utils/merge-shopping-list-names";
import {
	getStoredShoppingList,
	setStoredShoppingList,
} from "@/utils/shopping-list-storage";

interface ShoppingListContextValue {
	items: ShoppingListItem[];
	isLoading: boolean;
	addItem: (name: string) => void;
	addFromRecipe: (recipe: Recipe) => number;
	toggleItem: (id: string) => void;
	removeItem: (id: string) => void;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
	undefined,
);

const persist = async (items: ShoppingListItem[]) => {
	await setStoredShoppingList(items);
};

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
	const [items, setItems] = useState<ShoppingListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;
		void (async () => {
			const stored = await getStoredShoppingList();
			if (!cancelled) {
				setItems(stored);
				setIsLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);

	const updateItems = useCallback((next: ShoppingListItem[]) => {
		setItems(next);
		void persist(next);
	}, []);

	const addItem = useCallback(
		(name: string) => {
			const trimmed = name.trim();
			if (!trimmed) return;
			const key = trimmed.toLowerCase();
			if (items.some((item) => item.name.trim().toLowerCase() === key)) {
				return;
			}
			const next: ShoppingListItem[] = [
				...items,
				{
					id:
						globalThis.crypto?.randomUUID?.() ??
						`shop-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
					name: trimmed,
					checked: false,
				},
			];
			updateItems(next);
		},
		[items, updateItems],
	);

	const addFromRecipe = useCallback(
		(recipe: Recipe) => {
			const { items: next, addedCount } = mergeRecipeIngredientsIntoList(
				items,
				recipe,
			);
			if (addedCount > 0) {
				updateItems(next);
			}
			return addedCount;
		},
		[items, updateItems],
	);

	const toggleItem = useCallback(
		(id: string) => {
			updateItems(
				items.map((item) =>
					item.id === id ? { ...item, checked: !item.checked } : item,
				),
			);
		},
		[items, updateItems],
	);

	const removeItem = useCallback(
		(id: string) => {
			updateItems(items.filter((item) => item.id !== id));
		},
		[items, updateItems],
	);

	return (
		<ShoppingListContext.Provider
			value={{
				items,
				isLoading,
				addItem,
				addFromRecipe,
				toggleItem,
				removeItem,
			}}
		>
			{children}
		</ShoppingListContext.Provider>
	);
};

export const useShoppingList = (): ShoppingListContextValue => {
	const ctx = useContext(ShoppingListContext);
	if (ctx === undefined) {
		throw new Error("useShoppingList must be used within ShoppingListProvider");
	}
	return ctx;
};
