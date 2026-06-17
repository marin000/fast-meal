import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

import { AppModal, PrimaryButton } from "@/components";
import { useFridgeProducts } from "@/context/fridge-products-context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { ProductPickerRow } from "./fridge-product-picker-row";

interface FridgePickerModalProps {
	visible: boolean;
	onClose: () => void;
	onConfirm: (names: string[]) => void;
}

export const FridgePickerModal = ({
	visible,
	onClose,
	onConfirm,
}: FridgePickerModalProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { items } = useFridgeProducts();
	const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

	useEffect(() => {
		if (visible) {
			setSelectedIds(new Set(items.map((item) => item.id)));
		}
	}, [visible, items]);

	const allSelected = selectedIds.size === items.length && items.length > 0;

	const toggleProduct = (id: string) => {
		setSelectedIds((previous) => {
			const next = new Set(previous);
			if (next.has(id)) {
				next.delete(id);
			} else {
				next.add(id);
			}
			return next;
		});
	};

	const toggleAll = () => {
		setSelectedIds(
			allSelected ? new Set() : new Set(items.map((item) => item.id)),
		);
	};

	const handleConfirm = () => {
		const names = items
			.filter((item) => selectedIds.has(item.id))
			.map((item) => item.name);
		onConfirm(names);
		onClose();
	};

	const confirmLabel = useMemo(() => {
		const count = selectedIds.size;
		return t("fridge.picker.confirm", { count });
	}, [selectedIds.size, t]);

	return (
		<AppModal
			visible={visible}
			onClose={onClose}
			title={t("fridge.picker.title")}
			description={t("fridge.picker.description")}
			footer={
				<PrimaryButton
					label={confirmLabel}
					onPress={handleConfirm}
					disabled={selectedIds.size === 0}
					leftIconName="add"
				/>
			}
		>
			<Pressable
				accessibilityRole="button"
				onPress={toggleAll}
				style={styles.selectAllRow}
			>
				<View
					style={[
						styles.checkbox,
						{
							backgroundColor: allSelected ? theme.primary : "transparent",
							borderColor: allSelected ? theme.primary : theme.cardBorder,
						},
					]}
				>
					{allSelected ? (
						<Ionicons
							name="checkmark"
							size={12}
							color="#FFFFFF"
							strokeWidth={3}
						/>
					) : null}
				</View>

				<Text style={[styles.selectAllLabel, { color: theme.text }]}>
					{allSelected
						? t("fridge.picker.deselectAll")
						: t("fridge.picker.selectAll")}
				</Text>

				<Text style={[styles.selectCount, { color: theme.textMuted }]}>
					{selectedIds.size}/{items.length}
				</Text>
			</Pressable>

			<View style={[styles.divider, { backgroundColor: theme.rowDivider }]} />

			<ScrollView
				style={styles.list}
				contentContainerStyle={styles.listContent}
				showsVerticalScrollIndicator={false}
			>
				{items.map((item) => (
					<ProductPickerRow
						key={item.id}
						item={item}
						selected={selectedIds.has(item.id)}
						onToggle={() => toggleProduct(item.id)}
					/>
				))}
			</ScrollView>
		</AppModal>
	);
};

const styles = StyleSheet.create({
	selectAllRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 12,
		paddingVertical: 8,
	},
	checkbox: {
		alignItems: "center",
		borderRadius: 6,
		borderWidth: 2,
		height: 20,
		justifyContent: "center",
		width: 20,
	},
	selectAllLabel: {
		flex: 1,
		fontSize: 14,
		fontWeight: "900",
	},
	selectCount: {
		fontSize: 12,
		fontWeight: "600",
	},
	divider: {
		height: 1,
		marginBottom: 8,
	},
	list: {
		maxHeight: 224,
	},
	listContent: {
		gap: 6,
		paddingBottom: 4,
	},
});
