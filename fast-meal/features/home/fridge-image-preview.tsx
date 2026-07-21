import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useTranslation } from "react-i18next";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface FridgeImagePreviewProps {
	visible: boolean;
	previewUri: string | null;
	onClose: () => void;
	onReplacePress: () => void;
	onRemovePress: () => void;
}

export const FridgeImagePreview = ({
	visible,
	previewUri,
	onClose,
	onReplacePress,
	onRemovePress,
}: FridgeImagePreviewProps) => {
	const { t } = useTranslation();

	return (
		<Modal
			visible={visible && Boolean(previewUri)}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel={t("home.image.closePreview")}
					style={StyleSheet.absoluteFill}
					onPress={onClose}
				/>
				<View style={styles.content}>
					{previewUri ? (
						<Image
							source={{ uri: previewUri }}
							style={styles.image}
							contentFit="contain"
						/>
					) : null}

					<View style={styles.topActions}>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("home.image.replace")}
							onPress={() => {
								onClose();
								onReplacePress();
							}}
							style={styles.action}
						>
							<Ionicons name="camera-outline" size={12} color="#FFFFFF" />
							<Text style={styles.actionLabel}>{t("home.image.replace")}</Text>
						</Pressable>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={t("home.image.closePreview")}
							onPress={onClose}
							style={styles.close}
						>
							<Ionicons name="close" size={16} color="#FFFFFF" />
						</Pressable>
					</View>

					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("home.image.remove")}
						onPress={() => {
							onRemovePress();
							onClose();
						}}
						style={styles.remove}
					>
						<Ionicons name="trash-outline" size={12} color="#FFFFFF" />
						<Text style={styles.actionLabel}>{t("home.image.remove")}</Text>
					</Pressable>
				</View>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.8)",
		flex: 1,
		justifyContent: "center",
		paddingHorizontal: 16,
	},
	content: {
		maxHeight: "70%",
		position: "relative",
		width: "100%",
	},
	image: {
		borderRadius: 16,
		height: 420,
		maxHeight: "100%",
		width: "100%",
	},
	topActions: {
		flexDirection: "row",
		gap: 8,
		position: "absolute",
		right: 12,
		top: 12,
	},
	action: {
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 999,
		flexDirection: "row",
		gap: 6,
		paddingHorizontal: 12,
		paddingVertical: 8,
	},
	close: {
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 16,
		height: 32,
		justifyContent: "center",
		width: 32,
	},
	remove: {
		alignItems: "center",
		alignSelf: "center",
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		borderRadius: 999,
		bottom: 12,
		flexDirection: "row",
		gap: 6,
		paddingHorizontal: 16,
		paddingVertical: 10,
		position: "absolute",
	},
	actionLabel: {
		color: "#FFFFFF",
		fontSize: 12,
		fontWeight: "700",
	},
});
