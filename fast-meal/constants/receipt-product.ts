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

export const RECEIPT_CONFIDENCE_HIGH = 0.9;
export const RECEIPT_CONFIDENCE_REVIEW = 0.7;

export const isReceiptProductUnit = (
	value: string,
): value is ReceiptProductUnit =>
	(RECEIPT_PRODUCT_UNITS as readonly string[]).includes(value);

export const SCAN_RECEIPT_STEPS = {
	CAPTURE: "capture",
	PROCESSING: "processing",
	RESULTS: "results",
} as const;
