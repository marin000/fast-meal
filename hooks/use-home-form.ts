import { useMemo, useState } from 'react';

import { quickFilterOptions, type QuickFilterOption } from '@/constants/home';

interface HomeFormPayload {
  ingredients: string;
  selectedFilters: QuickFilterOption[];
}

export const useHomeForm = () => {
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
    const payload: HomeFormPayload = {
      ingredients: ingredientsInputValue.trim(),
      selectedFilters,
    };

    console.log('Generate recipes payload:', payload);
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
