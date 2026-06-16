export interface CreateFridgeProductRequestBody {
	deviceId: string;
	name: string;
	expirationDate?: string;
	purchasedAt?: string;
}

export interface FridgeProductListItem {
	id: string;
	deviceId: string;
	name: string;
	expirationDate?: string;
	purchasedAt?: string;
	createdAt: string;
	updatedAt: string;
}
