import type { ReactNode } from "react";
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
	labelRight?: ReactNode;
	placeholder: string;
	footer?: ReactNode;
}

export const AppTextInput = ({
	label,
	labelRight,
	placeholder,
	footer,
	style,
	...props
}: AppTextInputProps) => {
	const theme = useAppAppearance();

	return (
		<View style={styles.container}>
			<View style={styles.labelRow}>
				<Pressable onPress={Keyboard.dismiss} style={styles.labelPressable}>
					<Text style={[styles.label, { color: theme.text }]}>{label}</Text>
				</Pressable>
				{labelRight}
			</View>
			<View
				style={[
					styles.inputCard,
					{
						backgroundColor: theme.inputBg,
						borderColor: theme.inputBorder,
					},
				]}
			>
				<TextInput
					multiline
					numberOfLines={4}
					placeholder={placeholder}
					placeholderTextColor={theme.inputPlaceholder}
					style={[
						styles.input,
						footer ? styles.inputWithFooter : null,
						{ color: theme.text },
						style,
					]}
					textAlignVertical="top"
					{...props}
				/>
				{footer ? <View style={styles.footer}>{footer}</View> : null}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 8,
	},
	labelRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
		justifyContent: "space-between",
	},
	labelPressable: {
		flexShrink: 1,
	},
	label: {
		fontSize: 13,
		fontWeight: "700",
	},
	inputCard: {
		borderRadius: 16,
		borderWidth: 1,
		overflow: "hidden",
	},
	input: {
		fontSize: 16,
		minHeight: 120,
		paddingHorizontal: 16,
		paddingVertical: 14,
	},
	inputWithFooter: {
		minHeight: 100,
		paddingBottom: 8,
	},
	footer: {
		paddingBottom: 12,
		paddingHorizontal: 12,
	},
});
