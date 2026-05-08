import type {
	GenerateRecipeRequestBody,
	GenerateRecipeResponse,
} from "@/app/interface";

import { normalizeRecipe } from "./normalize-recipe";

const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === "string");

const isUnitsValue = (value: unknown): value is "metric" | "imperial" =>
	value === "metric" || value === "imperial";

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

const stripCodeFences = (text: string): string => {
	const trimmed = text.trim();
	const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

	return fenceMatch ? fenceMatch[1].trim() : trimmed;
};

interface OpenAiResponseEnvelope {
	output?: Array<{
		content?: Array<{ text?: string }>;
	}>;
}

export const extractRecipesFromOpenAiResponse = (
	data: unknown,
): GenerateRecipeResponse => {
	const envelope = data as OpenAiResponseEnvelope;
	const text = envelope.output?.[0]?.content?.[0]?.text;

	if (typeof text !== "string") {
		throw new Error("Invalid OpenAI response: missing output text");
	}

	const cleaned = stripCodeFences(text);
	const parsed = JSON.parse(cleaned);

	if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.recipes)) {
		throw new Error("Invalid recipe JSON: missing recipes array");
	}

	const declined = parsed.declined === true;
	const message =
		typeof parsed.message === "string" ? parsed.message : undefined;

	if (declined) {
		return { recipes: [], declined: true, message };
	}

	return { recipes: parsed.recipes.map(normalizeRecipe) };
};
