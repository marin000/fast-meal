import type { FridgeProductDoc, FridgeProductListItem } from "@/app/interface";

const toIsoString = (value: unknown): string => {
	if (value instanceof Date) return value.toISOString();
	return new Date(value as string | number).toISOString();
};

export const toFridgeProductListItem = (
	doc: FridgeProductDoc,
): FridgeProductListItem => ({
	id: doc._id.toString(),
	deviceId: doc.deviceId,
	name: doc.name,
	quantity: doc.quantity,
	unit: doc.unit as FridgeProductListItem["unit"],
	expirationDate: doc.expirationDate
		? toIsoString(doc.expirationDate)
		: undefined,
	purchasedAt: doc.purchasedAt ? toIsoString(doc.purchasedAt) : undefined,
	createdAt: toIsoString(doc.createdAt),
	updatedAt: toIsoString(doc.updatedAt),
});
