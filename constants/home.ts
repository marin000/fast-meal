export const quickFilterOptions = [
  'quick',
  'highProtein',
  'budget',
  'vegetarian',
  'gymMode',
] as const;

export type QuickFilterOption = (typeof quickFilterOptions)[number];
