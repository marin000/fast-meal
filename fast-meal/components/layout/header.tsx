import { StyleSheet, Text, View } from "react-native";

import { FridgeAiLogo } from "@/components/ui";
import { useAppAppearance } from "@/hooks/use-app-appearance";

export const Header = () => {
	const theme = useAppAppearance();

	return (
		<View style={styles.brandRow}>
			<View
				style={[
					styles.logoContainer,
					{ backgroundColor: theme.logoContainerBg },
				]}
			>
				<FridgeAiLogo size={24} />
			</View>
			<Text style={styles.brandText}>
				<Text style={{ color: theme.brandTextBase }}>Fridge</Text>
				<Text style={{ color: theme.primary }}>AI</Text>
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	brandRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 10,
	},
	logoContainer: {
		alignItems: "center",
		borderRadius: 14,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	brandText: {
		fontSize: 20,
		fontWeight: "900",
		letterSpacing: 0.2,
	},
});
