import mongoose, { Schema } from "mongoose";

const recipeCacheSchema = new Schema(
	{
		cacheKey: { type: String, required: true, unique: true, index: true },
		recipes: { type: [Schema.Types.Mixed], required: true },
		promptVersion: { type: String, required: true },
		modelVersion: { type: String, required: true },
	},
	{ timestamps: true, collection: "recipe_cache" },
);

export const RecipeCache =
	mongoose.models.RecipeCache ??
	mongoose.model("RecipeCache", recipeCacheSchema);
