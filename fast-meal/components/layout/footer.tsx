import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { FridgeIcon } from "@/components/ui/fridge-icon";
import { type FooterTab, footerItems } from "@/constants/nav";
import { useAppAppearance } from "@/hooks/use-app-appearance";

interface BottomFooterNavProps {
	activeTab: FooterTab | null;
	onTabPress: (tab: FooterTab) => void;
}

export const Footer = ({ activeTab, onTabPress }: BottomFooterNavProps) => {
	const { bottom } = useSafeAreaInsets();
	const { t } = useTranslation();
	const theme = useAppAppearance();

	return (
		<View
			style={[
				styles.wrapper,
				{
					backgroundColor: theme.footerBg,
					borderTopColor: theme.footerBorder,
					paddingBottom: Math.max(bottom, 10),
				},
			]}
		>
			<View style={styles.container}>
				{footerItems.map((item) => {
					const isActive = item.id === activeTab;

					return (
						<Pressable
							key={item.id}
							accessibilityRole="button"
							onPress={() => onTabPress(item.id)}
							style={styles.item}
						>
							{item.id === "fridge" ? (
								<FridgeIcon
									size={18}
									color={
										isActive ? theme.footerTabActive : theme.footerTabInactive
									}
									filled={isActive}
								/>
							) : (
								<Ionicons
									name={
										item.id === "saved"
											? isActive
												? "bookmark"
												: "bookmark-outline"
											: item.id === "shoppingList" && isActive
												? "cart"
												: item.iconName
									}
									size={18}
									color={
										isActive ? theme.footerTabActive : theme.footerTabInactive
									}
								/>
							)}
							<Text
								style={[
									styles.label,
									isActive
										? { color: theme.footerTabActive }
										: { color: theme.footerTabInactive },
								]}
							>
								{t(item.labelKey)}
							</Text>
						</Pressable>
					);
				})}
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	wrapper: {
		borderTopWidth: 1,
		bottom: 0,
		left: 0,
		paddingHorizontal: 8,
		position: "absolute",
		right: 0,
	},
	container: {
		flexDirection: "row",
		justifyContent: "space-around",
		paddingTop: 10,
	},
	item: {
		alignItems: "center",
		gap: 4,
		justifyContent: "center",
		flex: 1,
		maxWidth: 72,
		minWidth: 0,
	},
	label: {
		fontSize: 11,
		fontWeight: "700",
	},
});
