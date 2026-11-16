import { useTranslation } from "react-i18next";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";

import { OPEN_FOOD_FACTS_WEBSITE_URL, USDA_FOODDATA_CENTRAL_URL } from "@/constants/nutrition-sources";
import { useAppAppearance } from "@/hooks/use-app-appearance";

type NutritionSourceKind = "recipe" | "barcode";

interface NutritionSourceCitationProps {
	kind: NutritionSourceKind;
	/** Shorter line for recipe list cards. */
	compact?: boolean;
}

const openSourceUrl = (kind: NutritionSourceKind) => {
	const url = kind === "recipe" ? USDA_FOODDATA_CENTRAL_URL : OPEN_FOOD_FACTS_WEBSITE_URL;
	void Linking.openURL(url);
};

export const NutritionSourceCitation = ({ kind, compact = false }: NutritionSourceCitationProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const disclaimerKey =
		kind === "recipe"
			? compact
				? "recipe.nutritionCitation.compactDisclaimer"
				: "recipe.nutritionCitation.disclaimer"
			: "fridge.details.nutritionCitation.disclaimer";

	const linkKey =
		kind === "recipe" ? "recipe.nutritionCitation.sourceLink" : "fridge.details.nutritionCitation.sourceLink";

	return (
		<View style={compact ? styles.compactWrap : styles.wrap}>
			<Text style={[compact ? styles.compactText : styles.text, { color: theme.textMuted }]}>{t(disclaimerKey)}</Text>
			<Pressable
				accessibilityRole="link"
				accessibilityLabel={t(linkKey)}
				hitSlop={8}
				onPress={() => openSourceUrl(kind)}
			>
				<Text style={[compact ? styles.compactLink : styles.link, { color: theme.primary }]}>{t(linkKey)}</Text>
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		gap: 4,
		marginTop: 4,
	},
	text: {
		fontSize: 11,
		fontWeight: "500",
		lineHeight: 15,
	},
	link: {
		fontSize: 11,
		fontWeight: "700",
		lineHeight: 15,
		textDecorationLine: "underline",
	},
	compactWrap: {
		gap: 2,
		marginTop: 2,
	},
	compactText: {
		fontSize: 10,
		fontWeight: "500",
		lineHeight: 13,
	},
	compactLink: {
		fontSize: 10,
		fontWeight: "700",
		lineHeight: 13,
		textDecorationLine: "underline",
	},
});
