import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, View } from 'react-native';

export const RecipesHeader = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t('results.title')}</Text>
      <Text style={styles.subtitle}>{t('results.subtitle')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  title: {
    color: '#141A14',
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    color: '#6B7A6B',
    fontSize: 14,
    fontWeight: '500',
  },
});
