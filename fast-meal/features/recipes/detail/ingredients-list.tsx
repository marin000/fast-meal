import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { RecipeIngredient } from "@/interface";

import { RecipeSection } from "./section";

interface RecipeIngredientsProps {
	items: RecipeIngredient[];
}

export const RecipeIngredients = ({ items }: RecipeIngredientsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<RecipeSection label={t("recipe.ingredients")}>
			<View>
				{items.map((ingredient, index) => {
					const isLast = index === items.length - 1;

					return (
						<View
							key={`${ingredient.name}-${index}`}
							style={[
								styles.row,
								!isLast && {
									borderBottomColor: theme.rowDivider,
									borderBottomWidth: 1,
								},
							]}
						>
							<Text style={[styles.amount, { color: theme.primary }]}>
								{ingredient.quantity} {ingredient.unit}
							</Text>
							<Text style={[styles.name, { color: theme.text }]}>
								{ingredient.name}
							</Text>
						</View>
					);
				})}
			</View>
		</RecipeSection>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		gap: 12,
		paddingVertical: 10,
	},
	amount: {
		fontSize: 12,
		fontWeight: "900",
		minWidth: 70,
	},
	name: {
		flex: 1,
		fontSize: 14,
		fontWeight: "500",
	},
});
