import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface ChipSelectorProps<T extends string> {
	options: readonly T[];
	selectedOptions: readonly T[];
	disabledOptions?: readonly T[];
	onToggleOption: (value: T) => void;
	onDisabledOptionPress?: (value: T) => void;
}

export const ChipSelector = <T extends string>({
	options,
	selectedOptions,
	disabledOptions = [],
	onToggleOption,
	onDisabledOptionPress,
}: ChipSelectorProps<T>) => {
	const theme = useAppAppearance();

	return (
		<View style={styles.container}>
			{options.map((option) => {
				const isSelected = selectedOptions.includes(option);
				const isDisabled = disabledOptions.includes(option);

				return (
					<Pressable
						key={option}
						onPress={() =>
							isDisabled
								? onDisabledOptionPress?.(option)
								: onToggleOption(option)
						}
						style={[
							styles.chip,
							{
								backgroundColor: isSelected
									? theme.chipSelectedBg
									: theme.chipBg,
								borderColor: isSelected
									? theme.chipSelectedBorder
									: theme.chipBorder,
							},
							isDisabled && styles.disabledChip,
						]}
					>
						<Text
							style={[
								styles.label,
								{
									color: isSelected ? theme.chipSelectedText : theme.chipText,
								},
								isDisabled && styles.disabledLabel,
							]}
						>
							{option}
						</Text>
					</Pressable>
				);
			})}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 10,
	},
	chip: {
		borderRadius: 999,
		borderWidth: 1,
		paddingHorizontal: 14,
		paddingVertical: 10,
	},
	label: {
		fontSize: 14,
		fontWeight: "700",
	},
	disabledChip: {
		opacity: 0.85,
	},
	disabledLabel: {
		opacity: 0.95,
	},
});
