import { DailyLimitError } from "@/api/device";
import type {
	GenerateRecipeInput,
	GenerateRecipeRequestBody,
	GenerateRecipeResponse,
} from "@/interface";
import { formatApiErrorBody } from "@/utils/api-error-text";
import { parseIngredientsInput } from "@/utils/helper";

export { DailyLimitError } from "@/api/device";

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/generate-recipe`;

export const generateRecipe = async ({
	deviceId,
	ingredientsInput,
	selectedFilters,
	units,
	language,
}: GenerateRecipeInput): Promise<GenerateRecipeResponse> => {
	// await new Promise((resolve) => setTimeout(resolve, 2000));
	// return mockResponseFull;

	const requestBody: GenerateRecipeRequestBody = {
		deviceId,
		ingredients: parseIngredientsInput(ingredientsInput),
		preferences: [...selectedFilters],
		units,
		language,
	};

	const response = await fetch(`${apiEndpoint}`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(requestBody),
	});

	if (!response.ok) {
		const errorText = await response.text();
		if (response.status === 429) {
			let message: string = errorText;
			try {
				const parsed = JSON.parse(errorText) as { error?: string };
				if (typeof parsed.error === "string") {
					message = parsed.error;
				}
			} catch {
				console.error(`Invalid JSON from server: ${errorText}`);
			}
			throw new DailyLimitError(message);
		}
		throw new Error(
			`Recipe generation failed (${response.status}): ${formatApiErrorBody(response.status, errorText)}`,
		);
	}

	const text = await response.text();

	try {
		return JSON.parse(text) as GenerateRecipeResponse;
	} catch {
		throw new Error(
			`Invalid JSON from server (first 200 chars): ${text.slice(0, 200)}`,
		);
	}
};
