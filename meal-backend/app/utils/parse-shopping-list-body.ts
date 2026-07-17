import { getBoolean, getTrimmedString } from "./helper";

export interface ParsedShoppingListCreateBody {
	deviceId: string;
	name: string;
}

export interface ParsedShoppingListToggleBody {
	deviceId: string;
	id: string;
	checked: boolean;
}

export const parseShoppingListCreateBody = (
	body: unknown,
): ParsedShoppingListCreateBody | null => {
	const deviceId = getTrimmedString(body, "deviceId");
	const name = getTrimmedString(body, "name");

	if (!deviceId || !name) return null;

	return { deviceId, name };
};

export const parseShoppingListToggleBody = (
	body: unknown,
): ParsedShoppingListToggleBody | null => {
	const deviceId = getTrimmedString(body, "deviceId");
	const id = getTrimmedString(body, "id");
	const checked = getBoolean(body, "checked");

	if (!deviceId || !id || checked === null) return null;

	return { deviceId, id, checked };
};
