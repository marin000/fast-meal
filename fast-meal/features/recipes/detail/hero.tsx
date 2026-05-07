import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { DifficultyBadge } from '@/components';
import type { Recipe } from '@/interface';

interface RecipeHeroProps {
  recipe: Recipe;
  onBack: () => void;
}

export const RecipeHero = ({ recipe, onBack }: RecipeHeroProps) => {
  const { t } = useTranslation();

  return (
    <View style={styles.hero}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backButton}>
        <Ionicons name="chevron-back" size={20} color="#141A14" />
      </Pressable>

      <View style={styles.titleBlock}>
        <View style={styles.accent} />

        <View style={styles.titleContent}>
          <Text style={styles.title}>{recipe.title}</Text>
          <View style={styles.badgesRow}>
            <View style={styles.timeBadge}>
              <Ionicons name="time-outline" size={12} color="#6B7A6B" />
              <Text style={styles.timeBadgeText}>{t('recipe.prepTime', { minutes: recipe.prepTimeMinutes })}</Text>
            </View>
            <DifficultyBadge difficulty={recipe.difficulty} />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(20, 26, 20, 0.06)',
    borderRadius: 18,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  titleBlock: {
    flexDirection: 'row',
    gap: 12,
  },
  accent: {
    backgroundColor: '#2D8A4E',
    borderRadius: 2,
    width: 4,
  },
  titleContent: {
    flex: 1,
    gap: 10,
  },
  title: {
    color: '#141A14',
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 32,
  },
  badgesRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  timeBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(20, 26, 20, 0.06)',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  timeBadgeText: {
    color: '#6B7A6B',
    fontSize: 11,
    fontWeight: '700',
  },
});
