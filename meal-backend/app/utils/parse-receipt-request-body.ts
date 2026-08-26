import { MAX_IMAGE_BASE64_LENGTH } from "@/app/constants/device";
import type {
	ParseReceiptRequestBody,
	RecipeImageMimeType,
	RecipeImagePayload,
} from "@/app/interface";
import { isAppLanguage } from "@/app/utils/helper";
import { ERROR_MESSAGES } from "@/constants/messages";

const ALLOWED_IMAGE_MIME_TYPES: RecipeImageMimeType[] = [
	"image/jpeg",
	"image/png",
	"image/webp",
];

const parseImagePayload = (value: unknown): RecipeImagePayload | null => {
	if (typeof value !== "object" || value === null) return null;

	const { base64, mimeType } = value as Partial<RecipeImagePayload>;
	if (typeof base64 !== "string" || base64.trim().length === 0) return null;
	if (base64.length > MAX_IMAGE_BASE64_LENGTH) return null;
	if (
		typeof mimeType !== "string" ||
		!ALLOWED_IMAGE_MIME_TYPES.includes(mimeType as RecipeImageMimeType)
	) {
		return null;
	}

	return {
		base64: base64.trim(),
		mimeType: mimeType as RecipeImageMimeType,
	};
};

export const hasReceiptImageField = (body: unknown): boolean =>
	typeof body === "object" &&
	body !== null &&
	"image" in body &&
	(body as { image?: unknown }).image !== undefined;

export const buildParseReceiptInvalidBodyResponse = (
	body: unknown,
): Response => {
	const hasImage = hasReceiptImageField(body);

	return Response.json(
		{
			error: hasImage
				? ERROR_MESSAGES.PARSE_RECEIPT_INVALID_IMAGE
				: ERROR_MESSAGES.PARSE_RECEIPT_INVALID_REQUEST_BODY,
			code: "INVALID_IMAGE",
		},
		{ status: 400 },
	);
};

export const parseReceiptRequestBody = (
	body: unknown,
): ParseReceiptRequestBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const { deviceId, language, image } =
		body as Partial<ParseReceiptRequestBody> & {
			image?: unknown;
		};

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (deviceId.trim().length > 200) return null;

	const parsedImage = parseImagePayload(image);
	if (!parsedImage) return null;

	return {
		deviceId: deviceId.trim(),
		language: isAppLanguage(language) ? language : "en",
		image: parsedImage,
	};
};
