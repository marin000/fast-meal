import { DailyLimitError } from "@/api/device";
import type { IngredientImageMimeType } from "@/constants/ingredient-image";
import type {
	ParseReceiptErrorCode,
	ParseReceiptResponse,
} from "@/interface/receipt-product";
import { formatApiErrorBody } from "@/utils/api-error-text";

export { DailyLimitError };

export class ParseReceiptError extends Error {
	code: ParseReceiptErrorCode;

	constructor(code: ParseReceiptErrorCode, message: string) {
		super(message);
		this.name = "ParseReceiptError";
		this.code = code;
	}
}

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/parse-receipt`;

const parseErrorCode = (
	status: number,
	body: string,
): ParseReceiptErrorCode => {
	try {
		const parsed = JSON.parse(body) as { code?: string };
		switch (parsed.code) {
			case "INVALID_IMAGE":
			case "UNREADABLE_RECEIPT":
			case "NO_PRODUCTS_FOUND":
			case "INVALID_AI_RESPONSE":
			case "DAILY_RECEIPT_SCAN_LIMIT":
			case "PARSE_TIMEOUT":
				return parsed.code;
			default:
				break;
		}
	} catch {
		// fall through
	}

	if (status === 429) return "DAILY_RECEIPT_SCAN_LIMIT";
	if (status === 504) return "PARSE_TIMEOUT";
	if (status === 400) return "INVALID_IMAGE";
	return "INVALID_AI_RESPONSE";
};

export const parseReceipt = async (params: {
	deviceId: string;
	language: "en" | "hr";
	image: { base64: string; mimeType: IngredientImageMimeType };
}): Promise<ParseReceiptResponse> => {
	let response: Response;
	try {
		response = await fetch(apiEndpoint, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				deviceId: params.deviceId,
				language: params.language,
				image: {
					base64: params.image.base64,
					mimeType: params.image.mimeType,
				},
			}),
		});
	} catch {
		throw new ParseReceiptError(
			"NETWORK",
			"Something went wrong while reading the receipt. Try again.",
		);
	}

	if (!response.ok) {
		const text = await response.text();
		const code = parseErrorCode(response.status, text);

		if (code === "DAILY_RECEIPT_SCAN_LIMIT") {
			throw new DailyLimitError(
				formatApiErrorBody(response.status, text) ||
					"Daily receipt scan limit reached.",
			);
		}

		throw new ParseReceiptError(
			code,
			formatApiErrorBody(response.status, text) ||
				"Something went wrong while reading the receipt. Try again.",
		);
	}

	const data = (await response.json()) as Partial<ParseReceiptResponse>;
	if (!Array.isArray(data.products)) {
		throw new ParseReceiptError(
			"INVALID_AI_RESPONSE",
			"Something went wrong while reading the receipt. Try again.",
		);
	}

	return {
		products: data.products,
		partial: data.partial === true,
	};
};
