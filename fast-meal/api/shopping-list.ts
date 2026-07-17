import type { ShoppingListItem } from "@/interface/shopping-list";
import { formatApiErrorBody } from "@/utils/api-error-text";

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/shopping-list`;

export const fetchShoppingList = async (
	deviceId: string,
): Promise<ShoppingListItem[]> => {
	const params = new URLSearchParams({ deviceId });
	const response = await fetch(`${apiEndpoint}?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to load shopping list (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as { items?: ShoppingListItem[] };
	return Array.isArray(data.items) ? data.items : [];
};

export const createShoppingListItem = async (params: {
	deviceId: string;
	name: string;
}): Promise<ShoppingListItem> => {
	const response = await fetch(apiEndpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deviceId: params.deviceId, name: params.name }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Create shopping list item failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as ShoppingListItem;
};

export const updateShoppingListItem = async (params: {
	deviceId: string;
	id: string;
	checked: boolean;
}): Promise<ShoppingListItem> => {
	const response = await fetch(apiEndpoint, {
		method: "PATCH",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			deviceId: params.deviceId,
			id: params.id,
			checked: params.checked,
		}),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Update shopping list item failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as ShoppingListItem;
};

export const deleteShoppingListItem = async (
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
			`Delete shopping list item failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}
};
