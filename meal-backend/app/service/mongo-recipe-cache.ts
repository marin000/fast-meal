import { MODEL, PROMPT_VERSION } from "@/app/constants/openAI";
import type { Recipe } from "@/app/interface";
import { connectMongo } from "@/app/service/mongodb";
import { RecipeCache } from "@/models";

export const getPersistedRecipesByCacheKey = async (
	cacheKey: string,
): Promise<Recipe[] | null> => {
	await connectMongo();
	const doc = await RecipeCache.findOne({ cacheKey }).lean();
	if (!doc || !Array.isArray(doc.recipes) || doc.recipes.length === 0) {
		return null;
	}
	return doc.recipes as Recipe[];
};

export const upsertRecipeCacheEntry = async (
	cacheKey: string,
	recipes: Recipe[],
): Promise<void> => {
	if (recipes.length === 0) return;

	await connectMongo();
	await RecipeCache.findOneAndUpdate(
		{ cacheKey },
		{
			$set: {
				recipes,
				promptVersion: PROMPT_VERSION,
				modelVersion: MODEL,
			},
		},
		{ upsert: true },
	);
};
