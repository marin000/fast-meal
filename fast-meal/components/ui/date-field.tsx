import DateTimePicker, {
	type DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, StyleSheet, Text, View } from "react-native";

import { usePreferences } from "@/context/preferences-context";
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
	const { darkMode } = usePreferences();
	const [showAndroidPicker, setShowAndroidPicker] = useState(false);

	const handlePickerChange = (
		event: DateTimePickerEvent,
		selectedDate?: Date,
	) => {
		if (Platform.OS === "android") setShowAndroidPicker(false);

		if (event?.type === "dismissed") {
			setShowAndroidPicker(false);
			return;
		}
		if (selectedDate) onChange(selectedDate);
	};

	return (
		<View style={styles.field}>
			<Text style={[styles.label, { color: theme.textMuted }]}>{label}</Text>
			<View style={styles.row}>
				{Platform.OS === "ios" ? (
					<View
						style={[
							styles.dateButton,
							styles.iosPickerButton,
							{
								backgroundColor: theme.card,
								borderColor: theme.inputBorder,
							},
						]}
					>
						{/* compact opens a calendar popover — works even when the field is near the bottom */}
						<DateTimePicker
							value={value ?? new Date()}
							mode="date"
							display="compact"
							themeVariant={darkMode ? "dark" : "light"}
							accentColor={theme.primary}
							onChange={handlePickerChange}
						/>
					</View>
				) : (
					<Pressable
						onPress={() => setShowAndroidPicker(true)}
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
				)}
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
			{Platform.OS === "android" && showAndroidPicker ? (
				<DateTimePicker
					value={value ?? new Date()}
					mode="date"
					display="default"
					themeVariant={darkMode ? "dark" : "light"}
					onChange={handlePickerChange}
				/>
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
		alignItems: "center",
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
	iosPickerButton: {
		justifyContent: "center",
		minHeight: 48,
		overflow: "hidden",
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
		paddingVertical: 12,
	},
	clearText: {
		fontSize: 12,
		fontWeight: "700",
	},
});
