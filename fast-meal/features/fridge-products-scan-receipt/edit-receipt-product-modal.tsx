import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { AppModal, DateField, PrimaryButton } from "@/components";
import {
	RECEIPT_PRODUCT_UNITS,
	type ReceiptProductUnit,
} from "@/constants/receipt-product";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ReceiptProductDraft } from "@/interface/receipt-product";
import { formatDisplayDate, toIsoDate } from "@/utils/date";
import { parseQuantityInput } from "@/utils/fridge-product";

interface EditReceiptProductModalProps {
	visible: boolean;
	draft: ReceiptProductDraft | null;
	onClose: () => void;
	onSave: (patch: {
		name: string;
		quantity: number | null;
		unit: ReceiptProductUnit;
		expirationDate?: string;
	}) => void;
}

export const EditReceiptProductModal = ({
	visible,
	draft,
	onClose,
	onSave,
}: EditReceiptProductModalProps) => {
	const { t } = useTranslation();
	const { language } = usePreferences();
	const theme = useAppAppearance();
	const [name, setName] = useState("");
	const [quantityInput, setQuantityInput] = useState("");
	const [unit, setUnit] = useState<ReceiptProductUnit>("unknown");
	const [expirationDate, setExpirationDate] = useState<Date | undefined>();

	useEffect(() => {
		if (!visible || !draft) return;
		setName(draft.name);
		setQuantityInput(
			draft.quantity !== null && draft.quantity !== undefined
				? String(draft.quantity)
				: "",
		);
		setUnit(draft.unit);
		setExpirationDate(
			draft.expirationDate ? new Date(draft.expirationDate) : undefined,
		);
	}, [visible, draft]);

	const parsedQuantity = parseQuantityInput(quantityInput);
	const hasQuantityInput = quantityInput.trim().length > 0;
	const isQuantityInvalid = hasQuantityInput && parsedQuantity === undefined;
	const canSave = name.trim().length > 0 && !isQuantityInvalid;

	const handleSave = () => {
		if (!canSave) return;
		onSave({
			name: name.trim(),
			quantity: hasQuantityInput ? (parsedQuantity ?? null) : null,
			unit,
			expirationDate: expirationDate ? toIsoDate(expirationDate) : undefined,
		});
		onClose();
	};

	const expirationPreview = useMemo(() => {
		if (!expirationDate) return null;
		return formatDisplayDate(expirationDate, language);
	}, [expirationDate, language]);

	return (
		<AppModal
			visible={visible}
			onClose={onClose}
			title={t("fridge.scanReceipt.editTitle")}
			avoidKeyboard
			footer={
				<PrimaryButton
					label={t("fridge.scanReceipt.save")}
					onPress={handleSave}
					disabled={!canSave}
					leftIconName="checkmark"
				/>
			}
		>
			<View style={styles.fields}>
				<View style={styles.field}>
					<Text style={[styles.label, { color: theme.text }]}>
						{t("fridge.scanReceipt.nameLabel")}
					</Text>
					<TextInput
						value={name}
						onChangeText={setName}
						placeholder={t("fridge.scanReceipt.namePlaceholder")}
						placeholderTextColor={theme.textMuted}
						style={[
							styles.input,
							{
								backgroundColor: theme.inputBg,
								borderColor: theme.inputBorder,
								color: theme.text,
							},
						]}
					/>
				</View>

				<View style={styles.field}>
					<Text style={[styles.label, { color: theme.text }]}>
						{t("fridge.scanReceipt.quantityLabel")}
					</Text>
					<TextInput
						value={quantityInput}
						onChangeText={setQuantityInput}
						keyboardType="decimal-pad"
						placeholder={t("fridge.scanReceipt.quantityPlaceholder")}
						placeholderTextColor={theme.textMuted}
						style={[
							styles.input,
							{
								backgroundColor: theme.inputBg,
								borderColor: isQuantityInvalid
									? theme.expiration.expired.solid
									: theme.inputBorder,
								color: theme.text,
							},
						]}
					/>
				</View>

				<View style={styles.field}>
					<Text style={[styles.label, { color: theme.text }]}>
						{t("fridge.scanReceipt.unitLabel")}
					</Text>
					<View style={styles.unitRow}>
						{RECEIPT_PRODUCT_UNITS.map((option) => {
							const isSelected = option === unit;
							return (
								<Pressable
									key={option}
									onPress={() => setUnit(option)}
									style={[
										styles.unitChip,
										{
											backgroundColor: isSelected
												? theme.chipSelectedBg
												: theme.chipBg,
											borderColor: isSelected
												? theme.chipSelectedBorder
												: theme.chipBorder,
										},
									]}
								>
									<Text
										style={[
											styles.unitChipLabel,
											{
												color: isSelected
													? theme.chipSelectedText
													: theme.chipText,
											},
										]}
									>
										{t(`fridge.scanReceipt.units.${option}`)}
									</Text>
								</Pressable>
							);
						})}
					</View>
				</View>

				<View style={styles.field}>
					<DateField
						label={t("fridge.expirationLabel")}
						value={expirationDate}
						onChange={setExpirationDate}
					/>
					{expirationPreview ? (
						<Text style={[styles.expirationHint, { color: theme.textMuted }]}>
							{t("fridge.expiresOn", { date: expirationPreview })}
						</Text>
					) : null}
				</View>
			</View>
		</AppModal>
	);
};

const styles = StyleSheet.create({
	fields: {
		gap: 16,
	},
	field: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: "800",
	},
	input: {
		borderRadius: 12,
		borderWidth: 1.5,
		fontSize: 15,
		fontWeight: "600",
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	unitRow: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	unitChip: {
		borderRadius: 999,
		borderWidth: 1.5,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	unitChipLabel: {
		fontSize: 12,
		fontWeight: "800",
	},
	expirationHint: {
		fontSize: 12,
		fontWeight: "600",
	},
});
