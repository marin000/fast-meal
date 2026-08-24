import {
	OPEN_FOOD_FACTS_BASE_URL,
	OPEN_FOOD_FACTS_DETAILS_FIELDS,
	OPEN_FOOD_FACTS_ESSENTIALS_FIELDS,
	OPEN_FOOD_FACTS_FETCH_TIMEOUT_MS,
} from "@/constants/open-food-facts";
import type { AppLanguage } from "@/constants/settings";
import type {
	BarcodeProduct,
	BarcodeProductEssentials,
} from "@/interface/barcode-product";
import {
	buildOffUserAgent,
	mapDetails,
	mapEssentials,
} from "@/utils/food-facts-helper";

type OffProductPayload = {
	status: number | string;
	code?: string;
	product?: Record<string, unknown>;
};

/** OFF may store UPC-A as 12 digits or EAN-13 with a leading 0. */
const barcodeLookupVariants = (code: string): string[] => {
	const variants = [code];
	if (code.length === 13 && code.startsWith("0")) {
		variants.push(code.slice(1));
	} else if (code.length === 12) {
		variants.push(`0${code}`);
	}
	return variants;
};

const fetchWithTimeout = async (url: string): Promise<Response> => {
	const controller = new AbortController();
	const timer = setTimeout(
		() => controller.abort(),
		OPEN_FOOD_FACTS_FETCH_TIMEOUT_MS,
	);
	try {
		return await fetch(url, {
			method: "GET",
			headers: {
				Accept: "application/json",
				"X-User-Agent": buildOffUserAgent(),
			},
			signal: controller.signal,
		});
	} finally {
		clearTimeout(timer);
	}
};

const fetchOffProductOnce = async (
	code: string,
	language: AppLanguage,
	fields: string,
): Promise<Record<string, unknown> | null> => {
	const params = new URLSearchParams({
		fields,
		lc: language,
	});

	const urls = [
		`${OPEN_FOOD_FACTS_BASE_URL}/${encodeURIComponent(code)}?${params.toString()}`,
		`${OPEN_FOOD_FACTS_BASE_URL}/${encodeURIComponent(code)}.json?${params.toString()}`,
	];

	let lastError: unknown;

	for (const url of urls) {
		try {
			const response = await fetchWithTimeout(url);

			if (response.status === 404) continue;

			if (!response.ok) {
				lastError = new Error(
					`Open Food Facts request failed (${response.status})`,
				);
				continue;
			}

			const data = (await response.json()) as OffProductPayload;
			if (Number(data.status) !== 1 || !data.product) continue;
			return data.product;
		} catch (error) {
			lastError = error;
		}
	}

	if (lastError) throw lastError;
	return null;
};

const fetchOffProduct = async (
	code: string,
	language: AppLanguage,
	fields: string,
): Promise<Record<string, unknown> | null> => {
	let lastError: unknown;

	for (const variant of barcodeLookupVariants(code)) {
		try {
			const product = await fetchOffProductOnce(variant, language, fields);
			if (product) return product;
		} catch (error) {
			lastError = error;
		}
	}

	if (lastError) throw lastError;
	return null;
};

export const fetchOffEssentials = async (
	code: string,
	language: AppLanguage,
): Promise<BarcodeProductEssentials | null> => {
	const product = await fetchOffProduct(
		code,
		language,
		OPEN_FOOD_FACTS_ESSENTIALS_FIELDS,
	);
	if (!product) return null;
	return mapEssentials(code, product, language);
};

export const fetchOffDetails = async (
	code: string,
	language: AppLanguage,
): Promise<BarcodeProduct | null> => {
	const product = await fetchOffProduct(
		code,
		language,
		OPEN_FOOD_FACTS_DETAILS_FIELDS,
	);
	if (!product) return null;
	return {
		...mapEssentials(code, product, language),
		...mapDetails(product),
	};
};
