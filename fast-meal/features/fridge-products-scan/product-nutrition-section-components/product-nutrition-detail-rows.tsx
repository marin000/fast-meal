import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type {
	BarcodeNutrimentValues,
	NutritionDetailRow,
} from "@/interface/barcode-product";
import { formatNutrient, hasNutritionValue } from "@/utils/food-facts-helper";

interface ProductNutritionDetailRowsProps {
	nutriments: BarcodeNutrimentValues;
	showServingValues?: boolean;
	bordered?: boolean;
}

const buildDetailRows = (
	nutriments: BarcodeNutrimentValues,
	labels: {
		sugars: string;
		saturatedFat: string;
		fiber: string;
		salt: string;
	},
	massUnit: string,
): NutritionDetailRow[] => [
	{
		key: "sugars",
		label: labels.sugars,
		per100: nutriments.sugars100g,
		perServing: nutriments.sugarsServing,
		unit: massUnit,
	},
	{
		key: "saturatedFat",
		label: labels.saturatedFat,
		per100: nutriments.saturatedFat100g,
		perServing: nutriments.saturatedFatServing,
		unit: massUnit,
	},
	{
		key: "fiber",
		label: labels.fiber,
		per100: nutriments.fiber100g,
		perServing: nutriments.fiberServing,
		unit: massUnit,
	},
	{
		key: "salt",
		label: labels.salt,
		per100: nutriments.salt100g,
		perServing: nutriments.saltServing,
		unit: massUnit,
	},
];

export const hasVisibleDetailRows = (
	nutriments: BarcodeNutrimentValues,
): boolean =>
	[
		nutriments.sugars100g,
		nutriments.sugarsServing,
		nutriments.saturatedFat100g,
		nutriments.saturatedFatServing,
		nutriments.fiber100g,
		nutriments.fiberServing,
		nutriments.salt100g,
		nutriments.saltServing,
	].some((value) => value !== undefined);

export const ProductNutritionDetailRows = ({
	nutriments,
	showServingValues = false,
	bordered = false,
}: ProductNutritionDetailRowsProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const massUnit = t("recipe.units.g");

	const visibleDetailRows = buildDetailRows(
		nutriments,
		{
			sugars: t("fridge.details.nutrients.sugars"),
			saturatedFat: t("fridge.details.nutrients.saturatedFat"),
			fiber: t("fridge.details.nutrients.fiber"),
			salt: t("fridge.details.nutrients.salt"),
		},
		massUnit,
	).filter((row) => row.per100 !== undefined || row.perServing !== undefined);

	if (visibleDetailRows.length === 0) {
		return null;
	}

	return (
		<View
			style={[
				bordered && styles.detailsBlock,
				bordered && { borderTopColor: theme.rowDivider },
			]}
		>
			<Text style={[styles.detailsTitle, { color: theme.textMuted }]}>
				{t("fridge.details.nutrientDetails")}
			</Text>

			{visibleDetailRows.map((row, index) => (
				<View
					key={row.key}
					style={[
						styles.detailRow,
						index < visibleDetailRows.length - 1 && {
							borderBottomColor: theme.rowDivider,
							borderBottomWidth: 1,
						},
					]}
				>
					<Text style={[styles.detailLabel, { color: theme.text }]}>
						{row.label}
					</Text>
					{showServingValues ? (
						<View style={styles.detailValues}>
							<Text style={[styles.detailPer100, { color: theme.textMuted }]}>
								{formatNutrient(row.per100)}
								{row.unit} / 100g
							</Text>
							{hasNutritionValue(row.perServing) ? (
								<Text style={[styles.detailServing, { color: theme.text }]}>
									{formatNutrient(row.perServing)}
									{row.unit}
								</Text>
							) : null}
						</View>
					) : (
						<Text style={[styles.detailPer100, { color: theme.textMuted }]}>
							{formatNutrient(row.per100)}
							{row.unit} / 100g
						</Text>
					)}
				</View>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	detailsBlock: {
		borderTopWidth: 1,
		gap: 0,
		paddingTop: 16,
	},
	detailsTitle: {
		fontSize: 11,
		fontWeight: "900",
		letterSpacing: 1.2,
		marginBottom: 8,
		textTransform: "uppercase",
	},
	detailRow: {
		gap: 4,
		paddingVertical: 10,
	},
	detailLabel: {
		fontSize: 13,
		fontWeight: "700",
	},
	detailValues: {
		alignItems: "center",
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		justifyContent: "space-between",
	},
	detailPer100: {
		fontSize: 12,
		fontWeight: "500",
	},
	detailServing: {
		fontSize: 14,
		fontWeight: "900",
	},
});
