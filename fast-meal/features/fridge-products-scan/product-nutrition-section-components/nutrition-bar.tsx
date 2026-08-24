import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import { formatNutrient } from "@/utils/food-facts-helper";

interface NutritionBarProps {
	label: string;
	value: number | undefined;
	max: number;
	color: string;
	unit: string;
}

export const NutritionBar = ({
	label,
	value,
	max,
	color,
	unit,
}: NutritionBarProps) => {
	const theme = useAppAppearance();
	const numericValue = value ?? 0;
	const fillPercentage = Math.min(100, Math.round((numericValue / max) * 100));

	return (
		<View style={styles.barWrapper}>
			<View style={styles.barHeader}>
				<Text style={[styles.barLabel, { color: theme.textMuted }]}>
					{label}
				</Text>
				<Text style={[styles.barValue, { color: theme.text }]}>
					{formatNutrient(value)}
					{unit}
				</Text>
			</View>
			<View
				style={[styles.barTrack, { backgroundColor: theme.nutritionBarTrack }]}
			>
				<View
					style={[
						styles.barFill,
						{ width: `${fillPercentage}%`, backgroundColor: color },
					]}
				/>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	barWrapper: {
		gap: 4,
	},
	barHeader: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	barLabel: {
		fontSize: 12,
		fontWeight: "600",
	},
	barValue: {
		fontSize: 12,
		fontWeight: "900",
	},
	barTrack: {
		borderRadius: 999,
		height: 6,
		overflow: "hidden",
	},
	barFill: {
		borderRadius: 999,
		height: "100%",
	},
});
