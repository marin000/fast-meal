export const OPEN_FOOD_FACTS_BASE_URL =
	"https://world.openfoodfacts.org/api/v2/product";

export const OPEN_FOOD_FACTS_CONTACT_EMAIL =
	process.env.EXPO_PUBLIC_OPEN_FOOD_FACTS_CONTACT_EMAIL?.trim() ?? "";

export const OPEN_FOOD_FACTS_USER_AGENT_APP = "FastMeal";

export const OPEN_FOOD_FACTS_FETCH_TIMEOUT_MS = 10_000;

export const OPEN_FOOD_FACTS_DETAILS_REFRESH_DAYS = 30;

/** Fields requested for scan essentials (tier 1). */
export const OPEN_FOOD_FACTS_ESSENTIALS_FIELDS = [
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

/** Extra fields for the details tier. */
export const OPEN_FOOD_FACTS_DETAILS_FIELDS = [
	...OPEN_FOOD_FACTS_ESSENTIALS_FIELDS.split(","),
	"serving_size",
	"nutriments",
	"ingredients_text",
	"ingredients_text_en",
	"ingredients_text_hr",
	"allergens_tags",
	"labels_tags",
	"nutriscore_grade",
	"nova_group",
	"ecoscore_grade",
	"image_front_url",
	"image_url",
].join(",");
