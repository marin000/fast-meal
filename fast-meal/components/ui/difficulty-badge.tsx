import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

import type { RecipeDifficulty } from '@/interface';

interface DifficultyPalette {
  soft: string;
  solid: string;
}

const palettes: Record<RecipeDifficulty, DifficultyPalette> = {
  easy: { soft: 'rgba(45, 138, 78, 0.12)', solid: '#2D8A4E' },
  medium: { soft: 'rgba(198, 138, 14, 0.14)', solid: '#C68A0E' },
  hard: { soft: 'rgba(192, 57, 43, 0.12)', solid: '#C0392B' },
};

interface DifficultyBadgeProps {
  difficulty: RecipeDifficulty;
  variant?: 'soft' | 'overlay';
}

export const DifficultyBadge = ({ difficulty, variant = 'soft' }: DifficultyBadgeProps) => {
  const { t } = useTranslation();
  const palette = palettes[difficulty];
  const backgroundColor = variant === 'overlay' ? '#FFFFFF' : palette.soft;

  return (
    <View style={[styles.badge, { backgroundColor }]}>
      <Text style={[styles.text, { color: palette.solid }]}>{t(`recipe.difficulty.${difficulty}`)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontSize: 11,
    fontWeight: '800',
  },
});
