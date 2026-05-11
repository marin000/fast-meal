import mongoose, { Schema } from "mongoose";

const savedRecipeSchema = new Schema(
	{
		deviceId: { type: String, required: true, index: true },
		cacheKey: { type: String, index: true },
		recipe: { type: Schema.Types.Mixed, required: true },
	},
	{ timestamps: true, collection: "saved_recipes" },
);

export const SavedRecipe =
	mongoose.models.SavedRecipe ??
	mongoose.model("SavedRecipe", savedRecipeSchema);
