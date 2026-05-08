import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

export const RecipesHeader = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.header}>
			<Text style={[styles.title, { color: theme.text }]}>
				{t("results.title")}
			</Text>
			<Text style={[styles.subtitle, { color: theme.textMuted }]}>
				{t("results.subtitle")}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		gap: 6,
	},
	title: {
		fontSize: 24,
		fontWeight: "900",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "500",
	},
});
