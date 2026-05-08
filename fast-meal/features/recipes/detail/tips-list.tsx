import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

import { RecipeSection } from "./section";

interface RecipeTipsProps {
	items: string[];
}

export const RecipeTips = ({ items }: RecipeTipsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<RecipeSection label={t("recipe.tips")}>
			<View style={styles.list}>
				{items.map((tip) => (
					<View key={tip} style={styles.row}>
						<Ionicons
							name="sparkles"
							size={14}
							color={theme.primary}
							style={styles.icon}
						/>
						<Text style={[styles.text, { color: theme.textMuted }]}>{tip}</Text>
					</View>
				))}
			</View>
		</RecipeSection>
	);
};

const styles = StyleSheet.create({
	list: {
		gap: 8,
	},
	row: {
		flexDirection: "row",
		gap: 8,
	},
	icon: {
		marginTop: 3,
	},
	text: {
		flex: 1,
		fontSize: 13,
		fontWeight: "500",
		lineHeight: 19,
	},
});
