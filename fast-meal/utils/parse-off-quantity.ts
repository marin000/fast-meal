import type { FridgeProductUnit } from "@/constants/fridge";
import { isFridgeProductUnit } from "@/constants/fridge";

export interface ParsedOffQuantity {
	quantity: number;
	unit: FridgeProductUnit;
}

const UNIT_ALIASES: Readonly<Record<string, FridgeProductUnit>> = {
	g: "g",
	gr: "g",
	gram: "g",
	grams: "g",
	kg: "g",
	ml: "ml",
	milliliter: "ml",
	milliliters: "ml",
	millilitre: "ml",
	millilitres: "ml",
	l: "ml",
	lt: "ml",
	liter: "ml",
	liters: "ml",
	litre: "ml",
	litres: "ml",
	oz: "oz",
	ounce: "oz",
	ounces: "oz",
	cup: "cup",
	cups: "cup",
	tbsp: "tbsp",
	tablespoon: "tbsp",
	tablespoons: "tbsp",
	tsp: "tsp",
	teaspoon: "tsp",
	teaspoons: "tsp",
	pc: "pc",
	pcs: "pc",
	piece: "pc",
	pieces: "pc",
	unit: "pc",
	units: "pc",
	kom: "pc",
};

const MULTIPLIER_PATTERN =
	/^(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)\s*([a-zA-Z]+)/i;
const SIMPLE_PATTERN = /^(\d+(?:[.,]\d+)?)\s*([a-zA-Z]+)/i;

const parseNumber = (raw: string): number | undefined => {
	const normalized = raw.replace(",", ".");
	const value = Number(normalized);
	if (!Number.isFinite(value) || value <= 0) return undefined;
	return value;
};

const resolveUnit = (
	rawUnit: string,
	quantity: number,
): ParsedOffQuantity | undefined => {
	const key = rawUnit.trim().toLowerCase();
	const unit = UNIT_ALIASES[key];
	if (!unit || !isFridgeProductUnit(unit)) return undefined;

	if (key === "kg") {
		return { quantity: quantity * 1000, unit: "g" };
	}
	if (
		key === "l" ||
		key === "lt" ||
		key.startsWith("liter") ||
		key.startsWith("litre")
	) {
		return { quantity: quantity * 1000, unit: "ml" };
	}

	return { quantity, unit };
};

/**
 * Parses Open Food Facts quantity strings like "1 L", "500 g", "6 x 125 g".
 */
export const parseOffQuantity = (
	raw: string | undefined | null,
): ParsedOffQuantity | undefined => {
	if (!raw || typeof raw !== "string") return undefined;
	const trimmed = raw.trim();
	if (!trimmed) return undefined;

	const multiplierMatch = MULTIPLIER_PATTERN.exec(trimmed);
	if (multiplierMatch) {
		const count = parseNumber(multiplierMatch[1]);
		const perUnit = parseNumber(multiplierMatch[2]);
		if (count === undefined || perUnit === undefined) return undefined;
		return resolveUnit(multiplierMatch[3], count * perUnit);
	}

	const simpleMatch = SIMPLE_PATTERN.exec(trimmed);
	if (!simpleMatch) return undefined;

	const quantity = parseNumber(simpleMatch[1]);
	if (quantity === undefined) return undefined;
	return resolveUnit(simpleMatch[2], quantity);
};
