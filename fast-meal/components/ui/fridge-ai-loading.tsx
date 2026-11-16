import { type ReactNode, useEffect, useRef } from "react";
import { Animated, Easing, StyleSheet, Text, View } from "react-native";

import { FridgeAiLogo } from "@/components/ui/fridge-ai-logo";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface FridgeAiLoadingProps {
	title: string;
	subtitle?: string;
	icon?: ReactNode;
}

const RING_SIZE = 96;
const RING_BORDER = 4;

export const FridgeAiLoading = ({
	title,
	subtitle,
	icon,
}: FridgeAiLoadingProps) => {
	const theme = useAppAppearance();
	const rotation = useRef(new Animated.Value(0)).current;
	const contentOpacity = useRef(new Animated.Value(1)).current;
	const contentKeyRef = useRef(`${title}|${subtitle ?? ""}`);

	useEffect(() => {
		const animation = Animated.loop(
			Animated.timing(rotation, {
				toValue: 1,
				duration: 1200,
				easing: Easing.linear,
				useNativeDriver: true,
			}),
		);

		animation.start();

		return () => animation.stop();
	}, [rotation]);

	useEffect(() => {
		const nextKey = `${title}|${subtitle ?? ""}`;
		if (contentKeyRef.current === nextKey) {
			return;
		}

		contentKeyRef.current = nextKey;
		contentOpacity.setValue(0);
		Animated.timing(contentOpacity, {
			toValue: 1,
			duration: 350,
			easing: Easing.out(Easing.ease),
			useNativeDriver: true,
		}).start();
	}, [title, subtitle, contentOpacity]);

	const rotateInterpolation = rotation.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	const ringTrackColor = `${theme.primary}1F`;

	return (
		<View style={[styles.container, { backgroundColor: theme.background }]}>
			<View style={styles.ringWrapper}>
				<View style={[styles.ringTrack, { borderColor: ringTrackColor }]} />
				<Animated.View
					style={[
						styles.ringSpinner,
						{
							borderTopColor: theme.primary,
							transform: [{ rotate: rotateInterpolation }],
						},
					]}
				/>
				<Animated.View
					style={[
						styles.logoBackground,
						{ backgroundColor: theme.logoContainerBg, opacity: contentOpacity },
					]}
				>
					{icon ?? <FridgeAiLogo size={32} />}
				</Animated.View>
			</View>
			<Animated.View style={[styles.copy, { opacity: contentOpacity }]}>
				<Text style={[styles.title, { color: theme.heading }]}>{title}</Text>
				{subtitle ? (
					<Text style={[styles.subtitle, { color: theme.textMuted }]}>
						{subtitle}
					</Text>
				) : null}
			</Animated.View>
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
	ringWrapper: {
		alignItems: "center",
		height: RING_SIZE,
		justifyContent: "center",
		marginBottom: 12,
		width: RING_SIZE,
	},
	ringTrack: {
		borderRadius: RING_SIZE / 2,
		borderWidth: RING_BORDER,
		height: RING_SIZE,
		position: "absolute",
		width: RING_SIZE,
	},
	ringSpinner: {
		borderColor: "transparent",
		borderRadius: RING_SIZE / 2,
		borderWidth: RING_BORDER,
		height: RING_SIZE,
		position: "absolute",
		width: RING_SIZE,
	},
	logoBackground: {
		alignItems: "center",
		borderRadius: 18,
		height: 56,
		justifyContent: "center",
		width: 56,
	},
	copy: {
		alignItems: "center",
		gap: 14,
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
		maxWidth: 260,
		textAlign: "center",
	},
});
