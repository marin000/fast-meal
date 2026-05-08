import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface PrimaryButtonProps {
	label: string;
	onPress: () => void;
	disabled?: boolean;
	leftIconName?: keyof typeof Ionicons.glyphMap;
	rightIconName?: keyof typeof Ionicons.glyphMap;
}

export const PrimaryButton = ({
	label,
	onPress,
	disabled = false,
	leftIconName,
	rightIconName,
}: PrimaryButtonProps) => {
	const theme = useAppAppearance();
	const iconColor = "#FFFFFF";

	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={[
				styles.button,
				{ backgroundColor: theme.primary },
				disabled && styles.disabledButton,
			]}
		>
			<View style={styles.content}>
				{leftIconName ? (
					<Ionicons name={leftIconName} size={18} color={iconColor} />
				) : null}
				<Text style={styles.label}>{label}</Text>
				{rightIconName ? (
					<Ionicons name={rightIconName} size={18} color={iconColor} />
				) : null}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 16,
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	disabledButton: {
		opacity: 0.55,
	},
	content: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
		justifyContent: "center",
	},
	label: {
		color: "#FFFFFF",
		fontSize: 16,
		fontWeight: "800",
	},
});
