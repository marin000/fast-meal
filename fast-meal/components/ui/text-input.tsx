import type { TextInputProps } from 'react-native';
import { StyleSheet, Text, TextInput, View } from 'react-native';

interface AppTextInputProps extends TextInputProps {
  label: string;
  placeholder: string;
}

export const AppTextInput = ({ label, placeholder, style, ...props }: AppTextInputProps) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        multiline
        numberOfLines={4}
        placeholder={placeholder}
        placeholderTextColor="#7D8EA3"
        style={[styles.input, style]}
        textAlignVertical="top"
        {...props}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: '#141A14',
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    backgroundColor: '#FFFFFF',
    borderColor: 'rgba(20, 26, 20, 0.1)',
    borderRadius: 16,
    borderWidth: 1,
    color: '#141A14',
    fontSize: 16,
    minHeight: 120,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
});
