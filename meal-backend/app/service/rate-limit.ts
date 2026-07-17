const buckets = new Map<string, { count: number; resetAt: number }>();

export const checkRateLimit = (
	key: string,
	maxAttempts: number,
	windowMs: number,
): boolean => {
	const now = Date.now();
	const existing = buckets.get(key);

	if (!existing || now >= existing.resetAt) {
		buckets.set(key, { count: 1, resetAt: now + windowMs });
		return true;
	}

	if (existing.count >= maxAttempts) {
		return false;
	}

	existing.count += 1;
	return true;
};
