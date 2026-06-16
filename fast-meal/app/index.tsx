import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Keyboard, ScrollView, StyleSheet } from "react-native";

import { AppTextInput, FridgeIcon, PrimaryButton } from "@/components";
import { useFridgeProducts, useHomeIngredients } from "@/context";
import { FridgePickerModal } from "@/features/fridge-products";
import { HomeFilters, HomeHeader } from "@/features/home";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { useHomeForm } from "@/hooks/use-home-form";

const HomeScreen = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { items } = useFridgeProducts();
	const { appendIngredients } = useHomeIngredients();
	const [pickerVisible, setPickerVisible] = useState(false);
	const {
		ingredientsInputValue,
		setIngredientsInputValue,
		selectedFilters,
		lockedQuickFilters,
		toggleFilterOption,
		quickFilterOptions,
		canSubmit,
		submitForm,
	} = useHomeForm();

	const handlePickerConfirm = (names: string[]) => {
		appendIngredients(names);
		setPickerVisible(false);
	};

	return (
		<>
			<ScrollView
				style={{ backgroundColor: theme.background, flex: 1 }}
				contentContainerStyle={styles.container}
				keyboardShouldPersistTaps="handled"
				onScrollBeginDrag={Keyboard.dismiss}
			>
				<HomeHeader />

				<AppTextInput
					label={t("home.ingredientsLabel")}
					placeholder={t("home.ingredientsPlaceholder")}
					value={ingredientsInputValue}
					onChangeText={setIngredientsInputValue}
				/>

				{items.length > 0 ? (
					<PrimaryButton
						label={t("fridge.useFromFridge")}
						onPress={() => setPickerVisible(true)}
						compact
						leftIcon={<FridgeIcon size={16} color="#FFFFFF" />}
					/>
				) : null}

				<HomeFilters
					options={quickFilterOptions}
					selectedOptions={selectedFilters}
					lockedOptions={lockedQuickFilters}
					onToggleOption={toggleFilterOption}
				/>

				<PrimaryButton
					label={t("home.cta")}
					onPress={submitForm}
					disabled={!canSubmit}
					leftIconName="sparkles"
					rightIconName="arrow-forward"
				/>
			</ScrollView>

			<FridgePickerModal
				visible={pickerVisible}
				onClose={() => setPickerVisible(false)}
				onConfirm={handlePickerConfirm}
			/>
		</>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	container: {
		gap: 24,
		paddingBottom: 110,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
});
