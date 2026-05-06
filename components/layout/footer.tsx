import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { footerItems, type FooterTab } from '@/constants/nav';

interface BottomFooterNavProps {
  activeTab: FooterTab;
  onHomePress: () => void;
}

export const Footer = ({ activeTab, onHomePress }: BottomFooterNavProps) => {
  const { bottom } = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <View style={[styles.wrapper, { paddingBottom: Math.max(bottom, 10) }]}>
      <View style={styles.container}>
        {footerItems.map((item) => {
          const isActive = item.id === activeTab;
          const isHomeTab = item.id === 'home';

          return (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              disabled={!isHomeTab}
              onPress={isHomeTab ? onHomePress : undefined}
              style={styles.item}
            >
              <Ionicons name={item.iconName} size={18} color={isActive ? '#2D8A4E' : '#6B7A6B'} />
              <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
                {t(item.labelKey)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
    borderTopColor: 'rgba(20, 26, 20, 0.1)',
    borderTopWidth: 1,
    bottom: 0,
    left: 0,
    paddingHorizontal: 8,
    position: 'absolute',
    right: 0,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
  },
  item: {
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
    minWidth: 70,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  activeLabel: {
    color: '#2D8A4E',
  },
  inactiveLabel: {
    color: '#6B7A6B',
  },
});
