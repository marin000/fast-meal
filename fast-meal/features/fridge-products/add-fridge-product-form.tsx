import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { DateField } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { toIsoDate } from "@/utils/helper";

interface AddFridgeProductFormProps {
	onAdd: (input: {
		name: string;
		expirationDate?: string;
		purchasedAt?: string;
	}) => Promise<void>;
}

export const AddFridgeProductForm = ({ onAdd }: AddFridgeProductFormProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const [name, setName] = useState("");
	const [expirationDate, setExpirationDate] = useState<Date | undefined>();
	const [purchasedAt, setPurchasedAt] = useState<Date | undefined>();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleAdd = async () => {
		const trimmed = name.trim();
		if (!trimmed || isSubmitting) return;

		setIsSubmitting(true);
		try {
			await onAdd({
				name: trimmed,
				expirationDate: expirationDate ? toIsoDate(expirationDate) : undefined,
				purchasedAt: purchasedAt ? toIsoDate(purchasedAt) : undefined,
			});
			setName("");
			setExpirationDate(undefined);
			setPurchasedAt(undefined);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.nameRow}>
				<TextInput
					value={name}
					onChangeText={setName}
					onSubmitEditing={() => void handleAdd()}
					placeholder={t("fridge.addPlaceholder")}
					placeholderTextColor={theme.inputPlaceholder}
					returnKeyType="done"
					editable={!isSubmitting}
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
					onPress={() => void handleAdd()}
					disabled={isSubmitting}
					style={[
						styles.addButton,
						{
							backgroundColor: theme.primary,
							opacity: isSubmitting ? 0.6 : 1,
						},
					]}
				>
					<Ionicons name="add" size={24} color="#ffffff" />
				</Pressable>
			</View>

			<DateField
				label={t("fridge.expirationLabel")}
				value={expirationDate}
				onChange={setExpirationDate}
			/>
			<DateField
				label={t("fridge.purchasedLabel")}
				value={purchasedAt}
				onChange={setPurchasedAt}
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		gap: 12,
	},
	nameRow: {
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
