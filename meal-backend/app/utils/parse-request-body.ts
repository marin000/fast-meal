import type {
	GenerateRecipeRequestBody,
	RecipeImageMimeType,
	RecipeImagePayload,
} from "@/app/interface";
import { isAppLanguage, isStringArray, isUnitsValue } from "./helper";

const ALLOWED_IMAGE_MIME_TYPES: RecipeImageMimeType[] = [
	"image/jpeg",
	"image/png",
	"image/webp",
];

const MAX_IMAGE_BASE64_LENGTH = 4 * 1024 * 1024;

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

export const parseRequestBody = (
	body: unknown,
): GenerateRecipeRequestBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const {
		deviceId,
		ingredients,
		preferences,
		units,
		language,
		retryAttempt,
		image,
	} = body as Partial<GenerateRecipeRequestBody> & { image?: unknown };

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (deviceId.trim().length > 200) return null;

	if (!isStringArray(ingredients)) return null;

	const parsedImage =
		image === undefined ? undefined : parseImagePayload(image);
	if (image !== undefined && !parsedImage) return null;

	if (ingredients.length === 0 && !parsedImage) return null;

	const parsedRetryAttempt =
		typeof retryAttempt === "number" &&
		Number.isInteger(retryAttempt) &&
		retryAttempt >= 1 &&
		retryAttempt <= 10
			? retryAttempt
			: 1;

	return {
		deviceId: deviceId.trim(),
		ingredients,
		preferences: isStringArray(preferences) ? preferences : [],
		units: isUnitsValue(units) ? units : "metric",
		language: isAppLanguage(language) ? language : "en",
		retryAttempt: parsedRetryAttempt,
		...(parsedImage ? { image: parsedImage } : {}),
	};
};
