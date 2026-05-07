import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { RecipeSection } from './section';

interface RecipeTipsProps {
  items: string[];
}

export const RecipeTips = ({ items }: RecipeTipsProps) => {
  const { t } = useTranslation();

  return (
    <RecipeSection label={t('recipe.tips')}>
      <View style={styles.list}>
        {items.map((tip, index) => (
          <View key={`tip-${index}`} style={styles.row}>
            <Ionicons name="sparkles" size={14} color="#2D8A4E" style={styles.icon} />
            <Text style={styles.text}>{tip}</Text>
          </View>
        ))}
      </View>
    </RecipeSection>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    gap: 8,
  },
  icon: {
    marginTop: 3,
  },
  text: {
    color: '#6B7A6B',
    flex: 1,
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 19,
  },
});
