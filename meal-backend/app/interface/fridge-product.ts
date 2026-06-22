import type mongoose from "mongoose";

export const FRIDGE_PRODUCT_UNITS = [
	"g",
	"ml",
	"pc",
	"oz",
	"cup",
	"tbsp",
] as const;

export type FridgeProductUnit = (typeof FRIDGE_PRODUCT_UNITS)[number];

export interface CreateFridgeProductRequestBody {
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
}

export interface FridgeProductListItem {
	id: string;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	createdAt: string;
	updatedAt: string;
}

export type FridgeProductDoc = {
	_id: mongoose.Types.ObjectId;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: string;
	expirationDate?: Date;
	purchasedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
};
