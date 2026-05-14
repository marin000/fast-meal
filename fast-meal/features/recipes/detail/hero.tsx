import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { DifficultyBadge } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { Recipe } from "@/interface";

interface RecipeHeroProps {
	recipe: Recipe;
	onBack: () => void;
	rightActions?: ReactNode;
}

export const RecipeHero = ({
	recipe,
	onBack,
	rightActions,
}: RecipeHeroProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View style={styles.hero}>
			<View style={styles.toolbar}>
				<Pressable
					accessibilityRole="button"
					onPress={onBack}
					style={[styles.backButton, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Ionicons name="chevron-back" size={20} color={theme.text} />
				</Pressable>
				{rightActions != null ? (
					<View style={styles.rightActions}>{rightActions}</View>
				) : (
					<View style={styles.toolbarSpacer} />
				)}
			</View>

			<View style={styles.titleBlock}>
				<View style={[styles.accent, { backgroundColor: theme.primary }]} />

				<View style={styles.titleContent}>
					<Text style={[styles.title, { color: theme.text }]}>
						{recipe.title}
					</Text>
					<View style={styles.badgesRow}>
						<View
							style={[
								styles.timeBadge,
								{ backgroundColor: theme.surfaceOverlay },
							]}
						>
							<Ionicons name="time-outline" size={12} color={theme.iconMuted} />
							<Text style={[styles.timeBadgeText, { color: theme.iconMuted }]}>
								{t("recipe.prepTime", { minutes: recipe.prepTimeMinutes })}
							</Text>
						</View>
						<DifficultyBadge difficulty={recipe.difficulty} />
					</View>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	hero: {
		gap: 14,
		paddingHorizontal: 20,
		paddingTop: 4,
	},
	toolbar: {
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
		justifyContent: "space-between",
	},
	toolbarSpacer: {
		flex: 1,
	},
	rightActions: {
		alignItems: "center",
		flexDirection: "row",
		flex: 1,
		gap: 8,
		justifyContent: "flex-end",
	},
	backButton: {
		alignItems: "center",
		alignSelf: "flex-start",
		borderRadius: 18,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	titleBlock: {
		flexDirection: "row",
		gap: 12,
	},
	accent: {
		borderRadius: 2,
		width: 4,
	},
	titleContent: {
		flex: 1,
		gap: 10,
	},
	title: {
		fontSize: 26,
		fontWeight: "900",
		lineHeight: 32,
	},
	badgesRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
	},
	timeBadge: {
		alignItems: "center",
		borderRadius: 999,
		flexDirection: "row",
		gap: 4,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	timeBadgeText: {
		fontSize: 11,
		fontWeight: "700",
	},
});
