import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { TOAST_DURATION_MS } from "@/constants/device";

export type FeedbackTone = "success" | "error" | "info";

interface FeedbackMessageContextValue {
	showMessage: (message: string, tone?: FeedbackTone) => void;
}

const FeedbackMessageContext = createContext<
	FeedbackMessageContextValue | undefined
>(undefined);

const bannerColors = (
	tone: FeedbackTone,
): { backgroundColor: string; borderColor: string; textColor: string } => {
	if (tone === "success") {
		return {
			backgroundColor: "#15803d",
			borderColor: "#166534",
			textColor: "#ffffff",
		};
	}
	if (tone === "error") {
		return {
			backgroundColor: "#b91c1c",
			borderColor: "#991b1b",
			textColor: "#ffffff",
		};
	}
	return {
		backgroundColor: "#334155",
		borderColor: "#1e293b",
		textColor: "#ffffff",
	};
};

export const FeedbackMessageProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { bottom } = useSafeAreaInsets();
	const [toast, setToast] = useState<{
		message: string;
		tone: FeedbackTone;
	} | null>(null);
	const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

	useEffect(() => {
		return () => {
			if (hideTimer.current) clearTimeout(hideTimer.current);
		};
	}, []);

	const showMessage = useCallback(
		(next: string, tone: FeedbackTone = "info") => {
			setToast({ message: next, tone });
			if (hideTimer.current) clearTimeout(hideTimer.current);
			hideTimer.current = setTimeout(() => {
				setToast(null);
				hideTimer.current = null;
			}, TOAST_DURATION_MS);
		},
		[],
	);

	const dismiss = useCallback(() => {
		if (hideTimer.current) clearTimeout(hideTimer.current);
		hideTimer.current = null;
		setToast(null);
	}, []);

	const colors = toast ? bannerColors(toast.tone) : null;

	return (
		<FeedbackMessageContext.Provider value={{ showMessage }}>
			<View style={styles.root} pointerEvents="box-none">
				{children}
				{toast !== null && colors !== null && (
					<View
						style={[styles.anchor, { paddingBottom: Math.max(bottom, 8) + 52 }]}
						pointerEvents="box-none"
					>
						<Pressable onPress={dismiss} style={styles.pressable}>
							<View
								style={[
									styles.banner,
									{
										backgroundColor: colors.backgroundColor,
										borderColor: colors.borderColor,
									},
								]}
							>
								<Text style={[styles.text, { color: colors.textColor }]}>
									{toast.message}
								</Text>
							</View>
						</Pressable>
					</View>
				)}
			</View>
		</FeedbackMessageContext.Provider>
	);
};

export const useFeedbackMessage = (): FeedbackMessageContextValue => {
	const ctx = useContext(FeedbackMessageContext);
	if (ctx === undefined) {
		throw new Error(
			"useFeedbackMessage must be used within FeedbackMessageProvider",
		);
	}
	return ctx;
};

const styles = StyleSheet.create({
	root: {
		flex: 1,
	},
	anchor: {
		bottom: 0,
		left: 0,
		position: "absolute",
		right: 0,
		zIndex: 9999,
	},
	pressable: {
		alignItems: "center",
		paddingHorizontal: 20,
	},
	banner: {
		borderRadius: 14,
		borderWidth: 1,
		maxWidth: 400,
		paddingHorizontal: 16,
		paddingVertical: 12,
		width: "100%",
	},
	text: {
		fontSize: 14,
		fontWeight: "600",
		textAlign: "center",
	},
});
