export const WARNING_MESSAGES = {
	FRIDGE_PRODUCTS_POST_INVALID_JSON:
		"[api/fridge-products] POST invalid JSON body",
	FRIDGE_PRODUCTS_POST_PARSE_FAILED:
		"[api/fridge-products] POST parseFridgeProductBody failed — expected { deviceId, name, quantity?, unit?, expirationDate?, purchasedAt? }",
	RECIPES_POST_INVALID_JSON: "[api/recipes] POST invalid JSON body",
	RECIPES_POST_PARSE_FAILED:
		"[api/recipes] POST parseSaveRecipeBody failed — expected { deviceId, recipe }",
} as const;
