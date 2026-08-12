import { getCache } from "@vercel/functions";
import { config } from "@/app/config/config";
import {
	CACHE_TTL_SECONDS,
	MODEL,
	OPENAI_FETCH_TIMEOUT_MS,
	PROMPT_VERSION,
} from "@/app/constants/openAI";
import type { RecipeImagePayload } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { generateRecipeService } from "@/app/service/generate-recipe-service";
import {
	getPersistedRecipesByCacheKey,
	upsertRecipeCacheEntry,
} from "@/app/service/mongo-recipe-cache";
import { connectMongo } from "@/app/service/mongodb";
import {
	buildMealGenerationPrompt,
	captureApiError,
	captureApiMessage,
	getRecipeCountMode,
	parseRequestBody,
} from "@/app/utils";
import { ERROR_LOG_MESSAGES, ERROR_MESSAGES } from "@/constants/messages";

export const runtime = "nodejs";
export const maxDuration = 60;

const buildOpenAiInput = (
	prompt: string,
	image: RecipeImagePayload | undefined,
) => {
	if (!image) {
		return prompt;
	}

	return [
		{
			role: "user",
			content: [
				{ type: "input_text", text: prompt },
				{
					type: "input_image",
					image_url: `data:${image.mimeType};base64,${image.base64}`,
				},
			],
		},
	];
};

export async function POST(req: Request) {
	const body = await req.json();
	const parsedBody = parseRequestBody(body);

	if (!parsedBody) {
		return Response.json(
			{ error: ERROR_MESSAGES.GENERATE_RECIPE_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const {
		deviceId,
		ingredients,
		preferences,
		units,
		language,
		retryAttempt,
		image,
	} = parsedBody;
	const hasImage = Boolean(image);
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

	if (!hasImage) {
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
			} catch (error) {
				console.error(ERROR_LOG_MESSAGES.GENERATE_RECIPE_PERSISTED_GET_FAILED);
				captureApiError(error, {
					feature: "generate_recipe",
					step: "persisted_get",
				});
			}
		}
	}

	const prompt = buildMealGenerationPrompt({
		ingredients,
		preferences,
		units,
		language,
		recipeCountMode,
		hasImage,
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
				input: buildOpenAiInput(prompt, image),
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
		captureApiError(error, { feature: "generate_recipe", step: "openai_fetch" });
		throw error;
	}

	if (!response.ok) {
		captureApiMessage(ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT, {
			feature: "generate_recipe",
			step: "openai_http",
			status: response.status,
		});
		return Response.json(
			{ error: ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT },
			{ status: 502 },
		);
	}

	const data = await response.json();

	try {
		const { recipes, declined, message } =
			generateRecipeService.extractRecipesFromOpenAiResponse(data);

		if (declined) {
			return Response.json({
				recipes: [],
				declined: true,
				...(typeof message === "string" ? { message } : {}),
			});
		}

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

		if (!hasImage) {
			await cache.set(cacheKey, recipes, {
				ttl: CACHE_TTL_SECONDS,
				tags: ["recipes", `prompt:${PROMPT_VERSION}`],
			});
			if (process.env.MONGODB_URI && recipes.length > 0) {
				try {
					await upsertRecipeCacheEntry(cacheKey, recipes);
				} catch (error) {
					console.error(ERROR_LOG_MESSAGES.GENERATE_RECIPE_CACHE_UPSERT_FAILED);
					captureApiError(error, {
						feature: "generate_recipe",
						step: "cache_upsert",
					});
				}
			}
		}

		return Response.json({
			recipes,
			...(hasImage ? {} : { cacheKey }),
		});
	} catch (error) {
		captureApiError(error, {
			feature: "generate_recipe",
			step: "parse_output",
		});
		const message =
			error instanceof Error
				? error.message
				: ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT;
		return Response.json({ error: message }, { status: 502 });
	}
}
