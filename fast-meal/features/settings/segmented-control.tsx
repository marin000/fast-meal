import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface SegmentedControlProps<T extends string> {
	options: readonly T[];
	selectedOption?: T;
	onPressOption: (value: T) => void;
	getOptionLabel: (value: T) => string;
	equalWidth?: boolean;
}

export const SegmentedControl = <T extends string>({
	options,
	selectedOption,
	onPressOption,
	getOptionLabel,
	equalWidth = false,
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
							equalWidth && styles.segmentItemEqualWidth,
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
							numberOfLines={1}
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
		alignItems: "center",
		paddingHorizontal: 10,
		paddingVertical: 8,
	},
	segmentItemEqualWidth: {
		flex: 1,
	},
	segmentLabel: {
		fontSize: 12,
		fontWeight: "700",
		textAlign: "center",
		textTransform: "capitalize",
	},
});
