import { Ionicons } from "@expo/vector-icons";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components";
import type { IngredientImagePayload } from "@/constants/ingredient-image";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { processIngredientImageAsset } from "@/utils/process-ingredient-image";

const CAPTURE_GREEN = "#2D8A4E";

interface ReceiptCaptureViewProps {
	onCaptured: (payload: IngredientImagePayload) => void;
	onBack: () => void;
	onCaptureError: () => void;
}

export const ReceiptCaptureView = ({
	onCaptured,
	onBack,
	onCaptureError,
}: ReceiptCaptureViewProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const insets = useSafeAreaInsets();
	const [permission, requestPermission] = useCameraPermissions();
	const cameraRef = useRef<CameraView>(null);
	const [isCapturing, setIsCapturing] = useState(false);

	const processAsset = async (asset: ImagePicker.ImagePickerAsset) => {
		const result = await processIngredientImageAsset(asset);
		if (!result.ok) {
			onCaptureError();
			return;
		}
		onCaptured(result.payload);
	};

	const handleCapture = async () => {
		if (!cameraRef.current || isCapturing) return;
		setIsCapturing(true);
		try {
			const photo = await cameraRef.current.takePictureAsync({
				quality: 1,
				exif: false,
				shutterSound: false,
			});
			if (!photo?.uri) {
				onCaptureError();
				return;
			}
			await processAsset({
				uri: photo.uri,
				width: photo.width,
				height: photo.height,
				mimeType: "image/jpeg",
			});
		} catch {
			onCaptureError();
		} finally {
			setIsCapturing(false);
		}
	};

	const handleGallery = async () => {
		if (isCapturing) return;
		const libraryPermission =
			await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!libraryPermission.granted) {
			onCaptureError();
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsMultipleSelection: false,
			quality: 1,
			exif: false,
		});

		if (result.canceled || !result.assets[0]) return;

		setIsCapturing(true);
		try {
			await processAsset(result.assets[0]);
		} catch {
			onCaptureError();
		} finally {
			setIsCapturing(false);
		}
	};

	if (!permission) {
		return <View style={[styles.centered, { backgroundColor: "#000" }]} />;
	}

	if (!permission.granted) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<Ionicons name="camera-outline" size={40} color={theme.iconMuted} />
				<Text style={[styles.permissionTitle, { color: theme.text }]}>
					{t("fridge.scanReceipt.permissionTitle")}
				</Text>
				<Text style={[styles.permissionBody, { color: theme.textMuted }]}>
					{t("fridge.scanReceipt.permissionBody")}
				</Text>
				<PrimaryButton
					label={t("fridge.scanReceipt.permissionCta")}
					onPress={() => {
						void requestPermission();
					}}
					leftIconName="camera"
				/>
				<Pressable accessibilityRole="button" onPress={onBack}>
					<Text style={[styles.backLink, { color: theme.textMuted }]}>
						{t("fridge.scanReceipt.back")}
					</Text>
				</Pressable>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			<CameraView
				ref={cameraRef}
				style={StyleSheet.absoluteFill}
				facing="back"
			/>

			<View style={styles.overlay} pointerEvents="box-none">
				<View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("fridge.scanReceipt.back")}
						onPress={onBack}
						style={styles.iconButton}
					>
						<Ionicons name="chevron-back" size={24} color="#FFFFFF" />
					</Pressable>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("fridge.scanReceipt.gallery")}
						onPress={() => {
							void handleGallery();
						}}
						disabled={isCapturing}
						style={styles.iconButton}
					>
						<Ionicons name="images-outline" size={22} color="#FFFFFF" />
					</Pressable>
				</View>

				<View style={styles.frameWrap} pointerEvents="none">
					<View style={styles.frame} />
					<Text style={styles.instruction}>
						{t("fridge.scanReceipt.frameInstruction")}
					</Text>
				</View>

				<View
					style={[
						styles.bottomBar,
						{ paddingBottom: Math.max(insets.bottom, 16) },
					]}
				>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("fridge.scanReceipt.capture")}
						disabled={isCapturing}
						onPress={() => {
							void handleCapture();
						}}
						style={[styles.captureButton, { opacity: isCapturing ? 0.7 : 1 }]}
					>
						{isCapturing ? (
							<ActivityIndicator color="#FFFFFF" />
						) : (
							<Ionicons name="camera" size={28} color="#FFFFFF" />
						)}
					</Pressable>
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		overflow: "hidden",
	},
	centered: {
		alignItems: "center",
		flex: 1,
		gap: 12,
		justifyContent: "center",
		paddingHorizontal: 32,
	},
	permissionTitle: {
		fontSize: 18,
		fontWeight: "800",
		textAlign: "center",
	},
	permissionBody: {
		fontSize: 14,
		fontWeight: "500",
		marginBottom: 8,
		textAlign: "center",
	},
	backLink: {
		fontSize: 14,
		fontWeight: "600",
		marginTop: 8,
	},
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "space-between",
	},
	topBar: {
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 16,
	},
	iconButton: {
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.45)",
		borderRadius: 22,
		height: 44,
		justifyContent: "center",
		width: 44,
	},
	frameWrap: {
		alignItems: "center",
		flex: 1,
		gap: 16,
		justifyContent: "center",
		paddingHorizontal: 28,
	},
	frame: {
		borderColor: "#FFFFFF",
		borderRadius: 16,
		borderWidth: 2,
		height: "62%",
		maxHeight: 480,
		opacity: 0.95,
		width: "100%",
	},
	instruction: {
		color: "#FFFFFF",
		fontSize: 14,
		fontWeight: "700",
		textAlign: "center",
		textShadowColor: "rgba(0,0,0,0.6)",
		textShadowOffset: { width: 0, height: 1 },
		textShadowRadius: 3,
	},
	bottomBar: {
		alignItems: "center",
		paddingTop: 8,
	},
	captureButton: {
		alignItems: "center",
		backgroundColor: CAPTURE_GREEN,
		borderRadius: 40,
		elevation: 4,
		height: 76,
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.35,
		shadowRadius: 4,
		width: 76,
	},
});
