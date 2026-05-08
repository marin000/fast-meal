import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

import { RecipeSection } from "./section";

interface RecipeWarningsProps {
	items: string[];
}

export const RecipeWarnings = ({ items }: RecipeWarningsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<RecipeSection label={t("recipe.warnings")}>
			<View style={styles.list}>
				{items.map((warning) => (
					<View key={warning} style={styles.row}>
						<Ionicons
							name="warning-outline"
							size={14}
							color={theme.warning}
							style={styles.icon}
						/>
						<Text style={[styles.text, { color: theme.warning }]}>
							{warning}
						</Text>
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
