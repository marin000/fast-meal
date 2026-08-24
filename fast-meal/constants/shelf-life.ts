/**
 * Open Food Facts category tags → default fridge shelf life in days.
 * Matched most-specific-first by walking categories_tags from the end.
 */
export const SHELF_LIFE_BY_CATEGORY_TAG: Readonly<Record<string, number>> = {
	"en:fresh-milks": 7,
	"en:milks": 7,
	"en:plant-based-milk-alternatives": 7,
	"en:yogurts": 14,
	"en:fermented-milk-products": 14,
	"en:fresh-cheeses": 7,
	"en:cheeses": 21,
	"en:butters": 30,
	"en:creams": 7,
	"en:fresh-meats": 3,
	"en:meats": 3,
	"en:fresh-poultry": 3,
	"en:poultries": 3,
	"en:fresh-fishes": 2,
	"en:fishes": 2,
	"en:seafood": 2,
	"en:eggs": 21,
	"en:fresh-eggs": 21,
	"en:breads": 4,
	"en:fresh-vegetables": 5,
	"en:vegetables": 5,
	"en:fresh-fruits": 5,
	"en:fruits": 5,
	"en:frozen-foods": 180,
	"en:frozen-meats": 180,
	"en:frozen-vegetables": 180,
	"en:canned-foods": 730,
	"en:canned-vegetables": 730,
	"en:canned-fishes": 730,
	"en:pastas": 365,
	"en:rices": 365,
	"en:cereals-and-potatoes": 365,
	"en:spreads": 90,
	"en:chocolate-spreads": 180,
	"en:jams": 180,
	"en:sauces": 90,
	"en:condiments": 180,
	"en:beverages": 30,
	"en:sodas": 180,
	"en:juices": 7,
	"en:plant-based-foods": 14,
	"en:dairies": 7,
};

export const resolveShelfLifeDays = (
	categoriesTags: readonly string[] | undefined,
): number | undefined => {
	if (!categoriesTags || categoriesTags.length === 0) return undefined;

	for (let i = categoriesTags.length - 1; i >= 0; i -= 1) {
		const tag = categoriesTags[i];
		const days = SHELF_LIFE_BY_CATEGORY_TAG[tag];
		if (days !== undefined) return days;
	}

	return undefined;
};

export const expirationDateFromShelfLife = (
	shelfLifeDays: number | undefined,
	from: Date = new Date(),
): Date | undefined => {
	if (shelfLifeDays === undefined || shelfLifeDays <= 0) return undefined;
	const date = new Date(from);
	date.setHours(0, 0, 0, 0);
	date.setDate(date.getDate() + shelfLifeDays);
	return date;
};
