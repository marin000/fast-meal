import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
	ActivityIndicator,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";

import {
	fetchBarcodeProduct,
	reportBarcodeProduct,
} from "@/api/barcode-products";
import { fetchOffDetails } from "@/api/open-food-facts";
import { PrimaryButton, ScreenScrollView } from "@/components";
import { useDeviceId, usePreferences } from "@/context";
import {
	ProductIngredientsSection,
	ProductNutritionSection,
	ProductScoreBadges,
} from "@/features/fridge-products-scan";
import { useAppAppearance } from "@/hooks/use-app-appearance";
import type { BarcodeProduct } from "@/interface/barcode-product";
import {
	hasDetailsTier,
	isDetailsStale,
	pickLocalizedName,
	resolveParamCode,
	toBarcodeReportPayload,
} from "@/utils/food-facts-helper";
import {
	ANALYTICS_EVENTS,
	captureAppException,
	trackProductEvent,
} from "@/utils/sentry";

const FridgeProductDetailsScreen = () => {
	const { t } = useTranslation();
	const theme = useAppAppearance();
	const router = useRouter();
	const { deviceId } = useDeviceId();
	const { language } = usePreferences();
	const params = useLocalSearchParams<{ code?: string | string[] }>();
	const code = resolveParamCode(params.code);

	const [product, setProduct] = useState<BarcodeProduct | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const load = useCallback(async () => {
		if (!code) {
			setIsLoading(false);
			setError(t("fridge.details.loadFailed"));
			return;
		}

		if (!deviceId) {
			setIsLoading(true);
			setError(null);
			return;
		}

		setIsLoading(true);
		setError(null);

		try {
			const cached = await fetchBarcodeProduct(deviceId, code, true);
			let next: BarcodeProduct | null = cached.found ? cached.product : null;

			const needsDetails =
				!next || !hasDetailsTier(next) || isDetailsStale(next.detailsFetchedAt);

			if (needsDetails) {
				try {
					const fresh = await fetchOffDetails(code, language);
					if (fresh) {
						next = fresh;
						try {
							await reportBarcodeProduct({
								deviceId,
								...toBarcodeReportPayload(fresh),
							});
						} catch (reportError) {
							captureAppException(reportError, {
								feature: "barcode_details_report",
							});
						}
					}
				} catch (detailsError) {
					captureAppException(detailsError, {
						feature: "barcode_details_off",
					});
					// Keep cached essentials if OFF details refresh fails.
				}
			}

			if (!next) {
				setError(t("fridge.details.notFound"));
				setProduct(null);
				return;
			}

			setProduct(next);
			trackProductEvent(ANALYTICS_EVENTS.barcodeDetailsOpened, { code });
		} catch (loadError) {
			captureAppException(loadError, { feature: "barcode_details" });
			setError(t("fridge.details.loadFailed"));
			setProduct(null);
		} finally {
			setIsLoading(false);
		}
	}, [code, deviceId, language, t]);

	useEffect(() => {
		void load();
	}, [load]);

	if (isLoading) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<ActivityIndicator size="large" color={theme.primary} />
			</View>
		);
	}

	if (error || !product) {
		return (
			<View style={[styles.centered, { backgroundColor: theme.background }]}>
				<Text style={[styles.errorText, { color: theme.text }]}>
					{error ?? t("fridge.details.notFound")}
				</Text>
				<PrimaryButton
					label={t("errors.goBack")}
					onPress={() => router.back()}
					compact
				/>
			</View>
		);
	}

	const name = pickLocalizedName(product.names, language, product.code);
	const ingredients = pickLocalizedName(product.ingredientsText, language);
	const imageUri = product.imageUrl ?? product.imageThumbUrl;

	return (
		<ScreenScrollView
			backgroundColor={theme.background}
			contentContainerStyle={styles.container}
		>
			<View style={styles.hero}>
				<Pressable
					accessibilityRole="button"
					onPress={() => router.back()}
					style={[styles.backButton, { backgroundColor: theme.surfaceOverlay }]}
				>
					<Ionicons name="chevron-back" size={20} color={theme.text} />
				</Pressable>

				{imageUri ? (
					<View
						style={[
							styles.imageCard,
							{ backgroundColor: theme.card, borderColor: theme.cardBorder },
						]}
					>
						<Image
							source={{ uri: imageUri }}
							style={styles.heroImage}
							contentFit="contain"
						/>
					</View>
				) : null}

				<View style={styles.titleBlock}>
					<View style={[styles.accent, { backgroundColor: theme.primary }]} />
					<View style={styles.titleContent}>
						<Text style={[styles.title, { color: theme.text }]}>{name}</Text>
						{product.brandLabel ? (
							<Text style={[styles.subtitle, { color: theme.textMuted }]}>
								{product.brandLabel}
							</Text>
						) : null}
						<Text style={[styles.code, { color: theme.textMuted }]}>
							{product.code}
						</Text>
						<ProductScoreBadges
							nutriscoreGrade={product.nutriscoreGrade}
							novaGroup={product.novaGroup}
							ecoscoreGrade={product.ecoscoreGrade}
						/>
					</View>
				</View>
			</View>

			<View style={styles.body}>
				{product.nutriments ? (
					<ProductNutritionSection
						nutriments={product.nutriments}
						servingSize={product.servingSize}
					/>
				) : null}

				<ProductIngredientsSection
					ingredients={ingredients || undefined}
					allergensTags={product.allergensTags}
				/>
			</View>
		</ScreenScrollView>
	);
};

export default FridgeProductDetailsScreen;

const styles = StyleSheet.create({
	container: {
		gap: 20,
		paddingBottom: 32,
		paddingTop: 4,
	},
	centered: {
		alignItems: "center",
		flex: 1,
		gap: 16,
		justifyContent: "center",
		paddingHorizontal: 24,
	},
	errorText: {
		fontSize: 15,
		fontWeight: "600",
		textAlign: "center",
	},
	hero: {
		gap: 14,
		paddingHorizontal: 20,
		paddingTop: 4,
	},
	backButton: {
		alignItems: "center",
		alignSelf: "flex-start",
		borderRadius: 18,
		height: 36,
		justifyContent: "center",
		width: 36,
	},
	imageCard: {
		alignItems: "center",
		borderRadius: 18,
		borderWidth: 1,
		justifyContent: "center",
		overflow: "hidden",
		padding: 16,
	},
	heroImage: {
		height: 180,
		width: "100%",
	},
	titleBlock: {
		flexDirection: "row",
		gap: 12,
	},
	accent: {
		borderRadius: 2,
		width: 4,
	},
	titleContent: {
		flex: 1,
		gap: 8,
	},
	title: {
		fontSize: 26,
		fontWeight: "900",
		lineHeight: 32,
	},
	subtitle: {
		fontSize: 14,
		fontWeight: "600",
	},
	code: {
		fontSize: 12,
		fontWeight: "500",
	},
	body: {
		gap: 24,
		paddingBottom: 8,
		paddingHorizontal: 20,
	},
});
