import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { Recipe } from "@/interface";
import { macroMassFromGrams } from "@/utils/macro-display";

interface SavedRecipeCardProps {
	recipe: Recipe;
	onOpen: () => void;
	onDelete: () => void;
}

export const SavedRecipeCard = ({
	recipe,
	onOpen,
	onDelete,
}: SavedRecipeCardProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { units } = usePreferences();
	const imperial = units === "imperial";
	const massUnit = imperial ? t("recipe.units.oz") : t("recipe.units.g");

	return (
		<Pressable
			accessibilityRole="button"
			accessibilityLabel={recipe.title}
			onPress={onOpen}
			style={[
				styles.card,
				{
					backgroundColor: theme.card,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<View style={[styles.accent, { backgroundColor: theme.primary }]} />

			<View style={styles.middle}>
				<Text style={[styles.title, { color: theme.text }]} numberOfLines={2}>
					{recipe.title}
				</Text>
				<View style={styles.macrosRow}>
					<View style={styles.macroItem}>
						<Ionicons name="flame-outline" size={12} color={theme.iconMuted} />
						<Text style={[styles.macroText, { color: theme.iconMuted }]}>
							{t("recipe.kcal", { calories: recipe.macros.calories })}
						</Text>
					</View>
					<View style={styles.macroItem}>
						<Ionicons
							name="nutrition-outline"
							size={12}
							color={theme.iconMuted}
						/>
						<Text style={[styles.macroText, { color: theme.iconMuted }]}>
							{t("recipe.labels.protein")}{" "}
							{macroMassFromGrams(recipe.macros.protein, imperial)}
							{massUnit}
						</Text>
					</View>
					<View style={styles.macroItem}>
						<Ionicons name="leaf-outline" size={12} color={theme.iconMuted} />
						<Text style={[styles.macroText, { color: theme.iconMuted }]}>
							{t("recipe.labels.carbs")} {recipe.macros.carbs}
							{t("recipe.units.g")}
						</Text>
					</View>
					<View style={styles.macroItem}>
						<Ionicons name="water-outline" size={12} color={theme.iconMuted} />
						<Text style={[styles.macroText, { color: theme.iconMuted }]}>
							{t("recipe.labels.fat")} {recipe.macros.fat}
							{t("recipe.units.g")}
						</Text>
					</View>
				</View>
			</View>

			<View style={styles.actions}>
				<Pressable
					accessibilityRole="button"
					onPress={onOpen}
					style={[
						styles.iconButton,
						{ backgroundColor: theme.substitutionBoxBg },
					]}
				>
					<Ionicons name="arrow-forward" size={16} color={theme.primary} />
				</Pressable>
				<Pressable
					accessibilityRole="button"
					onPress={onDelete}
					style={[styles.iconButton, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Ionicons name="trash-outline" size={16} color={theme.iconMuted} />
				</Pressable>
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	card: {
		alignItems: "stretch",
		borderRadius: 16,
		borderWidth: 1,
		flexDirection: "row",
		overflow: "hidden",
	},
	accent: {
		alignSelf: "stretch",
		width: 4,
	},
	middle: {
		flex: 1,
		gap: 8,
		justifyContent: "center",
		minWidth: 0,
		paddingHorizontal: 12,
		paddingVertical: 12,
	},
	title: {
		fontSize: 15,
		fontWeight: "900",
		lineHeight: 20,
	},
	macrosRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	macroItem: {
		alignItems: "center",
		flexDirection: "row",
		gap: 4,
	},
	macroText: {
		fontSize: 11,
		fontWeight: "600",
	},
	actions: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
		justifyContent: "center",
		paddingRight: 12,
	},
	iconButton: {
		alignItems: "center",
		borderRadius: 999,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
});
