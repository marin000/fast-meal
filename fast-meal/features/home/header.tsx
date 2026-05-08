import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

export const HomeHeader = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.header}>
			<Text style={[styles.title, { color: theme.text }]}>
				{t("home.titleMain")}
			</Text>
			<Text style={[styles.titleAccent, { color: theme.primary }]}>
				{t("home.titleAccent")}
			</Text>
			<Text style={[styles.subtitle, { color: theme.textMuted }]}>
				{t("home.subtitle")}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	header: {
		gap: 6,
	},
	title: {
		fontSize: 32,
		fontWeight: "900",
		lineHeight: 38,
	},
	titleAccent: {
		fontSize: 32,
		fontWeight: "900",
		lineHeight: 38,
	},
	subtitle: {
		fontSize: 15,
		fontWeight: "500",
		marginTop: 4,
	},
});
