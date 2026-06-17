import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface FridgeScreenHeaderProps {
	onAddProduct: () => void;
	recipesAction?: ReactNode;
}

export const FridgeScreenHeader = ({
	onAddProduct,
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

				<PrimaryButton
					label={t("fridge.addProduct")}
					onPress={onAddProduct}
					compact
					leftIconName="add"
				/>
			</View>

			{recipesAction ? (
				<View style={styles.recipesAction}>{recipesAction}</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		gap: 12,
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
	recipesAction: {
		alignSelf: "flex-start",
	},
});
