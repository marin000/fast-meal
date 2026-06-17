import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import { formatDisplayDate } from "@/utils/date";

interface DateFieldProps {
	label: string;
	value?: Date;
	onChange: (value: Date | undefined) => void;
}

export const DateField = ({ label, value, onChange }: DateFieldProps) => {
	const { t, i18n } = useTranslation();
	const theme = useAppAppearance();
	const [showPicker, setShowPicker] = useState(false);

	const handlePickerChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		if (Platform.OS === "android") setShowPicker(false);

		if (event?.type === "dismissed") {
			setShowPicker(false);
			return;
		}
		if (selectedDate) onChange(selectedDate);
	};

	return (
		<View style={styles.field}>
			<Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
			<View style={styles.row}>
				<Pressable
					onPress={() => setShowPicker(true)}
					style={[
						styles.dateButton,
						{
							backgroundColor: theme.card,
							borderColor: theme.inputBorder,
						},
					]}
				>
					<Text style={[styles.dateText, { color: theme.text }]}>
						{value
							? formatDisplayDate(value, i18n.language)
							: t("common.addDate")}
					</Text>
				</Pressable>
				{value ? (
					<Pressable
						onPress={() => onChange(undefined)}
						style={[styles.clearButton, { backgroundColor: theme.chipBg }]}
					>
						<Text style={[styles.clearText, { color: theme.textMuted }]}>
							{t("common.clearDate")}
						</Text>
					</Pressable>
				) : null}
			</View>
			{showPicker ? (
				<DateTimePicker
					value={value ?? new Date()}
					mode="date"
					display={Platform.OS === "ios" ? "spinner" : "default"}
					onChange={handlePickerChange}
				/>
			) : null}
			{Platform.OS === "ios" && showPicker ? (
				<Pressable onPress={() => setShowPicker(false)}>
					<Text style={[styles.doneText, { color: theme.primary }]}>Done</Text>
				</Pressable>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	field: {
		gap: 6,
	},
	label: {
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 0.6,
		textTransform: "uppercase",
	},
	row: {
		flexDirection: "row",
		gap: 8,
	},
	dateButton: {
		borderRadius: 12,
		borderWidth: 2,
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	dateText: {
		fontSize: 14,
		fontWeight: "500",
	},
	clearButton: {
		alignItems: "center",
		borderRadius: 12,
		justifyContent: "center",
		paddingHorizontal: 12,
	},
	clearText: {
		fontSize: 12,
		fontWeight: "700",
	},
	webInput: {
		borderRadius: 12,
		borderWidth: 2,
		fontSize: 14,
		fontWeight: "500",
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	doneText: {
		fontSize: 14,
		fontWeight: "700",
		textAlign: "right",
	},
});
