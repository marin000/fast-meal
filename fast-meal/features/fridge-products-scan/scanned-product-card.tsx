import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { DateField } from "@/components";
import type { FridgeProductUnit } from "@/constants/fridge";
import { QuantityWithUnitField } from "@/features/fridge-products";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ScannedDraft } from "@/interface/barcode-product";
import { toIsoDate } from "@/utils/date";
import { parseQuantityInput } from "@/utils/fridge-product";

interface ScannedProductCardProps {
	draft: ScannedDraft;
	onChange: (patch: Partial<ScannedDraft>) => void;
	onRemove: () => void;
}

export const ScannedProductCard = ({
	draft,
	onChange,
	onRemove,
}: ScannedProductCardProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const [quantityInput, setQuantityInput] = useState(
		draft.quantity !== undefined ? String(draft.quantity) : "",
	);

	const parsedQuantity = parseQuantityInput(quantityInput);
	const hasQuantityInput = quantityInput.trim().length > 0;
	const isQuantityInvalid = hasQuantityInput && parsedQuantity === undefined;
	const isUnitMissing = parsedQuantity !== undefined && !draft.unit;

	const expirationDate = useMemo(
		() => (draft.expirationDate ? new Date(draft.expirationDate) : undefined),
		[draft.expirationDate],
	);

	const handleQuantityChange = (value: string) => {
		setQuantityInput(value);
		const parsed = parseQuantityInput(value);
		if (value.trim().length === 0) {
			onChange({ quantity: undefined, unit: undefined });
			return;
		}
		if (parsed !== undefined) {
			onChange({
				quantity: parsed,
				unit: draft.unit,
			});
		}
	};

	const handleUnitChange = (unit: FridgeProductUnit | undefined) => {
		onChange({ unit });
	};

	return (
		<View
			style={[
				styles.card,
				{
					backgroundColor: theme.card,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<View style={styles.header}>
				{draft.imageThumbUrl ? (
					<Image
						source={{ uri: draft.imageThumbUrl }}
						style={styles.thumb}
						contentFit="contain"
					/>
				) : (
					<View
						style={[styles.thumbPlaceholder, { backgroundColor: theme.chipBg }]}
					>
						<Ionicons
							name="barcode-outline"
							size={20}
							color={theme.iconMuted}
						/>
					</View>
				)}

				<View style={styles.headerText}>
					{draft.isLoading ? (
						<View style={styles.loadingRow}>
							<ActivityIndicator size="small" color={theme.primary} />
							<Text style={[styles.loadingLabel, { color: theme.textMuted }]}>
								{t("fridge.scan.lookingUp")}
							</Text>
						</View>
					) : (
						<>
							<TextInput
								value={draft.name}
								onChangeText={(name) =>
									onChange({
										name,
										needsName: name.trim().length === 0,
									})
								}
								placeholder={t("fridge.scan.namePlaceholder")}
								placeholderTextColor={theme.inputPlaceholder}
								style={[
									styles.nameInput,
									{
										backgroundColor: theme.background,
										borderColor: draft.needsName
											? theme.danger
											: theme.inputBorder,
										color: theme.text,
									},
								]}
							/>
							{draft.brandLabel ? (
								<Text
									style={[styles.brand, { color: theme.textMuted }]}
									numberOfLines={1}
								>
									{draft.brandLabel}
								</Text>
							) : null}
							{draft.lookupFailed ? (
								<Text style={[styles.miss, { color: theme.warning }]}>
									{t("fridge.scan.notFound")}
								</Text>
							) : null}
							<Text style={[styles.code, { color: theme.textMuted }]}>
								{draft.code}
							</Text>
						</>
					)}
				</View>

				<Pressable
					accessibilityRole="button"
					onPress={onRemove}
					style={[styles.removeButton, { backgroundColor: theme.chipBg }]}
				>
					<Ionicons name="close" size={16} color={theme.iconMuted} />
				</Pressable>
			</View>

			{!draft.isLoading ? (
				<View style={styles.fields}>
					<QuantityWithUnitField
						label={t("fridge.addModal.quantityLabel")}
						quantity={quantityInput}
						unit={draft.unit}
						isQuantityInvalid={isQuantityInvalid}
						isUnitMissing={isUnitMissing}
						onQuantityChange={handleQuantityChange}
						onUnitChange={handleUnitChange}
					/>
					<DateField
						label={t("fridge.expirationLabel")}
						value={expirationDate}
						onChange={(date) =>
							onChange({
								expirationDate: date ? toIsoDate(date) : undefined,
							})
						}
					/>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	card: {
		borderRadius: 14,
		borderWidth: 1,
		gap: 12,
		padding: 12,
	},
	header: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 10,
	},
	thumb: {
		borderRadius: 8,
		height: 48,
		width: 48,
	},
	thumbPlaceholder: {
		alignItems: "center",
		borderRadius: 8,
		height: 48,
		justifyContent: "center",
		width: 48,
	},
	headerText: {
		flex: 1,
		gap: 4,
	},
	loadingRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
		paddingVertical: 8,
	},
	loadingLabel: {
		fontSize: 13,
		fontWeight: "600",
	},
	nameInput: {
		borderRadius: 10,
		borderWidth: 1.5,
		fontSize: 14,
		fontWeight: "600",
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	brand: {
		fontSize: 12,
		fontWeight: "500",
	},
	miss: {
		fontSize: 12,
		fontWeight: "600",
	},
	code: {
		fontSize: 11,
		fontWeight: "500",
	},
	removeButton: {
		alignItems: "center",
		borderRadius: 8,
		height: 28,
		justifyContent: "center",
		width: 28,
	},
	fields: {
		gap: 10,
	},
});
