import { Pressable, StyleSheet, Text } from 'react-native';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export const PrimaryButton = ({
  label,
  onPress,
  disabled = false,
}: PrimaryButtonProps) => {
  return (
    <Pressable disabled={disabled} onPress={onPress} style={[styles.button, disabled && styles.disabledButton]}>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#2D8A4E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  disabledButton: {
    opacity: 0.55,
  },
  label: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
});
