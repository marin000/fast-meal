import type { ReceiptProductUnit } from "@/constants/receipt-product";

export interface ReceiptProduct {
	name: string;
	quantity: number | null;
	unit: ReceiptProductUnit;
	confidence: number;
}

export interface ParseReceiptResponse {
	products: ReceiptProduct[];
	partial: boolean;
}

export interface ReceiptProductDraft {
	localId: string;
	name: string;
	quantity: number | null;
	unit: ReceiptProductUnit;
	confidence: number;
	isSelected: boolean;
	expirationDate?: string;
}

export type ParseReceiptErrorCode =
	| "INVALID_IMAGE"
	| "UNREADABLE_RECEIPT"
	| "NO_PRODUCTS_FOUND"
	| "INVALID_AI_RESPONSE"
	| "DAILY_RECEIPT_SCAN_LIMIT"
	| "PARSE_TIMEOUT"
	| "NETWORK";
