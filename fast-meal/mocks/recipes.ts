import type { GenerateRecipeResponse } from '@/interface';

/**
 * Mock responses for the /api/generate-recipe endpoint.
 *
 * To use one while developing, edit api/generate-recipe.ts:
 *
 *   import { mockResponseFull } from '@/mocks';
 *
 *   export const generateRecipe = async (): Promise<GenerateRecipeResponse> => {
 *     await new Promise((resolve) => setTimeout(resolve, 600));
 *     return mockResponseFull;
 *   };
 */

export const mockResponseFull: GenerateRecipeResponse = {
  recipes: [
    {
      title: 'Crispy Chicken Stir-Fry',
      description:
        'A fast, protein-packed stir-fry with crisp vegetables and a sticky soy-garlic glaze. Ready in under 20 minutes.',
      prepTimeMinutes: 18,
      difficulty: 'easy',
      servings: 2,
      ingredients: [
        { name: 'chicken breast, sliced', quantity: 300, unit: 'g' },
        { name: 'bell pepper, sliced', quantity: 1, unit: 'pc' },
        { name: 'broccoli florets', quantity: 150, unit: 'g' },
        { name: 'garlic cloves, minced', quantity: 3, unit: 'pc' },
        { name: 'soy sauce', quantity: 3, unit: 'tbsp' },
        { name: 'honey', quantity: 1, unit: 'tbsp' },
        { name: 'sesame oil', quantity: 1, unit: 'tbsp' },
        { name: 'cooked rice, to serve', quantity: 2, unit: 'cups' },
      ],
      steps: [
        'Pat the chicken dry, season with salt, then sear in a hot pan with sesame oil for 3-4 minutes until golden.',
        'Push the chicken aside, add the broccoli and bell pepper, and stir-fry for 2 minutes.',
        'Add the garlic and cook for 30 seconds until fragrant.',
        'Pour in the soy sauce and honey, toss everything until glossy and coated.',
        'Serve immediately over warm rice.',
      ],
      macros: { calories: 420, protein: 38, carbs: 32, fat: 14 },
      tags: ['High protein', '20 min'],
      substitutions: [
        { ingredient: 'chicken breast', alternatives: ['firm tofu, cubed', 'turkey breast'] },
        { ingredient: 'honey', alternatives: ['maple syrup', 'brown sugar'] },
        { ingredient: 'broccoli', alternatives: ['snap peas', 'green beans'] },
      ],
      tips: [
        'Slice the chicken against the grain for the most tender bite.',
        'Get the pan smoking hot before adding ingredients to keep the vegetables crisp.',
        'Toast a pinch of sesame seeds at the end for extra crunch and aroma.',
      ],
      warnings: ['Contains soy and sesame; skip the soy sauce if avoiding gluten or use tamari instead.'],
    },
    {
      title: 'One-Pan Garlic Butter Pasta',
      description:
        'Creamy, garlicky pasta cooked in one pan with simple pantry staples. A 15-minute dinner that feels indulgent.',
      prepTimeMinutes: 15,
      difficulty: 'hard',
      servings: 2,
      ingredients: [
        { name: 'spaghetti or linguine', quantity: 200, unit: 'g' },
        { name: 'butter', quantity: 40, unit: 'g' },
        { name: 'garlic cloves, minced', quantity: 4, unit: 'pc' },
        { name: 'parmesan, grated', quantity: 50, unit: 'g' },
        { name: 'fresh parsley, chopped', quantity: 2, unit: 'tbsp' },
        { name: 'salt and black pepper', quantity: 1, unit: 'pinch' },
      ],
      steps: [
        'Bring a large pan of salted water to a rolling boil.',
        'Cook the pasta to one minute under al dente, reserving 1 cup of pasta water before draining.',
        'In the same pan, melt the butter on medium heat and saute the garlic for 60 seconds.',
        'Return the pasta to the pan with a splash of pasta water and toss until glossy.',
        'Off heat, stir in the parmesan and parsley, season generously, and serve.',
      ],
      macros: { calories: 510, protein: 18, carbs: 68, fat: 18 },
      tags: ['Budget', 'Vegetarian'],
      substitutions: [
        { ingredient: 'parmesan', alternatives: ['pecorino', 'nutritional yeast'] },
        { ingredient: 'butter', alternatives: ['olive oil', 'vegan butter'] },
      ],
      tips: [
        'Reserved pasta water is the secret to a silky sauce — never skip it.',
        'Add chili flakes with the garlic for a quick aglio e olio twist.',
      ],
      warnings: [],
    },
  ],
};

export const mockResponseMinimal: GenerateRecipeResponse = {
  recipes: [
    {
      title: 'Simple Eggs on Toast',
      description: 'Two fried eggs on warm buttered toast — a five minute breakfast classic.',
      prepTimeMinutes: 8,
      difficulty: 'easy',
      servings: 1,
      ingredients: [
        { name: 'eggs', quantity: 2, unit: 'pc' },
        { name: 'bread slices', quantity: 2, unit: 'pc' },
        { name: 'butter', quantity: 1, unit: 'tbsp' },
        { name: 'salt and pepper', quantity: 1, unit: 'pinch' },
      ],
      steps: [
        'Toast the bread until golden and spread with butter.',
        'Heat a non-stick pan over medium heat and fry the eggs to your liking.',
        'Slide the eggs onto the toast, season, and serve immediately.',
      ],
      macros: { calories: 290, protein: 18, carbs: 28, fat: 12 },
      tags: [],
      substitutions: [],
      tips: [],
      warnings: [],
    },
  ],
};

export const mockResponseDeclined: GenerateRecipeResponse = {
  recipes: [],
  declined: true,
  message: 'I can only help with recipes from ingredients.',
};
