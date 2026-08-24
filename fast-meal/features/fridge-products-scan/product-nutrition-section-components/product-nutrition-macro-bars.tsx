import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type {
	BarcodeNutrimentValues,
	NutritionMacroScope,
} from "@/interface/barcode-product";
import { NutritionBar } from "./nutrition-bar";

interface ProductNutritionMacroBarsProps {
	nutriments: BarcodeNutrimentValues;
	scope: NutritionMacroScope;
}

export const ProductNutritionMacroBars = ({
	nutriments,
	scope,
}: ProductNutritionMacroBarsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const massUnit = t("recipe.units.g");
	const isPer100 = scope === "per100";

	const protein = isPer100
		? nutriments.proteins100g
		: nutriments.proteinsServing;
	const carbs = isPer100
		? nutriments.carbohydrates100g
		: nutriments.carbohydratesServing;
	const fat = isPer100 ? nutriments.fat100g : nutriments.fatServing;

	return (
		<View style={styles.bars}>
			<NutritionBar
				label={t("recipe.labels.protein")}
				value={protein}
				max={50}
				color={theme.primary}
				unit={massUnit}
			/>
			<NutritionBar
				label={t("recipe.labels.carbs")}
				value={carbs}
				max={100}
				color="#3B82F6"
				unit={massUnit}
			/>
			<NutritionBar
				label={t("recipe.labels.fat")}
				value={fat}
				max={60}
				color="#F5A623"
				unit={massUnit}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	bars: {
		gap: 10,
	},
});
