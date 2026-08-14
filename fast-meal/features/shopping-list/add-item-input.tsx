import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface AddShoppingItemInputProps {
	onAdd: (name: string) => void;
}

export const AddShoppingItemInput = ({ onAdd }: AddShoppingItemInputProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const [value, setValue] = useState("");

	const canAdd = value.trim().length > 0;

	const handleAdd = () => {
		const trimmed = value.trim();
		if (!trimmed) return;
		onAdd(trimmed);
		setValue("");
	};

	return (
		<View style={styles.row}>
			<TextInput
				value={value}
				onChangeText={setValue}
				onSubmitEditing={handleAdd}
				placeholder={t("shopping.addPlaceholder")}
				placeholderTextColor={theme.inputPlaceholder}
				returnKeyType="done"
				style={[
					styles.input,
					{
						backgroundColor: theme.card,
						borderColor: theme.inputBorder,
						color: theme.text,
					},
				]}
			/>
			<Pressable
				accessibilityRole="button"
				accessibilityState={{ disabled: !canAdd }}
				disabled={!canAdd}
				onPress={handleAdd}
				style={[
					styles.addButton,
					{
						backgroundColor: theme.primary,
						opacity: canAdd ? 1 : 0.4,
					},
				]}
			>
				<Ionicons name="add" size={24} color="#ffffff" />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		flexDirection: "row",
		gap: 8,
	},
	input: {
		borderRadius: 12,
		borderWidth: 2,
		flex: 1,
		fontSize: 14,
		fontWeight: "500",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	addButton: {
		alignItems: "center",
		borderRadius: 12,
		height: 48,
		justifyContent: "center",
		width: 48,
	},
});
