import {
	RECEIPT_PRODUCT_UNITS,
	type ReceiptProduct,
	type ReceiptProductUnit,
} from "@/app/interface";
import { asRecord, stripCodeFences } from "@/app/utils/helper";
import { ERROR_MESSAGES } from "@/constants/messages";

const MAX_PRODUCTS = 50;
const MAX_NAME_LENGTH = 120;
const DEFAULT_CONFIDENCE = 0.5;

interface OpenAiResponseEnvelope {
	output?: Array<{
		content?: Array<{ text?: string }>;
	}>;
}

interface ParsedReceiptPayload {
	products: ReceiptProduct[];
	partial: boolean;
	unreadable: boolean;
}

const isReceiptUnit = (value: unknown): value is ReceiptProductUnit =>
	typeof value === "string" &&
	(RECEIPT_PRODUCT_UNITS as readonly string[]).includes(value);

const clampConfidence = (value: number): number =>
	Math.min(1, Math.max(0, value));

const parseQuantity = (value: unknown): number | null => {
	if (value === null || value === undefined) return null;
	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
		return null;
	}
	return value;
};

const parseProduct = (
	value: unknown,
): { product: ReceiptProduct; usedDefaultConfidence: boolean } | null => {
	const record = asRecord(value);
	if (!record) return null;

	if (typeof record.name !== "string") return null;
	const name = record.name.trim().slice(0, MAX_NAME_LENGTH);
	if (name.length === 0) return null;

	if (!isReceiptUnit(record.unit)) return null;

	let usedDefaultConfidence = false;
	let confidence = DEFAULT_CONFIDENCE;
	if (
		typeof record.confidence === "number" &&
		Number.isFinite(record.confidence)
	) {
		confidence = clampConfidence(record.confidence);
	} else {
		usedDefaultConfidence = true;
	}

	return {
		product: {
			name,
			quantity: parseQuantity(record.quantity),
			unit: record.unit,
			confidence,
		},
		usedDefaultConfidence,
	};
};

export const parseReceiptAiJson = (rawText: string): ParsedReceiptPayload => {
	const cleaned = stripCodeFences(rawText);
	let parsed: unknown;
	try {
		parsed = JSON.parse(cleaned);
	} catch {
		throw new Error(ERROR_MESSAGES.PARSE_RECEIPT_INVALID_AI_RESPONSE);
	}

	const record = asRecord(parsed);
	if (!record || !Array.isArray(record.products)) {
		throw new Error(ERROR_MESSAGES.PARSE_RECEIPT_INVALID_AI_RESPONSE);
	}

	const products: ReceiptProduct[] = [];
	let defaultConfidenceCount = 0;

	for (const item of record.products.slice(0, MAX_PRODUCTS)) {
		const parsedProduct = parseProduct(item);
		if (!parsedProduct) continue;
		if (parsedProduct.usedDefaultConfidence) defaultConfidenceCount += 1;
		products.push(parsedProduct.product);
	}

	if (defaultConfidenceCount > 0) {
		console.warn(
			`[parse-receipt] ${defaultConfidenceCount} product(s) missing confidence; defaulted to ${DEFAULT_CONFIDENCE}`,
		);
	}

	return {
		products,
		partial: record.partial === true,
		unreadable: record.unreadable === true,
	};
};

export const extractReceiptTextFromOpenAiResponse = (data: unknown): string => {
	const envelope = data as OpenAiResponseEnvelope;
	const text = envelope.output?.[0]?.content?.[0]?.text;

	if (typeof text !== "string" || text.trim().length === 0) {
		throw new Error(ERROR_MESSAGES.OPENAI_MISSING_OUTPUT_TEXT);
	}

	return text;
};
