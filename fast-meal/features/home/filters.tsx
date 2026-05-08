import { useTranslation } from "react-i18next";
import { Alert, StyleSheet, Text, View } from "react-native";

import { ChipSelector } from "@/components";
import type { QuickFilterOption } from "@/constants/home";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface HomeFiltersProps {
	options: readonly QuickFilterOption[];
	selectedOptions: readonly QuickFilterOption[];
	lockedOptions: readonly QuickFilterOption[];
	onToggleOption: (option: QuickFilterOption) => void;
}

export const HomeFilters = ({
	options,
	selectedOptions,
	lockedOptions,
	onToggleOption,
}: HomeFiltersProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const translatedOptions = options.map((option) => ({
		key: option,
		label: t(`home.filters.${option}`),
	}));

	const translatedSelectedOptions = selectedOptions.map((option) =>
		t(`home.filters.${option}`),
	);

	return (
		<View style={styles.filtersSection}>
			<Text style={[styles.filtersLabel, { color: theme.textMuted }]}>
				{t("home.quickFiltersLabel")}
			</Text>
			<ChipSelector
				options={translatedOptions.map((option) => option.label)}
				selectedOptions={translatedSelectedOptions}
				disabledOptions={lockedOptions.map((option) =>
					t(`home.filters.${option}`),
				)}
				onDisabledOptionPress={() => {
					Alert.alert(
						t("home.lockedFilter.title"),
						t("home.lockedFilter.message"),
					);
				}}
				onToggleOption={(selectedLabel) => {
					const selectedOption = translatedOptions.find(
						(option) => option.label === selectedLabel,
					);

					if (selectedOption) {
						onToggleOption(selectedOption.key);
					}
				}}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	filtersSection: {
		gap: 10,
	},
	filtersLabel: {
		fontSize: 12,
		fontWeight: "700",
		letterSpacing: 0.6,
		textTransform: "uppercase",
	},
});
