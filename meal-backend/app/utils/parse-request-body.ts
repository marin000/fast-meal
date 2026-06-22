import type { GenerateRecipeRequestBody } from "@/app/interface";
import { isAppLanguage, isStringArray, isUnitsValue } from "./helper";

export const parseRequestBody = (
	body: unknown,
): GenerateRecipeRequestBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const { deviceId, ingredients, preferences, units, language, retryAttempt } =
		body as Partial<GenerateRecipeRequestBody>;

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (deviceId.trim().length > 200) return null;

	if (!isStringArray(ingredients) || ingredients.length === 0) return null;

	const parsedRetryAttempt =
		typeof retryAttempt === "number" &&
		Number.isInteger(retryAttempt) &&
		retryAttempt >= 1 &&
		retryAttempt <= 10
			? retryAttempt
			: 1;

	return {
		deviceId: deviceId.trim(),
		ingredients,
		preferences: isStringArray(preferences) ? preferences : [],
		units: isUnitsValue(units) ? units : "metric",
		language: isAppLanguage(language) ? language : "en",
		retryAttempt: parsedRetryAttempt,
	};
};
