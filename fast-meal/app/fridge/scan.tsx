import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import {
	useFeedbackMessage,
	useFridgeProducts,
	usePreferences,
} from "@/context";
import {
	BarcodeScannerView,
	ScanReviewSheet,
} from "@/features/fridge-products-scan";
import { useBarcodeScanSession } from "@/hooks/use-barcode-scan-session";
import { ensureExpirationNotificationPermission } from "@/services/expiration-notifications";
import { ANALYTICS_EVENTS, trackProductEvent } from "@/utils/sentry";

const FridgeScanScreen = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const insets = useSafeAreaInsets();
	const { language } = usePreferences();
	const { addProducts } = useFridgeProducts();
	const { showMessage } = useFeedbackMessage();
	const {
		drafts,
		handleBarcodeScanned,
		updateDraft,
		removeDraft,
		clearDrafts,
	} = useBarcodeScanSession(language);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAddAll = async () => {
		const ready = drafts.filter(
			(draft) => !draft.isLoading && draft.name.trim().length > 0,
		);
		if (ready.length === 0 || isSubmitting) return;

		setIsSubmitting(true);
		try {
			if (ready.some((draft) => draft.expirationDate)) {
				await ensureExpirationNotificationPermission();
			}

			await addProducts(
				ready.map((draft) => ({
					name: draft.name.trim(),
					quantity: draft.quantity,
					unit: draft.unit,
					expirationDate: draft.expirationDate,
					purchasedAt: new Date().toISOString(),
					barcode: draft.code,
				})),
			);

			trackProductEvent(ANALYTICS_EVENTS.fridgeProductsBatchAdded, {
				count: ready.length,
			});
			clearDrafts();
			showMessage(
				t("fridge.scan.toast.added", { count: ready.length }),
				"success",
			);
			router.back();
		} catch {
			showMessage(t("fridge.scan.toast.addFailed"), "error");
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={[styles.container, { backgroundColor: "#000" }]}>
			<View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
				<Pressable
					accessibilityRole="button"
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Ionicons name="close" size={22} color="#FFFFFF" />
				</Pressable>
				<Text style={styles.title}>{t("fridge.scan.title")}</Text>
				<View style={styles.backButton} />
			</View>

			<View style={styles.cameraArea}>
				<BarcodeScannerView
					onBarcodeScanned={(code) => {
						void handleBarcodeScanned(code);
					}}
					enabled={!isSubmitting}
				/>
			</View>

			<ScanReviewSheet
				drafts={drafts}
				isSubmitting={isSubmitting}
				onChangeDraft={updateDraft}
				onRemoveDraft={removeDraft}
				onAddAll={() => {
					void handleAddAll();
				}}
			/>
		</View>
	);
};

export default FridgeScanScreen;

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	topBar: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingBottom: 8,
		paddingHorizontal: 12,
		zIndex: 2,
	},
	backButton: {
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.35)",
		borderRadius: 18,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	title: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "800",
	},
	cameraArea: {
		flex: 1,
	},
});
