import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";

import { PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { useFamilySharing } from "@/hooks/use-family-sharing";

export const FamilySection = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const {
		inviteCode,
		memberCount,
		isLoading,
		isShared,
		joinCode,
		setJoinCode,
		isJoining,
		isLeaving,
		handleShareCode,
		handleJoin,
		handleLeave,
	} = useFamilySharing();

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
				{t("settings.sections.family")}
			</Text>

			{isLoading ? (
				<View style={styles.loadingRow}>
					<ActivityIndicator size="small" color={theme.primary} />
				</View>
			) : (
				<>
					<View style={styles.block}>
						<Text style={[styles.label, { color: theme.text }]}>
							{t("settings.family.inviteCodeLabel")}
						</Text>
						<Text style={[styles.description, { color: theme.textMuted }]}>
							{t("settings.family.inviteCodeDescription")}
						</Text>
						<View
							style={[
								styles.codeRow,
								{
									backgroundColor: theme.inputBg,
									borderColor: theme.inputBorder,
								},
							]}
						>
							<Text style={[styles.code, { color: theme.text }]}>
								{inviteCode ?? "—"}
							</Text>
							<Pressable
								accessibilityRole="button"
								onPress={() => void handleShareCode()}
								style={[styles.shareButton, { backgroundColor: theme.primary }]}
							>
								<Ionicons name="share-outline" size={18} color="#ffffff" />
							</Pressable>
						</View>
					</View>

					{isShared ? (
						<View style={styles.block}>
							<Text style={[styles.memberCount, { color: theme.textMuted }]}>
								{t("settings.family.memberCount", { count: memberCount })}
							</Text>
							<PrimaryButton
								label={t("settings.family.leave")}
								onPress={handleLeave}
								disabled={isLeaving}
								compact
								shrink
							/>
						</View>
					) : (
						<View style={styles.block}>
							<Text style={[styles.label, { color: theme.text }]}>
								{t("settings.family.joinLabel")}
							</Text>
							<Text style={[styles.description, { color: theme.textMuted }]}>
								{t("settings.family.joinDescription")}
							</Text>
							<View style={styles.joinRow}>
								<TextInput
									value={joinCode}
									onChangeText={setJoinCode}
									autoCapitalize="characters"
									autoCorrect={false}
									maxLength={6}
									placeholder={t("settings.family.joinPlaceholder")}
									placeholderTextColor={theme.inputPlaceholder}
									style={[
										styles.joinInput,
										{
											backgroundColor: theme.inputBg,
											borderColor: theme.inputBorder,
											color: theme.text,
										},
									]}
								/>
								<PrimaryButton
									label={t("settings.family.join")}
									onPress={() => void handleJoin()}
									disabled={isJoining || joinCode.trim().length === 0}
									compact
								/>
							</View>
						</View>
					)}
				</>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		borderRadius: 16,
		borderWidth: 1,
		paddingHorizontal: 16,
		paddingVertical: 8,
	},
	sectionTitle: {
		fontSize: 12,
		fontWeight: "800",
		letterSpacing: 0.8,
		paddingBottom: 8,
		paddingTop: 8,
		textTransform: "uppercase",
	},
	loadingRow: {
		alignItems: "center",
		paddingVertical: 16,
	},
	block: {
		gap: 8,
		paddingVertical: 10,
	},
	label: {
		fontSize: 14,
		fontWeight: "700",
	},
	description: {
		fontSize: 12,
		fontWeight: "500",
	},
	codeRow: {
		alignItems: "center",
		borderRadius: 12,
		borderWidth: 1,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 14,
		paddingVertical: 12,
	},
	code: {
		fontSize: 22,
		fontWeight: "800",
		letterSpacing: 4,
	},
	shareButton: {
		alignItems: "center",
		borderRadius: 10,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	memberCount: {
		fontSize: 13,
		fontWeight: "600",
	},
	joinRow: {
		alignItems: "center",
		flexDirection: "row",
		gap: 8,
	},
	joinInput: {
		borderRadius: 12,
		borderWidth: 1,
		flex: 1,
		fontSize: 16,
		fontWeight: "700",
		letterSpacing: 2,
		paddingHorizontal: 14,
		paddingVertical: 12,
		textAlign: "center",
	},
});
