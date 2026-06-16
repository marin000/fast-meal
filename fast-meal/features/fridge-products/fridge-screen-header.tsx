import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface FridgeScreenHeaderProps {
	action?: ReactNode;
}

export const FridgeScreenHeader = ({ action }: FridgeScreenHeaderProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.header}>
			<View style={styles.textBlock}>
				<Text style={[styles.kicker, { color: theme.textMuted }]}>
					{t("fridge.kicker")}
				</Text>
				<Text style={[styles.title, { color: theme.text }]}>
					{t("fridge.title")}
				</Text>
			</View>
			{action}
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
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
});
