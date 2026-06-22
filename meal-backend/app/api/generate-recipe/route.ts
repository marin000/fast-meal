import { getCache } from "@vercel/functions";
import { config } from "@/app/config/config";
import {
	CACHE_TTL_SECONDS,
	MODEL,
	OPENAI_FETCH_TIMEOUT_MS,
	PROMPT_VERSION,
} from "@/app/constants/openAI";
import { deviceService } from "@/app/service/device";
import { generateRecipeService } from "@/app/service/generate-recipe-service";
import {
	getPersistedRecipesByCacheKey,
	upsertRecipeCacheEntry,
} from "@/app/service/mongo-recipe-cache";
import { connectMongo } from "@/app/service/mongodb";
import {
	buildMealGenerationPrompt,
	getRecipeCountMode,
	parseRequestBody,
} from "@/app/utils";
import { ERROR_LOG_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: Request) {
	const body = await req.json();
	const parsedBody = parseRequestBody(body);

	if (!parsedBody) {
		return Response.json(
			{ error: ERROR_MESSAGES.GENERATE_RECIPE_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId, ingredients, preferences, units, language, retryAttempt } =
		parsedBody;
	const recipeCountMode = getRecipeCountMode(retryAttempt ?? 1);

	await connectMongo();
	await deviceService.ensureDeviceRecord(deviceId);
	const remaining = await deviceService.getRemainingGenerationsToday(deviceId);
	if (remaining <= 0) {
		return Response.json(
			{
				error: ERROR_MESSAGES.DAILY_LIMIT_REACHED_TOMORROW,
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
		recipeCountMode,
	});
	const cachedRecipes = await cache.get(cacheKey);

	if (cachedRecipes) {
		const consumed = await deviceService.tryConsumeGeneration(deviceId);
		if (!consumed) {
			return Response.json(
				{
					error: ERROR_MESSAGES.DAILY_LIMIT_REACHED,
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
							error: ERROR_MESSAGES.DAILY_LIMIT_REACHED,
							code: "DAILY_LIMIT",
						},
						{ status: 429 },
					);
				}
				return Response.json({ recipes: persistedRecipes, cacheKey });
			}
		} catch {
			console.error(ERROR_LOG_MESSAGES.GENERATE_RECIPE_PERSISTED_GET_FAILED);
		}
	}

	const prompt = buildMealGenerationPrompt({
		ingredients,
		preferences,
		units,
		language,
		recipeCountMode,
	});

	let response: Response;
	try {
		response = await fetch(`${config.openAiApiBaseUrl}/v1/responses`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.openAiApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: MODEL,
				input: prompt,
			}),
			signal: AbortSignal.timeout(OPENAI_FETCH_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") {
			return Response.json(
				{
					error: ERROR_MESSAGES.GENERATION_TIMEOUT,
					code: "GENERATION_TIMEOUT",
				},
				{ status: 504 },
			);
		}
		throw error;
	}

	if (!response.ok) {
		return Response.json(
			{ error: ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT },
			{ status: 502 },
		);
	}

	const data = await response.json();

	try {
		const { recipes } =
			generateRecipeService.extractRecipesFromOpenAiResponse(data);
		if (recipes.length > 0) {
			const consumed = await deviceService.tryConsumeGeneration(deviceId);
			if (!consumed) {
				return Response.json(
					{
						error: ERROR_MESSAGES.DAILY_LIMIT_REACHED,
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
				console.error(ERROR_LOG_MESSAGES.GENERATE_RECIPE_CACHE_UPSERT_FAILED);
			}
		}
		return Response.json({ recipes, cacheKey });
	} catch (error) {
		const message =
			error instanceof Error
				? error.message
				: ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT;
		return Response.json({ error: message }, { status: 502 });
	}
}
