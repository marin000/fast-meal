export const DAILY_FREE_GENERATION_ALLOWANCE = 2;

/** Set env DISABLE_DAILY_GENERATION_LIMIT=true for local testing only. */
export const isDailyGenerationLimitDisabled = (): boolean =>
	process.env.DISABLE_DAILY_GENERATION_LIMIT === "true";
