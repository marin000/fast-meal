import mongoose, { Schema } from "mongoose";

const shoppingListItemSchema = new Schema(
	{
		householdId: { type: String, required: true, index: true },
		name: { type: String, required: true, trim: true },
		checked: { type: Boolean, default: false },
	},
	{ timestamps: true, collection: "shopping_list_items" },
);

export const ShoppingListItem =
	mongoose.models.ShoppingListItem ??
	mongoose.model("ShoppingListItem", shoppingListItemSchema);
