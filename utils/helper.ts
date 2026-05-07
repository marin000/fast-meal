export const parseIngredientsInput = (input: string): string[] => {
  return input
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter((item) => item.length > 0);
};
