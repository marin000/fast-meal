import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";

import { useFeedbackMessage } from "@/context/feedback-message-context";
import { useFridgeProducts } from "@/context/fridge-products-context";
import {
	AddFridgeProductForm,
	FridgeProductList,
	FridgeScreenHeader,
} from "@/features/fridge-products";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const FridgeScreen = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { items, isLoading, addProduct, removeById } = useFridgeProducts();
	const { showMessage } = useFeedbackMessage();

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
			<FridgeScreenHeader />
			<AddFridgeProductForm onAdd={handleAdd} />
			<FridgeProductList
				items={items}
				onRemove={(id) => void handleRemove(id)}
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
