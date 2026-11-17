import type { FridgeProductUnit } from "@/constants/fridge";

import { FridgeProductFormModal } from "./fridge-product-form-modal";

interface AddFridgeProductModalProps {
	visible: boolean;
	onClose: () => void;
	onAdd: (input: {
		name: string;
		quantity?: number;
		unit?: FridgeProductUnit;
		expirationDate?: string;
		purchasedAt?: string;
	}) => Promise<void>;
}

/** @deprecated Prefer FridgeProductFormModal; kept for existing imports. */
export const AddFridgeProductModal = ({ visible, onClose, onAdd }: AddFridgeProductModalProps) => (
	<FridgeProductFormModal visible={visible} mode="add" onClose={onClose} onSubmit={onAdd} />
);
