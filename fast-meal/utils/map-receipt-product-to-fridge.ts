import type { FridgeProductUnit } from "@/constants/fridge";
import type { ReceiptProductUnit } from "@/constants/receipt-product";

export interface FridgeProductCreateInput {
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
}

/**
 * Maps receipt AI units into existing fridge product units.
 * kg → g (×1000), L → ml (×1000), pcs/package → pc.
 */
export const mapReceiptProductToFridge = (input: {
	name: string;
	quantity: number | null;
	unit: ReceiptProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
}): FridgeProductCreateInput => {
	const name = input.name.trim();
	const quantity = input.quantity;
	const dates = {
		...(input.expirationDate ? { expirationDate: input.expirationDate } : {}),
		...(input.purchasedAt ? { purchasedAt: input.purchasedAt } : {}),
	};

	if (input.unit === "unknown" || quantity === null) {
		return { name, ...dates };
	}

	switch (input.unit) {
		case "g":
			return { name, quantity, unit: "g", ...dates };
		case "kg":
			return { name, quantity: quantity * 1000, unit: "g", ...dates };
		case "ml":
			return { name, quantity, unit: "ml", ...dates };
		case "L":
			return { name, quantity: quantity * 1000, unit: "ml", ...dates };
		case "pcs":
		case "package":
			return { name, quantity, unit: "pc", ...dates };
		default:
			return { name, ...dates };
	}
};
