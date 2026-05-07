import type { QuickFilterOption } from '@/constants/home';

export interface GenerateRecipeInput {
  ingredientsInput: string;
  selectedFilters: readonly QuickFilterOption[];
}

export interface GenerateRecipeRequestBody {
  ingredients: string[];
  preferences: QuickFilterOption[];
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface RecipeMacros {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface RecipeSubstitution {
  ingredient: string;
  alternatives: string[];
}

export type RecipeDifficulty = 'easy' | 'medium' | 'hard';

export interface Recipe {
  title: string;
  description: string;
  prepTimeMinutes: number;
  difficulty: RecipeDifficulty;
  servings: number;
  ingredients: RecipeIngredient[];
  steps: string[];
  macros: RecipeMacros;
  tags: string[];
  substitutions: RecipeSubstitution[];
  tips: string[];
  warnings: string[];
}

export interface GenerateRecipeResponse {
  recipes: Recipe[];
  declined?: boolean;
  message?: string;
}
