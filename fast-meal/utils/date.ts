export const startOfLocalDay = (date: Date): Date => {
	const day = new Date(date);
	day.setHours(0, 0, 0, 0);
	return day;
};

export const getDaysUntilExpiration = (
	expirationIso: string,
): number | null => {
	const expiration = new Date(expirationIso);
	if (Number.isNaN(expiration.getTime())) return null;

	const today = startOfLocalDay(new Date());
	const expDay = startOfLocalDay(expiration);

	return Math.ceil(
		(expDay.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
	);
};

export const formatDisplayDate = (date: Date, locale: string): string => {
	return date.toLocaleDateString(locale === "hr" ? "hr-HR" : "en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

export const toIsoDate = (date: Date): string => date.toISOString();

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
