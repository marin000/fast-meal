import type { GenerateRecipeInput, GenerateRecipeRequestBody, GenerateRecipeResponse } from '@/interface';
import { parseIngredientsInput } from '@/utils/helper';
// import { mockResponseFull } from '@/mocks';

const rawBaseUrl = process.env.EXPO_PUBLIC_API_BASE_URL;

if (!rawBaseUrl) {
  throw new Error('Missing required environment variable: EXPO_PUBLIC_API_BASE_URL');
}

const apiBaseUrl = rawBaseUrl.replace(/\/+$/, '');

export const generateRecipe = async ({
  ingredientsInput,
  selectedFilters,
}: GenerateRecipeInput): Promise<GenerateRecipeResponse> => {
  // await new Promise((resolve) => setTimeout(resolve, 9000));
  // return mockResponseFull;

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

  const text = await response.text();

  try {
    return JSON.parse(text) as GenerateRecipeResponse;
  } catch {
    throw new Error(`Invalid JSON from server (first 200 chars): ${text.slice(0, 200)}`);
  }
};
