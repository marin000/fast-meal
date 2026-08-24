import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { type FridgeProductUnit, getFridgeUnitsForPreference } from '@/constants/fridge';
import { usePreferences } from '@/context';
import { SegmentedControl } from '@/features/settings/segmented-control';
import { useAppAppearance } from '@/hooks/use-app-appearance';
import { translateMeasurementUnit } from '@/utils/fridge-product';

interface QuantityWithUnitFieldProps {
  label: string;
  quantity: string;
  unit?: FridgeProductUnit;
  isQuantityInvalid: boolean;
  isUnitMissing: boolean;
  editable?: boolean;
  onQuantityChange: (value: string) => void;
  onUnitChange: (value: FridgeProductUnit | undefined) => void;
}

export const QuantityWithUnitField = ({
  label,
  quantity,
  unit,
  isQuantityInvalid,
  isUnitMissing,
  editable = true,
  onQuantityChange,
  onUnitChange,
}: QuantityWithUnitFieldProps) => {
  const { t } = useTranslation();
  const theme = useAppAppearance();
  const { units: displayUnits } = usePreferences();
  const unitOptions = getFridgeUnitsForPreference(displayUnits);

  useEffect(() => {
    if (unit && !unitOptions.includes(unit)) {
      onUnitChange(undefined);
    }
  }, [unit, unitOptions, onUnitChange]);

  const borderColor = isQuantityInvalid || isUnitMissing ? theme.expiration.expired.solid : theme.inputBorder;

  const handleUnitPress = (value: FridgeProductUnit) => {
    onUnitChange(unit === value ? undefined : value);
  };

  return (
    <View style={styles.field}>
      <Text style={[styles.label, { color: theme.text }]}>{label}</Text>

      <View style={styles.row}>
        <TextInput
          value={quantity}
          onChangeText={onQuantityChange}
          placeholder={t('fridge.addModal.quantityPlaceholder')}
          placeholderTextColor={theme.inputPlaceholder}
          keyboardType="decimal-pad"
          editable={editable}
          style={[
            styles.quantityInput,
            {
              backgroundColor: theme.card,
              borderColor,
              color: theme.text,
            },
          ]}
        />

        <View style={styles.unitControl}>
          <SegmentedControl
            options={unitOptions}
            selectedOption={unit}
            onPressOption={handleUnitPress}
            getOptionLabel={(option) => translateMeasurementUnit(t, option)}
            equalWidth
          />
        </View>
      </View>

      {isQuantityInvalid ? (
        <Text style={[styles.helperText, { color: theme.expiration.expired.solid }]}>
          {t('fridge.addModal.quantityInvalid')}
        </Text>
      ) : null}
      {isUnitMissing ? (
        <Text style={[styles.helperText, { color: theme.expiration.expired.solid }]}>
          {t('fridge.addModal.unitRequired')}
        </Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  row: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 10,
  },
  quantityInput: {
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 12,
    paddingVertical: 10,
    textAlign: 'center',
    width: 72,
  },
  unitControl: {
    flex: 1,
    justifyContent: 'center',
  },
  helperText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
