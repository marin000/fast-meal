import { StyleSheet, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChipSelector } from '@/components';
import type { QuickFilterOption } from '@/constants/home';

interface HomeFiltersProps {
  options: readonly QuickFilterOption[];
  selectedOptions: readonly QuickFilterOption[];
  onToggleOption: (option: QuickFilterOption) => void;
}

export const HomeFilters = ({ options, selectedOptions, onToggleOption }: HomeFiltersProps) => {
  const { t } = useTranslation();

  const translatedOptions = options.map((option) => ({
    key: option,
    label: t(`home.filters.${option}`),
  }));

  const translatedSelectedOptions = selectedOptions.map((option) => t(`home.filters.${option}`));

  return (
    <View style={styles.filtersSection}>
      <Text style={styles.filtersLabel}>{t('home.quickFiltersLabel')}</Text>
      <ChipSelector
        options={translatedOptions.map((option) => option.label)}
        selectedOptions={translatedSelectedOptions}
        onToggleOption={(selectedLabel) => {
          const selectedOption = translatedOptions.find((option) => option.label === selectedLabel);

          if (selectedOption) {
            onToggleOption(selectedOption.key);
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  filtersSection: {
    gap: 10,
  },
  filtersLabel: {
    color: '#6B7A6B',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
});
