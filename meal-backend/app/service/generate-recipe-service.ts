import crypto from "node:crypto";
import { MODEL, PROMPT_VERSION } from "@/app/constants/openAI";
import {
	normalizeRecipe,
	normalizeStringList,
	stripCodeFences,
} from "@/app/utils";
import type { GenerateRecipeResponse } from "../interface";

const buildCacheKey = ({
	ingredients,
	preferences,
	units,
	language,
}: {
	ingredients: string[];
	preferences: string[];
	units: "metric" | "imperial";
	language: "en" | "hr";
}): string => {
	const normalizedPayload = {
		ingredients: normalizeStringList(ingredients),
		preferences: normalizeStringList(preferences),
		units,
		language,
		model: MODEL,
		promptVersion: PROMPT_VERSION,
	};

	const payloadHash = crypto
		.createHash("sha256")
		.update(JSON.stringify(normalizedPayload))
		.digest("hex");

	return `recipe:${payloadHash}`;
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

export const generateRecipeService = {
	buildCacheKey,
	extractRecipesFromOpenAiResponse,
};
