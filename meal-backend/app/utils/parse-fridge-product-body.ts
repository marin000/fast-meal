import {
	type CreateFridgeProductRequestBody,
	FRIDGE_PRODUCT_UNITS,
	type FridgeProductUnit,
} from "@/app/interface";

export interface ParsedFridgeProductBody {
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: Date;
	purchasedAt?: Date;
	barcode?: string;
}

const isFridgeProductUnit = (value: string): value is FridgeProductUnit =>
	FRIDGE_PRODUCT_UNITS.includes(value as FridgeProductUnit);

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

const parseOptionalQuantity = (
	value: unknown,
): { ok: true; quantity?: number } | { ok: false } => {
	if (value === undefined || value === null) return { ok: true };

	if (typeof value !== "number" || !Number.isFinite(value) || value <= 0)
		return { ok: false };

	return { ok: true, quantity: value };
};

const parseOptionalUnit = (
	value: unknown,
): { ok: true; unit?: FridgeProductUnit } | { ok: false } => {
	if (value === undefined || value === null) return { ok: true };

	if (typeof value !== "string" || !isFridgeProductUnit(value))
		return { ok: false };

	return { ok: true, unit: value };
};

export const parseFridgeProductBody = (
	body: unknown,
): ParsedFridgeProductBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const {
		deviceId,
		name,
		quantity,
		unit,
		expirationDate,
		purchasedAt,
		barcode,
	} = body as Partial<CreateFridgeProductRequestBody>;

	if (typeof deviceId !== "string" || deviceId.trim().length === 0) return null;
	if (typeof name !== "string" || name.trim().length === 0) return null;

	const parsedQuantity = parseOptionalQuantity(quantity);
	if (!parsedQuantity.ok) return null;

	const parsedUnit = parseOptionalUnit(unit);
	if (!parsedUnit.ok) return null;

	const hasQuantity = parsedQuantity.quantity !== undefined;
	const hasUnit = parsedUnit.unit !== undefined;
	if (hasQuantity !== hasUnit) return null;

	const parsedExpirationDate = parseOptionalIsoDate(expirationDate);
	if (!parsedExpirationDate.ok) return null;

	const parsedPurchasedAt = parseOptionalIsoDate(purchasedAt);
	if (!parsedPurchasedAt.ok) return null;

	let parsedBarcode: string | undefined;
	if (barcode !== undefined && barcode !== null) {
		if (typeof barcode !== "string" || barcode.trim().length === 0) return null;
		parsedBarcode = barcode.trim();
	}

	return {
		deviceId: deviceId.trim(),
		name: name.trim(),
		quantity: parsedQuantity.quantity,
		unit: parsedUnit.unit,
		expirationDate: parsedExpirationDate.date,
		purchasedAt: parsedPurchasedAt.date,
		barcode: parsedBarcode,
	};
};
