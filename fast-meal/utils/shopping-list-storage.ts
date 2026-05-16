import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { SHOPPING_LIST_STORAGE_KEY } from "@/constants/shopping-list";
import type { ShoppingListItem } from "@/interface/shopping-list";

const readFromWeb = (): ShoppingListItem[] | null => {
	try {
		if (typeof globalThis.localStorage === "undefined") return null;
		const raw = globalThis.localStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
		if (!raw) return [];
		return parseItems(JSON.parse(raw));
	} catch {
		return null;
	}
};

const writeToWeb = (items: ShoppingListItem[]): void => {
	try {
		if (typeof globalThis.localStorage === "undefined") return;
		globalThis.localStorage.setItem(
			SHOPPING_LIST_STORAGE_KEY,
			JSON.stringify(items),
		);
	} catch {
		/* unavailable */
	}
};

const parseItems = (value: unknown): ShoppingListItem[] => {
	if (!Array.isArray(value)) return [];
	return value
		.filter(
			(item): item is ShoppingListItem =>
				typeof item === "object" &&
				item !== null &&
				typeof (item as ShoppingListItem).id === "string" &&
				typeof (item as ShoppingListItem).name === "string" &&
				typeof (item as ShoppingListItem).checked === "boolean",
		)
		.map((item) => ({
			id: item.id,
			name: item.name.trim(),
			checked: item.checked,
		}))
		.filter((item) => item.name.length > 0);
};

export const getStoredShoppingList = async (): Promise<ShoppingListItem[]> => {
	if (Platform.OS === "web") {
		return readFromWeb() ?? [];
	}
	try {
		const raw = await AsyncStorage.getItem(SHOPPING_LIST_STORAGE_KEY);
		if (!raw) return [];
		return parseItems(JSON.parse(raw));
	} catch {
		return [];
	}
};

export const setStoredShoppingList = async (
	items: ShoppingListItem[],
): Promise<void> => {
	if (Platform.OS === "web") {
		writeToWeb(items);
		return;
	}
	try {
		await AsyncStorage.setItem(
			SHOPPING_LIST_STORAGE_KEY,
			JSON.stringify(items),
		);
	} catch {
		/* native module missing */
	}
};
