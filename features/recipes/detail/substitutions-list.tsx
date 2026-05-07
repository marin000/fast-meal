import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { RecipeSubstitution } from '@/interface';

import { RecipeSection } from './section';

interface RecipeSubstitutionsProps {
  items: RecipeSubstitution[];
}

export const RecipeSubstitutions = ({ items }: RecipeSubstitutionsProps) => {
  const { t } = useTranslation();

  return (
    <RecipeSection label={t('recipe.substitutions')}>
      <View style={styles.list}>
        {items.map((substitution, index) => (
          <View key={`sub-${index}`} style={styles.box}>
            <Ionicons name="alert-circle-outline" size={16} color="#2D8A4E" style={styles.icon} />
            <Text style={styles.text}>
              <Text style={styles.original}>{substitution.ingredient}</Text>
              <Text style={styles.arrow}> → </Text>
              <Text style={styles.alternatives}>{substitution.alternatives.join(' · ')}</Text>
            </Text>
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
  box: {
    backgroundColor: 'rgba(45, 138, 78, 0.08)',
    borderRadius: 12,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  icon: {
    marginTop: 2,
  },
  text: {
    color: '#141A14',
    flex: 1,
    fontSize: 13,
    lineHeight: 19,
  },
  original: {
    fontWeight: '900',
  },
  arrow: {
    color: '#6B7A6B',
  },
  alternatives: {
    fontWeight: '500',
  },
});
