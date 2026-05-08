import type { ReactNode } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface SettingsRowProps {
	label: string;
	description?: string;
	children: ReactNode;
	hideSeparator?: boolean;
}

export const SettingsRow = ({
	label,
	description,
	children,
	hideSeparator = false,
}: SettingsRowProps) => {
	const theme = useAppAppearance();

	return (
		<View
			style={[
				styles.row,
				{ borderBottomColor: theme.settingsRowDivider },
				hideSeparator && styles.rowWithoutSeparator,
			]}
		>
			<View style={styles.rowCopy}>
				<Text style={[styles.rowLabel, { color: theme.text }]}>{label}</Text>
				{description ? (
					<Text style={[styles.rowDescription, { color: theme.textMuted }]}>
						{description}
					</Text>
				) : null}
			</View>
			<View>{children}</View>
		</View>
	);
};

const styles = StyleSheet.create({
	row: {
		alignItems: "center",
		borderBottomWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 14,
	},
	rowCopy: {
		flex: 1,
		gap: 4,
		paddingRight: 10,
	},
	rowLabel: {
		fontSize: 14,
		fontWeight: "700",
	},
	rowDescription: {
		fontSize: 12,
		fontWeight: "500",
	},
	rowWithoutSeparator: {
		borderBottomWidth: 0,
	},
});
