export const parseIngredientsInput = (input: string): string[] => {
  return input
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
};

export const coerceParam = (value: string | string[] | undefined): string => {
  if (Array.isArray(value)) return value[0] ?? '';
  return value ?? '';
};
