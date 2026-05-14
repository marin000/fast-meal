import type { Recipe } from "@/interface";
import type { SavedRecipeListItem } from "@/interface/recipe";
import { formatApiErrorBody } from "@/utils/api-error-text";

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/recipes`;

export const fetchSavedRecipes = async (
	deviceId: string,
): Promise<SavedRecipeListItem[]> => {
	const params = new URLSearchParams({ deviceId });
	const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to load saved recipes (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as {
		savedRecipes?: SavedRecipeListItem[];
	};
	return Array.isArray(data.savedRecipes) ? data.savedRecipes : [];
};

export const saveRecipeToBackend = async (params: {
	deviceId: string;
	recipe: Recipe;
	cacheKey?: string;
}): Promise<string> => {
	const response = await fetch(`${apiEndpoint}`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			deviceId: params.deviceId,
			recipe: params.recipe,
			...(params.cacheKey ? { cacheKey: params.cacheKey } : {}),
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Save recipe failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as { id?: string };
	if (typeof data.id !== "string") {
		throw new Error("Save recipe response missing id");
	}
	return data.id;
};

export const deleteSavedRecipeOnBackend = async (
	deviceId: string,
	savedRecipeId: string,
): Promise<void> => {
	const params = new URLSearchParams({ deviceId, id: savedRecipeId });
	const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Delete recipe failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}
};
