import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { BarcodeNutrimentValues } from "@/interface/barcode-product";

import {
	hasServingMacros,
	hasVisibleDetailRows,
	ProductNutritionDetailRows,
	ProductNutritionMacroBars,
	ProductNutritionMacroGrid,
} from "./product-nutrition-section-components";

interface ProductNutritionSectionProps {
	nutriments: BarcodeNutrimentValues;
	servingSize?: string;
}

export const ProductNutritionSection = ({
	nutriments,
	servingSize,
}: ProductNutritionSectionProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const showServingCard = hasServingMacros(nutriments);
	const showDetailsOnlyCard =
		!showServingCard && hasVisibleDetailRows(nutriments);

	return (
		<View style={styles.wrap}>
			<View
				style={[
					styles.card,
					{ backgroundColor: theme.card, borderColor: theme.cardBorder },
				]}
			>
				<Text style={[styles.label, { color: theme.textMuted }]}>
					{t("recipe.nutrition")}
				</Text>
				<Text style={[styles.sectionTitle, { color: theme.text }]}>
					{t("fridge.details.per100g")}
				</Text>

				<ProductNutritionMacroGrid nutriments={nutriments} scope="per100" />
				<ProductNutritionMacroBars nutriments={nutriments} scope="per100" />
			</View>

			{showServingCard ? (
				<View
					style={[
						styles.card,
						{ backgroundColor: theme.card, borderColor: theme.cardBorder },
					]}
				>
					<Text style={[styles.label, { color: theme.textMuted }]}>
						{t("recipe.nutrition")}
					</Text>
					<Text style={[styles.sectionTitle, { color: theme.text }]}>
						{servingSize
							? t("fridge.details.perServingWithSize", { size: servingSize })
							: t("fridge.details.perServing")}
					</Text>

					<ProductNutritionMacroGrid
						nutriments={nutriments}
						scope="perServing"
					/>
					<ProductNutritionMacroBars
						nutriments={nutriments}
						scope="perServing"
					/>
					<ProductNutritionDetailRows
						nutriments={nutriments}
						showServingValues
						bordered
					/>
				</View>
			) : null}

			{showDetailsOnlyCard ? (
				<View
					style={[
						styles.card,
						{ backgroundColor: theme.card, borderColor: theme.cardBorder },
					]}
				>
					<ProductNutritionDetailRows nutriments={nutriments} />
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	wrap: {
		gap: 16,
	},
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
	sectionTitle: {
		fontSize: 15,
		fontWeight: "900",
		marginTop: -8,
	},
});
