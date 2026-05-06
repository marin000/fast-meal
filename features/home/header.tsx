import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

export const HomeHeader = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.header}>
      <Text style={styles.title}>{t('home.titleMain')}</Text>
      <Text style={styles.titleAccent}>{t('home.titleAccent')}</Text>
      <Text style={styles.subtitle}>{t('home.subtitle')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    gap: 6,
  },
  title: {
    color: '#141A14',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
  titleAccent: {
    color: '#2D8A4E',
    fontSize: 32,
    fontWeight: '900',
    lineHeight: 38,
  },
  subtitle: {
    color: '#6B7A6B',
    fontSize: 15,
    fontWeight: '500',
    marginTop: 4,
  },
});
