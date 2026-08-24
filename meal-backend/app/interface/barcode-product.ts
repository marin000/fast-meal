import type mongoose from "mongoose";

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

export interface BarcodeProductEssentialsResponse {
	code: string;
	names: BarcodeProductNames;
	brandLabel?: string;
	quantity?: number;
	unit?: string;
	shelfLifeDays?: number;
	imageThumbUrl?: string;
	categoriesTags?: string[];
	source: BarcodeProductSource;
	fetchedAt?: string;
}

export interface BarcodeProductDetailsResponse {
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

export interface BarcodeProductResponse
	extends BarcodeProductEssentialsResponse,
		BarcodeProductDetailsResponse {}

export interface CreateBarcodeProductRequestBody {
	deviceId: string;
	code: string;
	names?: BarcodeProductNames;
	brandLabel?: string;
	quantity?: number;
	unit?: string;
	shelfLifeDays?: number;
	imageThumbUrl?: string;
	categoriesTags?: string[];
	source?: BarcodeProductSource;
	fetchedAt?: string;
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

export type BarcodeProductDoc = {
	_id: mongoose.Types.ObjectId;
	code: string;
	names?: BarcodeProductNames;
	brandLabel?: string;
	quantity?: number;
	unit?: string;
	shelfLifeDays?: number;
	imageThumbUrl?: string;
	categoriesTags?: string[];
	source?: BarcodeProductSource;
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
	createdAt: Date;
	updatedAt: Date;
};
