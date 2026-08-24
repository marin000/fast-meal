import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppAppearance } from "@/hooks/use-app-appearance";
import { formatScoreGrade } from "@/utils/food-facts-helper";

interface ProductScoreBadgesProps {
	nutriscoreGrade?: string;
	novaGroup?: number;
	ecoscoreGrade?: string;
}

export const ProductScoreBadges = ({
	nutriscoreGrade,
	novaGroup,
	ecoscoreGrade,
}: ProductScoreBadgesProps) => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const unknownLabel = t("fridge.details.scores.unknown");

	if (!nutriscoreGrade && novaGroup === undefined && !ecoscoreGrade) {
		return null;
	}

	return (
		<View style={styles.badges}>
			{nutriscoreGrade ? (
				<View
					style={[styles.badge, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Text style={[styles.badgeText, { color: theme.text }]}>
						{t("fridge.details.scores.nutriscore", {
							grade: formatScoreGrade(nutriscoreGrade, unknownLabel),
						})}
					</Text>
				</View>
			) : null}
			{novaGroup !== undefined ? (
				<View
					style={[styles.badge, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Text style={[styles.badgeText, { color: theme.text }]}>
						{t("fridge.details.scores.nova", { group: novaGroup })}
					</Text>
				</View>
			) : null}
			{ecoscoreGrade ? (
				<View
					style={[styles.badge, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Text style={[styles.badgeText, { color: theme.text }]}>
						{t("fridge.details.scores.ecoscore", {
							grade: formatScoreGrade(ecoscoreGrade, unknownLabel),
						})}
					</Text>
				</View>
			) : null}
		</View>
	);
};

const styles = StyleSheet.create({
	badges: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
		marginTop: 4,
	},
	badge: {
		borderRadius: 999,
		paddingHorizontal: 10,
		paddingVertical: 4,
	},
	badgeText: {
		fontSize: 11,
		fontWeight: "700",
	},
});
