import { Pressable, StyleSheet, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface ToggleSwitchProps {
	value: boolean;
	onValueChange: (value: boolean) => void;
}

export const ToggleSwitch = ({ value, onValueChange }: ToggleSwitchProps) => {
	const theme = useAppAppearance();

	return (
		<Pressable
			accessibilityRole="switch"
			accessibilityState={{ checked: value }}
			onPress={() => onValueChange(!value)}
			style={[
				styles.track,
				{
					backgroundColor: value ? theme.toggleTrackActive : theme.toggleTrack,
				},
			]}
		>
			<View style={[styles.thumb, value && styles.thumbActive]} />
		</Pressable>
	);
};

const styles = StyleSheet.create({
	track: {
		alignItems: "center",
		borderRadius: 999,
		height: 28,
		justifyContent: "center",
		paddingHorizontal: 3,
		width: 48,
	},
	thumb: {
		alignSelf: "flex-start",
		backgroundColor: "#FFFFFF",
		borderRadius: 10,
		height: 20,
		width: 20,
	},
	thumbActive: {
		alignSelf: "flex-end",
	},
});
