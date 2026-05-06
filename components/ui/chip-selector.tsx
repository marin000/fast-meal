import { Pressable, StyleSheet, Text, View } from 'react-native';

interface ChipSelectorProps<T extends string> {
  options: readonly T[];
  selectedOptions: readonly T[];
  onToggleOption: (value: T) => void;
}

export const ChipSelector = <T extends string,>({
  options,
  selectedOptions,
  onToggleOption,
}: ChipSelectorProps<T>) => {
  return (
    <View style={styles.container}>
      {options.map((option) => {
        const isSelected = selectedOptions.includes(option);

        return (
          <Pressable
            key={option}
            onPress={() => onToggleOption(option)}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Text style={[styles.label, isSelected && styles.selectedLabel]}>{option}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D7DFE8',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  selectedChip: {
    backgroundColor: '#2D8A4E',
    borderColor: '#2D8A4E',
  },
  label: {
    color: '#16263A',
    fontSize: 14,
    fontWeight: '700',
  },
  selectedLabel: {
    color: '#FFFFFF',
  },
});
