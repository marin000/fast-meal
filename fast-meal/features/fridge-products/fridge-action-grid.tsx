import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ReceiptIcon } from "@/components/ui/receipt-icon";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface FridgeActionGridProps {
	onAddProduct: () => void;
	onScanProducts: () => void;
	onScanReceipt: () => void;
}

export const FridgeActionGrid = ({
	onAddProduct,
	onScanProducts,
	onScanReceipt,
}: FridgeActionGridProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.grid}>
			<Pressable
				accessibilityRole="button"
				onPress={onAddProduct}
				style={[
					styles.tile,
					styles.primaryTile,
					{ backgroundColor: theme.primary },
				]}
			>
				<Ionicons name="create-outline" size={20} color="#FFFFFF" />
				<Text style={styles.primaryLabel}>{t("fridge.addProduct")}</Text>
			</Pressable>

			<Pressable
				accessibilityRole="button"
				onPress={onScanProducts}
				style={[
					styles.tile,
					styles.outlinedTile,
					{
						backgroundColor: theme.card,
						borderColor: theme.cardBorder,
					},
				]}
			>
				<Ionicons name="scan-outline" size={20} color={theme.text} />
				<Text style={[styles.outlinedLabel, { color: theme.text }]}>
					{t("fridge.scan.scanProduct")}
				</Text>
			</Pressable>

			<Pressable
				accessibilityRole="button"
				onPress={onScanReceipt}
				style={[
					styles.tile,
					styles.outlinedTile,
					{
						backgroundColor: theme.card,
						borderColor: theme.cardBorder,
					},
				]}
			>
				<ReceiptIcon size={20} color={theme.text} />
				<Text style={[styles.outlinedLabel, { color: theme.text }]}>
					{t("fridge.scanReceipt.label")}
				</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	grid: {
		flexDirection: "row",
		gap: 10,
	},
	tile: {
		alignItems: "center",
		borderRadius: 16,
		flex: 1,
		gap: 8,
		justifyContent: "center",
		paddingHorizontal: 8,
		paddingVertical: 16,
	},
	primaryTile: {
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.12,
		shadowRadius: 6,
	},
	outlinedTile: {
		borderWidth: 2,
	},
	primaryLabel: {
		color: "#FFFFFF",
		fontSize: 11,
		fontWeight: "900",
		textAlign: "center",
	},
	outlinedLabel: {
		fontSize: 11,
		fontWeight: "900",
		textAlign: "center",
	},
});
