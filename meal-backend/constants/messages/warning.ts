export const WARNING_MESSAGES = {
	FRIDGE_PRODUCTS_POST_INVALID_JSON:
		"[api/fridge-products] POST invalid JSON body",
	FRIDGE_PRODUCTS_POST_PARSE_FAILED:
		"[api/fridge-products] POST parseFridgeProductBody failed — expected { deviceId, name, quantity?, unit?, expirationDate?, purchasedAt?, barcode? }",
	FRIDGE_PRODUCTS_BATCH_INVALID_JSON:
		"[api/fridge-products/batch] POST invalid JSON body",
	FRIDGE_PRODUCTS_BATCH_PARSE_FAILED:
		"[api/fridge-products/batch] POST parseFridgeProductBatchBody failed — expected { deviceId, products: [...] }",
	BARCODE_PRODUCTS_POST_INVALID_JSON:
		"[api/barcode-products] POST invalid JSON body",
	BARCODE_PRODUCTS_POST_PARSE_FAILED:
		"[api/barcode-products] POST parseBarcodeProductBody failed — expected { deviceId, code, ... }",
	RECIPES_POST_INVALID_JSON: "[api/recipes] POST invalid JSON body",
	RECIPES_POST_PARSE_FAILED:
		"[api/recipes] POST parseSaveRecipeBody failed — expected { deviceId, recipe }",
} as const;
