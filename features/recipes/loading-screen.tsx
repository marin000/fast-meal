import { useTranslation } from 'react-i18next';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { FridgeAiLogo } from '@/components';

export const LoadingScreen = () => {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={styles.logoWrapper}>
        <View style={styles.logoBackground}>
          <FridgeAiLogo size={36} />
        </View>
        <ActivityIndicator size="large" color="#2D8A4E" style={styles.spinner} />
      </View>
      <Text style={styles.title}>{t('loading.title')}</Text>
      <Text style={styles.subtitle}>{t('loading.subtitle')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    paddingBottom: 80,
    paddingHorizontal: 32,
  },
  logoWrapper: {
    alignItems: 'center',
    height: 96,
    justifyContent: 'center',
    marginBottom: 12,
    width: 96,
  },
  logoBackground: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 22,
    height: 60,
    justifyContent: 'center',
    width: 60,
  },
  spinner: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  title: {
    color: '#141A14',
    fontSize: 20,
    fontWeight: '900',
    textAlign: 'center',
  },
  subtitle: {
    color: '#6B7A6B',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
    maxWidth: 260,
    textAlign: 'center',
  },
});
