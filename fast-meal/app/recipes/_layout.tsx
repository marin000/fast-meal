import { Stack } from 'expo-router';

import { appBackgroundColor } from '@/constants/navigation-theme';
import { LoadingScreen } from '@/features/recipes';
import { useRecipes } from '@/hooks/use-recipes';
import { RecipesProvider } from '@/store/use-recipes-context';

const RecipesLayout = () => {
  const { recipes } = useRecipes();

  if (!recipes) {
    return <LoadingScreen />;
  }

  return (
    <RecipesProvider recipes={recipes}>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: appBackgroundColor } }} />
    </RecipesProvider>
  );
};

export default RecipesLayout;
