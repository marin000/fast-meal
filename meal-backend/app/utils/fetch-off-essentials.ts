import type { BarcodeProductEssentialsResponse } from "@/app/interface/barcode-product";

const OFF_BASE_URL = "https://world.openfoodfacts.org/api/v2/product";
const OFF_TIMEOUT_MS = 10_000;
const OFF_USER_AGENT = "FastMeal-Backend/1.0 (infinityfunstudios@gmail.com)";

const ESSENTIALS_FIELDS = [
	"code",
	"product_name",
	"product_name_en",
	"product_name_hr",
	"generic_name",
	"generic_name_en",
	"generic_name_hr",
	"brands",
	"quantity",
	"categories_tags",
	"image_front_small_url",
	"image_front_thumb_url",
].join(",");

const asOptionalString = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

const pickLocalized = (
	product: Record<string, unknown>,
	baseKey: string,
	lang: "en" | "hr",
): string | undefined => {
	const preferred = asOptionalString(product[`${baseKey}_${lang}`]);
	if (preferred) return preferred;
	const en = asOptionalString(product[`${baseKey}_en`]);
	if (en) return en;
	return asOptionalString(product[baseKey]);
};

const resolveNames = (
	product: Record<string, unknown>,
): { en?: string; hr?: string } => {
	const brands = asOptionalString(product.brands);
	const stripBrand = (name: string): string => {
		if (!brands) return name;
		let result = name;
		for (const brand of brands.split(/[,;]/)) {
			const token = brand.trim();
			if (token.length < 2) continue;
			result = result.replace(
				new RegExp(
					`\\b${token.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`,
					"gi",
				),
				" ",
			);
		}
		return result.replace(/\s+/g, " ").trim() || name;
	};

	const resolveFor = (lang: "en" | "hr"): string | undefined => {
		const productName = pickLocalized(product, "product_name", lang);
		if (productName) return stripBrand(productName);
		const generic = pickLocalized(product, "generic_name", lang);
		if (generic) return generic;
		if (brands) {
			const primary = brands.split(/[,;]/)[0]?.trim();
			if (primary) return primary;
		}
		return undefined;
	};

	return {
		en: resolveFor("en"),
		hr: resolveFor("hr"),
	};
};

const barcodeVariants = (code: string): string[] => {
	const variants = [code];
	if (code.length === 13 && code.startsWith("0")) variants.push(code.slice(1));
	else if (code.length === 12) variants.push(`0${code}`);
	return variants;
};

const fetchOffOnce = async (
	code: string,
): Promise<Record<string, unknown> | null> => {
	const params = new URLSearchParams({ fields: ESSENTIALS_FIELDS });
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), OFF_TIMEOUT_MS);

	try {
		const response = await fetch(
			`${OFF_BASE_URL}/${encodeURIComponent(code)}?${params.toString()}`,
			{
				method: "GET",
				headers: {
					Accept: "application/json",
					"User-Agent": OFF_USER_AGENT,
				},
				signal: controller.signal,
			},
		);

		if (response.status === 404) return null;
		if (!response.ok) {
			throw new Error(`OFF request failed (${response.status})`);
		}

		const data = (await response.json()) as {
			status: number | string;
			product?: Record<string, unknown>;
		};
		if (Number(data.status) !== 1 || !data.product) return null;
		return data.product;
	} finally {
		clearTimeout(timer);
	}
};

/** Server-side Open Food Facts essentials lookup (cache miss fallback). */
export const fetchOffEssentialsFromOff = async (
	code: string,
): Promise<BarcodeProductEssentialsResponse | null> => {
	for (const variant of barcodeVariants(code)) {
		try {
			const product = await fetchOffOnce(variant);
			if (!product) continue;

			const names = resolveNames(product);
			if (!names.en && !names.hr) continue;

			const brands = asOptionalString(product.brands);
			const productName =
				pickLocalized(product, "product_name", "en") ??
				pickLocalized(product, "product_name", "hr");
			const brandLabel =
				brands && productName
					? `${brands} — ${productName}`
					: (productName ?? brands);

			return {
				code,
				names,
				brandLabel,
				imageThumbUrl:
					asOptionalString(product.image_front_small_url) ??
					asOptionalString(product.image_front_thumb_url),
				categoriesTags: Array.isArray(product.categories_tags)
					? product.categories_tags.filter(
							(tag): tag is string => typeof tag === "string",
						)
					: undefined,
				source: "off",
				fetchedAt: new Date().toISOString(),
			};
		} catch {
			// try next variant
		}
	}

	return null;
};

export const barcodeLookupCodes = (code: string): string[] => {
	const codes = [code];
	if (code.length === 13 && code.startsWith("0")) codes.push(code.slice(1));
	else if (code.length === 12) codes.push(`0${code}`);
	return codes;
};
