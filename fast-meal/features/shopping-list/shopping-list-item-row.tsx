import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { ShoppingListItem } from "@/interface/shopping-list";

interface ShoppingListItemRowProps {
	item: ShoppingListItem;
	onToggle: () => void;
	onRemove: () => void;
}

export const ShoppingListItemRow = ({
	item,
	onToggle,
	onRemove,
}: ShoppingListItemRowProps) => {
	const theme = useAppAppearance();

	return (
		<View
			style={[
				styles.row,
				{
					backgroundColor: item.checked ? theme.chipBg : theme.card,
					borderColor: item.checked ? theme.cardBorder : theme.cardBorder,
					borderWidth: item.checked ? 1 : 2,
				},
			]}
		>
			<Pressable
				accessibilityRole="checkbox"
				accessibilityState={{ checked: item.checked }}
				onPress={onToggle}
				style={[
					styles.checkbox,
					item.checked
						? {
								backgroundColor: theme.primary,
								borderColor: theme.primary,
							}
						: { borderColor: theme.cardBorder },
				]}
			>
				{item.checked ? (
					<Ionicons name="checkmark" size={14} color="#ffffff" />
				) : null}
			</Pressable>

			<Text
				style={[
					styles.name,
					{ color: item.checked ? theme.textMuted : theme.text },
					item.checked ? styles.nameChecked : null,
				]}
				numberOfLines={2}
			>
				{item.name}
			</Text>

			<Pressable
				accessibilityRole="button"
				onPress={onRemove}
				style={[styles.deleteButton, { backgroundColor: theme.chipBg }]}
			>
				<Ionicons name="trash-outline" size={16} color={theme.iconMuted} />
			</Pressable>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		borderRadius: 12,
		flexDirection: "row",
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	checkbox: {
		alignItems: "center",
		borderRadius: 6,
		borderWidth: 2,
		height: 20,
		justifyContent: "center",
		width: 20,
	},
	name: {
		flex: 1,
		fontSize: 14,
		fontWeight: "500",
	},
	nameChecked: {
		textDecorationLine: "line-through",
	},
	deleteButton: {
		alignItems: "center",
		borderRadius: 8,
		height: 28,
		justifyContent: "center",
		width: 28,
	},
});
