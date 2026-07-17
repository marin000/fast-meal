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
	createdAt: convertToIsoString(doc.createdAt),
	updatedAt: convertToIsoString(doc.updatedAt),
});
