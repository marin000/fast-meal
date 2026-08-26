import type { FridgeProductUnit } from "@/constants/fridge";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { formatApiErrorBody } from "@/utils/api-error-text";

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/fridge-products`;

export const fetchFridgeProducts = async (
	deviceId: string,
): Promise<FridgeProductListItem[]> => {
	const params = new URLSearchParams({ deviceId });
	const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to load fridge products (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as {
		fridgeProducts?: FridgeProductListItem[];
	};
	return Array.isArray(data.fridgeProducts) ? data.fridgeProducts : [];
};

export const createFridgeProduct = async (params: {
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	barcode?: string;
}): Promise<FridgeProductListItem> => {
	const response = await fetch(apiEndpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			deviceId: params.deviceId,
			...toCreatePayload(params),
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Create fridge product failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as FridgeProductListItem;
};

const toCreatePayload = (params: {
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	barcode?: string;
}) => ({
	name: params.name,
	...(params.quantity !== undefined && params.unit
		? { quantity: params.quantity, unit: params.unit }
		: {}),
	...(params.expirationDate ? { expirationDate: params.expirationDate } : {}),
	...(params.purchasedAt ? { purchasedAt: params.purchasedAt } : {}),
	...(params.barcode ? { barcode: params.barcode } : {}),
});

export const createFridgeProductsBatch = async (params: {
	deviceId: string;
	products: Array<{
		name: string;
		quantity?: number;
		unit?: FridgeProductUnit;
		expirationDate?: string;
		purchasedAt?: string;
		barcode?: string;
	}>;
}): Promise<FridgeProductListItem[]> => {
	if (params.products.length === 0) return [];

	const response = await fetch(`${apiEndpoint}/batch`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			deviceId: params.deviceId,
			products: params.products.map(toCreatePayload),
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Create fridge products batch failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as {
		fridgeProducts?: FridgeProductListItem[];
	};
	return Array.isArray(data.fridgeProducts) ? data.fridgeProducts : [];
};

export const deleteFridgeProduct = async (
	deviceId: string,
	id: string,
): Promise<void> => {
	const params = new URLSearchParams({ deviceId, id });
	const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
		method: "DELETE",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Delete fridge product failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}
};
