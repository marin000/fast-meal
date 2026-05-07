import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { quickFilterOptions, type QuickFilterOption } from '@/constants/home';

export const useHomeForm = () => {
  const router = useRouter();
  const [ingredientsInputValue, setIngredientsInputValue] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<QuickFilterOption[]>([]);

  const toggleFilterOption = (filter: QuickFilterOption) => {
    setSelectedFilters((previousFilters) =>
      previousFilters.includes(filter)
        ? previousFilters.filter((item) => item !== filter)
        : [...previousFilters, filter],
    );
  };

  const canSubmit = useMemo(() => ingredientsInputValue.trim().length > 0, [ingredientsInputValue]);

  const submitForm = () => {
    router.push({
      pathname: '/recipes',
      params: {
        ingredients: ingredientsInputValue.trim(),
        preferences: selectedFilters.join(','),
      },
    });
  };

  return {
    ingredientsInputValue,
    setIngredientsInputValue,
    selectedFilters,
    toggleFilterOption,
    quickFilterOptions,
    canSubmit,
    submitForm,
  };
};
