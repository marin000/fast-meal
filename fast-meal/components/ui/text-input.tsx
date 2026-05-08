import type { TextInputProps } from "react-native";
import {
	Keyboard,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface AppTextInputProps extends TextInputProps {
	label: string;
	placeholder: string;
}

export const AppTextInput = ({
	label,
	placeholder,
	style,
	...props
}: AppTextInputProps) => {
	const theme = useAppAppearance();

	return (
		<View style={styles.container}>
			<Pressable onPress={Keyboard.dismiss}>
				<Text style={[styles.label, { color: theme.text }]}>{label}</Text>
			</Pressable>
			<TextInput
				multiline
				numberOfLines={4}
				placeholder={placeholder}
				placeholderTextColor={theme.inputPlaceholder}
				style={[
					styles.input,
					{
						backgroundColor: theme.inputBg,
						borderColor: theme.inputBorder,
						color: theme.text,
					},
					style,
				]}
				textAlignVertical="top"
				{...props}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	label: {
		fontSize: 13,
		fontWeight: "700",
	},
	input: {
		borderRadius: 16,
		borderWidth: 1,
		fontSize: 16,
		minHeight: 120,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
});
