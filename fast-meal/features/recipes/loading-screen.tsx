import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Animated, Easing, StyleSheet, Text, View } from 'react-native';

import { FridgeAiLogo } from '@/components';

export const LoadingScreen = () => {
  const { t } = useTranslation();
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    animation.start();

    return () => animation.stop();
  }, [rotation]);

  const rotateInterpolation = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.ringWrapper}>
        <View style={styles.ringTrack} />
        <Animated.View style={[styles.ringSpinner, { transform: [{ rotate: rotateInterpolation }] }]} />
        <View style={styles.logoBackground}>
          <FridgeAiLogo size={32} />
        </View>
      </View>
      <Text style={styles.title}>{t('loading.title')}</Text>
      <Text style={styles.subtitle}>{t('loading.subtitle')}</Text>
    </View>
  );
};

const RING_SIZE = 96;
const RING_BORDER = 4;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    gap: 14,
    justifyContent: 'center',
    paddingBottom: 80,
    paddingHorizontal: 32,
  },
  ringWrapper: {
    alignItems: 'center',
    height: RING_SIZE,
    justifyContent: 'center',
    marginBottom: 12,
    width: RING_SIZE,
  },
  ringTrack: {
    borderColor: 'rgba(45, 138, 78, 0.12)',
    borderRadius: RING_SIZE / 2,
    borderWidth: RING_BORDER,
    height: RING_SIZE,
    position: 'absolute',
    width: RING_SIZE,
  },
  ringSpinner: {
    borderColor: 'transparent',
    borderRadius: RING_SIZE / 2,
    borderTopColor: '#2D8A4E',
    borderWidth: RING_BORDER,
    height: RING_SIZE,
    position: 'absolute',
    width: RING_SIZE,
  },
  logoBackground: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    width: 56,
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
