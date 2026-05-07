import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { generateRecipe } from '@/api';
import { quickFilterOptions, type QuickFilterOption } from '@/constants/home';

export const useHomeForm = () => {
  const { t } = useTranslation();
  const [ingredientsInputValue, setIngredientsInputValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<QuickFilterOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleFilterOption = (filter: QuickFilterOption) => {
    setSelectedFilters((previousFilters) =>
      previousFilters.includes(filter)
        ? previousFilters.filter((item) => item !== filter)
        : [...previousFilters, filter],
    );
  };

  const canSubmit = useMemo(
    () => ingredientsInputValue.trim().length > 0 && !isSubmitting,
    [ingredientsInputValue, isSubmitting],
  );

  const submitForm = async () => {
    setIsSubmitting(true);

    try {
      const response = await generateRecipe({
        ingredientsInput: ingredientsInputValue,
        selectedFilters,
      });

      if (response.declined) {
        Alert.alert(t('message.recipeGenerator'), response.message ?? t('message.unableToHelp'));
        return;
      }

      console.log('Generate recipes response:', response);
    } catch (error) {
      const message = error instanceof Error ? error.message : t('message.unknownError');
      Alert.alert(t('message.recipeGenerationFailed'), message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    ingredientsInputValue,
    setIngredientsInputValue,
    selectedFilters,
    toggleFilterOption,
    quickFilterOptions,
    canSubmit,
    isSubmitting,
    submitForm,
  };
};
