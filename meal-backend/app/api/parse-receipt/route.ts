import { config } from "@/app/config/config";
import { MODEL, OPENAI_FETCH_TIMEOUT_MS } from "@/app/constants/openAI";
import type { RecipeImagePayload } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { connectMongo } from "@/app/service/mongodb";
import {
	NoProductsFoundError,
	parseReceiptService,
	UnreadableReceiptError,
} from "@/app/service/parse-receipt-service";
import { buildReceiptParsePrompt } from "@/app/utils/build-receipt-parse-prompt";
import {
	captureApiError,
	captureApiMessage,
} from "@/app/utils/capture-api-error";
import {
	buildParseReceiptInvalidBodyResponse,
	parseReceiptRequestBody,
} from "@/app/utils/parse-receipt-request-body";
import { ERROR_MESSAGES } from "@/constants/messages";

export const runtime = "nodejs";
export const maxDuration = 60;

const buildOpenAiInput = (prompt: string, image: RecipeImagePayload) => [
	{
		role: "user",
		content: [
			{ type: "input_text", text: prompt },
			{
				type: "input_image",
				image_url: `data:${image.mimeType};base64,${image.base64}`,
			},
		],
	},
];

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY, code: "INVALID_IMAGE" },
			{ status: 400 },
		);
	}

	const parsedBody = parseReceiptRequestBody(body);
	if (!parsedBody) {
		return buildParseReceiptInvalidBodyResponse(body);
	}

	const { deviceId, language, image } = parsedBody;

	await connectMongo();
	await deviceService.ensureDeviceRecord(deviceId);

	const remaining = await deviceService.getRemainingReceiptScansToday(deviceId);
	if (remaining <= 0) {
		return Response.json(
			{
				error: ERROR_MESSAGES.DAILY_RECEIPT_SCAN_LIMIT,
				code: "DAILY_RECEIPT_SCAN_LIMIT",
			},
			{ status: 429 },
		);
	}

	const prompt = buildReceiptParsePrompt(language);

	let response: Response;
	try {
		response = await fetch(`${config.openAiApiBaseUrl}/v1/responses`, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${config.openAiApiKey}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				model: MODEL,
				input: buildOpenAiInput(prompt, image),
			}),
			signal: AbortSignal.timeout(OPENAI_FETCH_TIMEOUT_MS),
		});
	} catch (error) {
		if (error instanceof Error && error.name === "TimeoutError") {
			return Response.json(
				{
					error: ERROR_MESSAGES.PARSE_RECEIPT_TIMEOUT,
					code: "PARSE_TIMEOUT",
				},
				{ status: 504 },
			);
		}
		captureApiError(error, { feature: "parse_receipt", step: "openai_fetch" });
		throw error;
	}

	if (!response.ok) {
		captureApiMessage(ERROR_MESSAGES.FAILED_TO_PARSE_MODEL_OUTPUT, {
			feature: "parse_receipt",
			step: "openai_http",
			status: response.status,
		});
		return Response.json(
			{
				error: ERROR_MESSAGES.PARSE_RECEIPT_INVALID_AI_RESPONSE,
				code: "INVALID_AI_RESPONSE",
			},
			{ status: 422 },
		);
	}

	const data = await response.json();

	try {
		const result = parseReceiptService.extractFromOpenAiResponse(data);

		const consumed = await deviceService.tryConsumeReceiptScan(deviceId);
		if (!consumed) {
			return Response.json(
				{
					error: ERROR_MESSAGES.DAILY_RECEIPT_SCAN_LIMIT,
					code: "DAILY_RECEIPT_SCAN_LIMIT",
				},
				{ status: 429 },
			);
		}

		return Response.json(result);
	} catch (error) {
		if (error instanceof UnreadableReceiptError) {
			return Response.json(
				{
					error: ERROR_MESSAGES.PARSE_RECEIPT_UNREADABLE,
					code: "UNREADABLE_RECEIPT",
				},
				{ status: 422 },
			);
		}
		if (error instanceof NoProductsFoundError) {
			return Response.json(
				{
					error: ERROR_MESSAGES.PARSE_RECEIPT_NO_PRODUCTS,
					code: "NO_PRODUCTS_FOUND",
				},
				{ status: 422 },
			);
		}

		captureApiError(error, {
			feature: "parse_receipt",
			step: "parse_output",
		});
		return Response.json(
			{
				error: ERROR_MESSAGES.PARSE_RECEIPT_INVALID_AI_RESPONSE,
				code: "INVALID_AI_RESPONSE",
			},
			{ status: 422 },
		);
	}
}
