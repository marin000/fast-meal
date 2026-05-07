import { useLocalSearchParams, useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import {
  RecipeHero,
  RecipeIngredients,
  RecipeInstructions,
  RecipeNutrition,
  RecipeSubstitutions,
  RecipeTips,
  RecipeWarnings,
} from '@/features/recipes';
import { useRecipesContext } from '@/store/use-recipes-context';

const RecipeDetailScreen = () => {
  const { recipes } = useRecipesContext();
  const router = useRouter();
  const { index } = useLocalSearchParams<{ index: string }>();
  const recipe = recipes[Number(index)];

  if (!recipe) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <RecipeHero recipe={recipe} onBack={() => router.back()} />

      <View style={styles.body}>
        <Text style={styles.description}>{recipe?.description}</Text>

        <RecipeNutrition macros={recipe?.macros} />
        <RecipeIngredients items={recipe?.ingredients} />
        <RecipeInstructions steps={recipe?.steps} />
        {recipe?.substitutions.length > 0 && <RecipeSubstitutions items={recipe?.substitutions} />}
        {recipe?.tips.length > 0 && <RecipeTips items={recipe?.tips} />}
        {recipe?.warnings.length > 0 && <RecipeWarnings items={recipe?.warnings} />}
      </View>
    </ScrollView>
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
    color: '#6B7A6B',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
