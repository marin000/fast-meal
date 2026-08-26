import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

import {
	DailyLimitError,
	ParseReceiptError,
	parseReceipt,
} from "@/api/parse-receipt";
import type { IngredientImagePayload } from "@/constants/ingredient-image";
import { SCAN_RECEIPT_STEPS } from "@/constants/receipt-product";
import { useDeviceId, usePreferences } from "@/context";
import type { ReceiptProduct } from "@/interface/receipt-product";
import { ANALYTICS_EVENTS, trackProductEvent } from "@/utils/sentry";

export type ScanReceiptStep =
	(typeof SCAN_RECEIPT_STEPS)[keyof typeof SCAN_RECEIPT_STEPS];

const resolveParseReceiptErrorMessage = (
	error: unknown,
	t: (key: string) => string,
): string => {
	if (error instanceof DailyLimitError) {
		return t("fridge.scanReceipt.errors.dailyLimit");
	}
	if (error instanceof ParseReceiptError) {
		switch (error.code) {
			case "NO_PRODUCTS_FOUND":
				return t("fridge.scanReceipt.errors.noProducts");
			case "UNREADABLE_RECEIPT":
				return t("fridge.scanReceipt.errors.unreadable");
			case "DAILY_RECEIPT_SCAN_LIMIT":
				return t("fridge.scanReceipt.errors.dailyLimit");
			case "INVALID_IMAGE":
				return t("fridge.scanReceipt.errors.invalidImage");
			default:
				return t("fridge.scanReceipt.errors.generic");
		}
	}
	return t("fridge.scanReceipt.errors.generic");
};

const getParseFailureCode = (error: unknown): string => {
	if (error instanceof ParseReceiptError) return error.code;
	if (error instanceof DailyLimitError) return "DAILY_RECEIPT_SCAN_LIMIT";
	return "NETWORK";
};

export const useParseReceipt = (options: {
	setFromProducts: (products: ReceiptProduct[], isPartial: boolean) => void;
}) => {
	const { setFromProducts } = options;
	const { t } = useTranslation();
	const { deviceId } = useDeviceId();
	const { language } = usePreferences();

	const [step, setStep] = useState<ScanReceiptStep>(SCAN_RECEIPT_STEPS.CAPTURE);
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const runParse = useCallback(
		async (image: IngredientImagePayload) => {
			if (!deviceId) {
				setErrorMessage(t("fridge.scanReceipt.errors.generic"));
				setStep(SCAN_RECEIPT_STEPS.PROCESSING);
				return;
			}

			setErrorMessage(null);
			setStep(SCAN_RECEIPT_STEPS.PROCESSING);
			trackProductEvent(ANALYTICS_EVENTS.receiptScanStarted);

			try {
				const result = await parseReceipt({
					deviceId,
					language,
					image: {
						base64: image.base64,
						mimeType: image.mimeType,
					},
				});

				setFromProducts(result.products, result.partial);
				trackProductEvent(ANALYTICS_EVENTS.receiptScanSucceeded, {
					count: result.products.length,
					partial: result.partial,
				});
				setStep(SCAN_RECEIPT_STEPS.RESULTS);
			} catch (error) {
				trackProductEvent(ANALYTICS_EVENTS.receiptScanFailed, {
					code: getParseFailureCode(error),
				});
				setErrorMessage(resolveParseReceiptErrorMessage(error, t));
				setStep(SCAN_RECEIPT_STEPS.PROCESSING);
			}
		},
		[deviceId, language, setFromProducts, t],
	);

	const resetParse = useCallback(() => {
		setErrorMessage(null);
		setStep(SCAN_RECEIPT_STEPS.CAPTURE);
	}, []);

	return {
		step,
		errorMessage,
		runParse,
		resetParse,
	};
};
