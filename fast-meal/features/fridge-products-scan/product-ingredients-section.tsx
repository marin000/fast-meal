import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import { formatAllergenTag } from "@/utils/food-facts-helper";

interface ProductIngredientsSectionProps {
	ingredients?: string;
	allergensTags?: string[];
}

export const ProductIngredientsSection = ({
	ingredients,
	allergensTags,
}: ProductIngredientsSectionProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const hasIngredients = Boolean(ingredients);
	const hasAllergens = Boolean(allergensTags && allergensTags.length > 0);

	if (!hasIngredients && !hasAllergens) {
		return null;
	}

	return (
		<View style={styles.wrap}>
			{hasIngredients ? (
				<View style={styles.section}>
					<Text style={[styles.label, { color: theme.textMuted }]}>
						{t("fridge.details.ingredients")}
					</Text>
					<Text style={[styles.body, { color: theme.text }]}>
						{ingredients}
					</Text>
				</View>
			) : null}

			{hasAllergens ? (
				<View style={styles.section}>
					<Text style={[styles.label, { color: theme.textMuted }]}>
						{t("fridge.details.allergens")}
					</Text>
					<View style={styles.allergenChips}>
						{allergensTags?.map((tag) => (
							<View
								key={tag}
								style={[
									styles.chip,
									{ backgroundColor: theme.substitutionBoxBg },
								]}
							>
								<Text style={[styles.chipText, { color: theme.primary }]}>
									{formatAllergenTag(tag)}
								</Text>
							</View>
						))}
					</View>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		gap: 24,
	},
	section: {
		gap: 12,
	},
	label: {
		fontSize: 11,
		fontWeight: "900",
		letterSpacing: 1.4,
		textTransform: "uppercase",
	},
	body: {
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 21,
	},
	allergenChips: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	chip: {
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 6,
	},
	chipText: {
		fontSize: 12,
		fontWeight: "700",
	},
});
