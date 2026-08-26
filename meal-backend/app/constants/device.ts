export const DAILY_FREE_GENERATION_ALLOWANCE = 2;
export const DAILY_FREE_RECEIPT_SCAN_ALLOWANCE = 5;

/** Set env DISABLE_DAILY_GENERATION_LIMIT=true for local testing only. */
export const isDailyGenerationLimitDisabled = (): boolean =>
	process.env.DISABLE_DAILY_GENERATION_LIMIT === "true";

/** Set env DISABLE_DAILY_RECEIPT_SCAN_LIMIT=true for local testing only. */
export const isDailyReceiptScanLimitDisabled = (): boolean =>
	process.env.DISABLE_DAILY_RECEIPT_SCAN_LIMIT === "true";

export const MAX_IMAGE_BASE64_LENGTH = 4 * 1024 * 1024;
