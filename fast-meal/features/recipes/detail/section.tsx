import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface RecipeSectionProps {
  label: string;
  children: ReactNode;
}

export const RecipeSection = ({ label, children }: RecipeSectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.label}>{label}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  label: {
    color: '#6B7A6B',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
});
