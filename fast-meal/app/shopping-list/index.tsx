import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { ScreenScrollView } from "@/components";

import { useShoppingList } from "@/context/shopping-list-context";
import {
	AddShoppingItemInput,
	ShoppingListItemRow,
} from "@/features/shopping-list";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const ShoppingListScreen = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { items, isLoading, addItem, toggleItem, removeItem, reload } =
		useShoppingList();

	useFocusEffect(
		useCallback(() => {
			void reload();
		}, [reload]),
	);

	const activeItems = items.filter((item) => !item.checked);
	const checkedItems = items.filter((item) => item.checked);

	if (isLoading) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
			</View>
		);
	}

	return (
		<ScreenScrollView
			backgroundColor={theme.background}
			contentContainerStyle={styles.container}
		>
			<View style={styles.header}>
				<Text style={[styles.kicker, { color: theme.textMuted }]}>
					{t("shopping.kicker")}
				</Text>
				<Text style={[styles.title, { color: theme.text }]}>
					{t("shopping.title")}
				</Text>
			</View>

			<AddShoppingItemInput onAdd={(name) => void addItem(name)} />

			{activeItems.length > 0 && (
				<View style={styles.section}>
					{activeItems.map((item) => (
						<ShoppingListItemRow
							key={item.id}
							item={item}
							onToggle={() => void toggleItem(item.id)}
							onRemove={() => void removeItem(item.id)}
						/>
					))}
				</View>
			)}

			{checkedItems.length > 0 && (
				<View style={styles.section}>
					<Text style={[styles.completedLabel, { color: theme.textMuted }]}>
						{t("shopping.completed", { count: checkedItems.length })}
					</Text>
					{checkedItems.map((item) => (
						<ShoppingListItemRow
							key={item.id}
							item={item}
							onToggle={() => void toggleItem(item.id)}
							onRemove={() => void removeItem(item.id)}
						/>
					))}
				</View>
			)}

			{items.length === 0 && (
				<View style={styles.empty}>
					<View style={[styles.emptyIcon, { backgroundColor: theme.chipBg }]}>
						<Ionicons name="cart-outline" size={28} color={theme.iconMuted} />
					</View>
					<Text style={[styles.emptyTitle, { color: theme.text }]}>
						{t("shopping.emptyTitle")}
					</Text>
					<Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
						{t("shopping.emptySubtitle")}
					</Text>
				</View>
			)}
		</ScreenScrollView>
	);
};

export default ShoppingListScreen;

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 32,
		paddingHorizontal: 20,
		paddingTop: 8,
	},
	centered: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	header: {
		gap: 6,
	},
	kicker: {
		fontSize: 10,
		fontWeight: "900",
		letterSpacing: 1.2,
		textTransform: "uppercase",
	},
	title: {
		fontSize: 24,
		fontWeight: "900",
	},
	section: {
		gap: 8,
	},
	completedLabel: {
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 0.8,
		marginBottom: 4,
		textTransform: "uppercase",
	},
	empty: {
		alignItems: "center",
		gap: 8,
		paddingVertical: 48,
	},
	emptyIcon: {
		alignItems: "center",
		borderRadius: 16,
		height: 56,
		justifyContent: "center",
		marginBottom: 8,
		width: 56,
	},
	emptyTitle: {
		fontSize: 15,
		fontWeight: "900",
	},
	emptySubtitle: {
		fontSize: 13,
		fontWeight: "500",
		textAlign: "center",
	},
});
