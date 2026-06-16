import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { FridgeIcon } from "@/components/ui/fridge-icon";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { FridgeProductRow } from "./fridge-product-row";

interface FridgeProductListProps {
	items: FridgeProductListItem[];
	onRemove: (id: string) => void;
}

export const FridgeProductList = ({
	items,
	onRemove,
}: FridgeProductListProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	if (items.length === 0) {
		return (
			<View style={styles.empty}>
				<View style={[styles.emptyIcon, { backgroundColor: theme.chipBg }]}>
					<FridgeIcon size={28} color={theme.iconMuted} />
				</View>
				<Text style={[styles.emptyTitle, { color: theme.text }]}>
					{t("fridge.emptyTitle")}
				</Text>
				<Text style={[styles.emptySubtitle, { color: theme.textMuted }]}>
					{t("fridge.emptySubtitle")}
				</Text>
			</View>
		);
	}

	return (
		<View style={styles.section}>
			<Text style={[styles.sectionTitle, { color: theme.textMuted }]}>
				{t("fridge.productsTitle")}
			</Text>
			{items.map((item) => (
				<FridgeProductRow
					key={item.id}
					item={item}
					onRemove={() => onRemove(item.id)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		gap: 8,
	},
	sectionTitle: {
		fontSize: 11,
		fontWeight: "700",
		letterSpacing: 0.8,
		marginBottom: 4,
		textTransform: "uppercase",
	},
	empty: {
		alignItems: "center",
		gap: 8,
		paddingVertical: 48,
	},
	emptyIcon: {
		alignItems: "center",
		borderRadius: 16,
		height: 56,
		justifyContent: "center",
		marginBottom: 8,
		width: 56,
	},
	emptyTitle: {
		fontSize: 15,
		fontWeight: "900",
	},
	emptySubtitle: {
		fontSize: 13,
		fontWeight: "500",
		textAlign: "center",
	},
});
