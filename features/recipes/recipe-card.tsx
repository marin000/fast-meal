import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { Recipe } from '@/interface';

interface RecipeCardProps {
  recipe: Recipe;
}

export const RecipeCard = ({ recipe }: RecipeCardProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imagePlaceholderTitle}>{recipe.title}</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.description}>{recipe.description}</Text>

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Ionicons name="time-outline" size={14} color="#6B7A6B" />
            <Text style={styles.statText}>{t('recipe.prepTime', { minutes: recipe.prepTimeMinutes })}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="flame-outline" size={14} color="#6B7A6B" />
            <Text style={styles.statText}>{t('recipe.kcal', { calories: recipe.macros.calories })}</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="barbell-outline" size={14} color="#6B7A6B" />
            <Text style={styles.statText}>{t('recipe.proteinG', { protein: recipe.macros.protein })}</Text>
          </View>
        </View>

        <Text style={styles.sectionLabel}>{t('recipe.ingredients')}</Text>
        <View style={styles.list}>
          {recipe.ingredients.map((ingredient, index) => (
            <View key={`${recipe.title}-ingredient-${index}`} style={styles.ingredientRow}>
              <Text style={styles.ingredientAmount}>
                {ingredient.quantity} {ingredient.unit}
              </Text>
              <Text style={styles.ingredientName}>{ingredient.name}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.sectionLabel}>{t('recipe.steps')}</Text>
        <View style={styles.list}>
          {recipe.steps.map((step, index) => (
            <View key={`${recipe.title}-step-${index}`} style={styles.stepRow}>
              <View style={styles.stepNumberCircle}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        {recipe.warnings.length > 0 && (
          <>
            <Text style={styles.sectionLabel}>{t('recipe.warnings')}</Text>
            <View style={styles.list}>
              {recipe.warnings.map((warning, index) => (
                <Text key={`${recipe.title}-warning-${index}`} style={styles.warningText}>
                  {warning}
                </Text>
              ))}
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(20, 26, 20, 0.08)',
    borderRadius: 24,
    borderWidth: 1,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    height: 120,
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  imagePlaceholderTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  body: {
    gap: 14,
    padding: 16,
  },
  description: {
    color: '#6B7A6B',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
  },
  statItem: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  statText: {
    color: '#6B7A6B',
    fontSize: 12,
    fontWeight: '600',
  },
  sectionLabel: {
    color: '#141A14',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  list: {
    gap: 8,
  },
  ingredientRow: {
    flexDirection: 'row',
    gap: 10,
  },
  ingredientAmount: {
    color: '#2D8A4E',
    fontSize: 13,
    fontWeight: '800',
    minWidth: 70,
  },
  ingredientName: {
    color: '#141A14',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
  },
  stepRow: {
    flexDirection: 'row',
    gap: 10,
  },
  stepNumberCircle: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 12,
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  stepNumberText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  stepText: {
    color: '#141A14',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
  warningText: {
    color: '#A14A18',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
});
