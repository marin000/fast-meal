import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface SegmentedControlProps<T extends string> {
	options: readonly T[];
	selectedOption: T;
	onPressOption: (value: T) => void;
	getOptionLabel: (value: T) => string;
}

export const SegmentedControl = <T extends string>({
	options,
	selectedOption,
	onPressOption,
	getOptionLabel,
}: SegmentedControlProps<T>) => {
	const theme = useAppAppearance();

	return (
		<View
			style={[styles.segmentedControl, { borderColor: theme.segmentBorder }]}
		>
			{options.map((option) => {
				const isSelected = option === selectedOption;

				return (
					<Pressable
						key={option}
						onPress={() => onPressOption(option)}
						style={[
							styles.segmentItem,
							{
								backgroundColor: isSelected
									? theme.segmentActiveBg
									: theme.segmentInactiveBg,
							},
						]}
					>
						<Text
							style={[
								styles.segmentLabel,
								{
									color: isSelected
										? theme.segmentActiveText
										: theme.segmentInactiveText,
								},
							]}
						>
							{getOptionLabel(option)}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	segmentedControl: {
		borderRadius: 10,
		borderWidth: 1,
		flexDirection: "row",
		overflow: "hidden",
	},
	segmentItem: {
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	segmentLabel: {
		fontSize: 12,
		fontWeight: "700",
		textTransform: "capitalize",
	},
});
