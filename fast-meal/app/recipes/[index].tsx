import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenScrollView } from "@/components";

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
import { useRecipesContext } from "@/store/use-recipes-context";

const RecipeDetailScreen = () => {
	const router = useRouter();
	const theme = useAppAppearance();
	const { index: indexParam } = useLocalSearchParams<{ index: string }>();
	const recipeIndex = Number(indexParam);
	const {
		recipes,
		getSavedBackendIdForIndex,
		saveRecipeAtIndex,
		removeSavedRecipeAtIndex,
		isBusyForIndex,
	} = useRecipesContext();
	const recipe = recipes[recipeIndex];

	if (!recipe) {
		return null;
	}

	const savedId = getSavedBackendIdForIndex(recipeIndex);
	const isSaved = savedId !== null;
	const isBusy = isBusyForIndex(recipeIndex);

	const heroRight = (
		<View style={styles.heroActions}>
			<Pressable
				accessibilityRole="button"
				disabled={isBusy || isSaved}
				onPress={() => saveRecipeAtIndex(recipeIndex)}
				style={[
					styles.heroIconButton,
					{ backgroundColor: theme.substitutionBoxBg },
				]}
			>
				<Ionicons
					name={isSaved ? "bookmark" : "bookmark-outline"}
					size={18}
					color={isSaved ? theme.primary : theme.text}
				/>
			</Pressable>
			{isSaved ? (
				<Pressable
					accessibilityRole="button"
					disabled={isBusy}
					onPress={() => removeSavedRecipeAtIndex(recipeIndex)}
					style={[
						styles.heroIconButton,
						{ backgroundColor: theme.surfaceOverlay },
					]}
				>
					<Ionicons name="trash-outline" size={18} color={theme.iconMuted} />
				</Pressable>
			) : null}
		</View>
	);

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

export default RecipeDetailScreen;

const styles = StyleSheet.create({
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
