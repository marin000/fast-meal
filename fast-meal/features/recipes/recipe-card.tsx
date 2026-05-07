import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DifficultyBadge } from '@/components';
import type { Recipe } from '@/interface';

interface RecipeCardProps {
  recipe: Recipe;
  onPress: () => void;
}

export const RecipeCard = ({ recipe, onPress }: RecipeCardProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.card}>
      <View style={styles.accent} />

      <View style={styles.body}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {recipe.title}
          </Text>
          <DifficultyBadge difficulty={recipe.difficulty} />
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {recipe.description}
        </Text>

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

        <Pressable accessibilityRole="button" onPress={onPress} style={styles.ctaButton}>
          <Text style={styles.ctaText}>{t('recipe.cta.seeRecipe')}</Text>
          <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(20, 26, 20, 0.08)',
    borderRadius: 20,
    borderWidth: 1,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  accent: {
    backgroundColor: '#2D8A4E',
    width: 4,
  },
  body: {
    flex: 1,
    gap: 10,
    padding: 16,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  title: {
    color: '#141A14',
    flex: 1,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  description: {
    color: '#6B7A6B',
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 2,
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
  ctaButton: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    marginTop: 6,
    paddingVertical: 10,
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
  },
});
