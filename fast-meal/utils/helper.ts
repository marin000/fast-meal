import type { AppAppearance } from "@/constants/app-appearance";
import { EXPIRATION_STATUS } from "@/constants/fridge";

export interface ExpirationRowAppearance {
	borderColor: string;
	backgroundColor: string;
	accentColor: string;
}

export const parseIngredientsInput = (input: string): string[] => {
	return input
		.split(",")
		.map((item) => item.trim().toLowerCase())
		.filter((item) => item.length > 0);
};

export const mergeIngredientNames = (
	existing: string,
	names: string[],
): string => {
	if (names.length === 0) return existing;

	const joined = names.join(", ");
	const trimmed = existing.trim();
	return trimmed ? `${trimmed}, ${joined}` : joined;
};

export const coerceParam = (value: string | string[] | undefined): string => {
	if (Array.isArray(value)) return value[0] ?? "";
	return value ?? "";
};

export const formatDisplayDate = (date: Date, locale: string): string => {
	return date.toLocaleDateString(locale === "hr" ? "hr-HR" : "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export const toIsoDate = (date: Date): string => date.toISOString();

export const getExpirationStatus = (
	iso: string,
): (typeof EXPIRATION_STATUS)[keyof typeof EXPIRATION_STATUS] | undefined => {
	const { OK, SOON, EXPIRED } = EXPIRATION_STATUS;
	const expiration = new Date(iso);
	if (Number.isNaN(expiration.getTime())) return undefined;

	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const expDay = new Date(expiration);
	expDay.setHours(0, 0, 0, 0);

	const diffDays = Math.ceil(
		(expDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);

	if (diffDays <= 0) return EXPIRED;
	if (diffDays <= 3) return SOON;
	return OK;
};

export const getExpirationRowAppearance = (
	theme: AppAppearance,
	status?: (typeof EXPIRATION_STATUS)[keyof typeof EXPIRATION_STATUS],
): ExpirationRowAppearance => {
	if (!status) {
		return {
			borderColor: theme.cardBorder,
			backgroundColor: theme.card,
			accentColor: theme.textMuted,
		};
	}

	const { SOON, EXPIRED } = EXPIRATION_STATUS;
	const palette =
		status === EXPIRED
			? theme.expiration.expired
			: status === SOON
				? theme.expiration.soon
				: theme.expiration.ok;

	return {
		borderColor: palette.solid,
		backgroundColor: palette.soft,
		accentColor: palette.solid,
	};
};

export const getExpirationDaysLeft = (iso: string): number => {
	const expiration = new Date(iso);
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const expDay = new Date(expiration);
	expDay.setHours(0, 0, 0, 0);
	return Math.ceil(
		(expDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);
};
