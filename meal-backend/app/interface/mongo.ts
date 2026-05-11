import type { Recipe } from "./recipe";

export interface SaveRecipeRequestBody {
	deviceId: string;
	recipe: unknown;
	cacheKey?: string;
}

export interface SavedRecipeListItem {
	id: string;
	deviceId: string;
	cacheKey?: string;
	recipe: Recipe;
	createdAt: string;
}
