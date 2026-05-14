import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DifficultyBadge } from "@/components";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { Recipe } from "@/interface";
import { useRecipesContext } from "@/store/use-recipes-context";
import { macroMassFromGrams } from "@/utils/macro-display";

interface RecipeCardProps {
	recipe: Recipe;
	recipeIndex: number;
	onPress: () => void;
}

export const RecipeCard = ({
	recipe,
	recipeIndex,
	onPress,
}: RecipeCardProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { units } = usePreferences();
	const imperial = units === "imperial";
	const massUnit = imperial ? t("recipe.units.oz") : t("recipe.units.g");
	const { getSavedBackendIdForIndex, saveRecipeAtIndex, isBusyForIndex } =
		useRecipesContext();

	const savedId = getSavedBackendIdForIndex(recipeIndex);
	const isSaved = savedId !== null;
	const isBusy = isBusyForIndex(recipeIndex);

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
				<View style={styles.topRow}>
					<View style={[styles.titleRow, styles.titleRowGrow]}>
						<Text
							style={[styles.title, { color: theme.text }]}
							numberOfLines={2}
						>
							{recipe.title}
						</Text>
						<DifficultyBadge difficulty={recipe.difficulty} />
					</View>
					<View style={styles.iconActions}>
						{!isSaved && (
							<Pressable
								accessibilityRole="button"
								disabled={isBusy}
								onPress={() => saveRecipeAtIndex(recipeIndex)}
								style={[
									styles.iconButton,
									{ backgroundColor: theme.substitutionBoxBg },
								]}
							>
								<Ionicons
									name="bookmark-outline"
									size={16}
									color={theme.text}
								/>
							</Pressable>
						)}
					</View>
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
	topRow: {
		flexDirection: "row",
		gap: 10,
		justifyContent: "space-between",
	},
	titleRow: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 12,
		justifyContent: "space-between",
	},
	titleRowGrow: {
		flex: 1,
		minWidth: 0,
	},
	title: {
		flex: 1,
		fontSize: 17,
		fontWeight: "900",
		lineHeight: 22,
	},
	iconActions: {
		flexDirection: "row",
		gap: 8,
	},
	iconButton: {
		alignItems: "center",
		borderRadius: 999,
		height: 36,
		justifyContent: "center",
		width: 36,
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
