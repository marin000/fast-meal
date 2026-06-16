import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

export const FridgeScreenHeader = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.header}>
			<Text style={[styles.kicker, { color: theme.textMuted }]}>
				{t("fridge.kicker")}
			</Text>
			<Text style={[styles.title, { color: theme.text }]}>
				{t("fridge.title")}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
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
