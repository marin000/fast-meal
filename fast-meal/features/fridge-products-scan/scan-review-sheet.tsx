import { useTranslation } from "react-i18next";
import { Keyboard, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ScannedDraft } from "@/interface/barcode-product";

import { ScannedProductCard } from "./scanned-product-card";

interface ScanReviewSheetProps {
	drafts: ScannedDraft[];
	isSubmitting: boolean;
	pinnedTop?: boolean;
	onChangeDraft: (localId: string, patch: Partial<ScannedDraft>) => void;
	onRemoveDraft: (localId: string) => void;
	onAddAll: () => void;
}

export const ScanReviewSheet = ({
	drafts,
	isSubmitting,
	pinnedTop = false,
	onChangeDraft,
	onRemoveDraft,
	onAddAll,
}: ScanReviewSheetProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const readyCount = drafts.filter((draft) => !draft.isLoading && draft.name.trim().length > 0).length;
	const canSubmit = readyCount > 0 && !isSubmitting;

	if (drafts.length === 0) {
		return (
			<Pressable
				onPress={Keyboard.dismiss}
				style={[styles.emptySheet, { backgroundColor: theme.card, borderColor: theme.cardBorder }]}
			>
				<Text style={[styles.emptyTitle, { color: theme.heading }]}>{t("fridge.scan.emptyTitle")}</Text>
			</Pressable>
		);
	}

	return (
		<View
			style={[
				styles.sheet,
				pinnedTop ? styles.sheetPinnedTop : null,
				{ backgroundColor: theme.card, borderColor: theme.cardBorder },
			]}
		>
			<Pressable onPress={Keyboard.dismiss}>
				<Text style={[styles.title, { color: theme.heading }]}>
					{t("fridge.scan.reviewTitle", { count: drafts.length })}
				</Text>
			</Pressable>

			<ScrollView
				style={styles.list}
				contentContainerStyle={styles.listContent}
				keyboardShouldPersistTaps="handled"
				keyboardDismissMode="on-drag"
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
				onPress={() => {
					Keyboard.dismiss();
					onAddAll();
				}}
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
	sheetPinnedTop: {
		borderBottomLeftRadius: 20,
		borderBottomRightRadius: 20,
		borderBottomWidth: 1,
		borderTopLeftRadius: 0,
		borderTopRightRadius: 0,
		borderTopWidth: 0,
		flexGrow: 1,
		maxHeight: "100%",
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
		flexShrink: 1,
	},
	listContent: {
		gap: 10,
		paddingBottom: 4,
	},
});
