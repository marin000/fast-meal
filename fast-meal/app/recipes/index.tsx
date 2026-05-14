import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";

import { RecipeCard, RecipesHeader } from "@/features/recipes";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { useRecipesContext } from "@/store/use-recipes-context";

const RecipesListScreen = () => {
	const { recipes } = useRecipesContext();
	const router = useRouter();
	const theme = useAppAppearance();

	const openRecipe = (index: number) => {
		router.push({
			pathname: "/recipes/[index]",
			params: { index: String(index) },
		});
	};

	return (
		<ScrollView
			style={{ backgroundColor: theme.background }}
			contentContainerStyle={styles.container}
		>
			<RecipesHeader />

			<View style={styles.cardsList}>
				{recipes.map((recipe, index) => (
					<RecipeCard
						key={`${recipe.title}-${index}`}
						recipe={recipe}
						recipeIndex={index}
						onPress={() => openRecipe(index)}
					/>
				))}
			</View>
		</ScrollView>
	);
};

export default RecipesListScreen;

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 120,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
	cardsList: {
		gap: 16,
	},
});
