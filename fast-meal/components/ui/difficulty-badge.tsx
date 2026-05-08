import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { RecipeDifficulty } from "@/interface";

interface DifficultyBadgeProps {
	difficulty: RecipeDifficulty;
	variant?: "soft" | "overlay";
}

export const DifficultyBadge = ({
	difficulty,
	variant = "soft",
}: DifficultyBadgeProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const palette = theme.difficulty[difficulty];
	const backgroundColor = variant === "overlay" ? theme.card : palette.soft;

	return (
		<View style={[styles.badge, { backgroundColor }]}>
			<Text style={[styles.text, { color: palette.solid }]}>
				{t(`recipe.difficulty.${difficulty}`)}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	badge: {
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	text: {
		fontSize: 11,
		fontWeight: "800",
	},
});
