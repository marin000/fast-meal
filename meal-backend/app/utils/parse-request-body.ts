import type { GenerateRecipeRequestBody } from "@/app/interface";
import { isStringArray, isUnitsValue } from "./helper";

export const parseRequestBody = (
	body: unknown,
): GenerateRecipeRequestBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const { ingredients, preferences, units } =
		body as Partial<GenerateRecipeRequestBody>;

	if (!isStringArray(ingredients) || ingredients.length === 0) return null;

	return {
		ingredients,
		preferences: isStringArray(preferences) ? preferences : [],
		units: isUnitsValue(units) ? units : "metric",
	};
};
