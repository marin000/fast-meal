export const dietaryStyleOptions = ["all", "veggie", "vegan"] as const;
export const unitsOptions = ["metric", "imperial"] as const;

export const languageOptions = ["en", "hr"] as const;
export type AppLanguage = (typeof languageOptions)[number];
