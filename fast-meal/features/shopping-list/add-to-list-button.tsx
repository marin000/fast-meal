import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text } from "react-native";

import { useFeedbackMessage } from "@/context/feedback-message-context";
import { useShoppingList } from "@/context/shopping-list-context";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { Recipe } from "@/interface";

const ZERO_ITEMS = 0;
const ONE_ITEM = 1;

interface AddToShoppingListButtonProps {
	recipe: Recipe;
}

export const AddToShoppingListButton = ({
	recipe,
}: AddToShoppingListButtonProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { showMessage } = useFeedbackMessage();
	const { addFromRecipe } = useShoppingList();

	const handlePress = () => {
		void (async () => {
			const added = await addFromRecipe(recipe);
			if (added > ZERO_ITEMS) {
				const key =
					added === ONE_ITEM
						? "shopping.toast.added_one"
						: "shopping.toast.added";
				showMessage(t(key, { count: added }), "success");
				return;
			}
			showMessage(t("shopping.toast.alreadyOnList"), "info");
		})();
	};

	return (
		<Pressable
			accessibilityRole="button"
			onPress={handlePress}
			style={[
				styles.button,
				{
					backgroundColor: theme.substitutionBoxBg,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<Ionicons name="cart-outline" size={18} color={theme.primary} />
			<Text style={[styles.label, { color: theme.text }]}>
				{t("shopping.addFromRecipe")}
			</Text>
		</Pressable>
	);
};

const styles = StyleSheet.create({
	button: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: "row",
		gap: 8,
		justifyContent: "center",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	label: {
		fontSize: 14,
		fontWeight: "700",
	},
});
