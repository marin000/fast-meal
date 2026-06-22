import fs from "node:fs";
import path from "node:path";

import type { GenerateRecipeRequestBody } from "@/app/interface";

const mealPromptBase = fs.readFileSync(
	path.join(process.cwd(), "app/prompts/meal-prompt.txt"),
	"utf-8",
);

type MealPromptInput = Pick<
	GenerateRecipeRequestBody,
	"ingredients" | "preferences" | "units" | "language"
>;

const getRecipeLanguageLabel = (
	language: GenerateRecipeRequestBody["language"],
): string => (language === "hr" ? "Croatian (hr)" : "English (en)");

export const buildMealGenerationPrompt = ({
	ingredients,
	preferences,
	units,
	language,
}: MealPromptInput): string => {
	const recipeLanguageLabel = getRecipeLanguageLabel(language);

	return `${mealPromptBase.trim()}

    User ingredients: ${JSON.stringify(ingredients, null, 2)}
    User preferences / filters: ${JSON.stringify(preferences, null, 2)}
    User units preference: ${JSON.stringify(units)}
    User interface language: ${JSON.stringify(language)} (${recipeLanguageLabel}). Use this as the recipe language (overrides ingredient-list detection).`;
};
