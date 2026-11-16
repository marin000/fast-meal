import { Ionicons } from "@expo/vector-icons";
import { type Href, useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from "react-native";

import { ScreenScrollView } from "@/components";
import { useFeedbackMessage, useFridgeProducts, useHomeIngredients } from "@/context";
import {
	FridgePickerModal,
	FridgeProductFormModal,
	type FridgeProductFormValues,
	FridgeProductList,
	FridgeScreenHeader,
} from "@/features/fridge-products";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { FridgeProductListItem } from "@/interface/fridge-product";

const FridgeScreen = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const theme = useAppAppearance();
	const { items, isLoading, addProduct, updateProduct, removeById, reload } = useFridgeProducts();
	const { appendIngredients } = useHomeIngredients();
	const { showMessage } = useFeedbackMessage();
	const [addModalVisible, setAddModalVisible] = useState(false);
	const [editingProduct, setEditingProduct] = useState<FridgeProductListItem | null>(null);
	const [pickerVisible, setPickerVisible] = useState(false);

	useFocusEffect(
		useCallback(() => {
			void reload();
		}, [reload]),
	);

	const handleAdd = async (input: FridgeProductFormValues) => {
		try {
			await addProduct(input);
			showMessage(t("fridge.toast.added"), "success");
		} catch {
			showMessage(t("fridge.toast.addFailed"), "error");
		}
	};

	const handleEdit = async (input: FridgeProductFormValues) => {
		if (!editingProduct) return;
		try {
			await updateProduct({
				id: editingProduct.id,
				name: input.name,
				quantity: input.quantity,
				unit: input.unit,
				expirationDate: input.expirationDate,
				purchasedAt: input.purchasedAt,
			});
			showMessage(t("fridge.toast.updated"), "success");
		} catch {
			showMessage(t("fridge.toast.updateFailed"), "error");
		}
	};

	const handleRemove = async (id: string) => {
		try {
			await removeById(id);
			showMessage(t("fridge.toast.deleted"), "success");
		} catch {
			showMessage(t("fridge.toast.deleteFailed"), "error");
		}
	};

	const handlePickerConfirm = (names: string[]) => {
		appendIngredients(names);
		setPickerVisible(false);
		router.navigate("/");
	};

	if (isLoading) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
			</View>
		);
	}

	return (
		<ScreenScrollView backgroundColor={theme.background} contentContainerStyle={styles.container}>
			<FridgeScreenHeader
				onAddProduct={() => setAddModalVisible(true)}
				onScanProducts={() => router.push("/fridge/scan" as Href)}
				onScanReceipt={() => router.push("/fridge/scan-receipt" as Href)}
				recipesAction={
					items.length > 0 ? (
						<Pressable
							accessibilityRole="button"
							onPress={() => setPickerVisible(true)}
							style={[
								styles.recipesButton,
								{
									backgroundColor: theme.substitutionBoxBg,
									borderColor: theme.primary,
								},
							]}
						>
							<Ionicons name="sparkles" size={12} color={theme.primary} />
							<Text style={[styles.recipesLabel, { color: theme.primary }]}>{t("fridge.useForRecipes")}</Text>
						</Pressable>
					) : null
				}
			/>
			<FridgeProductList
				items={items}
				onRemove={(id) => void handleRemove(id)}
				onEdit={setEditingProduct}
				onOpenDetails={(item) => {
					if (!item.barcode) return;
					router.push(`/fridge/product/${encodeURIComponent(item.barcode)}` as Href);
				}}
			/>

			<FridgeProductFormModal
				visible={addModalVisible}
				mode="add"
				onClose={() => setAddModalVisible(false)}
				onSubmit={handleAdd}
			/>

			<FridgeProductFormModal
				visible={Boolean(editingProduct)}
				mode="edit"
				initialProduct={editingProduct}
				onClose={() => setEditingProduct(null)}
				onSubmit={handleEdit}
			/>

			<FridgePickerModal
				visible={pickerVisible}
				onClose={() => setPickerVisible(false)}
				onConfirm={handlePickerConfirm}
			/>
		</ScreenScrollView>
	);
};

export default FridgeScreen;

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 32,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	recipesButton: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 2,
		flexDirection: "row",
		gap: 6,
		opacity: 0.95,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	recipesLabel: {
		fontSize: 12,
		fontWeight: "900",
	},
});
