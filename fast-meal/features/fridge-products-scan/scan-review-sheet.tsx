import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ScannedDraft } from "@/interface/barcode-product";

import { ScannedProductCard } from "./scanned-product-card";

interface ScanReviewSheetProps {
	drafts: ScannedDraft[];
	isSubmitting: boolean;
	onChangeDraft: (localId: string, patch: Partial<ScannedDraft>) => void;
	onRemoveDraft: (localId: string) => void;
	onAddAll: () => void;
}

export const ScanReviewSheet = ({
	drafts,
	isSubmitting,
	onChangeDraft,
	onRemoveDraft,
	onAddAll,
}: ScanReviewSheetProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const readyCount = drafts.filter(
		(draft) => !draft.isLoading && draft.name.trim().length > 0,
	).length;
	const canSubmit = readyCount > 0 && !isSubmitting;

	if (drafts.length === 0) {
		return (
			<View
				style={[
					styles.emptySheet,
					{ backgroundColor: theme.card, borderColor: theme.cardBorder },
				]}
			>
				<Text style={[styles.emptyTitle, { color: theme.text }]}>
					{t("fridge.scan.emptyTitle")}
				</Text>
			</View>
		);
	}

	return (
		<View
			style={[
				styles.sheet,
				{ backgroundColor: theme.card, borderColor: theme.cardBorder },
			]}
		>
			<Text style={[styles.title, { color: theme.text }]}>
				{t("fridge.scan.reviewTitle", { count: drafts.length })}
			</Text>

			<ScrollView
				style={styles.list}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
			>
				{drafts.map((draft) => (
					<ScannedProductCard
						key={draft.localId}
						draft={draft}
						onChange={(patch) => onChangeDraft(draft.localId, patch)}
						onRemove={() => onRemoveDraft(draft.localId)}
					/>
				))}
			</ScrollView>

			<PrimaryButton
				label={t("fridge.scan.addAll", { count: readyCount })}
				onPress={onAddAll}
				disabled={!canSubmit}
				leftIconName="checkmark"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	sheet: {
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		gap: 12,
		maxHeight: "48%",
		paddingBottom: 16,
		paddingHorizontal: 16,
		paddingTop: 14,
	},
	emptySheet: {
		alignItems: "center",
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
		borderTopWidth: 1,
		gap: 6,
		justifyContent: "center",
		paddingBottom: 28,
		paddingHorizontal: 20,
		paddingTop: 18,
	},
	emptyTitle: {
		fontSize: 15,
		fontWeight: "800",
		textAlign: "center",
		width: "100%",
	},
	emptySubtitle: {
		fontSize: 13,
		fontWeight: "500",
		textAlign: "center",
		width: "100%",
	},
	title: {
		fontSize: 15,
		fontWeight: "800",
	},
	list: {
		flexGrow: 0,
	},
	listContent: {
		gap: 10,
		paddingBottom: 4,
	},
});
