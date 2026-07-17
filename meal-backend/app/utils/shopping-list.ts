import type {
	ShoppingListItemDoc,
	ShoppingListItemResponse,
} from "@/app/interface";
import { convertToIsoString } from "@/app/utils/helper";

export const toShoppingListItemResponse = (
	doc: ShoppingListItemDoc,
): ShoppingListItemResponse => ({
	id: doc._id.toString(),
	name: doc.name,
	checked: doc.checked,
	createdAt: convertToIsoString(doc.createdAt),
	updatedAt: convertToIsoString(doc.updatedAt),
});

export const normalizeShoppingListName = (name: string): string =>
	name.trim().toLowerCase();
