import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DifficultyBadge } from "@/components";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { Recipe } from "@/interface";
import { macroMassFromGrams } from "@/utils/macro-display";

interface RecipeCardProps {
	recipe: Recipe;
	onPress: () => void;
}

export const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { units } = usePreferences();
	const imperial = units === "imperial";
	const massUnit = imperial ? t("recipe.units.oz") : t("recipe.units.g");

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
			<View style={[styles.accent, { backgroundColor: theme.primary }]} />

			<View style={styles.body}>
				<View style={styles.titleRow}>
					<Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
						{recipe.title}
					</Text>
					<DifficultyBadge difficulty={recipe.difficulty} />
				</View>

				<Text
					style={[styles.description, { color: theme.textMuted }]}
					numberOfLines={2}
				>
					{recipe.description}
				</Text>

				<View style={styles.statsRow}>
					<View style={styles.statItem}>
						<Ionicons name="time-outline" size={14} color={theme.iconMuted} />
						<Text style={[styles.statText, { color: theme.iconMuted }]}>
							{t("recipe.prepTime", { minutes: recipe.prepTimeMinutes })}
						</Text>
					</View>
					<View style={styles.statItem}>
						<Ionicons name="flame-outline" size={14} color={theme.iconMuted} />
						<Text style={[styles.statText, { color: theme.iconMuted }]}>
							{t("recipe.kcal", { calories: recipe.macros.calories })}
						</Text>
					</View>
					<View style={styles.statItem}>
						<Ionicons
							name="barbell-outline"
							size={14}
							color={theme.iconMuted}
						/>
						<Text style={[styles.statText, { color: theme.iconMuted }]}>
							{t("recipe.proteinG", {
								protein: macroMassFromGrams(recipe.macros.protein, imperial),
								massUnit,
							})}
						</Text>
					</View>
				</View>

				<Pressable
					accessibilityRole="button"
					onPress={onPress}
					style={[styles.ctaButton, { backgroundColor: theme.primary }]}
				>
					<Text style={styles.ctaText}>{t("recipe.cta.seeRecipe")}</Text>
					<Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 20,
		borderWidth: 1,
		flexDirection: "row",
		overflow: "hidden",
	},
	accent: {
		width: 4,
	},
	body: {
		flex: 1,
		gap: 10,
		padding: 16,
	},
	titleRow: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
	title: {
		flex: 1,
		fontSize: 17,
		fontWeight: "900",
		lineHeight: 22,
	},
	description: {
		fontSize: 13,
		fontWeight: "500",
		lineHeight: 18,
	},
	statsRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
		marginTop: 2,
	},
	statItem: {
		alignItems: "center",
		flexDirection: "row",
		gap: 4,
	},
	statText: {
		fontSize: 12,
		fontWeight: "600",
	},
	ctaButton: {
		alignItems: "center",
		borderRadius: 12,
		flexDirection: "row",
		gap: 6,
		justifyContent: "center",
		marginTop: 6,
		paddingVertical: 10,
	},
	ctaText: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "900",
	},
});
