import * as Haptics from "expo-haptics";
import { useCallback, useRef, useState } from "react";

import {
	fetchBarcodeProduct,
	reportBarcodeProduct,
} from "@/api/barcode-products";
import { fetchOffEssentials } from "@/api/open-food-facts";
import type { AppLanguage } from "@/constants/settings";
import { expirationDateFromShelfLife } from "@/constants/shelf-life";
import { useDeviceId } from "@/context/device-id-context";
import type {
	BarcodeProductEssentials,
	ScannedDraft,
} from "@/interface/barcode-product";
import { toIsoDate } from "@/utils/date";
import { pickLocalizedName } from "@/utils/food-facts-helper";
import { isValidGtin, normalizeGtin } from "@/utils/gtin";
import {
	ANALYTICS_EVENTS,
	captureAppException,
	trackProductEvent,
} from "@/utils/sentry";

const SCAN_COOLDOWN_MS = 1800;

const createLocalId = (): string =>
	`${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const isAbandonedEmptyDraft = (draft: ScannedDraft): boolean =>
	!draft.isLoading && draft.name.trim().length === 0;

const essentialsToDraft = (
	essentials: BarcodeProductEssentials,
	language: AppLanguage,
	needsName: boolean,
): Omit<ScannedDraft, "localId" | "isLoading" | "lookupFailed"> => {
	const name = pickLocalizedName(essentials.names, language);
	const expiration = expirationDateFromShelfLife(essentials.shelfLifeDays);

	return {
		code: essentials.code,
		name,
		brandLabel: essentials.brandLabel,
		quantity: essentials.quantity,
		unit: essentials.unit,
		expirationDate: expiration ? toIsoDate(expiration) : undefined,
		imageThumbUrl: essentials.imageThumbUrl,
		needsName: needsName || name.trim().length === 0,
	};
};

export const useBarcodeScanSession = (language: AppLanguage) => {
	const { deviceId } = useDeviceId();
	const [drafts, setDrafts] = useState<ScannedDraft[]>([]);
	const draftsRef = useRef(drafts);
	draftsRef.current = drafts;
	const cooldownRef = useRef<Map<string, number>>(new Map());
	const inFlightRef = useRef<Set<string>>(new Set());

	const updateDraft = useCallback(
		(localId: string, patch: Partial<ScannedDraft>) => {
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

	const handleBarcodeScanned = useCallback(
		async (rawData: string) => {
			const code = normalizeGtin(rawData);
			if (!isValidGtin(code)) return;

			const now = Date.now();
			const lastSeen = cooldownRef.current.get(code) ?? 0;
			if (now - lastSeen < SCAN_COOLDOWN_MS) return;
			cooldownRef.current.set(code, now);

			const existing = draftsRef.current.find((draft) => draft.code === code);
			if (existing) {
				void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
				setDrafts((prev) =>
					prev
						.filter(
							(draft) => draft.code === code || !isAbandonedEmptyDraft(draft),
						)
						.map((draft) => {
							if (draft.code !== code) return draft;
							const nextQuantity =
								draft.quantity !== undefined ? draft.quantity + 1 : 1;
							return {
								...draft,
								quantity: nextQuantity,
								unit: draft.unit ?? "pc",
							};
						}),
				);
				return;
			}

			if (inFlightRef.current.has(code)) return;
			inFlightRef.current.add(code);

			const localId = createLocalId();
			setDrafts((prev) => [
				{
					localId,
					code,
					name: "",
					needsName: true,
					isLoading: true,
					lookupFailed: false,
				},
				...prev.filter((draft) => !isAbandonedEmptyDraft(draft)),
			]);

			void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
			trackProductEvent(ANALYTICS_EVENTS.barcodeScanned, { code });

			try {
				if (deviceId) {
					try {
						const cached = await fetchBarcodeProduct(deviceId, code, false);
						if (cached.found) {
							const mapped = essentialsToDraft(cached.product, language, false);
							updateDraft(localId, {
								...mapped,
								isLoading: false,
								lookupFailed: false,
							});
							return;
						}
					} catch (cacheError) {
						captureAppException(cacheError, {
							feature: "barcode_cache_lookup",
						});
					}
				}

				const off = await fetchOffEssentials(code, language);
				if (off) {
					if (deviceId) {
						try {
							await reportBarcodeProduct({
								deviceId,
								essentials: off,
							});
						} catch (error) {
							captureAppException(error, {
								feature: "barcode_cache_report",
							});
						}
					}

					const mapped = essentialsToDraft(off, language, false);
					updateDraft(localId, {
						...mapped,
						isLoading: false,
						lookupFailed: false,
					});
					return;
				}

				trackProductEvent(ANALYTICS_EVENTS.barcodeLookupMiss, { code });
				updateDraft(localId, {
					isLoading: false,
					lookupFailed: true,
					needsName: true,
					name: "",
				});
			} catch (error) {
				captureAppException(error, { feature: "barcode_lookup" });
				trackProductEvent(ANALYTICS_EVENTS.barcodeLookupMiss, {
					code,
					error: true,
				});
				updateDraft(localId, {
					isLoading: false,
					lookupFailed: true,
					needsName: true,
				});
			} finally {
				inFlightRef.current.delete(code);
			}
		},
		[deviceId, language, updateDraft],
	);

	const clearDrafts = useCallback(() => {
		setDrafts([]);
	}, []);

	return {
		drafts,
		handleBarcodeScanned,
		updateDraft,
		removeDraft,
		clearDrafts,
	};
};
