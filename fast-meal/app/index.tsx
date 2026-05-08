import { useTranslation } from "react-i18next";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { AppTextInput, PrimaryButton } from "@/components";
import { HomeFilters, HomeHeader } from "@/features/home";
import { useHomeForm } from "@/hooks/use-home-form";

const HomeScreen = () => {
	const { t } = useTranslation();
	const {
		ingredientsInputValue,
		setIngredientsInputValue,
		selectedFilters,
		toggleFilterOption,
		quickFilterOptions,
		canSubmit,
		submitForm,
	} = useHomeForm();

	return (
		<Pressable style={styles.screen} onPress={Keyboard.dismiss}>
			<HomeHeader />

			<AppTextInput
				label={t("home.ingredientsLabel")}
				placeholder={t("home.ingredientsPlaceholder")}
				value={ingredientsInputValue}
				onChangeText={setIngredientsInputValue}
			/>

			<HomeFilters
				options={quickFilterOptions}
				selectedOptions={selectedFilters}
				onToggleOption={toggleFilterOption}
			/>

			<PrimaryButton
				label={t("home.cta")}
				onPress={submitForm}
				disabled={!canSubmit}
				leftIconName="sparkles"
				rightIconName="arrow-forward"
			/>
		</Pressable>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		gap: 24,
		paddingBottom: 110,
		paddingHorizontal: 20,
		paddingVertical: 24,
	},
});
