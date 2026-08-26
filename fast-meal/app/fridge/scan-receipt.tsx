import { type Href, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { FridgeAiLoading } from "@/components";
import type { IngredientImagePayload } from "@/constants/ingredient-image";
import { SCAN_RECEIPT_STEPS } from "@/constants/receipt-product";
import { useFeedbackMessage, useFridgeProducts } from "@/context";
import {
	ReceiptCaptureView,
	ReceiptProcessingView,
	ReceiptResultsView,
} from "@/features/fridge-products-scan-receipt";
import { useParseReceipt } from "@/hooks/use-parse-receipt";
import { useReceiptScanSession } from "@/hooks/use-receipt-scan-session";
import { ensureExpirationNotificationPermission } from "@/services/expiration-notifications";
import { toIsoDate } from "@/utils/date";
import { mapReceiptProductToFridge } from "@/utils/map-receipt-product-to-fridge";
import { ANALYTICS_EVENTS, trackProductEvent } from "@/utils/sentry";

const FridgeScanReceiptScreen = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const { addProducts } = useFridgeProducts();
	const { showMessage } = useFeedbackMessage();
	const {
		drafts,
		partial,
		setFromProducts,
		updateDraft,
		removeDraft,
		toggleSelected,
		clearDrafts,
		selectedDrafts,
	} = useReceiptScanSession();
	const { step, errorMessage, runParse, resetParse } = useParseReceipt({
		setFromProducts,
	});

	const [isSubmitting, setIsSubmitting] = useState(false);
	const imageRef = useRef<IngredientImagePayload | null>(null);

	const handleCaptured = (payload: IngredientImagePayload) => {
		imageRef.current = payload;
		void runParse(payload);
	};

	const handleRetry = () => {
		clearDrafts();
		imageRef.current = null;
		resetParse();
	};

	const handleAddSelected = async () => {
		if (selectedDrafts.length === 0 || isSubmitting) return;

		const toAdd = selectedDrafts;
		const addedCount = toAdd.length;

		setIsSubmitting(true);
		try {
			if (toAdd.some((draft) => draft.expirationDate)) {
				await ensureExpirationNotificationPermission();
			}

			const purchasedAt = toIsoDate(new Date());

			await addProducts(
				toAdd.map((draft) =>
					mapReceiptProductToFridge({
						name: draft.name,
						quantity: draft.quantity,
						unit: draft.unit,
						purchasedAt,
						expirationDate: draft.expirationDate,
					}),
				),
			);

			trackProductEvent(ANALYTICS_EVENTS.receiptProductsAdded, {
				count: addedCount,
			});
			clearDrafts();
			showMessage(
				t("fridge.scanReceipt.toast.added", { count: addedCount }),
				"success",
			);
			router.replace("/fridge" as Href);
		} catch {
			showMessage(t("fridge.scanReceipt.toast.addFailed"), "error");
			setIsSubmitting(false);
		}
	};

	if (isSubmitting) {
		return (
			<View style={styles.container}>
				<FridgeAiLoading
					title={t("fridge.scanReceipt.addingTitle")}
					subtitle={t("fridge.scanReceipt.addingSubtitle")}
				/>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{step === SCAN_RECEIPT_STEPS.CAPTURE ? (
				<ReceiptCaptureView
					onCaptured={handleCaptured}
					onBack={() => router.back()}
					onCaptureError={() => {
						showMessage(t("fridge.scanReceipt.errors.captureFailed"), "error");
					}}
				/>
			) : null}

			{step === SCAN_RECEIPT_STEPS.PROCESSING ? (
				<ReceiptProcessingView
					errorMessage={errorMessage}
					onRetry={handleRetry}
				/>
			) : null}

			{step === SCAN_RECEIPT_STEPS.RESULTS ? (
				<ReceiptResultsView
					drafts={drafts}
					partial={partial}
					isSubmitting={isSubmitting}
					onToggle={toggleSelected}
					onRemove={removeDraft}
					onUpdate={(localId, patch) => updateDraft(localId, patch)}
					onAddSelected={() => {
						void handleAddSelected();
					}}
					onBack={handleRetry}
				/>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#000",
		flex: 1,
	},
});

export default FridgeScanReceiptScreen;
