export const INVITE_CODE_LENGTH = 6;
export const INVITE_CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export const HOUSEHOLD_JOIN_RATE_LIMIT = {
	maxAttempts: 10,
	windowMs: 60_000,
} as const;
