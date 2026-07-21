import * as ImageManipulator from "expo-image-manipulator";
import type { ImagePickerAsset } from "expo-image-picker";

import {
	INGREDIENT_IMAGE_JPEG_QUALITY,
	INGREDIENT_IMAGE_MAX_EDGE_PX,
	INGREDIENT_IMAGE_MAX_RAW_BYTES,
	type IngredientImageErrorCode,
	type IngredientImagePayload,
} from "@/constants/ingredient-image";

const ALLOWED_SOURCE_MIME_TYPES = new Set<string>([
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	"image/heic",
	"image/heif",
]);

const isAllowedSourceMime = (mimeType: string | undefined | null): boolean => {
	if (!mimeType) return false;
	return ALLOWED_SOURCE_MIME_TYPES.has(mimeType.toLowerCase().trim());
};

const isAllowedSourceUri = (uri: string): boolean => {
	const lower = uri.toLowerCase().split("?")[0] ?? "";
	return (
		lower.endsWith(".jpg") ||
		lower.endsWith(".jpeg") ||
		lower.endsWith(".png") ||
		lower.endsWith(".webp") ||
		lower.endsWith(".heic") ||
		lower.endsWith(".heif")
	);
};

export const validateIngredientImageAsset = (
	asset: ImagePickerAsset,
): IngredientImageErrorCode | null => {
	const hasAllowedType =
		isAllowedSourceMime(asset.mimeType) || isAllowedSourceUri(asset.uri);
	if (!hasAllowedType) return "unsupportedType";

	if (
		typeof asset.fileSize === "number" &&
		asset.fileSize > INGREDIENT_IMAGE_MAX_RAW_BYTES
	) {
		return "tooLarge";
	}

	return null;
};

const resizeActions = (
	width: number | undefined,
	height: number | undefined,
): ImageManipulator.Action[] => {
	if (!width || !height) {
		return [
			{
				resize: {
					width: INGREDIENT_IMAGE_MAX_EDGE_PX,
				},
			},
		];
	}

	const longestEdge = Math.max(width, height);
	if (longestEdge <= INGREDIENT_IMAGE_MAX_EDGE_PX) {
		return [];
	}

	if (width >= height) {
		return [{ resize: { width: INGREDIENT_IMAGE_MAX_EDGE_PX } }];
	}

	return [{ resize: { height: INGREDIENT_IMAGE_MAX_EDGE_PX } }];
};

export const processIngredientImageAsset = async (
	asset: ImagePickerAsset,
): Promise<
	| { ok: true; payload: IngredientImagePayload }
	| { ok: false; error: IngredientImageErrorCode }
> => {
	const validationError = validateIngredientImageAsset(asset);
	if (validationError) {
		return { ok: false, error: validationError };
	}

	try {
		const manipulated = await ImageManipulator.manipulateAsync(
			asset.uri,
			resizeActions(asset.width, asset.height),
			{
				compress: INGREDIENT_IMAGE_JPEG_QUALITY,
				format: ImageManipulator.SaveFormat.JPEG,
				base64: true,
			},
		);

		if (!manipulated.base64) {
			return { ok: false, error: "processingFailed" };
		}

		return {
			ok: true,
			payload: {
				base64: manipulated.base64,
				mimeType: "image/jpeg",
				previewUri: manipulated.uri,
			},
		};
	} catch {
		return { ok: false, error: "processingFailed" };
	}
};
