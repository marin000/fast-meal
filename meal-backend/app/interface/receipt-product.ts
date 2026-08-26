import type { RecipeImagePayload } from "./recipe";

export const RECEIPT_PRODUCT_UNITS = [
	"g",
	"kg",
	"ml",
	"L",
	"pcs",
	"package",
	"unknown",
] as const;

export type ReceiptProductUnit = (typeof RECEIPT_PRODUCT_UNITS)[number];

export interface ReceiptProduct {
	name: string;
	quantity: number | null;
	unit: ReceiptProductUnit;
	confidence: number;
}

export interface ParseReceiptRequestBody {
	deviceId: string;
	language: "en" | "hr";
	image: RecipeImagePayload;
}

export interface ParseReceiptResponse {
	products: ReceiptProduct[];
	partial: boolean;
}

export type ParseReceiptErrorCode =
	| "INVALID_IMAGE"
	| "UNREADABLE_RECEIPT"
	| "NO_PRODUCTS_FOUND"
	| "INVALID_AI_RESPONSE"
	| "DAILY_RECEIPT_SCAN_LIMIT"
	| "PARSE_TIMEOUT";
