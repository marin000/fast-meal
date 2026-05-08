import { StyleSheet, View } from "react-native";

import { DietLifestyleSection, DisplaySection } from "@/features/settings";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const SettingsScreen = () => {
	const theme = useAppAppearance();

	return (
		<View style={[styles.screen, { backgroundColor: theme.background }]}>
			<DietLifestyleSection />
			<DisplaySection />
		</View>
	);
};

export default SettingsScreen;

const styles = StyleSheet.create({
	screen: {
		flex: 1,
		gap: 12,
		paddingBottom: 110,
		paddingHorizontal: 20,
		paddingTop: 24,
	},
});
