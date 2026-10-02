import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { PrimaryButton } from "@/components";
import { MAX_EXCLUDED_INGREDIENTS } from "@/constants/settings";
import { usePreferences } from "@/context";
import { useAppAppearance } from "@/hooks/use-app-appearance";

export const ExcludedIngredientsSection = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const { excludedIngredients, addExcludedIngredient, removeExcludedIngredient } = usePreferences();
	const [draft, setDraft] = useState("");

	const isAtLimit = excludedIngredients.length >= MAX_EXCLUDED_INGREDIENTS;
	const canAdd = draft.trim().length > 0 && !isAtLimit;

	const handleAdd = () => {
		if (!canAdd) return;
		addExcludedIngredient(draft);
		setDraft("");
	};

	return (
		<View
			style={[
				styles.section,
				{
					backgroundColor: theme.card,
					borderColor: theme.cardBorder,
				},
			]}
		>
			<Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
				{t("settings.sections.excludedIngredients")}
			</Text>
			<Text style={[styles.description, { color: theme.textMuted }]}>
				{t("settings.excludedIngredients.description")}
			</Text>

			<View style={styles.inputRow}>
				<TextInput
					value={draft}
					onChangeText={setDraft}
					placeholder={t("settings.excludedIngredients.placeholder")}
					placeholderTextColor={theme.inputPlaceholder}
					editable={!isAtLimit}
					returnKeyType="done"
					onSubmitEditing={handleAdd}
					style={[
						styles.input,
						{
							backgroundColor: theme.inputBg,
							borderColor: theme.inputBorder,
							color: theme.text,
						},
					]}
				/>
				<PrimaryButton
					label={t("settings.excludedIngredients.add")}
					onPress={handleAdd}
					disabled={!canAdd}
					compact
					shrink
				/>
			</View>

			{isAtLimit ? (
				<Text style={[styles.hint, { color: theme.textMuted }]}>
					{t("settings.excludedIngredients.limitReached", {
						count: MAX_EXCLUDED_INGREDIENTS,
					})}
				</Text>
			) : null}

			{excludedIngredients.length === 0 ? (
				<Text style={[styles.hint, { color: theme.textMuted }]}>{t("settings.excludedIngredients.empty")}</Text>
			) : (
				<View style={styles.chips}>
					{excludedIngredients.map((item) => (
						<Pressable
							key={item}
							onPress={() => removeExcludedIngredient(item)}
							accessibilityRole="button"
							accessibilityLabel={t("settings.excludedIngredients.remove", {
								name: item,
							})}
							style={[
								styles.chip,
								{
									backgroundColor: theme.chipSelectedBg,
									borderColor: theme.chipSelectedBorder,
								},
							]}
						>
							<Text style={[styles.chipText, { color: theme.chipSelectedText }]}>{item}</Text>
							<Ionicons name="close" size={14} color={theme.chipSelectedText} />
						</Pressable>
					))}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		borderRadius: 16,
		borderWidth: 1,
		gap: 12,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "800",
		letterSpacing: 0.8,
		paddingTop: 4,
		textTransform: "uppercase",
	},
	description: {
		fontSize: 12,
		fontWeight: "500",
		lineHeight: 18,
	},
	inputRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
	},
	input: {
		borderRadius: 12,
		borderWidth: 1,
		flex: 1,
		fontSize: 14,
		fontWeight: "600",
		paddingHorizontal: 12,
		paddingVertical: 10,
	},
	hint: {
		fontSize: 12,
		fontWeight: "500",
	},
	chips: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		paddingBottom: 4,
	},
	chip: {
		alignItems: "center",
		borderRadius: 999,
		borderWidth: 1,
		flexDirection: "row",
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	chipText: {
		fontSize: 13,
		fontWeight: "700",
	},
});
