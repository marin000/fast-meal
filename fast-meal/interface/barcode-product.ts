import type { FridgeProductUnit } from "@/constants/fridge";

export type BarcodeProductSource = "off" | "user";

export interface BarcodeProductNames {
	en?: string;
	hr?: string;
}

export interface BarcodeNutrimentValues {
	energyKcal100g?: number;
	proteins100g?: number;
	carbohydrates100g?: number;
	sugars100g?: number;
	fat100g?: number;
	saturatedFat100g?: number;
	fiber100g?: number;
	salt100g?: number;
	energyKcalServing?: number;
	proteinsServing?: number;
	carbohydratesServing?: number;
	sugarsServing?: number;
	fatServing?: number;
	saturatedFatServing?: number;
	fiberServing?: number;
	saltServing?: number;
}

/** Scan essentials (tier 1). */
export interface BarcodeProductEssentials {
	code: string;
	names: BarcodeProductNames;
	brandLabel?: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	shelfLifeDays?: number;
	imageThumbUrl?: string;
	categoriesTags?: string[];
	source: BarcodeProductSource;
	fetchedAt?: string;
}

/** Details blob (tier 2). */
export interface BarcodeProductDetails {
	servingSize?: string;
	nutriments?: BarcodeNutrimentValues;
	ingredientsText?: BarcodeProductNames;
	allergensTags?: string[];
	labelsTags?: string[];
	nutriscoreGrade?: string;
	novaGroup?: number;
	ecoscoreGrade?: string;
	imageUrl?: string;
	detailsFetchedAt?: string;
}

export interface BarcodeProduct
	extends BarcodeProductEssentials,
		BarcodeProductDetails {}

export interface ScannedDraft {
	localId: string;
	code: string;
	name: string;
	brandLabel?: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	imageThumbUrl?: string;
	needsName: boolean;
	isLoading: boolean;
	lookupFailed: boolean;
}

export type NutritionMacroScope = "per100" | "perServing";

export interface NutritionMacroStat {
	key: string;
	label: string;
	value: number | undefined;
	unit: string;
}

export interface NutritionDetailRow {
	key: string;
	label: string;
	per100: number | undefined;
	perServing: number | undefined;
	unit: string;
}
