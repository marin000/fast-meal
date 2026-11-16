import type { FridgeProductListItem } from "@/interface/fridge-product";

const toTime = (value: string | undefined): number | null => {
	if (!value) return null;
	const time = new Date(value).getTime();
	return Number.isNaN(time) ? null : time;
};

/** Soonest expiration first; items without a date last; newest createdAt as tie-break. */
export const sortFridgeProductsByExpiration = (
	items: FridgeProductListItem[],
): FridgeProductListItem[] =>
	[...items].sort((a, b) => {
		const aExp = toTime(a.expirationDate);
		const bExp = toTime(b.expirationDate);

		if (aExp !== null && bExp === null) return -1;
		if (aExp === null && bExp !== null) return 1;
		if (aExp !== null && bExp !== null && aExp !== bExp) return aExp - bExp;

		const aCreated = toTime(a.createdAt) ?? 0;
		const bCreated = toTime(b.createdAt) ?? 0;
		return bCreated - aCreated;
	});
