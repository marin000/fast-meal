import type mongoose from "mongoose";

export interface ShoppingListItemResponse {
	id: string;
	name: string;
	checked: boolean;
	createdAt: string;
	updatedAt: string;
}

export type ShoppingListItemDoc = {
	_id: mongoose.Types.ObjectId;
	householdId: string;
	name: string;
	checked: boolean;
	createdAt: Date;
	updatedAt: Date;
};
