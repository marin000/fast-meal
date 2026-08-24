import Constants from "expo-constants";

import {
	OPEN_FOOD_FACTS_CONTACT_EMAIL,
	OPEN_FOOD_FACTS_DETAILS_REFRESH_DAYS,
	OPEN_FOOD_FACTS_USER_AGENT_APP,
} from "@/constants/open-food-facts";
import type { AppLanguage } from "@/constants/settings";
import { resolveShelfLifeDays } from "@/constants/shelf-life";
import type {
	BarcodeNutrimentValues,
	BarcodeProduct,
	BarcodeProductDetails,
	BarcodeProductEssentials,
	BarcodeProductNames,
} from "@/interface/barcode-product";
import { parseOffQuantity } from "@/utils/parse-off-quantity";
import { normalizeGtin } from "./gtin";

const stripNoise = (value: string, brands: string | undefined): string => {
	let result = value.trim();

	if (brands) {
		for (const brand of brands.split(/[,;]/)) {
			const token = brand.trim();
			if (token.length < 2) continue;
			const pattern = new RegExp(
				`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
				"gi",
			);
			result = result.replace(pattern, " ");
		}
	}

	result = result
		.replace(/\b\d+(?:[.,]\d+)?\s*(?:%|m\.?\s*m\.?)\b/gi, " ")
		.replace(/\b\d+(?:[.,]\d+)?\s*(?:kg|g|ml|l|cl|oz|lb|pcs?|kom)\b/gi, " ")
		.replace(/\s+/g, " ")
		.trim();

	return result;
};

const categoryLeafLabel = (tag: string): string => {
	const withoutLang = tag.includes(":") ? (tag.split(":")[1] ?? tag) : tag;
	return withoutLang.replace(/-/g, " ").trim();
};

const pickLocalizedField = (
	product: Record<string, unknown>,
	baseKey: string,
	language: AppLanguage,
): string | undefined => {
	const preferredKey = `${baseKey}_${language}`;
	const preferred = product[preferredKey];
	if (typeof preferred === "string" && preferred.trim())
		return preferred.trim();

	const enKey = `${baseKey}_en`;
	const en = product[enKey];
	if (typeof en === "string" && en.trim()) return en.trim();

	const base = product[baseKey];
	if (typeof base === "string" && base.trim()) return base.trim();

	return undefined;
};

export const resolveOffProductName = (
	product: Record<string, unknown>,
): { en?: string; hr?: string } => {
	const brands =
		typeof product.brands === "string" ? product.brands : undefined;
	const primaryBrand = brands
		?.split(/[,;]/)
		.map((part) => part.trim())
		.find((part) => part.length > 0);

	const resolveForLang = (lang: AppLanguage): string | undefined => {
		const productName = pickLocalizedField(product, "product_name", lang);
		if (productName) {
			const cleaned = stripNoise(productName, brands);
			return cleaned.length > 0 ? cleaned : productName;
		}

		const generic = pickLocalizedField(product, "generic_name", lang);
		if (generic) return generic;

		if (primaryBrand) return primaryBrand;

		const tags = product.categories_tags;
		if (Array.isArray(tags) && tags.length > 0) {
			const leaf = tags[tags.length - 1];
			if (typeof leaf === "string") return categoryLeafLabel(leaf);
		}

		return undefined;
	};

	return {
		en: resolveForLang("en"),
		hr: resolveForLang("hr"),
	};
};

export const resolveOffBrandLabel = (
	product: Record<string, unknown>,
	language: AppLanguage,
): string | undefined => {
	const productName = pickLocalizedField(product, "product_name", language);
	const brands =
		typeof product.brands === "string" ? product.brands.trim() : undefined;

	if (productName && brands) {
		return `${brands} — ${productName}`;
	}
	return productName ?? brands;
};

export const asStringArray = (value: unknown): string[] | undefined => {
	if (!Array.isArray(value)) return undefined;
	const tags = value.filter(
		(item): item is string => typeof item === "string" && item.length > 0,
	);
	return tags.length > 0 ? tags : undefined;
};

export const asOptionalString = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

export const asOptionalNumber = (value: unknown): number | undefined => {
	if (typeof value !== "number" || !Number.isFinite(value)) return undefined;
	return value;
};

export const pickLocalizedText = (
	product: Record<string, unknown>,
	baseKey: string,
): BarcodeProductNames => {
	const en =
		asOptionalString(product[`${baseKey}_en`]) ??
		asOptionalString(product[baseKey]);
	const hr = asOptionalString(product[`${baseKey}_hr`]);
	return {
		...(en ? { en } : {}),
		...(hr ? { hr } : {}),
	};
};

export const mapNutriments = (
	raw: unknown,
): BarcodeNutrimentValues | undefined => {
	if (typeof raw !== "object" || raw === null) return undefined;
	const n = raw as Record<string, unknown>;

	const values: BarcodeNutrimentValues = {
		energyKcal100g:
			asOptionalNumber(n["energy-kcal_100g"]) ??
			asOptionalNumber(n.energy_kcal_100g),
		proteins100g: asOptionalNumber(n.proteins_100g),
		carbohydrates100g: asOptionalNumber(n.carbohydrates_100g),
		sugars100g: asOptionalNumber(n.sugars_100g),
		fat100g: asOptionalNumber(n.fat_100g),
		saturatedFat100g: asOptionalNumber(n["saturated-fat_100g"]),
		fiber100g: asOptionalNumber(n.fiber_100g) ?? asOptionalNumber(n.fibre_100g),
		salt100g: asOptionalNumber(n.salt_100g),
		energyKcalServing:
			asOptionalNumber(n["energy-kcal_serving"]) ??
			asOptionalNumber(n.energy_kcal_serving),
		proteinsServing: asOptionalNumber(n.proteins_serving),
		carbohydratesServing: asOptionalNumber(n.carbohydrates_serving),
		sugarsServing: asOptionalNumber(n.sugars_serving),
		fatServing: asOptionalNumber(n.fat_serving),
		saturatedFatServing: asOptionalNumber(n["saturated-fat_serving"]),
		fiberServing:
			asOptionalNumber(n.fiber_serving) ?? asOptionalNumber(n.fibre_serving),
		saltServing: asOptionalNumber(n.salt_serving),
	};

	const hasAny = Object.values(values).some((v) => v !== undefined);
	return hasAny ? values : undefined;
};

export const mapEssentials = (
	code: string,
	product: Record<string, unknown>,
	language: AppLanguage,
): BarcodeProductEssentials => {
	const names = resolveOffProductName(product);
	const parsedQuantity = parseOffQuantity(asOptionalString(product.quantity));
	const categoriesTags = asStringArray(product.categories_tags);

	return {
		code,
		names,
		brandLabel: resolveOffBrandLabel(product, language),
		quantity: parsedQuantity?.quantity,
		unit: parsedQuantity?.unit,
		shelfLifeDays: resolveShelfLifeDays(categoriesTags),
		imageThumbUrl:
			asOptionalString(product.image_front_small_url) ??
			asOptionalString(product.image_front_thumb_url),
		categoriesTags,
		source: "off",
		fetchedAt: new Date().toISOString(),
	};
};

export const mapDetails = (
	product: Record<string, unknown>,
): BarcodeProductDetails => ({
	servingSize: asOptionalString(product.serving_size),
	nutriments: mapNutriments(product.nutriments),
	ingredientsText: pickLocalizedText(product, "ingredients_text"),
	allergensTags: asStringArray(product.allergens_tags),
	labelsTags: asStringArray(product.labels_tags),
	nutriscoreGrade: asOptionalString(product.nutriscore_grade)?.toUpperCase(),
	novaGroup: asOptionalNumber(product.nova_group),
	ecoscoreGrade: asOptionalString(product.ecoscore_grade)?.toUpperCase(),
	imageUrl:
		asOptionalString(product.image_front_url) ??
		asOptionalString(product.image_url),
	detailsFetchedAt: new Date().toISOString(),
});

export const buildOffUserAgent = (): string => {
	const version =
		Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "1.0.0";
	return `${OPEN_FOOD_FACTS_USER_AGENT_APP}/${version} (${OPEN_FOOD_FACTS_CONTACT_EMAIL})`;
};

export const buildBarcodeProductReportBody = (params: {
	deviceId: string;
	essentials: BarcodeProductEssentials;
	details?: BarcodeProductDetails;
}): Record<string, unknown> => ({
	deviceId: params.deviceId,
	code: params.essentials.code,
	names: params.essentials.names,
	brandLabel: params.essentials.brandLabel,
	quantity: params.essentials.quantity,
	unit: params.essentials.unit,
	shelfLifeDays: params.essentials.shelfLifeDays,
	imageThumbUrl: params.essentials.imageThumbUrl,
	categoriesTags: params.essentials.categoriesTags,
	source: params.essentials.source,
	fetchedAt: params.essentials.fetchedAt,
	...(params.details ?? {}),
});

export const toBarcodeReportPayload = (
	product: BarcodeProduct,
): {
	essentials: BarcodeProductEssentials;
	details: BarcodeProductDetails;
} => ({
	essentials: {
		code: product.code,
		names: product.names,
		brandLabel: product.brandLabel,
		quantity: product.quantity,
		unit: product.unit,
		shelfLifeDays: product.shelfLifeDays,
		imageThumbUrl: product.imageThumbUrl,
		categoriesTags: product.categoriesTags,
		source: product.source,
		fetchedAt: product.fetchedAt,
	},
	details: {
		servingSize: product.servingSize,
		nutriments: product.nutriments,
		ingredientsText: product.ingredientsText,
		allergensTags: product.allergensTags,
		labelsTags: product.labelsTags,
		nutriscoreGrade: product.nutriscoreGrade,
		novaGroup: product.novaGroup,
		ecoscoreGrade: product.ecoscoreGrade,
		imageUrl: product.imageUrl,
		detailsFetchedAt: product.detailsFetchedAt,
	},
});

export const formatAllergenTag = (tag: string): string =>
	tag.replace(/^en:/, "").replace(/-/g, " ");

export const isDetailsStale = (detailsFetchedAt?: string): boolean => {
	if (!detailsFetchedAt) return true;
	const fetched = new Date(detailsFetchedAt).getTime();
	if (Number.isNaN(fetched)) return true;
	const ageMs = Date.now() - fetched;
	return ageMs > OPEN_FOOD_FACTS_DETAILS_REFRESH_DAYS * 24 * 60 * 60 * 1000;
};

export const hasDetailsTier = (product: BarcodeProduct): boolean =>
	Boolean(
		product.detailsFetchedAt ||
			product.nutriments ||
			product.ingredientsText ||
			product.servingSize ||
			product.imageUrl,
	);

export const formatNutrient = (value: number | undefined): string => {
	if (value === undefined) return "—";
	return Number.isInteger(value) ? String(value) : value.toFixed(1);
};

export const isMissingScoreGrade = (grade: string): boolean => {
	const normalized = grade.trim().toLowerCase();
	return (
		normalized === "unknown" ||
		normalized === "not-applicable" ||
		normalized === "n/a"
	);
};

export const formatScoreGrade = (
	grade: string,
	unknownLabel: string,
): string => {
	if (isMissingScoreGrade(grade)) return unknownLabel;
	return grade;
};

export const resolveParamCode = (
	value: string | string[] | undefined,
): string => {
	const raw = Array.isArray(value) ? value[0] : value;
	if (typeof raw !== "string" || raw.trim().length === 0) return "";
	return normalizeGtin(decodeURIComponent(raw.trim()));
};

export const hasNutritionValue = (value: number | undefined): value is number =>
	value !== undefined;

export const pickLocalizedName = (
	names: BarcodeProductNames | undefined,
	language: string,
	fallback = "",
): string => {
	if (!names) return fallback;
	if (language.startsWith("hr") && names.hr) return names.hr;
	if (names.en) return names.en;
	return names.hr ?? names.en ?? fallback;
};
