import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface PrimaryButtonProps {
	label: string;
	onPress: () => void;
	disabled?: boolean;
	compact?: boolean;
	leftIcon?: ReactNode;
	leftIconName?: keyof typeof Ionicons.glyphMap;
	rightIconName?: keyof typeof Ionicons.glyphMap;
}

export const PrimaryButton = ({
	label,
	onPress,
	disabled = false,
	compact = false,
	leftIcon,
	leftIconName,
	rightIconName,
}: PrimaryButtonProps) => {
	const theme = useAppAppearance();
	const iconColor = "#FFFFFF";
	const iconSize = compact ? 16 : 18;

	return (
		<Pressable
			disabled={disabled}
			onPress={onPress}
			style={[
				styles.button,
				compact ? styles.buttonCompact : styles.buttonDefault,
				{ backgroundColor: theme.primary },
				disabled && styles.disabledButton,
			]}
		>
			<View style={styles.content}>
				{leftIcon ??
					(leftIconName ? (
						<Ionicons name={leftIconName} size={iconSize} color={iconColor} />
					) : null)}
				<Text style={[styles.label, compact && styles.labelCompact]}>
					{label}
				</Text>
				{rightIconName ? (
					<Ionicons name={rightIconName} size={iconSize} color={iconColor} />
				) : null}
			</View>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		borderRadius: 16,
	},
	buttonDefault: {
		paddingHorizontal: 16,
		paddingVertical: 16,
	},
	buttonCompact: {
		borderRadius: 12,
		paddingHorizontal: 14,
		paddingVertical: 10,
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
	labelCompact: {
		fontSize: 14,
	},
});
