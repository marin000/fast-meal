export const INGREDIENT_IMAGE_MAX_RAW_BYTES = 10 * 1024 * 1024;
export const INGREDIENT_IMAGE_MAX_EDGE_PX = 1280;
export const INGREDIENT_IMAGE_JPEG_QUALITY = 0.7;

export const INGREDIENT_IMAGE_ALLOWED_MIME_TYPES = [
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
] as const;

export type IngredientImageMimeType = "image/jpeg" | "image/png" | "image/webp";

export type IngredientImageErrorCode =
	| "unsupportedType"
	| "tooLarge"
	| "processingFailed"
	| "permissionDenied";

export interface IngredientImagePayload {
	base64: string;
	mimeType: IngredientImageMimeType;
	previewUri: string;
}
