import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { formatDisplayDate, getDaysUntilExpiration } from "@/utils/date";
import {
	formatFridgeProductQuantity,
	translateMeasurementUnit,
} from "@/utils/fridge-product";
import {
	getExpirationRowAppearance,
	getExpirationStatus,
} from "@/utils/helper";

interface FridgeProductRowProps {
	item: FridgeProductListItem;
	onRemove: () => void;
	onPress?: () => void;
}

export const FridgeProductRow = ({
	item,
	onRemove,
	onPress,
}: FridgeProductRowProps) => {
	const { t, i18n } = useTranslation();
	const theme = useAppAppearance();
	const expirationStatus = item.expirationDate
		? getExpirationStatus(item.expirationDate)
		: undefined;

	const rowAppearance = getExpirationRowAppearance(theme, expirationStatus);
	const daysUntilExpiration = item.expirationDate
		? getDaysUntilExpiration(item.expirationDate)
		: null;
	const quantityLabel = formatFridgeProductQuantity(
		item.quantity,
		item.unit,
		(unitKey) => translateMeasurementUnit(t, unitKey),
	);
	const isScanned = Boolean(item.barcode);

	return (
		<View
			style={[
				styles.row,
				{
					backgroundColor: rowAppearance.backgroundColor,
					borderColor: rowAppearance.borderColor,
				},
			]}
		>
			<Pressable
				style={styles.contentPressable}
				onPress={onPress}
				disabled={!onPress}
			>
				<View style={styles.content}>
					<Text style={[styles.name, { color: theme.text }]} numberOfLines={2}>
						{item.name}
					</Text>
					{quantityLabel ? (
						<Text style={[styles.meta, { color: theme.textMuted }]}>
							{quantityLabel}
						</Text>
					) : null}
					{item.expirationDate && daysUntilExpiration !== null ? (
						<Text style={[styles.meta, { color: rowAppearance.accentColor }]}>
							{t(
								daysUntilExpiration < 0
									? "fridge.expiredOn"
									: "fridge.expiresOn",
								{
									date: formatDisplayDate(
										new Date(item.expirationDate),
										i18n.language,
									),
								},
							)}
						</Text>
					) : null}
					{item.purchasedAt ? (
						<Text style={[styles.meta, { color: theme.textMuted }]}>
							{t("fridge.boughtOn", {
								date: formatDisplayDate(
									new Date(item.purchasedAt),
									i18n.language,
								),
							})}
						</Text>
					) : null}
				</View>
			</Pressable>

			{isScanned && onPress ? (
				<Pressable
					accessibilityRole="button"
					onPress={onPress}
					style={[
						styles.arrowButton,
						{ backgroundColor: theme.substitutionBoxBg },
					]}
				>
					<Ionicons name="arrow-forward" size={14} color={theme.primary} />
				</Pressable>
			) : null}

			<Pressable
				accessibilityRole="button"
				onPress={onRemove}
				style={[styles.deleteButton, { backgroundColor: theme.chipBg }]}
			>
				<Ionicons name="trash-outline" size={16} color={theme.iconMuted} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 2,
		flexDirection: "row",
		gap: 10,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	contentPressable: {
		flex: 1,
	},
	content: {
		flex: 1,
		gap: 2,
	},
	name: {
		fontSize: 14,
		fontWeight: "600",
	},
	meta: {
		fontSize: 12,
		fontWeight: "500",
	},
	arrowButton: {
		alignItems: "center",
		borderRadius: 16,
		height: 32,
		justifyContent: "center",
		width: 32,
	},
	deleteButton: {
		alignItems: "center",
		borderRadius: 8,
		height: 28,
		justifyContent: "center",
		width: 28,
	},
});
