import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

import { generateRecipe } from '@/api';
import type { QuickFilterOption } from '@/constants/home';
import type { Recipe } from '@/interface';
import { coerceParam } from '@/utils/helper';

interface RecipesParams {
  ingredients?: string | string[];
  preferences?: string | string[];
}

export const useRecipes = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const params = useLocalSearchParams() as RecipesParams;
  const [recipes, setRecipes] = useState<Recipe[] | null>(null);
  const hasRunRef = useRef(false);

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const goBack = () => router.back();
    const showAlert = (titleKey: string) => {
      Alert.alert(t(titleKey), undefined, [{ text: 'OK', onPress: goBack }]);
    };

    const fetchRecipes = async () => {
      try {
        const ingredientsInput = coerceParam(params.ingredients);
        const preferencesString = coerceParam(params.preferences);
        const selectedFilters = preferencesString.split(',').filter(Boolean) as QuickFilterOption[];

        const response = await generateRecipe({ ingredientsInput, selectedFilters });

        if (response.declined) {
          showAlert('errors.declined');
          return;
        }

        if (!response.recipes || response.recipes.length === 0) {
          showAlert('errors.noRecipes');
          return;
        }

        setRecipes(response.recipes);
      } catch (error) {
        const detail = error instanceof Error ? error.message : t('message.unknownError');
        Alert.alert(t('errors.generic'), detail, [{ text: 'OK', onPress: goBack }]);
      }
    };

    fetchRecipes();
  }, [params, router, t]);

  return { recipes };
};
