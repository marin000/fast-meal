import mongoose, { Schema } from "mongoose";

const fridgeProductSchema = new Schema(
	{
		householdId: { type: String, index: true },
		deviceId: { type: String, required: true, index: true },
		name: { type: String, required: true, trim: true },
		quantity: { type: Number, min: 0 },
		unit: { type: String, trim: true },
		expirationDate: { type: Date },
		purchasedAt: { type: Date },
	},
	{ timestamps: true, collection: "fridge_products" },
);

export const FridgeProduct =
	mongoose.models.FridgeProduct ??
	mongoose.model("FridgeProduct", fridgeProductSchema);
