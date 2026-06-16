import mongoose, { Schema } from "mongoose";

const fridgeProductSchema = new Schema(
	{
		deviceId: { type: String, required: true, index: true },
		name: { type: String, required: true, trim: true },
		expirationDate: { type: Date },
		purchasedAt: { type: Date },
	},
	{ timestamps: true, collection: "fridge_products" },
);

export const FridgeProduct =
	mongoose.models.FridgeProduct ??
	mongoose.model("FridgeProduct", fridgeProductSchema);
