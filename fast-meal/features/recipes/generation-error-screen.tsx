import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { FridgeAiLogo, PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface GenerationErrorScreenProps {
	kind: "timeout" | "generic";
	onRetry: () => void;
	isRetrying?: boolean;
}

export const GenerationErrorScreen = ({
	kind,
	onRetry,
	isRetrying = false,
}: GenerationErrorScreenProps) => {
	const { t } = useTranslation();
	const router = useRouter();
	const theme = useAppAppearance();

	const titleKey =
		kind === "timeout" ? "errors.generationTimeout" : "errors.generic";
	const messageKey =
		kind === "timeout"
			? "errors.generationTimeoutMessage"
			: "errors.generationFailedMessage";

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<View
				style={[
					styles.logoBackground,
					{ backgroundColor: theme.logoContainerBg },
				]}
			>
				<FridgeAiLogo size={32} />
			</View>
			<Text style={[styles.title, { color: theme.text }]}>{t(titleKey)}</Text>
			<Text style={[styles.subtitle, { color: theme.textMuted }]}>
				{t(messageKey)}
			</Text>
			<View style={styles.actions}>
				<PrimaryButton
					label={t("errors.retry")}
					onPress={onRetry}
					disabled={isRetrying}
					leftIconName="refresh"
				/>
				<Pressable
					disabled={isRetrying}
					onPress={() => router.back()}
					style={styles.backButton}
				>
					<Text style={[styles.backLabel, { color: theme.textMuted }]}>
						{t("errors.goBack")}
					</Text>
				</Pressable>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		flex: 1,
		gap: 14,
		justifyContent: "center",
		paddingBottom: 80,
		paddingHorizontal: 32,
	},
	logoBackground: {
		alignItems: "center",
		borderRadius: 18,
		height: 56,
		justifyContent: "center",
		marginBottom: 8,
		width: 56,
	},
	title: {
		fontSize: 20,
		fontWeight: "900",
		textAlign: "center",
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "500",
		lineHeight: 20,
		maxWidth: 280,
		textAlign: "center",
	},
	actions: {
		gap: 12,
		marginTop: 8,
		width: "100%",
	},
	backButton: {
		alignItems: "center",
		paddingVertical: 8,
	},
	backLabel: {
		fontSize: 14,
		fontWeight: "600",
	},
});
