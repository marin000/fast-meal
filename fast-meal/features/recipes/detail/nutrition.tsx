import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { RecipeMacros } from "@/interface";
import { macroBarMaxFromGrams, macroMassFromGrams } from "@/utils/macro-display";

interface NutritionBarProps {
	label: string;
	value: number;
	max: number;
	color: string;
	unit: string;
}

const NutritionBar = ({
	label,
	value,
	max,
	color,
	unit,
}: NutritionBarProps) => {
	const theme = useAppAppearance();
	const fillPercentage = Math.min(100, Math.round((value / max) * 100));

	return (
		<View style={styles.barWrapper}>
			<View style={styles.barHeader}>
				<Text style={[styles.barLabel, { color: theme.textMuted }]}>
					{label}
				</Text>
				<Text style={[styles.barValue, { color: theme.text }]}>
					{value}
					{unit}
				</Text>
			</View>
			<View
				style={[styles.barTrack, { backgroundColor: theme.nutritionBarTrack }]}
			>
				<View
					style={[
						styles.barFill,
						{ width: `${fillPercentage}%`, backgroundColor: color },
					]}
				/>
			</View>
		</View>
	);
};

interface RecipeNutritionProps {
	macros: RecipeMacros;
}

export const RecipeNutrition = ({ macros }: RecipeNutritionProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { units } = usePreferences();
	const imperial = units === "imperial";
	const kcal = t("recipe.units.kcal");
	const massUnit = imperial ? t("recipe.units.oz") : t("recipe.units.g");

	const stats = [
		{ key: "calories", value: macros.calories, unit: kcal },
		{
			key: "protein",
			value: macroMassFromGrams(macros.protein, imperial),
			unit: massUnit,
		},
		{
			key: "carbs",
			value: macroMassFromGrams(macros.carbs, imperial),
			unit: massUnit,
		},
		{
			key: "fat",
			value: macroMassFromGrams(macros.fat, imperial),
			unit: massUnit,
		},
	] as const;

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: theme.card,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<Text style={[styles.label, { color: theme.textMuted }]}>
				{t("recipe.nutrition")}
			</Text>

			<View style={styles.grid}>
				{stats.map((stat) => (
					<View key={stat.key} style={styles.gridItem}>
						<Text style={[styles.gridValue, { color: theme.text }]}>
							{stat.value}
							<Text style={[styles.gridUnit, { color: theme.textMuted }]}>
								{stat.unit}
							</Text>
						</Text>
						<Text style={[styles.gridLabel, { color: theme.textMuted }]}>
							{t(`recipe.labels.${stat.key}`)}
						</Text>
					</View>
				))}
			</View>

			<View style={styles.bars}>
				<NutritionBar
					label={t("recipe.labels.protein")}
					value={macroMassFromGrams(macros.protein, imperial)}
					max={macroBarMaxFromGrams(50, imperial)}
					color={theme.primary}
					unit={massUnit}
				/>
				<NutritionBar
					label={t("recipe.labels.carbs")}
					value={macroMassFromGrams(macros.carbs, imperial)}
					max={macroBarMaxFromGrams(100, imperial)}
					color="#3B82F6"
					unit={massUnit}
				/>
				<NutritionBar
					label={t("recipe.labels.fat")}
					value={macroMassFromGrams(macros.fat, imperial)}
					max={macroBarMaxFromGrams(60, imperial)}
					color="#F5A623"
					unit={massUnit}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 18,
		borderWidth: 1,
		gap: 16,
		padding: 16,
	},
	label: {
		fontSize: 11,
		fontWeight: "900",
		letterSpacing: 1.4,
		textTransform: "uppercase",
	},
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
	},
	bars: {
		gap: 10,
	},
	barWrapper: {
		gap: 4,
	},
	barHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	barLabel: {
		fontSize: 12,
		fontWeight: "600",
	},
	barValue: {
		fontSize: 12,
		fontWeight: "900",
	},
	barTrack: {
		borderRadius: 999,
		height: 6,
		overflow: "hidden",
	},
	barFill: {
		borderRadius: 999,
		height: "100%",
	},
});
