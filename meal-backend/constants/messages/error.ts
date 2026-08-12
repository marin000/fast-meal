export const ERROR_MESSAGES = {
	INVALID_JSON_BODY: "Invalid JSON body",
	MISSING_DEVICE_ID_QUERY: "Missing required query parameter: deviceId",
	MISSING_DEVICE_ID_AND_ID_QUERY:
		"Missing required query parameters: deviceId and id",
	INVALID_ID: "Invalid id",
	DEVICE_NOT_FOUND: "Device not found",
	DEVICE_INVALID_JSON_BODY: "Invalid JSON body. Expected { deviceId: string }",
	DEVICE_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string }",
	DEVICE_NOT_CREATED: "Device was not created",
	FRIDGE_PRODUCT_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string, name: string, quantity?: number, unit?: string, expirationDate?: string, purchasedAt?: string }",
	FRIDGE_PRODUCT_SAVE_FAILED: "Could not save fridge product (database error)",
	FRIDGE_PRODUCT_NOT_FOUND: "Fridge product not found",
	HOUSEHOLD_NOT_FOUND: "Household not found",
	INVALID_INVITE_CODE: "Invalid invite code",
	LEAVE_CURRENT_FAMILY_FIRST:
		"Leave your current family before joining another",
	RATE_LIMIT_EXCEEDED: "Too many attempts. Please try again later.",
	SHOPPING_LIST_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string, name: string }",
	SHOPPING_LIST_ITEM_NOT_FOUND: "Shopping list item not found",
	SHOPPING_LIST_SAVE_FAILED:
		"Could not save shopping list item (database error)",
	SHOPPING_LIST_TOGGLE_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string, id: string, checked: boolean }",
	RECIPE_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string, recipe: object, cacheKey?: string }",
	RECIPE_SAVE_FAILED: "Could not save recipe (database error)",
	SAVED_RECIPE_NOT_FOUND: "Saved recipe not found",
	GENERATE_RECIPE_INVALID_REQUEST_BODY:
		"Invalid request body. Expected { deviceId: string, ingredients: string[], preferences?: string[], units?: 'metric' | 'imperial', language?: 'en' | 'hr' }",
	GENERATION_TIMEOUT: "Recipe generation took too long. Please try again.",
	DAILY_LIMIT_REACHED: "Daily recipe generation limit reached.",
	DAILY_LIMIT_REACHED_TOMORROW:
		"Daily recipe generation limit reached. Try again tomorrow.",
	FAILED_TO_PARSE_MODEL_OUTPUT: "Failed to parse model output",
	OPENAI_MISSING_OUTPUT_TEXT: "Invalid OpenAI response: missing output text",
	OPENAI_MISSING_RECIPES_ARRAY: "Invalid recipe JSON: missing recipes array",
	MISSING_OPENAI_API_KEY:
		"Missing required environment variable: OPENAI_API_KEY",
	MISSING_OPENAI_API_BASE_URL:
		"Missing required environment variable: OPENAI_API_BASE_URL",
	MISSING_MONGODB_URI: "Missing required environment variable: MONGODB_URI",
} as const;

export const ERROR_LOG_MESSAGES = {
	FRIDGE_PRODUCTS_CREATE_FAILED:
		"[api/fridge-products] FridgeProduct.create failed",
	RECIPES_CREATE_FAILED: "[api/recipes] SavedRecipe.create failed",
	GENERATE_RECIPE_PERSISTED_GET_FAILED:
		"Failed to get persisted recipes from MongoDB",
	GENERATE_RECIPE_CACHE_UPSERT_FAILED: "Failed to upsert recipe cache entry",
	MONGODB_STARTUP_CONNECT_FAILED:
		"[meal-backend] MongoDB startup connect failed:",
} as const;
