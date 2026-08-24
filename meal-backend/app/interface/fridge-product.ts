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
	barcode?: string;
}

export interface FridgeProductListItem {
	id: string;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	barcode?: string;
	createdAt: string;
	updatedAt: string;
}

export type FridgeProductDoc = {
	_id: mongoose.Types.ObjectId;
	householdId?: string;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: string;
	expirationDate?: Date;
	purchasedAt?: Date;
	barcode?: string;
	createdAt: Date;
	updatedAt: Date;
};
