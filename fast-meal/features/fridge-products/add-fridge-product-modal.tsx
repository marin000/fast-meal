import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { AppModal, DateField, PrimaryButton } from '@/components';
import { FRIDGE_DATE_TABS, type FridgeDateTab, type FridgeProductUnit } from '@/constants/fridge';
import { SegmentedControl } from '@/features/settings/segmented-control';
import { useAppAppearance } from '@/hooks/use-app-appearance';
import { ensureExpirationNotificationPermission } from '@/services/expiration-notifications';
import { toIsoDate } from '@/utils/date';
import { parseQuantityInput } from '@/utils/fridge-product';

import { QuantityWithUnitField } from './quantity-with-unit-field';

interface AddFridgeProductModalProps {
  visible: boolean;
  onClose: () => void;
  onAdd: (input: {
    name: string;
    quantity?: number;
    unit?: FridgeProductUnit;
    expirationDate?: string;
    purchasedAt?: string;
  }) => Promise<void>;
}

export const AddFridgeProductModal = ({ visible, onClose, onAdd }: AddFridgeProductModalProps) => {
  const { t } = useTranslation();
  const theme = useAppAppearance();
  const [name, setName] = useState('');
  const [quantityInput, setQuantityInput] = useState('');
  const [unit, setUnit] = useState<FridgeProductUnit | undefined>();
  const [dateTab, setDateTab] = useState<FridgeDateTab>('expiration');
  const [expirationDate, setExpirationDate] = useState<Date | undefined>();
  const [purchasedAt, setPurchasedAt] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!visible) return;

    setName('');
    setQuantityInput('');
    setUnit(undefined);
    setDateTab('expiration');
    setExpirationDate(undefined);
    setPurchasedAt(undefined);
    setIsSubmitting(false);
  }, [visible]);

  const handleAdd = async () => {
    const trimmedName = name.trim();
    if (!trimmedName || isSubmitting) return;

    const parsedQuantity = parseQuantityInput(quantityInput);
    const hasQuantityInput = quantityInput.trim().length > 0;

    if (hasQuantityInput && parsedQuantity === undefined) return;
    if (parsedQuantity !== undefined && !unit) return;

    setIsSubmitting(true);
    try {
      if (expirationDate) {
        await ensureExpirationNotificationPermission();
      }

      await onAdd({
        name: trimmedName,
        quantity: parsedQuantity,
        unit,
        expirationDate: expirationDate ? toIsoDate(expirationDate) : undefined,
        purchasedAt: purchasedAt ? toIsoDate(purchasedAt) : undefined,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedQuantity = parseQuantityInput(quantityInput);
  const hasQuantityInput = quantityInput.trim().length > 0;
  const isQuantityInvalid = hasQuantityInput && parsedQuantity === undefined;
  const isUnitMissing = parsedQuantity !== undefined && !unit;
  const canSubmit = name.trim().length > 0 && !isSubmitting && !isQuantityInvalid && !isUnitMissing;

  return (
    <AppModal visible={visible} onClose={onClose} title={t('fridge.addModal.title')} avoidKeyboard>
      <View style={styles.form}>
        <View style={styles.field}>
          <Text style={[styles.label, { color: theme.text }]}>{t('fridge.addModal.nameLabel')}</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder={t('fridge.addPlaceholder')}
            placeholderTextColor={theme.inputPlaceholder}
            editable={!isSubmitting}
            style={[
              styles.input,
              {
                backgroundColor: theme.card,
                borderColor: theme.inputBorder,
                color: theme.text,
              },
            ]}
          />
        </View>

        <QuantityWithUnitField
          label={t('fridge.addModal.quantityLabel')}
          quantity={quantityInput}
          unit={unit}
          isQuantityInvalid={isQuantityInvalid}
          isUnitMissing={isUnitMissing}
          editable={!isSubmitting}
          onQuantityChange={setQuantityInput}
          onUnitChange={setUnit}
        />

        <View style={styles.field}>
          <SegmentedControl
            options={FRIDGE_DATE_TABS}
            selectedOption={dateTab}
            onPressOption={setDateTab}
            equalWidth
            getOptionLabel={(tab) =>
              tab === 'expiration' ? t('fridge.addModal.expirationTab') : t('fridge.addModal.purchasedTab')
            }
          />

          {dateTab === 'expiration' ? (
            <DateField label={t('fridge.expirationLabel')} value={expirationDate} onChange={setExpirationDate} />
          ) : (
            <DateField label={t('fridge.purchasedLabel')} value={purchasedAt} onChange={setPurchasedAt} />
          )}
        </View>

        <PrimaryButton
          label={t('fridge.addModal.submit')}
          onPress={() => void handleAdd()}
          disabled={!canSubmit}
          leftIconName="add"
        />
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  form: {
    gap: 16,
  },
  field: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
  },
  input: {
    borderRadius: 12,
    borderWidth: 2,
    fontSize: 14,
    fontWeight: '500',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
