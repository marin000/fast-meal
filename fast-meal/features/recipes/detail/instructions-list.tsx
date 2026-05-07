import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import { RecipeSection } from './section';

interface RecipeInstructionsProps {
  steps: string[];
}

export const RecipeInstructions = ({ steps }: RecipeInstructionsProps) => {
  const { t } = useTranslation();

  return (
    <RecipeSection label={t('recipe.steps')}>
      <View style={styles.list}>
        {steps.map((step, index) => (
          <View key={`step-${index}`} style={styles.row}>
            <View style={styles.circle}>
              <Text style={styles.circleText}>{index + 1}</Text>
            </View>
            <Text style={styles.text}>{step}</Text>
          </View>
        ))}
      </View>
    </RecipeSection>
  );
};

const styles = StyleSheet.create({
  list: {
    gap: 14,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  circle: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  circleText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  text: {
    color: '#141A14',
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 21,
  },
});
