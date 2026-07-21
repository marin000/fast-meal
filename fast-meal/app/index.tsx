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
import { FridgeImageUpload, HomeFilters, HomeHeader } from "@/features/home";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { useHomeForm } from "@/hooks/use-home-form";
import { useIngredientImage } from "@/hooks/use-ingredient-image";

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
	const {
		previewUri,
		imageError,
		isProcessing,
		showPickerOptions,
		removeImage,
	} = useIngredientImage();

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
					placeholder={
						previewUri
							? t("home.ingredientsPlaceholderWithPhoto")
							: t("home.ingredientsPlaceholder")
					}
					value={ingredientsInputValue}
					onChangeText={setIngredientsInputValue}
					footer={
						<FridgeImageUpload
							previewUri={previewUri}
							isProcessing={isProcessing}
							imageError={imageError}
							onAddPress={showPickerOptions}
							onReplacePress={showPickerOptions}
							onRemovePress={removeImage}
						/>
					}
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
		flexShrink: 0,
	},
});
