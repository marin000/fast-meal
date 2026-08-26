import { useCallback, useState } from "react";

import {
	RECEIPT_CONFIDENCE_REVIEW,
	type ReceiptProductUnit,
} from "@/constants/receipt-product";
import type {
	ReceiptProduct,
	ReceiptProductDraft,
} from "@/interface/receipt-product";

const createLocalId = (): string =>
	`receipt-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const toDraft = (product: ReceiptProduct): ReceiptProductDraft => ({
	localId: createLocalId(),
	name: product.name,
	quantity: product.quantity,
	unit: product.unit,
	confidence: product.confidence,
	isSelected: product.confidence >= RECEIPT_CONFIDENCE_REVIEW,
});

export const useReceiptScanSession = () => {
	const [drafts, setDrafts] = useState<ReceiptProductDraft[]>([]);
	const [partial, setPartial] = useState(false);

	const setFromProducts = useCallback(
		(products: ReceiptProduct[], isPartial: boolean) => {
			setDrafts(products.map(toDraft));
			setPartial(isPartial);
		},
		[],
	);

	const updateDraft = useCallback(
		(
			localId: string,
			patch: Partial<
				Pick<
					ReceiptProductDraft,
					| "name"
					| "quantity"
					| "unit"
					| "isSelected"
					| "confidence"
					| "expirationDate"
				>
			>,
		) => {
			setDrafts((prev) =>
				prev.map((draft) =>
					draft.localId === localId ? { ...draft, ...patch } : draft,
				),
			);
		},
		[],
	);

	const removeDraft = useCallback((localId: string) => {
		setDrafts((prev) => prev.filter((draft) => draft.localId !== localId));
	}, []);

	const toggleSelected = useCallback((localId: string) => {
		setDrafts((prev) =>
			prev.map((draft) =>
				draft.localId === localId
					? { ...draft, isSelected: !draft.isSelected }
					: draft,
			),
		);
	}, []);

	const clearDrafts = useCallback(() => {
		setDrafts([]);
		setPartial(false);
	}, []);

	const selectedDrafts = drafts.filter(
		(draft) => draft.isSelected && draft.name.trim().length > 0,
	);

	return {
		drafts,
		partial,
		selectedDrafts,
		setFromProducts,
		updateDraft,
		removeDraft,
		toggleSelected,
		clearDrafts,
		setUnit: (localId: string, unit: ReceiptProductUnit) =>
			updateDraft(localId, { unit }),
	};
};
