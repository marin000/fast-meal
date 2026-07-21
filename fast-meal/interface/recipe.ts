import type { QuickFilterOption } from "@/constants/home";
import type { AppLanguage } from "@/constants/settings";

export type DisplayUnits = "metric" | "imperial";

export type RecipeImageMimeType = "image/jpeg" | "image/png" | "image/webp";

export interface RecipeImagePayload {
	base64: string;
	mimeType: RecipeImageMimeType;
}

export interface GenerateRecipeInput {
	deviceId: string;
	ingredientsInput: string;
	selectedFilters: readonly QuickFilterOption[];
	units: DisplayUnits;
	language: AppLanguage;
	retryAttempt?: number;
	image?: RecipeImagePayload;
}

export interface GenerateRecipeRequestBody {
	deviceId: string;
	ingredients: string[];
	preferences: QuickFilterOption[];
	units: DisplayUnits;
	language: AppLanguage;
	retryAttempt?: number;
	image?: RecipeImagePayload;
}

export interface RecipeIngredient {
	name: string;
	quantity: number;
	unit: string;
}

export interface RecipeMacros {
	calories: number;
	protein: number;
	carbs: number;
	fat: number;
}

export interface RecipeSubstitution {
	ingredient: string;
	alternatives: string[];
}

export type RecipeDifficulty = "easy" | "medium" | "hard";

export interface Recipe {
	title: string;
	description: string;
	prepTimeMinutes: number;
	difficulty: RecipeDifficulty;
	servings: number;
	ingredients: RecipeIngredient[];
	steps: string[];
	macros: RecipeMacros;
	tags: string[];
	substitutions: RecipeSubstitution[];
	tips: string[];
	warnings: string[];
}

export interface GenerateRecipeResponse {
	recipes: Recipe[];
	cacheKey?: string;
	declined?: boolean;
	message?: string;
}

export interface SavedRecipeListItem {
	id: string;
	deviceId: string;
	cacheKey?: string;
	recipe: Recipe;
	createdAt: string;
}
