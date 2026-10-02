import { StyleSheet } from "react-native";

import { ScreenScrollView } from "@/components";
import { DietLifestyleSection, DisplaySection, ExcludedIngredientsSection, FamilySection } from "@/features/settings";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const SettingsScreen = () => {
	const theme = useAppAppearance();

	return (
		<ScreenScrollView backgroundColor={theme.background} contentContainerStyle={styles.screen}>
			<DietLifestyleSection />
			<ExcludedIngredientsSection />
			<DisplaySection />
			<FamilySection />
		</ScreenScrollView>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	screen: {
		gap: 12,
		paddingBottom: 32,
		paddingHorizontal: 20,
		paddingTop: 24,
	},
});
