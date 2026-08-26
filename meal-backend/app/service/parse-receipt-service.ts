import type { ParseReceiptResponse } from "@/app/interface";
import {
	extractReceiptTextFromOpenAiResponse,
	parseReceiptAiJson,
} from "@/app/utils/parse-receipt-response";
import { ERROR_MESSAGES } from "@/constants/messages";

export class UnreadableReceiptError extends Error {
	constructor(message = ERROR_MESSAGES.PARSE_RECEIPT_UNREADABLE) {
		super(message);
		this.name = "UnreadableReceiptError";
	}
}

export class NoProductsFoundError extends Error {
	constructor(message = ERROR_MESSAGES.PARSE_RECEIPT_NO_PRODUCTS) {
		super(message);
		this.name = "NoProductsFoundError";
	}
}

export const parseReceiptService = {
	extractFromOpenAiResponse(data: unknown): ParseReceiptResponse {
		const text = extractReceiptTextFromOpenAiResponse(data);
		const { products, partial, unreadable } = parseReceiptAiJson(text);

		if (unreadable) throw new UnreadableReceiptError();
		if (products.length === 0) throw new NoProductsFoundError();

		return { products, partial };
	},
};
