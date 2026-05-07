import { ScrollView, StyleSheet, View } from 'react-native';

import { LoadingScreen, RecipeCard, RecipesHeader } from '@/features/recipes';
import { useRecipes } from '@/hooks/use-recipes';

const RecipesScreen = () => {
  const { recipes } = useRecipes();

  if (!recipes) {
    return <LoadingScreen />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RecipesHeader />

      <View style={styles.cardsList}>
        {recipes.map((recipe, index) => (
          <RecipeCard key={`${recipe.title}-${index}`} recipe={recipe} />
        ))}
      </View>
    </ScrollView>
  );
};

export default RecipesScreen;

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
