import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface RecipeSectionProps {
	label: string;
	children: ReactNode;
}

export const RecipeSection = ({ label, children }: RecipeSectionProps) => {
	const theme = useAppAppearance();

	return (
		<View style={styles.section}>
			<Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
			{children}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		gap: 12,
	},
	label: {
		fontSize: 11,
		fontWeight: "900",
		letterSpacing: 1.4,
		textTransform: "uppercase",
	},
});
