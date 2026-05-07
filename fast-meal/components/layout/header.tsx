import { StyleSheet, Text, View } from 'react-native';

import { FridgeAiLogo } from '@/components/ui';

export const Header = () => {
  return (
    <View style={styles.brandRow}>
      <View style={styles.logoContainer}>
        <FridgeAiLogo size={24} />
      </View>
      <Text style={styles.brandText}>
        <Text style={styles.brandTextBase}>Fridge</Text>
        <Text style={styles.brandTextAccent}>AI</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  brandRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  logoContainer: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 14,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  brandText: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  brandTextBase: {
    color: '#141A14',
  },
  brandTextAccent: {
    color: '#2D8A4E',
  },
});
