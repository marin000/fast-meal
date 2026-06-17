import type { FridgeProductUnit } from "@/constants/fridge";

export interface FridgeProductListItem {
	id: string;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	createdAt: string;
	updatedAt: string;
}
