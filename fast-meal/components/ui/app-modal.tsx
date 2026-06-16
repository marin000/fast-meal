import { Ionicons } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppAppearance } from "@/hooks/use-app-appearance";

interface AppModalProps {
	visible: boolean;
	onClose: () => void;
	title?: string;
	description?: string;
	children: ReactNode;
	footer?: ReactNode;
}

export const AppModal = ({
	visible,
	onClose,
	title,
	description,
	children,
	footer,
}: AppModalProps) => {
	const theme = useAppAppearance();
	const { bottom } = useSafeAreaInsets();

	return (
		<Modal
			visible={visible}
			transparent
			animationType="slide"
			onRequestClose={onClose}
		>
			<View style={styles.overlay}>
				<Pressable
					accessibilityRole="button"
					accessibilityLabel="Close modal"
					style={styles.backdrop}
					onPress={onClose}
				/>

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
									<Text style={[styles.title, { color: theme.text }]}>
										{title}
									</Text>
								) : null}
								{description ? (
									<Text
										style={[styles.description, { color: theme.textMuted }]}
									>
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

					<View style={styles.body}>{children}</View>

					{footer ? <View style={styles.footer}>{footer}</View> : null}
				</View>
			</View>
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
	footer: {
		marginTop: 16,
	},
});
