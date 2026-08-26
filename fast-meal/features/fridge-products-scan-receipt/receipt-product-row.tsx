import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import {
	RECEIPT_CONFIDENCE_REVIEW,
	type ReceiptProductUnit,
} from "@/constants/receipt-product";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ReceiptProductDraft } from "@/interface/receipt-product";
import { formatDisplayDate } from "@/utils/date";

interface ReceiptProductRowProps {
	draft: ReceiptProductDraft;
	onToggle: () => void;
	onEdit: () => void;
	onRemove: () => void;
}

const formatQuantityUnit = (
	quantity: number | null,
	unit: ReceiptProductUnit,
	unknownLabel: string,
): string => {
	if (quantity === null && unit === "unknown") return unknownLabel;
	if (quantity === null) return unit === "unknown" ? unknownLabel : unit;
	if (unit === "unknown") return String(quantity);
	return `${quantity} ${unit}`;
};

export const ReceiptProductRow = ({
	draft,
	onToggle,
	onEdit,
	onRemove,
}: ReceiptProductRowProps) => {
	const { t } = useTranslation();
	const { language } = usePreferences();
	const theme = useAppAppearance();
	const needsReview = draft.confidence < RECEIPT_CONFIDENCE_REVIEW;
	const displayName = needsReview
		? t("fridge.scanReceipt.unknownProduct")
		: draft.name;
	const quantityLabel = formatQuantityUnit(
		draft.quantity,
		draft.unit,
		t("fridge.scanReceipt.units.unknown"),
	);
	const expirationLabel = draft.expirationDate
		? t("fridge.expiresOn", {
				date: formatDisplayDate(new Date(draft.expirationDate), language),
			})
		: null;

	return (
		<View
			style={[
				styles.row,
				{
					backgroundColor: theme.card,
					borderColor: needsReview
						? theme.expiration.soon.solid
						: theme.cardBorder,
				},
			]}
		>
			<Pressable
				accessibilityRole="checkbox"
				accessibilityState={{ checked: draft.isSelected }}
				onPress={onToggle}
				style={styles.checkboxHit}
			>
				<Ionicons
					name={draft.isSelected ? "checkbox" : "square-outline"}
					size={24}
					color={draft.isSelected ? theme.primary : theme.iconMuted}
				/>
			</Pressable>

			<View style={styles.content}>
				{needsReview ? (
					<Text
						style={[styles.warning, { color: theme.expiration.soon.solid }]}
					>
						⚠ {displayName}
					</Text>
				) : null}
				<Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
					{needsReview ? draft.name || displayName : draft.name}
				</Text>
				<Text style={[styles.meta, { color: theme.textMuted }]}>
					{quantityLabel}
				</Text>
				{expirationLabel ? (
					<Text style={[styles.meta, { color: theme.textMuted }]}>
						{expirationLabel}
					</Text>
				) : null}
			</View>

			<Pressable
				accessibilityRole="button"
				accessibilityLabel={t("fridge.scanReceipt.edit")}
				onPress={onEdit}
				style={styles.iconHit}
			>
				<Ionicons name="create-outline" size={20} color={theme.iconMuted} />
			</Pressable>
			<Pressable
				accessibilityRole="button"
				accessibilityLabel={t("fridge.scanReceipt.remove")}
				onPress={onRemove}
				style={styles.iconHit}
			>
				<Ionicons name="trash-outline" size={20} color={theme.iconMuted} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		borderRadius: 14,
		borderWidth: 1.5,
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 10,
		paddingVertical: 12,
	},
	checkboxHit: {
		padding: 4,
	},
	content: {
		flex: 1,
		gap: 2,
	},
	warning: {
		fontSize: 11,
		fontWeight: "800",
	},
	name: {
		fontSize: 15,
		fontWeight: "800",
	},
	meta: {
		fontSize: 13,
		fontWeight: "600",
	},
	iconHit: {
		padding: 6,
	},
});
