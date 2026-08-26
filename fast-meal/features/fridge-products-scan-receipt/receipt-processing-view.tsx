import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { FridgeAiLoading, PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface ReceiptProcessingViewProps {
	errorMessage: string | null;
	onRetry: () => void;
}

export const ReceiptProcessingView = ({
	errorMessage,
	onRetry,
}: ReceiptProcessingViewProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	if (!errorMessage) {
		return (
			<FridgeAiLoading
				title={t("fridge.scanReceipt.processingTitle")}
				subtitle={t("fridge.scanReceipt.processingSubtitle")}
			/>
		);
	}

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<Text style={[styles.title, { color: theme.text }]}>
				{t("fridge.scanReceipt.errorTitle")}
			</Text>
			<Text style={[styles.subtitle, { color: theme.textMuted }]}>
				{errorMessage}
			</Text>
			<PrimaryButton
				label={t("fridge.scanReceipt.retry")}
				onPress={onRetry}
				leftIconName="refresh"
			/>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		gap: 12,
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 8,
		textAlign: "center",
	},
});
