import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { EXPIRATION_STATUS } from "@/constants/fridge";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { getDaysUntilExpiration } from "@/utils/date";
import { getExpirationStatus } from "@/utils/helper";

interface ProductPickerRowProps {
	item: FridgeProductListItem;
	selected: boolean;
	onToggle: () => void;
}

const ExpirationBadge = ({ expirationDate }: { expirationDate: string }) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const status = getExpirationStatus(expirationDate);

	if (!status) return null;

	const diffDays = getDaysUntilExpiration(expirationDate);
	const label =
		status === EXPIRATION_STATUS.EXPIRED
			? t("fridge.picker.expired")
			: diffDays === 0
				? t("fridge.picker.expiresToday")
				: t("fridge.picker.daysLeft", { count: diffDays });

	const palette =
		status === EXPIRATION_STATUS.EXPIRED
			? theme.expiration.expired
			: status === EXPIRATION_STATUS.SOON
				? theme.expiration.soon
				: theme.expiration.ok;

	return (
		<View style={[styles.badge, { backgroundColor: palette.soft }]}>
			<Ionicons name="calendar-outline" size={10} color={palette.solid} />
			<Text style={[styles.badgeText, { color: palette.solid }]}>{label}</Text>
		</View>
	);
};

export const ProductPickerRow = ({
	item,
	selected,
	onToggle,
}: ProductPickerRowProps) => {
	const theme = useAppAppearance();

	return (
		<Pressable
			accessibilityRole="checkbox"
			accessibilityState={{ checked: selected }}
			onPress={onToggle}
			style={[
				styles.productRow,
				{
					backgroundColor: selected
						? theme.substitutionBoxBg
						: theme.background,
					borderColor: selected ? theme.primary : theme.cardBorder,
				},
			]}
		>
			<View
				style={[
					styles.checkbox,
					{
						backgroundColor: selected ? theme.primary : "transparent",
						borderColor: selected ? theme.primary : theme.cardBorder,
					},
				]}
			>
				{selected ? (
					<Ionicons name="checkmark" size={12} color="#FFFFFF" />
				) : null}
			</View>

			<Text
				style={[styles.productName, { color: theme.text }]}
				numberOfLines={1}
			>
				{item.name}
			</Text>

			{item.expirationDate ? (
				<ExpirationBadge expirationDate={item.expirationDate} />
			) : null}
		</Pressable>
	);
};

const styles = StyleSheet.create({
	productRow: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 2,
		flexDirection: "row",
		gap: 12,
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	checkbox: {
		alignItems: "center",
		borderRadius: 6,
		borderWidth: 2,
		height: 20,
		justifyContent: "center",
		width: 20,
	},
	productName: {
		flex: 1,
		fontSize: 14,
		fontWeight: "700",
	},
	badge: {
		alignItems: "center",
		borderRadius: 999,
		flexDirection: "row",
		gap: 4,
		paddingHorizontal: 8,
		paddingVertical: 3,
	},
	badgeText: {
		fontSize: 10,
		fontWeight: "700",
	},
});
