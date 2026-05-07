import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { RecipeIngredient } from '@/interface';

import { RecipeSection } from './section';

interface RecipeIngredientsProps {
  items: RecipeIngredient[];
}

export const RecipeIngredients = ({ items }: RecipeIngredientsProps) => {
  const { t } = useTranslation();

  return (
    <RecipeSection label={t('recipe.ingredients')}>
      <View>
        {items.map((ingredient, index) => {
          const isLast = index === items.length - 1;

          return (
            <View key={`${ingredient.name}-${index}`} style={[styles.row, !isLast && styles.rowDivider]}>
              <Text style={styles.amount}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
              <Text style={styles.name}>{ingredient.name}</Text>
            </View>
          );
        })}
      </View>
    </RecipeSection>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  rowDivider: {
    borderBottomColor: 'rgba(20, 26, 20, 0.08)',
    borderBottomWidth: 1,
  },
  amount: {
    color: '#2D8A4E',
    fontSize: 12,
    fontWeight: '900',
    minWidth: 70,
  },
  name: {
    color: '#141A14',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
