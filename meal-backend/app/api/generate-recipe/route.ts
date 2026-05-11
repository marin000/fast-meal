import fs from "node:fs";
import path from "node:path";

import { getCache } from "@vercel/functions";
import { config } from "@/app/config/config";
import {
	CACHE_TTL_SECONDS,
	MODEL,
	PROMPT_VERSION,
} from "@/app/constants/openAI";
import { generateRecipeService } from "@/app/service/generate-recipe-service";
import {
	getPersistedRecipesByCacheKey,
	upsertRecipeCacheEntry,
} from "@/app/service/mongo-recipe-cache";
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
					"Invalid request body. Expected { ingredients: string[], preferences?: string[], units?: 'metric' | 'imperial' }",
			},
			{ status: 400 },
		);
	}

	const { ingredients, preferences, units } = parsedBody;
	const cache = getCache();
	const cacheKey = generateRecipeService.buildCacheKey({
		ingredients,
		preferences,
		units,
	});
	const cachedRecipes = await cache.get(cacheKey);

	if (cachedRecipes) {
		return Response.json({ recipes: cachedRecipes });
	}

	if (process.env.MONGODB_URI) {
		try {
			const persistedRecipes = await getPersistedRecipesByCacheKey(cacheKey);
			if (persistedRecipes && persistedRecipes.length > 0) {
				await cache.set(cacheKey, persistedRecipes, {
					ttl: CACHE_TTL_SECONDS,
					tags: ["recipes", `prompt:${PROMPT_VERSION}`],
				});
				return Response.json({ recipes: persistedRecipes });
			}
		} catch {
			console.error("Failed to get persisted recipes from MongoDB");
		}
	}

	const prompt = `${mealPromptBase.trim()}

    User ingredients: ${JSON.stringify(ingredients, null, 2)}
    User preferences / filters: ${JSON.stringify(preferences, null, 2)}
    User units preference: ${JSON.stringify(units)}`;

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
		return Response.json({ recipes });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to parse model output";
		return Response.json({ error: message }, { status: 502 });
	}
}
