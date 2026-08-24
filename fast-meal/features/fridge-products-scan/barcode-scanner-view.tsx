import { Ionicons } from "@expo/vector-icons";
import {
	type BarcodeScanningResult,
	CameraView,
	useCameraPermissions,
} from "expo-camera";
import { useCallback, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { PrimaryButton } from "@/components";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import { isValidGtin, normalizeGtin } from "@/utils/gtin";

interface BarcodeScannerViewProps {
	onBarcodeScanned: (code: string) => void;
	enabled?: boolean;
}

const SCAN_BUTTON_GREEN = "#2D8A4E";

export const BarcodeScannerView = ({
	onBarcodeScanned,
	enabled = true,
}: BarcodeScannerViewProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const [permission, requestPermission] = useCameraPermissions();
	const [torchOn, setTorchOn] = useState(false);
	const [isHolding, setIsHolding] = useState(false);
	const capturedThisHoldRef = useRef(false);

	const handleScan = useCallback(
		(result: BarcodeScanningResult) => {
			if (!enabled || !isHolding || capturedThisHoldRef.current) return;

			const raw = result.data?.trim();
			if (!raw) return;

			const code = normalizeGtin(raw);
			if (!isValidGtin(code)) return;

			capturedThisHoldRef.current = true;
			setIsHolding(false);
			onBarcodeScanned(code);
		},
		[enabled, isHolding, onBarcodeScanned],
	);

	const handlePressIn = useCallback(() => {
		if (!enabled) return;
		capturedThisHoldRef.current = false;
		setIsHolding(true);
	}, [enabled]);

	const handlePressOut = useCallback(() => {
		setIsHolding(false);
	}, []);

	if (!permission) {
		return <View style={[styles.centered, { backgroundColor: "#000" }]} />;
	}

	if (!permission.granted) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<Ionicons name="camera-outline" size={40} color={theme.iconMuted} />
				<Text style={[styles.permissionTitle, { color: theme.text }]}>
					{t("fridge.scan.permissionTitle")}
				</Text>
				<Text style={[styles.permissionBody, { color: theme.textMuted }]}>
					{t("fridge.scan.permissionBody")}
				</Text>
				<PrimaryButton
					label={t("fridge.scan.permissionCta")}
					onPress={() => {
						void requestPermission();
					}}
					leftIconName="camera"
				/>
			</View>
		);
	}

	const scanningActive = enabled && isHolding;

	return (
		<View style={styles.container}>
			<CameraView
				style={StyleSheet.absoluteFill}
				facing="back"
				enableTorch={torchOn}
				barcodeScannerSettings={{
					barcodeTypes: ["ean13", "ean8", "upc_a", "upc_e"],
				}}
				onBarcodeScanned={scanningActive ? handleScan : undefined}
			/>

			<View style={styles.overlay} pointerEvents="box-none">
				<View style={styles.topBar}>
					<Pressable
						accessibilityRole="button"
						onPress={() => setTorchOn((prev) => !prev)}
						style={[
							styles.torchButton,
							{ backgroundColor: "rgba(0,0,0,0.45)" },
						]}
					>
						<Ionicons
							name={torchOn ? "flash" : "flash-outline"}
							size={22}
							color="#FFFFFF"
						/>
					</Pressable>
				</View>

				<View style={styles.reticleWrap} pointerEvents="none">
					<View style={[styles.reticle, isHolding && styles.reticleActive]} />
				</View>

				<View style={styles.scanButtonWrap}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel={t("fridge.scan.holdCta")}
						disabled={!enabled}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						style={[
							styles.scanButton,
							{
								backgroundColor: SCAN_BUTTON_GREEN,
								opacity: enabled ? (isHolding ? 0.85 : 1) : 0.45,
								transform: [{ scale: isHolding ? 0.96 : 1 }],
							},
						]}
					>
						<Ionicons name="barcode-outline" size={26} color="#FFFFFF" />
						<Text style={styles.scanButtonLabel} numberOfLines={2}>
							{t("fridge.scan.holdCta")}
						</Text>
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
	overlay: {
		...StyleSheet.absoluteFillObject,
		justifyContent: "space-between",
		paddingBottom: 20,
		paddingTop: 16,
	},
	topBar: {
		alignItems: "flex-end",
		paddingHorizontal: 16,
	},
	torchButton: {
		alignItems: "center",
		borderRadius: 22,
		height: 44,
		justifyContent: "center",
		width: 44,
	},
	reticleWrap: {
		alignItems: "center",
		flex: 1,
		justifyContent: "center",
	},
	reticle: {
		borderColor: "#FFFFFF",
		borderRadius: 16,
		borderWidth: 2,
		height: 160,
		opacity: 0.9,
		width: 240,
	},
	reticleActive: {
		borderColor: "#7CFFB2",
		opacity: 1,
	},
	scanButtonWrap: {
		alignItems: "center",
		paddingHorizontal: 16,
	},
	scanButton: {
		alignItems: "center",
		borderRadius: 36,
		elevation: 4,
		gap: 2,
		height: 72,
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.35,
		shadowRadius: 4,
		width: 72,
	},
	scanButtonLabel: {
		color: "#FFFFFF",
		fontSize: 10,
		fontWeight: "800",
		textAlign: "center",
	},
});
