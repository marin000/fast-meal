import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type {
	BarcodeNutrimentValues,
	NutritionMacroScope,
	NutritionMacroStat,
} from "@/interface/barcode-product";
import { formatNutrient, hasNutritionValue } from "@/utils/food-facts-helper";

interface ProductNutritionMacroGridProps {
	nutriments: BarcodeNutrimentValues;
	scope: NutritionMacroScope;
}

const buildMacros = (
	nutriments: BarcodeNutrimentValues,
	scope: NutritionMacroScope,
	labels: {
		calories: string;
		protein: string;
		carbs: string;
		fat: string;
	},
	units: { kcal: string; mass: string },
): NutritionMacroStat[] => {
	const isPer100 = scope === "per100";

	return [
		{
			key: "calories",
			label: labels.calories,
			value: isPer100
				? nutriments.energyKcal100g
				: nutriments.energyKcalServing,
			unit: units.kcal,
		},
		{
			key: "protein",
			label: labels.protein,
			value: isPer100 ? nutriments.proteins100g : nutriments.proteinsServing,
			unit: units.mass,
		},
		{
			key: "carbs",
			label: labels.carbs,
			value: isPer100
				? nutriments.carbohydrates100g
				: nutriments.carbohydratesServing,
			unit: units.mass,
		},
		{
			key: "fat",
			label: labels.fat,
			value: isPer100 ? nutriments.fat100g : nutriments.fatServing,
			unit: units.mass,
		},
	];
};

export const hasServingMacros = (nutriments: BarcodeNutrimentValues): boolean =>
	[
		nutriments.energyKcalServing,
		nutriments.proteinsServing,
		nutriments.carbohydratesServing,
		nutriments.fatServing,
	].some(hasNutritionValue);

export const ProductNutritionMacroGrid = ({
	nutriments,
	scope,
}: ProductNutritionMacroGridProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const macros = buildMacros(
		nutriments,
		scope,
		{
			calories: t("recipe.labels.calories"),
			protein: t("recipe.labels.protein"),
			carbs: t("recipe.labels.carbs"),
			fat: t("recipe.labels.fat"),
		},
		{
			kcal: t("recipe.units.kcal"),
			mass: t("recipe.units.g"),
		},
	);

	return (
		<View style={styles.grid}>
			{macros.map((macro) => (
				<View key={macro.key} style={styles.gridItem}>
					<Text style={[styles.gridValue, { color: theme.text }]}>
						{formatNutrient(macro.value)}
						<Text style={[styles.gridUnit, { color: theme.textMuted }]}>
							{macro.unit}
						</Text>
					</Text>
					<Text style={[styles.gridLabel, { color: theme.textMuted }]}>
						{macro.label}
					</Text>
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	grid: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	gridItem: {
		alignItems: "center",
		flex: 1,
		gap: 2,
	},
	gridValue: {
		fontSize: 18,
		fontWeight: "900",
	},
	gridUnit: {
		fontSize: 10,
		fontWeight: "600",
	},
	gridLabel: {
		fontSize: 11,
		fontWeight: "500",
		textAlign: "center",
	},
});
