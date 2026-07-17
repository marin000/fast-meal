import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import {
	AppTextInput,
	FridgeIcon,
	PrimaryButton,
	ScreenScrollView,
} from "@/components";
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
			<ScreenScrollView
				backgroundColor={theme.background}
				contentContainerStyle={styles.container}
				dismissKeyboardOnScroll
			>
				<HomeHeader />

				<AppTextInput
					label={t("home.ingredientsLabel")}
					labelRight={
						items.length > 0 ? (
							<View style={styles.fridgeButtonWrap}>
								<PrimaryButton
									label={t("fridge.useFromFridge")}
									onPress={() => setPickerVisible(true)}
									compact
									shrink
									leftIcon={<FridgeIcon size={14} color="#FFFFFF" />}
								/>
							</View>
						) : undefined
					}
					placeholder={t("home.ingredientsPlaceholder")}
					value={ingredientsInputValue}
					onChangeText={setIngredientsInputValue}
				/>

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
			</ScreenScrollView>

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
		paddingBottom: 32,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
	fridgeButtonWrap: {
		alignSelf: "flex-end",
		flexShrink: 1,
		maxWidth: "58%",
	},
});
