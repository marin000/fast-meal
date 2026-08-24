import type {
	BarcodeNutrimentValues,
	BarcodeProductDoc,
	BarcodeProductNames,
	BarcodeProductResponse,
	BarcodeProductSource,
	CreateBarcodeProductRequestBody,
} from "@/app/interface/barcode-product";

export interface ParsedBarcodeProductBody {
	deviceId: string;
	code: string;
	names?: BarcodeProductNames;
	brandLabel?: string;
	quantity?: number;
	unit?: string;
	shelfLifeDays?: number;
	imageThumbUrl?: string;
	categoriesTags?: string[];
	source: BarcodeProductSource;
	fetchedAt?: Date;
	servingSize?: string;
	nutriments?: BarcodeNutrimentValues;
	ingredientsText?: BarcodeProductNames;
	allergensTags?: string[];
	labelsTags?: string[];
	nutriscoreGrade?: string;
	novaGroup?: number;
	ecoscoreGrade?: string;
	imageUrl?: string;
	detailsFetchedAt?: Date;
	hasDetails: boolean;
}

const asOptionalString = (value: unknown): string | undefined => {
	if (typeof value !== "string") return undefined;
	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : undefined;
};

const asOptionalNumber = (value: unknown): number | undefined => {
	if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
		return undefined;
	}
	return value;
};

const asStringArray = (value: unknown): string[] | undefined => {
	if (!Array.isArray(value)) return undefined;
	const items = value.filter(
		(item): item is string =>
			typeof item === "string" && item.trim().length > 0,
	);
	return items.length > 0 ? items.map((item) => item.trim()) : undefined;
};

const asNames = (value: unknown): BarcodeProductNames | undefined => {
	if (typeof value !== "object" || value === null) return undefined;
	const record = value as Record<string, unknown>;
	const en = asOptionalString(record.en);
	const hr = asOptionalString(record.hr);
	if (!en && !hr) return undefined;
	return { ...(en ? { en } : {}), ...(hr ? { hr } : {}) };
};

const asOptionalIsoDate = (value: unknown): Date | undefined => {
	if (typeof value !== "string" || value.trim().length === 0) return undefined;
	const parsed = new Date(value);
	if (Number.isNaN(parsed.getTime())) return undefined;
	return parsed;
};

const asNutriments = (value: unknown): BarcodeNutrimentValues | undefined => {
	if (typeof value !== "object" || value === null) return undefined;
	const record = value as Record<string, unknown>;
	const mapped: BarcodeNutrimentValues = {
		energyKcal100g: asOptionalNumber(record.energyKcal100g),
		proteins100g: asOptionalNumber(record.proteins100g),
		carbohydrates100g: asOptionalNumber(record.carbohydrates100g),
		sugars100g: asOptionalNumber(record.sugars100g),
		fat100g: asOptionalNumber(record.fat100g),
		saturatedFat100g: asOptionalNumber(record.saturatedFat100g),
		fiber100g: asOptionalNumber(record.fiber100g),
		salt100g: asOptionalNumber(record.salt100g),
		energyKcalServing: asOptionalNumber(record.energyKcalServing),
		proteinsServing: asOptionalNumber(record.proteinsServing),
		carbohydratesServing: asOptionalNumber(record.carbohydratesServing),
		sugarsServing: asOptionalNumber(record.sugarsServing),
		fatServing: asOptionalNumber(record.fatServing),
		saturatedFatServing: asOptionalNumber(record.saturatedFatServing),
		fiberServing: asOptionalNumber(record.fiberServing),
		saltServing: asOptionalNumber(record.saltServing),
	};
	const hasAny = Object.values(mapped).some((v) => v !== undefined);
	return hasAny ? mapped : undefined;
};

const asSource = (value: unknown): BarcodeProductSource =>
	value === "user" ? "user" : "off";

export const parseBarcodeProductBody = (
	body: unknown,
): ParsedBarcodeProductBody | null => {
	if (typeof body !== "object" || body === null) return null;

	const record = body as Partial<CreateBarcodeProductRequestBody>;
	const deviceId = asOptionalString(record.deviceId);
	const code = asOptionalString(record.code);
	if (!deviceId || !code) return null;
	if (!/^\d{8}$|^\d{12,14}$/.test(code)) return null;

	const servingSize = asOptionalString(record.servingSize);
	const nutriments = asNutriments(record.nutriments);
	const ingredientsText = asNames(record.ingredientsText);
	const allergensTags = asStringArray(record.allergensTags);
	const labelsTags = asStringArray(record.labelsTags);
	const nutriscoreGrade = asOptionalString(record.nutriscoreGrade);
	const novaGroup = asOptionalNumber(record.novaGroup);
	const ecoscoreGrade = asOptionalString(record.ecoscoreGrade);
	const imageUrl = asOptionalString(record.imageUrl);
	const detailsFetchedAt = asOptionalIsoDate(record.detailsFetchedAt);

	const hasDetails = Boolean(
		servingSize ||
			nutriments ||
			ingredientsText ||
			allergensTags ||
			labelsTags ||
			nutriscoreGrade ||
			novaGroup !== undefined ||
			ecoscoreGrade ||
			imageUrl ||
			detailsFetchedAt,
	);

	return {
		deviceId,
		code,
		names: asNames(record.names),
		brandLabel: asOptionalString(record.brandLabel),
		quantity: asOptionalNumber(record.quantity),
		unit: asOptionalString(record.unit),
		shelfLifeDays: asOptionalNumber(record.shelfLifeDays),
		imageThumbUrl: asOptionalString(record.imageThumbUrl),
		categoriesTags: asStringArray(record.categoriesTags),
		source: asSource(record.source),
		fetchedAt: asOptionalIsoDate(record.fetchedAt) ?? new Date(),
		servingSize,
		nutriments,
		ingredientsText,
		allergensTags,
		labelsTags,
		nutriscoreGrade,
		novaGroup,
		ecoscoreGrade,
		imageUrl,
		detailsFetchedAt: hasDetails ? (detailsFetchedAt ?? new Date()) : undefined,
		hasDetails,
	};
};

export const toBarcodeProductResponse = (
	doc: BarcodeProductDoc,
	includeDetails: boolean,
): BarcodeProductResponse => {
	const base: BarcodeProductResponse = {
		code: doc.code,
		names: doc.names ?? {},
		brandLabel: doc.brandLabel,
		quantity: doc.quantity,
		unit: doc.unit,
		shelfLifeDays: doc.shelfLifeDays,
		imageThumbUrl: doc.imageThumbUrl,
		categoriesTags: doc.categoriesTags,
		source: doc.source ?? "off",
		fetchedAt: doc.fetchedAt?.toISOString(),
	};

	if (!includeDetails) return base;

	return {
		...base,
		servingSize: doc.servingSize,
		nutriments: doc.nutriments,
		ingredientsText: doc.ingredientsText,
		allergensTags: doc.allergensTags,
		labelsTags: doc.labelsTags,
		nutriscoreGrade: doc.nutriscoreGrade,
		novaGroup: doc.novaGroup,
		ecoscoreGrade: doc.ecoscoreGrade,
		imageUrl: doc.imageUrl,
		detailsFetchedAt: doc.detailsFetchedAt?.toISOString(),
	};
};

const assignIfDefined = (
	target: Record<string, unknown>,
	key: string,
	value: unknown,
): void => {
	if (value !== undefined) {
		target[key] = value;
	}
};

/** Builds the Mongo `$set` payload for barcode product upserts. */
export const buildBarcodeProductUpdateSet = (
	parsed: ParsedBarcodeProductBody,
): Record<string, unknown> => {
	const updateSet: Record<string, unknown> = {
		code: parsed.code,
		source: parsed.source,
		fetchedAt: parsed.fetchedAt,
	};

	assignIfDefined(updateSet, "names", parsed.names);
	assignIfDefined(updateSet, "brandLabel", parsed.brandLabel);
	assignIfDefined(updateSet, "quantity", parsed.quantity);
	assignIfDefined(updateSet, "unit", parsed.unit);
	assignIfDefined(updateSet, "shelfLifeDays", parsed.shelfLifeDays);
	assignIfDefined(updateSet, "imageThumbUrl", parsed.imageThumbUrl);
	assignIfDefined(updateSet, "categoriesTags", parsed.categoriesTags);

	if (parsed.hasDetails) {
		assignIfDefined(updateSet, "servingSize", parsed.servingSize);
		assignIfDefined(updateSet, "nutriments", parsed.nutriments);
		assignIfDefined(updateSet, "ingredientsText", parsed.ingredientsText);
		assignIfDefined(updateSet, "allergensTags", parsed.allergensTags);
		assignIfDefined(updateSet, "labelsTags", parsed.labelsTags);
		assignIfDefined(updateSet, "nutriscoreGrade", parsed.nutriscoreGrade);
		assignIfDefined(updateSet, "novaGroup", parsed.novaGroup);
		assignIfDefined(updateSet, "ecoscoreGrade", parsed.ecoscoreGrade);
		assignIfDefined(updateSet, "imageUrl", parsed.imageUrl);
		assignIfDefined(updateSet, "detailsFetchedAt", parsed.detailsFetchedAt);
	}

	return updateSet;
};
