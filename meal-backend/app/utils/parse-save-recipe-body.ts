import type { SaveRecipeRequestBody } from "@/app/interface";

export const parseSaveRecipeBody = (
	body: unknown,
): SaveRecipeRequestBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const { deviceId, recipe, cacheKey } = body as Partial<SaveRecipeRequestBody>;

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (recipe === undefined || recipe === null) return null;

	return {
		deviceId: deviceId.trim(),
		recipe,
		cacheKey:
			typeof cacheKey === "string" && cacheKey.trim().length > 0
				? cacheKey.trim()
				: undefined,
	};
};
