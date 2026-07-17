import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	createShoppingListItem,
	deleteShoppingListItem,
	fetchShoppingList,
	updateShoppingListItem,
} from "@/api/shopping-list";
import { useDeviceId } from "@/context/device-id-context";
import { useRefetchOnForeground } from "@/hooks/use-refetch-on-foreground";
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
	reload: () => Promise<void>;
	addItem: (name: string) => Promise<void>;
	addFromRecipe: (recipe: Recipe) => Promise<number>;
	toggleItem: (id: string) => Promise<void>;
	removeItem: (id: string) => Promise<void>;
}

const ShoppingListContext = createContext<ShoppingListContextValue | undefined>(
	undefined,
);

const migrateLocalItemsIfNeeded = async (
	deviceId: string,
	serverItems: ShoppingListItem[],
): Promise<ShoppingListItem[]> => {
	if (serverItems.length > 0) {
		return serverItems;
	}

	const localItems = await getStoredShoppingList();
	if (localItems.length === 0) {
		return serverItems;
	}

	const migrated: ShoppingListItem[] = [];
	for (const item of localItems) {
		try {
			const created = await createShoppingListItem({
				deviceId,
				name: item.name,
			});
			migrated.push(
				item.checked
					? await updateShoppingListItem({
							deviceId,
							id: created.id,
							checked: true,
						})
					: created,
			);
		} catch {
			/* skip failed item */
		}
	}

	await setStoredShoppingList([]);
	return migrated.length > 0 ? migrated : await fetchShoppingList(deviceId);
};

export const ShoppingListProvider = ({ children }: { children: ReactNode }) => {
	const { deviceId } = useDeviceId();
	const [items, setItems] = useState<ShoppingListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const reload = useCallback(async () => {
		if (!deviceId) {
			setItems([]);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		try {
			let list = await fetchShoppingList(deviceId);
			list = await migrateLocalItemsIfNeeded(deviceId, list);
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

	useRefetchOnForeground(() => {
		void reload();
	});

	const addItem = useCallback(
		async (name: string) => {
			if (!deviceId) return;
			const trimmed = name.trim();
			if (!trimmed) return;

			const key = trimmed.toLowerCase();
			if (items.some((item) => item.name.trim().toLowerCase() === key)) {
				return;
			}

			const optimisticId = `temp-${Date.now()}`;
			const optimistic: ShoppingListItem = {
				id: optimisticId,
				name: trimmed,
				checked: false,
			};
			setItems((prev) => [...prev, optimistic]);

			try {
				const created = await createShoppingListItem({
					deviceId,
					name: trimmed,
				});
				setItems((prev) =>
					prev.map((item) => (item.id === optimisticId ? created : item)),
				);
			} catch {
				setItems((prev) => prev.filter((item) => item.id !== optimisticId));
			}
		},
		[deviceId, items],
	);

	const addFromRecipe = useCallback(
		async (recipe: Recipe) => {
			if (!deviceId) return 0;

			const { items: next, addedCount } = mergeRecipeIngredientsIntoList(
				items,
				recipe,
			);
			if (addedCount === 0) return 0;

			const previousItems = items;
			setItems(next);

			try {
				const createdItems = await Promise.all(
					next
						.filter(
							(item) =>
								!previousItems.some((existing) => existing.id === item.id),
						)
						.map((item) =>
							createShoppingListItem({ deviceId, name: item.name }),
						),
				);
				setItems((current) => {
					const createdByName = new Map(
						createdItems.map((item) => [item.name.trim().toLowerCase(), item]),
					);
					return current.map((item) => {
						const created = createdByName.get(item.name.trim().toLowerCase());
						return created ?? item;
					});
				});
			} catch {
				setItems(previousItems);
				return 0;
			}

			return addedCount;
		},
		[deviceId, items],
	);

	const toggleItem = useCallback(
		async (id: string) => {
			if (!deviceId) return;

			const target = items.find((item) => item.id === id);
			if (!target) return;

			const nextChecked = !target.checked;
			const previousItems = items;
			setItems((prev) =>
				prev.map((item) =>
					item.id === id ? { ...item, checked: nextChecked } : item,
				),
			);

			try {
				await updateShoppingListItem({
					deviceId,
					id,
					checked: nextChecked,
				});
			} catch {
				setItems(previousItems);
			}
		},
		[deviceId, items],
	);

	const removeItem = useCallback(
		async (id: string) => {
			if (!deviceId) return;

			const previousItems = items;
			setItems((prev) => prev.filter((item) => item.id !== id));

			try {
				await deleteShoppingListItem(deviceId, id);
			} catch {
				setItems(previousItems);
			}
		},
		[deviceId, items],
	);

	return (
		<ShoppingListContext.Provider
			value={{
				items,
				isLoading,
				reload,
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
