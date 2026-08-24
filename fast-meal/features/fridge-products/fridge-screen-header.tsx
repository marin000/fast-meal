import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

import { FridgeActionGrid } from "./fridge-action-grid";

interface FridgeScreenHeaderProps {
	onAddProduct: () => void;
	onScanProducts: () => void;
	recipesAction?: ReactNode;
}

export const FridgeScreenHeader = ({
	onAddProduct,
	onScanProducts,
	recipesAction,
}: FridgeScreenHeaderProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.header}>
			<View style={styles.topRow}>
				<View style={styles.textBlock}>
					<Text style={[styles.kicker, { color: theme.textMuted }]}>
						{t("fridge.kicker")}
					</Text>
					<Text style={[styles.title, { color: theme.text }]}>
						{t("fridge.title")}
					</Text>
				</View>

				{recipesAction ? (
					<View style={styles.recipesAction}>{recipesAction}</View>
				) : null}
			</View>

			<FridgeActionGrid
				onAddProduct={onAddProduct}
				onScanProducts={onScanProducts}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		gap: 20,
	},
	topRow: {
		alignItems: "flex-end",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
	textBlock: {
		flex: 1,
		gap: 6,
	},
	recipesAction: {
		marginBottom: 2,
	},
	kicker: {
		fontSize: 10,
		fontWeight: "900",
		letterSpacing: 1.2,
		textTransform: "uppercase",
	},
	title: {
		fontSize: 24,
		fontWeight: "900",
	},
});
