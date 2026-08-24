import mongoose, { Schema } from "mongoose";

const barcodeNamesSchema = new Schema(
	{
		en: { type: String, trim: true },
		hr: { type: String, trim: true },
	},
	{ _id: false },
);

const nutrimentsSchema = new Schema(
	{
		energyKcal100g: { type: Number },
		proteins100g: { type: Number },
		carbohydrates100g: { type: Number },
		sugars100g: { type: Number },
		fat100g: { type: Number },
		saturatedFat100g: { type: Number },
		fiber100g: { type: Number },
		salt100g: { type: Number },
		energyKcalServing: { type: Number },
		proteinsServing: { type: Number },
		carbohydratesServing: { type: Number },
		sugarsServing: { type: Number },
		fatServing: { type: Number },
		saturatedFatServing: { type: Number },
		fiberServing: { type: Number },
		saltServing: { type: Number },
	},
	{ _id: false },
);

const barcodeProductSchema = new Schema(
	{
		code: { type: String, required: true, unique: true, index: true },
		names: { type: barcodeNamesSchema, default: {} },
		brandLabel: { type: String, trim: true },
		quantity: { type: Number, min: 0 },
		unit: { type: String, trim: true },
		shelfLifeDays: { type: Number, min: 0 },
		imageThumbUrl: { type: String, trim: true },
		categoriesTags: { type: [String], default: undefined },
		source: { type: String, enum: ["off", "user"], default: "off" },
		fetchedAt: { type: Date },
		servingSize: { type: String, trim: true },
		nutriments: { type: nutrimentsSchema },
		ingredientsText: { type: barcodeNamesSchema },
		allergensTags: { type: [String], default: undefined },
		labelsTags: { type: [String], default: undefined },
		nutriscoreGrade: { type: String, trim: true },
		novaGroup: { type: Number },
		ecoscoreGrade: { type: String, trim: true },
		imageUrl: { type: String, trim: true },
		detailsFetchedAt: { type: Date },
	},
	{ timestamps: true, collection: "barcode_products" },
);

export const BarcodeProduct =
	mongoose.models.BarcodeProduct ??
	mongoose.model("BarcodeProduct", barcodeProductSchema);
