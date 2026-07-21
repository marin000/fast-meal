import fs from "node:fs";
import path from "node:path";
import {
	CROATIAN_LANGUAGE_LABEL,
	ENGLISH_LANGUAGE_LABEL,
	RECIPE_REDUCED,
	RECIPE_REDUCED_COUNT,
	RECIPE_STANDARD,
	RECIPE_STANDARD_COUNT,
} from "@/app/constants/openAI";
import type { GenerateRecipeRequestBody } from "@/app/interface";

const mealPromptTemplate = fs.readFileSync(
	path.join(process.cwd(), "app/prompts/meal-prompt.txt"),
	"utf-8",
);

export type RecipeCountMode = typeof RECIPE_STANDARD | typeof RECIPE_REDUCED;

type MealPromptInput = Pick<
	GenerateRecipeRequestBody,
	"ingredients" | "preferences" | "units" | "language"
> & {
	recipeCountMode: RecipeCountMode;
	hasImage?: boolean;
};

const RECIPE_COUNT_LABELS: Record<RecipeCountMode, string> = {
	standard: RECIPE_STANDARD_COUNT,
	reduced: RECIPE_REDUCED_COUNT,
};

const getRecipeLanguageLabel = (
	language: GenerateRecipeRequestBody["language"],
): string =>
	language === "hr" ? CROATIAN_LANGUAGE_LABEL : ENGLISH_LANGUAGE_LABEL;

export const getRecipeCountMode = (retryAttempt: number): RecipeCountMode =>
	retryAttempt >= 2 ? RECIPE_REDUCED : RECIPE_STANDARD;

export const buildMealGenerationPrompt = ({
	ingredients,
	preferences,
	units,
	language,
	recipeCountMode,
	hasImage = false,
}: MealPromptInput): string => {
	const recipeLanguageLabel = getRecipeLanguageLabel(language);
	const recipeCountRange = RECIPE_COUNT_LABELS[recipeCountMode];

	const mealPromptBase = mealPromptTemplate.replaceAll(
		"{{recipeCountRange}}",
		recipeCountRange,
	);

	const imageNote = hasImage
		? "\n    An image of ingredients / fridge / pantry was provided with this request. Use it as described in the Image input rules."
		: "";

	return `${mealPromptBase.trim()}

    User ingredients: ${JSON.stringify(ingredients, null, 2)}
    User preferences / filters: ${JSON.stringify(preferences, null, 2)}
    User units preference: ${JSON.stringify(units)}
    User interface language: ${JSON.stringify(language)} (${recipeLanguageLabel}). Use this as the recipe language (overrides ingredient-list detection).${imageNote}`;
};
