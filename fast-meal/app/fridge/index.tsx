import { useRouter } from "expo-router";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { PrimaryButton } from "@/components";
import {
	useFeedbackMessage,
	useFridgeProducts,
	useHomeIngredients,
} from "@/context";
import {
	AddFridgeProductForm,
	FridgePickerModal,
	FridgeProductList,
	FridgeScreenHeader,
} from "@/features/fridge-products";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const FridgeScreen = () => {
	const { t } = useTranslation();
	const router = useRouter();
	const theme = useAppAppearance();
	const { items, isLoading, addProduct, removeById } = useFridgeProducts();
	const { appendIngredients } = useHomeIngredients();
	const { showMessage } = useFeedbackMessage();
	const [pickerVisible, setPickerVisible] = useState(false);

	const handleAdd = async (input: {
		name: string;
		expirationDate?: string;
		purchasedAt?: string;
	}) => {
		try {
			await addProduct(input);
			showMessage(t("fridge.toast.added"), "success");
		} catch {
			showMessage(t("fridge.toast.addFailed"), "error");
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
		<ScrollView
			style={{ backgroundColor: theme.background }}
			contentContainerStyle={styles.container}
			keyboardShouldPersistTaps="handled"
		>
			<FridgeScreenHeader
				action={
					items.length > 0 ? (
						<PrimaryButton
							label={t("fridge.useForRecipes")}
							onPress={() => setPickerVisible(true)}
							compact
							leftIconName="sparkles"
						/>
					) : null
				}
			/>
			<AddFridgeProductForm onAdd={handleAdd} />
			<FridgeProductList
				items={items}
				onRemove={(id) => void handleRemove(id)}
			/>

			<FridgePickerModal
				visible={pickerVisible}
				onClose={() => setPickerVisible(false)}
				onConfirm={handlePickerConfirm}
			/>
		</ScrollView>
	);
};

export default FridgeScreen;

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 120,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
});
