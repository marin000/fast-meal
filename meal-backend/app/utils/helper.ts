export const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === "string");

export const isUnitsValue = (value: unknown): value is "metric" | "imperial" =>
	value === "metric" || value === "imperial";

export const isAppLanguage = (value: unknown): value is "en" | "hr" =>
	value === "en" || value === "hr";

export const stripCodeFences = (text: string): string => {
	const trimmed = text.trim();
	const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);

	return fenceMatch ? fenceMatch[1].trim() : trimmed;
};

export const normalizeStringList = (values: string[]): string[] =>
	[
		...new Set(
			values.map((value) => value.trim().toLowerCase()).filter(Boolean),
		),
	].sort();
