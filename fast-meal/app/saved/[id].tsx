import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { ScreenScrollView } from "@/components";
import { useFeedbackMessage } from "@/context/feedback-message-context";
import { useSavedRecipesList } from "@/context/saved-recipes-context";
import {
	RecipeHero,
	RecipeIngredients,
	RecipeInstructions,
	RecipeNutrition,
	RecipeSubstitutions,
	RecipeTips,
	RecipeWarnings,
} from "@/features/recipes";
import { AddToShoppingListButton } from "@/features/shopping-list";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const SavedRecipeDetailScreen = () => {
	const { t } = useTranslation();
	const { id } = useLocalSearchParams<{ id: string }>();
	const router = useRouter();
	const theme = useAppAppearance();
	const { showMessage } = useFeedbackMessage();
	const { items, isLoading, removeById } = useSavedRecipesList();

	const item = items.find((entry) => entry.id === id);

	const heroRight = item ? (
		<View style={styles.heroActions}>
			<View
				style={[
					styles.heroIconButton,
					{ backgroundColor: theme.substitutionBoxBg, opacity: 0.85 },
				]}
			>
				<Ionicons name="bookmark" size={18} color={theme.primary} />
			</View>
			<Pressable
				accessibilityRole="button"
				onPress={async () => {
					await removeById(item.id);
					showMessage(t("saved.toast.deleted"), "success");
					router.back();
				}}
				style={[
					styles.heroIconButton,
					{ backgroundColor: theme.surfaceOverlay },
				]}
			>
				<Ionicons name="trash-outline" size={18} color={theme.iconMuted} />
			</Pressable>
		</View>
	) : null;

	if (isLoading && !item) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
			</View>
		);
	}

	if (!item) return null;
	const { recipe } = item;

	return (
		<ScreenScrollView
			backgroundColor={theme.background}
			contentContainerStyle={styles.container}
		>
			<RecipeHero
				recipe={recipe}
				onBack={() => router.back()}
				rightActions={heroRight}
			/>

			<View style={styles.body}>
				<Text style={[styles.description, { color: theme.textMuted }]}>
					{recipe.description}
				</Text>

				<RecipeNutrition macros={recipe.macros} />
				<AddToShoppingListButton recipe={recipe} />
				<RecipeIngredients items={recipe.ingredients} />
				<RecipeInstructions steps={recipe.steps} />
				{recipe.substitutions.length > 0 && (
					<RecipeSubstitutions items={recipe.substitutions} />
				)}
				{recipe.tips.length > 0 && <RecipeTips items={recipe.tips} />}
				{recipe.warnings.length > 0 && (
					<RecipeWarnings items={recipe.warnings} />
				)}
			</View>
		</ScreenScrollView>
	);
};

export default SavedRecipeDetailScreen;

const styles = StyleSheet.create({
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	container: {
		gap: 20,
		paddingBottom: 32,
		paddingTop: 4,
	},
	body: {
		gap: 24,
		paddingBottom: 8,
		paddingHorizontal: 20,
	},
	description: {
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 21,
	},
	heroActions: {
		flexDirection: "row",
		gap: 8,
	},
	heroIconButton: {
		alignItems: "center",
		borderRadius: 18,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
});
