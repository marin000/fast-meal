import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { RecipeMacros } from '@/interface';

interface NutritionBarProps {
  label: string;
  value: number;
  max: number;
  color: string;
  unit: string;
}

const NutritionBar = ({ label, value, max, color, unit }: NutritionBarProps) => {
  const fillPercentage = Math.min(100, Math.round((value / max) * 100));

  return (
    <View style={styles.barWrapper}>
      <View style={styles.barHeader}>
        <Text style={styles.barLabel}>{label}</Text>
        <Text style={styles.barValue}>
          {value}
          {unit}
        </Text>
      </View>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, { width: `${fillPercentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

interface RecipeNutritionProps {
  macros: RecipeMacros;
}

export const RecipeNutrition = ({ macros }: RecipeNutritionProps) => {
  const { t } = useTranslation();
  const grams = t('recipe.units.g');
  const kcal = t('recipe.units.kcal');

  const stats = [
    { key: 'calories', value: macros.calories, unit: kcal },
    { key: 'protein', value: macros.protein, unit: grams },
    { key: 'carbs', value: macros.carbs, unit: grams },
    { key: 'fat', value: macros.fat, unit: grams },
  ] as const;

  return (
    <View style={styles.card}>
      <Text style={styles.label}>{t('recipe.nutrition')}</Text>

      <View style={styles.grid}>
        {stats.map((stat) => (
          <View key={stat.key} style={styles.gridItem}>
            <Text style={styles.gridValue}>
              {stat.value}
              <Text style={styles.gridUnit}>{stat.unit}</Text>
            </Text>
            <Text style={styles.gridLabel}>{t(`recipe.labels.${stat.key}`)}</Text>
          </View>
        ))}
      </View>

      <View style={styles.bars}>
        <NutritionBar label={t('recipe.labels.protein')} value={macros.protein} max={50} color="#2D8A4E" unit={grams} />
        <NutritionBar label={t('recipe.labels.carbs')} value={macros.carbs} max={100} color="#3B82F6" unit={grams} />
        <NutritionBar label={t('recipe.labels.fat')} value={macros.fat} max={60} color="#F5A623" unit={grams} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(20, 26, 20, 0.08)',
    borderRadius: 18,
    borderWidth: 1,
    gap: 16,
    padding: 16,
  },
  label: {
    color: '#6B7A6B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gridItem: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
  },
  gridValue: {
    color: '#141A14',
    fontSize: 18,
    fontWeight: '900',
  },
  gridUnit: {
    color: '#6B7A6B',
    fontSize: 10,
    fontWeight: '600',
  },
  gridLabel: {
    color: '#6B7A6B',
    fontSize: 11,
    fontWeight: '500',
  },
  bars: {
    gap: 10,
  },
  barWrapper: {
    gap: 4,
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  barLabel: {
    color: '#6B7A6B',
    fontSize: 12,
    fontWeight: '600',
  },
  barValue: {
    color: '#141A14',
    fontSize: 12,
    fontWeight: '900',
  },
  barTrack: {
    backgroundColor: 'rgba(20, 26, 20, 0.06)',
    borderRadius: 999,
    height: 6,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: 999,
    height: '100%',
  },
});
