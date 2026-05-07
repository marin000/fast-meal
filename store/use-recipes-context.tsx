import { createContext, useContext, type ReactNode } from 'react';

import type { Recipe } from '@/interface';

interface RecipesContextValue {
  recipes: Recipe[];
}

const RecipesContext = createContext<RecipesContextValue | null>(null);

interface RecipesProviderProps {
  recipes: Recipe[];
  children: ReactNode;
}

export const RecipesProvider = ({ recipes, children }: RecipesProviderProps) => {
  return <RecipesContext.Provider value={{ recipes }}>{children}</RecipesContext.Provider>;
};

export const useRecipesContext = () => {
  const value = useContext(RecipesContext);

  if (!value) {
    throw new Error('useRecipesContext must be used within a RecipesProvider');
  }

  return value;
};
