import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { RecipeSubstitution } from "@/interface";

import { RecipeSection } from "./section";

interface RecipeSubstitutionsProps {
	items: RecipeSubstitution[];
}

export const RecipeSubstitutions = ({ items }: RecipeSubstitutionsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<RecipeSection label={t("recipe.substitutions")}>
			<View style={styles.list}>
				{items.map((substitution) => (
					<View
						key={substitution.ingredient}
						style={[styles.box, { backgroundColor: theme.substitutionBoxBg }]}
					>
						<Ionicons
							name="alert-circle-outline"
							size={16}
							color={theme.primary}
							style={styles.icon}
						/>
						<Text style={[styles.text, { color: theme.text }]}>
							<Text style={styles.original}>{substitution.ingredient}</Text>
							<Text style={[styles.arrow, { color: theme.textMuted }]}>
								{" "}
								→{" "}
							</Text>
							<Text style={styles.alternatives}>
								{substitution.alternatives.join(" · ")}
							</Text>
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
	box: {
		borderRadius: 12,
		flexDirection: "row",
		gap: 8,
		padding: 12,
	},
	icon: {
		marginTop: 2,
	},
	text: {
		flex: 1,
		fontSize: 13,
		lineHeight: 19,
	},
	original: {
		fontWeight: "900",
	},
	arrow: {},
	alternatives: {
		fontWeight: "500",
	},
});
