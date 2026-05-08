import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

import { RecipeSection } from "./section";

interface RecipeInstructionsProps {
	steps: string[];
}

export const RecipeInstructions = ({ steps }: RecipeInstructionsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<RecipeSection label={t("recipe.steps")}>
			<View style={styles.list}>
				{steps.map((step, index) => (
					<View key={step} style={styles.row}>
						<View style={[styles.circle, { backgroundColor: theme.primary }]}>
							<Text style={styles.circleText}>{index + 1}</Text>
						</View>
						<Text style={[styles.text, { color: theme.text }]}>{step}</Text>
					</View>
				))}
			</View>
		</RecipeSection>
	);
};

const styles = StyleSheet.create({
	list: {
		gap: 14,
	},
	row: {
		flexDirection: "row",
		gap: 12,
	},
	circle: {
		alignItems: "center",
		borderRadius: 12,
		height: 24,
		justifyContent: "center",
		width: 24,
	},
	circleText: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "900",
	},
	text: {
		flex: 1,
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 21,
	},
});
