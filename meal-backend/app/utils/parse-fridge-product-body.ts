import type { CreateFridgeProductRequestBody } from "@/app/interface";

export interface ParsedFridgeProductBody {
	deviceId: string;
	name: string;
	expirationDate?: Date;
	purchasedAt?: Date;
}

const parseOptionalIsoDate = (
	value: unknown,
): { ok: true; date?: Date } | { ok: false } => {
	if (value === undefined || value === null) {
		return { ok: true };
	}

	if (typeof value !== "string" || value.trim().length === 0) {
		return { ok: false };
	}

	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) {
		return { ok: false };
	}

	return { ok: true, date: parsed };
};

export const parseFridgeProductBody = (
	body: unknown,
): ParsedFridgeProductBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const { deviceId, name, expirationDate, purchasedAt } =
		body as Partial<CreateFridgeProductRequestBody>;

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (typeof name !== "string" || name.trim().length === 0) return null;

	const parsedExpirationDate = parseOptionalIsoDate(expirationDate);
	if (!parsedExpirationDate.ok) return null;

	const parsedPurchasedAt = parseOptionalIsoDate(purchasedAt);
	if (!parsedPurchasedAt.ok) return null;

	return {
		deviceId: deviceId.trim(),
		name: name.trim(),
		expirationDate: parsedExpirationDate.date,
		purchasedAt: parsedPurchasedAt.date,
	};
};
