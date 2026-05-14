import type {
	Recipe,
	RecipeIngredient,
	RecipeMacros,
	RecipeSubstitution,
} from "@/app/interface";

const toStringArray = (value: unknown): string[] => {
	if (!Array.isArray(value)) return [];
	return value.filter((item): item is string => typeof item === "string");
};

const toNumber = (value: unknown, fallback: number): number =>
	typeof value === "number" && Number.isFinite(value) ? value : fallback;

const toMacros = (value: unknown): RecipeMacros => {
	const macros = (
		value && typeof value === "object" ? value : {}
	) as Partial<RecipeMacros>;

	return {
		calories: toNumber(macros.calories, 0),
		protein: toNumber(macros.protein, 0),
		carbs: toNumber(macros.carbs, 0),
		fat: toNumber(macros.fat, 0),
	};
};

const toIngredients = (value: unknown): RecipeIngredient[] => {
	if (!Array.isArray(value)) return [];

	return value.map((item) => {
		const ingredient = (
			item && typeof item === "object" ? item : {}
		) as Partial<RecipeIngredient>;

		return {
			name: typeof ingredient.name === "string" ? ingredient.name : "",
			quantity: toNumber(ingredient.quantity, 0),
			unit: typeof ingredient.unit === "string" ? ingredient.unit : "",
		};
	});
};

const toSubstitutions = (value: unknown): RecipeSubstitution[] => {
	if (!Array.isArray(value)) return [];

	return value.map((item) => {
		const substitution = (
			item && typeof item === "object" ? item : {}
		) as Partial<RecipeSubstitution>;

		return {
			ingredient:
				typeof substitution.ingredient === "string"
					? substitution.ingredient
					: "",
			alternatives: toStringArray(substitution.alternatives),
		};
	});
};

export const normalizeRecipe = (input: unknown): Recipe => {
	const recipe = (
		input && typeof input === "object" ? input : {}
	) as Partial<Recipe>;

	return {
		title: typeof recipe.title === "string" ? recipe.title : "",
		description:
			typeof recipe.description === "string" ? recipe.description : "",
		prepTimeMinutes: toNumber(recipe.prepTimeMinutes, 0),
		difficulty:
			recipe.difficulty === "medium" || recipe.difficulty === "hard"
				? recipe.difficulty
				: "easy",
		servings: toNumber(recipe.servings, 1),
		ingredients: toIngredients(recipe.ingredients),
		steps: toStringArray(recipe.steps),
		macros: toMacros(recipe.macros),
		tags: toStringArray(recipe.tags),
		substitutions: toSubstitutions(recipe.substitutions),
		tips: toStringArray(recipe.tips),
		warnings: toStringArray(recipe.warnings),
	};
};
