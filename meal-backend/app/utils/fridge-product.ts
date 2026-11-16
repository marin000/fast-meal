import type { FridgeProductDoc, FridgeProductListItem } from "@/app/interface";
import { convertToIsoString } from "@/app/utils/helper";

export const toFridgeProductListItem = (
	doc: FridgeProductDoc,
): FridgeProductListItem => ({
	id: doc._id.toString(),
	deviceId: doc.deviceId,
	name: doc.name,
	quantity: doc.quantity,
	unit: doc.unit as FridgeProductListItem["unit"],
	expirationDate: doc.expirationDate
		? convertToIsoString(doc.expirationDate)
		: undefined,
	purchasedAt: doc.purchasedAt
		? convertToIsoString(doc.purchasedAt)
		: undefined,
	barcode: doc.barcode,
	createdAt: convertToIsoString(doc.createdAt),
	updatedAt: convertToIsoString(doc.updatedAt),
});

const toTime = (value: Date | string | undefined | null): number | null => {
	if (!value) return null;
	const time = new Date(value).getTime();
	return Number.isNaN(time) ? null : time;
};

/** Soonest expiration first; items without a date last; newest createdAt as tie-break. */
export const sortFridgeProductDocsByExpiration = <
	T extends {
		expirationDate?: Date | string | null;
		createdAt?: Date | string | null;
	},
>(
	docs: T[],
): T[] =>
	[...docs].sort((a, b) => {
		const aExp = toTime(a.expirationDate);
		const bExp = toTime(b.expirationDate);

		if (aExp !== null && bExp === null) return -1;
		if (aExp === null && bExp !== null) return 1;
		if (aExp !== null && bExp !== null && aExp !== bExp) return aExp - bExp;

		const aCreated = toTime(a.createdAt) ?? 0;
		const bCreated = toTime(b.createdAt) ?? 0;
		return bCreated - aCreated;
	});
