import type { DisplayUnits } from "@/interface/recipe";

export const EXPIRATION_STATUS = {
	OK: "ok",
	SOON: "soon",
	EXPIRED: "expired",
} as const;

export const FRIDGE_METRIC_UNITS = ["g", "ml", "pc"] as const;
export const FRIDGE_IMPERIAL_UNITS = ["oz", "pc", "cup", "tbsp"] as const;

export const FRIDGE_PRODUCT_UNITS = [
	"g",
	"ml",
	"pc",
	"oz",
	"cup",
	"tbsp",
	"tsp",
	"pinch",
	"to_taste",
] as const;

export type FridgeProductUnit = (typeof FRIDGE_PRODUCT_UNITS)[number];

export const FRIDGE_DATE_TABS = ["expiration", "purchased"] as const;
export type FridgeDateTab = (typeof FRIDGE_DATE_TABS)[number];

export const getFridgeUnitsForPreference = (
	units: DisplayUnits,
): readonly FridgeProductUnit[] =>
	units === "imperial" ? FRIDGE_IMPERIAL_UNITS : FRIDGE_METRIC_UNITS;

export const isFridgeProductUnit = (
	value: string,
): value is FridgeProductUnit =>
	FRIDGE_PRODUCT_UNITS.includes(value as FridgeProductUnit);
