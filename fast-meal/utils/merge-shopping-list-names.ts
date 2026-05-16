import type { Recipe } from "@/interface/recipe";
import type { ShoppingListItem } from "@/interface/shopping-list";

const normalizeName = (name: string): string => name.trim().toLowerCase();

const createId = (): string =>
	globalThis.crypto?.randomUUID?.() ??
	`shop-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

export const mergeRecipeIngredientsIntoList = (
	current: readonly ShoppingListItem[],
	recipe: Recipe,
): { items: ShoppingListItem[]; addedCount: number } => {
	const existing = new Set(current.map((item) => normalizeName(item.name)));
	const toAdd: ShoppingListItem[] = [];

	for (const ingredient of recipe.ingredients) {
		const name = ingredient.name.trim();
		if (!name) continue;
		const key = normalizeName(name);
		if (existing.has(key)) continue;
		existing.add(key);
		toAdd.push({ id: createId(), name, checked: false });
	}

	return {
		items: [...current, ...toAdd],
		addedCount: toAdd.length,
	};
};
