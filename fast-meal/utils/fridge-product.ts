import type { TFunction } from "i18next";

import {
	FRIDGE_PRODUCT_UNITS,
	type FridgeProductUnit,
	isFridgeProductUnit,
} from "@/constants/fridge";

export const formatFridgeProductQuantity = (
	quantity: number | undefined,
	unit: string | undefined,
	translateUnit: (unit: FridgeProductUnit) => string,
): string | undefined => {
	if (quantity === undefined || unit === undefined) return undefined;

	const unitLabel = isFridgeProductUnit(unit) ? translateUnit(unit) : unit;

	return `${quantity} ${unitLabel}`;
};

export const translateMeasurementUnit = (
	t: TFunction,
	unit: string,
): string => {
	if (!isFridgeProductUnit(unit)) return unit;
	return t(`fridge.units.${unit}`);
};

export const parseQuantityInput = (value: string): number | undefined => {
	const trimmed = value.trim();
	if (!trimmed) return undefined;

	const parsed = Number(trimmed);
	if (!Number.isFinite(parsed) || parsed <= 0) return undefined;

	return parsed;
};

export { FRIDGE_PRODUCT_UNITS, isFridgeProductUnit };
