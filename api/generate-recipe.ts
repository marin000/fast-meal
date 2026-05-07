import type { GenerateRecipeInput, GenerateRecipeRequestBody, GenerateRecipeResponse } from '@/interface';
import { parseIngredientsInput } from '@/utils/helper';

const apiBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!apiBaseUrl) {
  throw new Error('Missing required environment variable: EXPO_PUBLIC_API_BASE_URL');
}

export const generateRecipe = async ({
  ingredientsInput,
  selectedFilters,
}: GenerateRecipeInput): Promise<GenerateRecipeResponse> => {
  const requestBody: GenerateRecipeRequestBody = {
    ingredients: parseIngredientsInput(ingredientsInput),
    preferences: [...selectedFilters],
  };

  const response = await fetch(`${apiBaseUrl}/api/generate-recipe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Recipe generation failed (${response.status}): ${errorText}`);
  }

  return response.json() as Promise<GenerateRecipeResponse>;
};
