import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { ToggleSwitch } from "@/components";
import { languageOptions, unitsOptions } from "@/constants/settings";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";

import { SegmentedControl } from "./segmented-control";
import { SettingsRow } from "./settings-row";

export const DisplaySection = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { darkMode, setDarkMode, language, setLanguage, units, setUnits } =
		usePreferences();

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
				{t("settings.sections.display")}
			</Text>
			<SettingsRow label={t("settings.darkMode.label")}>
				<ToggleSwitch value={darkMode} onValueChange={setDarkMode} />
			</SettingsRow>
			<SettingsRow
				label={t("settings.language.label")}
				description={t("settings.language.description")}
			>
				<SegmentedControl
					options={languageOptions}
					selectedOption={language}
					onPressOption={setLanguage}
					getOptionLabel={(option) => t(`settings.language.options.${option}`)}
				/>
			</SettingsRow>
			<SettingsRow
				label={t("settings.units.label")}
				description={t("settings.units.description")}
				hideSeparator
			>
				<SegmentedControl
					options={unitsOptions}
					selectedOption={units}
					onPressOption={setUnits}
					getOptionLabel={(option) => t(`settings.units.options.${option}`)}
				/>
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
