const GRAMS_PER_OUNCE = 28.349523125;

export const macroMassFromGrams = (
	grams: number,
	imperial: boolean,
): number => {
	if (!imperial) {
		return Math.round(grams * 10) / 10;
	}
	return Math.round((grams / GRAMS_PER_OUNCE) * 10) / 10;
};

export const macroBarMaxFromGrams = (
	maxGrams: number,
	imperial: boolean,
): number => (imperial ? maxGrams / GRAMS_PER_OUNCE : maxGrams);
