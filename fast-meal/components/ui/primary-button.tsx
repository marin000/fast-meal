import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  leftIconName?: keyof typeof Ionicons.glyphMap;
  rightIconName?: keyof typeof Ionicons.glyphMap;
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
  leftIconName,
  rightIconName,
}: PrimaryButtonProps) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabledButton]}>
      <View style={styles.content}>
        {leftIconName ? <Ionicons name={leftIconName} size={18} color="#FFFFFF" /> : null}
        <Text style={styles.label}>{label}</Text>
        {rightIconName ? <Ionicons name={rightIconName} size={18} color="#FFFFFF" /> : null}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#2D8A4E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.55,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
