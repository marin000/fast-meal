import fs from "node:fs";
import path from "node:path";

import { getCache } from "@vercel/functions";
import { config } from "@/app/config/config";
import {
	CACHE_TTL_SECONDS,
	MODEL,
	PROMPT_VERSION,
} from "@/app/constants/openAI";
import { deviceService } from "@/app/service/device";
import { generateRecipeService } from "@/app/service/generate-recipe-service";
import {
	getPersistedRecipesByCacheKey,
	upsertRecipeCacheEntry,
} from "@/app/service/mongo-recipe-cache";
import { connectMongo } from "@/app/service/mongodb";
import { parseRequestBody } from "@/app/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const mealPromptBase = fs.readFileSync(
	path.join(process.cwd(), "app/prompts/meal-prompt.txt"),
	"utf-8",
);

export async function POST(req: Request) {
	const body = await req.json();
	const parsedBody = parseRequestBody(body);

	if (!parsedBody) {
		return Response.json(
			{
				error:
					"Invalid request body. Expected { deviceId: string, ingredients: string[], preferences?: string[], units?: 'metric' | 'imperial', language?: 'en' | 'hr' }",
			},
			{ status: 400 },
		);
	}

	const { deviceId, ingredients, preferences, units, language } = parsedBody;

	await connectMongo();
	await deviceService.ensureDeviceRecord(deviceId);
	const remaining = await deviceService.getRemainingGenerationsToday(deviceId);
	if (remaining <= 0) {
		return Response.json(
			{
				error: "Daily recipe generation limit reached. Try again tomorrow.",
				code: "DAILY_LIMIT",
			},
			{ status: 429 },
		);
	}

	const cache = getCache();
	const cacheKey = generateRecipeService.buildCacheKey({
		ingredients,
		preferences,
		units,
		language,
	});
	const cachedRecipes = await cache.get(cacheKey);

	if (cachedRecipes) {
		const consumed = await deviceService.tryConsumeGeneration(deviceId);
		if (!consumed) {
			return Response.json(
				{
					error: "Daily recipe generation limit reached.",
					code: "DAILY_LIMIT",
				},
				{ status: 429 },
			);
		}
		return Response.json({ recipes: cachedRecipes, cacheKey });
	}

	if (process.env.MONGODB_URI) {
		try {
			const persistedRecipes = await getPersistedRecipesByCacheKey(cacheKey);
			if (persistedRecipes && persistedRecipes.length > 0) {
				await cache.set(cacheKey, persistedRecipes, {
					ttl: CACHE_TTL_SECONDS,
					tags: ["recipes", `prompt:${PROMPT_VERSION}`],
				});
				const consumed = await deviceService.tryConsumeGeneration(deviceId);
				if (!consumed) {
					return Response.json(
						{
							error: "Daily recipe generation limit reached.",
							code: "DAILY_LIMIT",
						},
						{ status: 429 },
					);
				}
				return Response.json({ recipes: persistedRecipes, cacheKey });
			}
		} catch {
			console.error("Failed to get persisted recipes from MongoDB");
		}
	}

	const recipeLanguageLabel =
		language === "hr" ? "Croatian (hr)" : "English (en)";

	const prompt = `${mealPromptBase.trim()}

    User ingredients: ${JSON.stringify(ingredients, null, 2)}
    User preferences / filters: ${JSON.stringify(preferences, null, 2)}
    User units preference: ${JSON.stringify(units)}
    User interface language: ${JSON.stringify(language)} (${recipeLanguageLabel}). Use this as the recipe language (overrides ingredient-list detection).`;

	const response = await fetch(`${config.openAiApiBaseUrl}/v1/responses`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${config.openAiApiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: MODEL,
			input: prompt,
		}),
	});

	const data = await response.json();

	try {
		const { recipes } =
			generateRecipeService.extractRecipesFromOpenAiResponse(data);
		if (recipes.length > 0) {
			const consumed = await deviceService.tryConsumeGeneration(deviceId);
			if (!consumed) {
				return Response.json(
					{
						error: "Daily recipe generation limit reached.",
						code: "DAILY_LIMIT",
					},
					{ status: 429 },
				);
			}
		}
		await cache.set(cacheKey, recipes, {
			ttl: CACHE_TTL_SECONDS,
			tags: ["recipes", `prompt:${PROMPT_VERSION}`],
		});
		if (process.env.MONGODB_URI && recipes.length > 0) {
			try {
				await upsertRecipeCacheEntry(cacheKey, recipes);
			} catch {
				console.error("Failed to upsert recipe cache entry");
			}
		}
		return Response.json({ recipes, cacheKey });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to parse model output";
		return Response.json({ error: message }, { status: 502 });
	}
}
