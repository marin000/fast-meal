import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ToggleSwitch } from "@/components";
import { dietaryStyleOptions } from "@/constants/settings";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";

import { SegmentedControl } from "./segmented-control";
import { SettingsRow } from "./settings-row";

export const DietLifestyleSection = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const {
		dietaryStyle,
		setDietaryStyle,
		glutenFree,
		setGlutenFree,
		gymMode,
		setGymMode,
	} = usePreferences();

	return (
		<View
			style={[
				styles.section,
				{
					backgroundColor: theme.card,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
				{t("settings.sections.dietLifestyle")}
			</Text>
			<SettingsRow
				label={t("settings.dietaryStyle.label")}
				description={t("settings.dietaryStyle.description")}
			>
				<SegmentedControl
					options={dietaryStyleOptions}
					selectedOption={dietaryStyle}
					onPressOption={setDietaryStyle}
					getOptionLabel={(option) =>
						t(`settings.dietaryStyle.options.${option}`)
					}
				/>
			</SettingsRow>
			<SettingsRow
				label={t("settings.glutenFree.label")}
				description={t("settings.glutenFree.description")}
			>
				<ToggleSwitch value={glutenFree} onValueChange={setGlutenFree} />
			</SettingsRow>
			<SettingsRow
				label={t("settings.gymMode.label")}
				description={t("settings.gymMode.description")}
				hideSeparator
			>
				<ToggleSwitch value={gymMode} onValueChange={setGymMode} />
			</SettingsRow>
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "800",
		letterSpacing: 0.8,
		paddingBottom: 8,
		paddingTop: 8,
		textTransform: "uppercase",
	},
});
