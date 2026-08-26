import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components";
import type { ReceiptProductUnit } from "@/constants/receipt-product";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ReceiptProductDraft } from "@/interface/receipt-product";

import { EditReceiptProductModal } from "./edit-receipt-product-modal";
import { ReceiptProductRow } from "./receipt-product-row";

interface ReceiptResultsViewProps {
	drafts: ReceiptProductDraft[];
	partial: boolean;
	isSubmitting: boolean;
	onToggle: (localId: string) => void;
	onRemove: (localId: string) => void;
	onUpdate: (
		localId: string,
		patch: {
			name: string;
			quantity: number | null;
			unit: ReceiptProductUnit;
			expirationDate?: string;
			isSelected?: boolean;
			confidence?: number;
		},
	) => void;
	onAddSelected: () => void;
	onBack: () => void;
}

export const ReceiptResultsView = ({
	drafts,
	partial,
	isSubmitting,
	onToggle,
	onRemove,
	onUpdate,
	onAddSelected,
	onBack,
}: ReceiptResultsViewProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const insets = useSafeAreaInsets();
	const [editing, setEditing] = useState<ReceiptProductDraft | null>(null);

	const selectedCount = drafts.filter(
		(draft) => draft.isSelected && draft.name.trim().length > 0,
	).length;
	const canSubmit = selectedCount > 0 && !isSubmitting;

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: theme.background,
					paddingTop: insets.top + 8,
					paddingBottom: Math.max(insets.bottom, 16),
				},
			]}
		>
			<View style={styles.header}>
				<Text style={[styles.title, { color: theme.text }]}>
					{t("fridge.scanReceipt.resultsTitle")}
				</Text>
				<Text style={[styles.subtitle, { color: theme.textMuted }]}>
					{t("fridge.scanReceipt.resultsSubtitle", { count: drafts.length })}
				</Text>
				{partial ? (
					<Text
						style={[styles.partial, { color: theme.expiration.soon.solid }]}
					>
						{t("fridge.scanReceipt.partialWarning")}
					</Text>
				) : null}
				<Text style={[styles.purchasedHint, { color: theme.textMuted }]}>
					{t("fridge.scanReceipt.purchasedToday")}
				</Text>
			</View>

			<ScrollView
				style={styles.list}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
			>
				{drafts.map((draft) => (
					<ReceiptProductRow
						key={draft.localId}
						draft={draft}
						onToggle={() => onToggle(draft.localId)}
						onEdit={() => setEditing(draft)}
						onRemove={() => onRemove(draft.localId)}
					/>
				))}
			</ScrollView>

			<View style={styles.footer}>
				<PrimaryButton
					label={t("fridge.scanReceipt.addSelected", { count: selectedCount })}
					onPress={onAddSelected}
					disabled={!canSubmit}
					leftIconName="checkmark"
				/>
				<Pressable
					accessibilityRole="button"
					onPress={onBack}
					disabled={isSubmitting}
					style={styles.retakeButton}
				>
					<Text style={[styles.retakeLabel, { color: theme.textMuted }]}>
						{t("fridge.scanReceipt.retake")}
					</Text>
				</Pressable>
			</View>

			<EditReceiptProductModal
				visible={Boolean(editing)}
				draft={editing}
				onClose={() => setEditing(null)}
				onSave={(patch) => {
					if (!editing) return;
					onUpdate(editing.localId, {
						...patch,
						isSelected: true,
						confidence: 1,
					});
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 16,
	},
	header: {
		gap: 6,
		marginBottom: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "900",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "600",
	},
	partial: {
		fontSize: 13,
		fontWeight: "700",
		marginTop: 4,
	},
	purchasedHint: {
		fontSize: 12,
		fontWeight: "600",
		marginTop: 2,
	},
	list: {
		flex: 1,
	},
	listContent: {
		gap: 10,
		paddingBottom: 16,
	},
	footer: {
		gap: 10,
		paddingTop: 8,
	},
	retakeButton: {
		alignItems: "center",
		paddingVertical: 10,
	},
	retakeLabel: {
		fontSize: 14,
		fontWeight: "700",
	},
});
