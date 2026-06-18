import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";

import { useFeedbackMessage } from "@/context/feedback-message-context";
import { useSavedRecipesList } from "@/context/saved-recipes-context";
import { SavedRecipeCard } from "@/features/recipes";
import { useAppAppearance } from "@/hooks/use-app-appearance";

const SavedRecipesScreen = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const router = useRouter();
	const { items, isLoading, removeById } = useSavedRecipesList();
	const { showMessage } = useFeedbackMessage();

	const openRecipe = (id: string) => {
		router.push(`/saved/${id}`);
	};

	const handleDelete = async (id: string) => {
		await removeById(id);
		showMessage(t("saved.toast.deleted"), "success");
	};

	if (isLoading) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
			</View>
		);
	}

	return (
		<ScrollView
			style={{ backgroundColor: theme.background }}
			contentContainerStyle={styles.container}
		>
			<View style={styles.header}>
				<Text style={[styles.kicker, { color: theme.textMuted }]}>
					{t("saved.kicker")}
				</Text>
				<Text style={[styles.title, { color: theme.text }]}>
					{t("saved.title")}
				</Text>
			</View>

			{items.length === 0 ? (
				<View style={styles.empty}>
					<Text style={[styles.emptyTitle, { color: theme.text }]}>
						{t("saved.emptyTitle")}
					</Text>
					<Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
						{t("saved.emptySubtitle")}
					</Text>
				</View>
			) : (
				<View style={styles.list}>
					{items.map((item) => (
						<SavedRecipeCard
							key={item.id}
							recipe={item.recipe}
							onOpen={() => openRecipe(item.id)}
							onDelete={() => handleDelete(item.id)}
						/>
					))}
				</View>
			)}
		</ScrollView>
	);
};

export default SavedRecipesScreen;

const styles = StyleSheet.create({
	container: {
		gap: 16,
		paddingBottom: 24,
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
	empty: {
		alignItems: "center",
		gap: 8,
		paddingVertical: 48,
	},
	emptyTitle: {
		fontSize: 16,
		fontWeight: "900",
	},
	emptySubtitle: {
		fontSize: 13,
		fontWeight: "500",
		textAlign: "center",
	},
	list: {
		gap: 12,
	},
});
