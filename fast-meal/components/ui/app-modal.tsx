import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import {
	Keyboard,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface AppModalProps {
	visible: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
	footer?: ReactNode;
	avoidKeyboard?: boolean;
}

export const AppModal = ({
	visible,
	onClose,
	title,
	description,
	children,
	footer,
	avoidKeyboard = false,
}: AppModalProps) => {
	const theme = useAppAppearance();
	const { bottom } = useSafeAreaInsets();
	const [keyboardVisible, setKeyboardVisible] = useState(false);
	const scrollable = avoidKeyboard;

	useEffect(() => {
		if (!visible || !avoidKeyboard) {
			setKeyboardVisible(false);
			return;
		}

		const showEvent =
			Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
		const hideEvent =
			Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

		const showSubscription = Keyboard.addListener(showEvent, () => {
			setKeyboardVisible(true);
		});
		const hideSubscription = Keyboard.addListener(hideEvent, () => {
			setKeyboardVisible(false);
		});

		return () => {
			showSubscription.remove();
			hideSubscription.remove();
		};
	}, [avoidKeyboard, visible]);

	const sheet = (
		<View
			style={[
				styles.sheet,
				{
					backgroundColor: theme.card,
					borderTopColor: theme.cardBorder,
					paddingBottom: bottom + 16,
				},
			]}
		>
			<View style={[styles.handle, { backgroundColor: theme.border }]} />

			{(title || description) && (
				<View style={styles.header}>
					<View style={styles.headerText}>
						{title ? (
							<Text style={[styles.title, { color: theme.text }]}>{title}</Text>
						) : null}
						{description ? (
							<Text style={[styles.description, { color: theme.textMuted }]}>
								{description}
							</Text>
						) : null}
					</View>

					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close"
						onPress={onClose}
						style={[
							styles.closeButton,
							{ backgroundColor: theme.surfaceOverlay },
						]}
					>
						<Ionicons name="close" size={16} color={theme.iconMuted} />
					</Pressable>
				</View>
			)}

			{scrollable ? (
				<ScrollView
					style={styles.body}
					contentContainerStyle={styles.bodyContent}
					keyboardShouldPersistTaps="handled"
					showsVerticalScrollIndicator={false}
					bounces={false}
				>
					{children}
				</ScrollView>
			) : (
				<View style={styles.body}>{children}</View>
			)}

			{footer && !keyboardVisible ? (
				<View style={styles.footer}>{footer}</View>
			) : null}
		</View>
	);

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			{avoidKeyboard ? (
				<KeyboardAvoidingView
					style={styles.overlay}
					behavior={Platform.OS === "ios" ? "padding" : "height"}
				>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close modal"
						style={styles.backdrop}
						onPress={onClose}
					/>
					{sheet}
				</KeyboardAvoidingView>
			) : (
				<View style={styles.overlay}>
					<Pressable
						accessibilityRole="button"
						accessibilityLabel="Close modal"
						style={styles.backdrop}
						onPress={onClose}
					/>
					{sheet}
				</View>
			)}
		</Modal>
	);
};

const styles = StyleSheet.create({
	overlay: {
		flex: 1,
		justifyContent: "flex-end",
	},
	backdrop: {
		...StyleSheet.absoluteFillObject,
		backgroundColor: "rgba(0, 0, 0, 0.4)",
	},
	sheet: {
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		borderTopWidth: 1,
		elevation: 8,
		maxHeight: "90%",
		paddingHorizontal: 20,
		paddingTop: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.12,
		shadowRadius: 16,
	},
	handle: {
		alignSelf: "center",
		borderRadius: 2,
		height: 4,
		marginBottom: 16,
		width: 40,
	},
	header: {
		alignItems: "flex-start",
		flexDirection: "row",
		gap: 12,
		marginBottom: 16,
	},
	headerText: {
		flex: 1,
		gap: 4,
	},
	title: {
		fontSize: 18,
		fontWeight: "900",
	},
	description: {
		fontSize: 12,
		fontWeight: "500",
	},
	closeButton: {
		alignItems: "center",
		borderRadius: 16,
		height: 32,
		justifyContent: "center",
		width: 32,
	},
	body: {
		flexGrow: 0,
		flexShrink: 1,
	},
	bodyContent: {
		flexGrow: 0,
	},
	footer: {
		marginTop: 16,
	},
});
