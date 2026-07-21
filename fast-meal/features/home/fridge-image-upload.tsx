import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { FridgeImagePreview } from "./fridge-image-preview";

interface FridgeImageUploadProps {
	previewUri: string | null;
	isProcessing: boolean;
	imageError: string | null;
	onAddPress: () => void;
	onReplacePress: () => void;
	onRemovePress: () => void;
}

export const FridgeImageUpload = ({
	previewUri,
	isProcessing,
	imageError,
	onAddPress,
	onReplacePress,
	onRemovePress,
}: FridgeImageUploadProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const [previewVisible, setPreviewVisible] = useState(false);

	return (
		<>
			{previewUri ? (
				<View style={styles.selectedRow}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("home.image.photoAdded")}
						onPress={() => setPreviewVisible(true)}
						style={[
							styles.photoChip,
							{
								backgroundColor: `${theme.primary}14`,
								borderColor: `${theme.primary}4D`,
							},
						]}
					>
						<View
							style={[
								styles.thumbnailRing,
								{ borderColor: `${theme.primary}33` },
							]}
						>
							<Image
								source={{ uri: previewUri }}
								style={styles.thumbnail}
								contentFit="cover"
							/>
						</View>
						<Text style={[styles.photoChipLabel, { color: theme.primary }]}>
							{t("home.image.photoAdded")}
						</Text>
					</Pressable>

					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("home.image.remove")}
						onPress={onRemovePress}
						hitSlop={8}
						style={[
							styles.removeButton,
							{ backgroundColor: theme.surfaceOverlay },
						]}
					>
						<Ionicons name="close" size={12} color={theme.iconMuted} />
					</Pressable>
				</View>
			) : (
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={t("home.image.add")}
					onPress={onAddPress}
					disabled={isProcessing}
					style={[
						styles.addChip,
						{
							backgroundColor: theme.card,
							borderColor: theme.border,
						},
					]}
				>
					{isProcessing ? (
						<ActivityIndicator size="small" color={theme.primary} />
					) : (
						<>
							<Ionicons
								name="camera-outline"
								size={12}
								color={theme.textMuted}
							/>
							<Text style={[styles.addChipLabel, { color: theme.textMuted }]}>
								{t("home.image.add")}
							</Text>
						</>
					)}
				</Pressable>
			)}

			{imageError ? (
				<Text style={[styles.errorText, { color: theme.danger }]}>
					{imageError}
				</Text>
			) : null}

			<FridgeImagePreview
				visible={previewVisible}
				previewUri={previewUri}
				onClose={() => setPreviewVisible(false)}
				onReplacePress={onReplacePress}
				onRemovePress={onRemovePress}
			/>
		</>
	);
};

const styles = StyleSheet.create({
	selectedRow: {
		alignItems: "center",
		alignSelf: "flex-start",
		flexDirection: "row",
		flexShrink: 1,
		gap: 8,
	},
	photoChip: {
		alignItems: "center",
		borderRadius: 999,
		borderWidth: 1,
		flexDirection: "row",
		gap: 8,
		paddingLeft: 4,
		paddingRight: 12,
		paddingVertical: 4,
	},
	thumbnailRing: {
		borderRadius: 12,
		borderWidth: 1,
		height: 24,
		overflow: "hidden",
		width: 24,
	},
	thumbnail: {
		height: "100%",
		width: "100%",
	},
	photoChipLabel: {
		fontSize: 11,
		fontWeight: "800",
	},
	removeButton: {
		alignItems: "center",
		borderRadius: 12,
		height: 24,
		justifyContent: "center",
		width: 24,
	},
	addChip: {
		alignItems: "center",
		alignSelf: "flex-start",
		borderRadius: 999,
		borderWidth: 1,
		flexDirection: "row",
		gap: 6,
		minHeight: 32,
		paddingHorizontal: 12,
		paddingVertical: 6,
	},
	addChipLabel: {
		fontSize: 11,
		fontWeight: "700",
	},
	errorText: {
		fontSize: 10,
		fontWeight: "600",
		marginTop: 4,
	},
});
