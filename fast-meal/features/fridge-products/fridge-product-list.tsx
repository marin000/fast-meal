import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { FridgeIcon } from "@/components/ui/fridge-icon";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { FridgeProductRow } from "./fridge-product-row";

interface FridgeProductListProps {
	items: FridgeProductListItem[];
	onRemove: (id: string) => void;
	onPressProduct?: (item: FridgeProductListItem) => void;
}

export const FridgeProductList = ({
	items,
	onRemove,
	onPressProduct,
}: FridgeProductListProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();

	const handlePressProduct = (item: FridgeProductListItem) => {
		if (!item.barcode) return;
		onPressProduct?.(item);
	};

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
			{items.map((item) => (
				<FridgeProductRow
					key={item.id}
					item={item}
					onRemove={() => onRemove(item.id)}
					onPress={() => handlePressProduct(item)}
				/>
			))}
		</View>
	);
};

const styles = StyleSheet.create({
	section: {
		gap: 8,
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
