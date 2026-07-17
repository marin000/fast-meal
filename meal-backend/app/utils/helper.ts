export const isStringArray = (value: unknown): value is string[] =>
	Array.isArray(value) && value.every((item) => typeof item === "string");

export const asRecord = (value: unknown): Record<string, unknown> | null => {
	if (typeof value !== "object" || value === null) return null;
	return value as Record<string, unknown>;
};

export const getTrimmedString = (body: unknown, key: string): string | null => {
	const record = asRecord(body);
	if (!record) return null;

	const value = record[key];
	if (typeof value !== "string") return null;

	const trimmed = value.trim();
	return trimmed.length > 0 ? trimmed : null;
};

export const getBoolean = (body: unknown, key: string): boolean | null => {
	const record = asRecord(body);
	if (!record) return null;

	const value = record[key];
	return typeof value === "boolean" ? value : null;
};

export const parseDeviceIdBody = (
	body: unknown,
): { deviceId: string } | null => {
	const deviceId = getTrimmedString(body, "deviceId");
	if (!deviceId) return null;
	return { deviceId };
};

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

export const convertToIsoString = (value: unknown): string => {
	if (value instanceof Date) return value.toISOString();
	return new Date(value as string | number).toISOString();
};
