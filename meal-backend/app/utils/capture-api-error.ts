import * as Sentry from "@sentry/nextjs";

type SafeContext = Record<string, string | number | boolean | undefined>;

export const captureApiError = (
	error: unknown,
	context?: SafeContext,
): void => {
	Sentry.withScope((scope) => {
		if (context) {
			for (const [key, value] of Object.entries(context)) {
				if (value === undefined) continue;
				scope.setTag(key, String(value));
			}
		}
		Sentry.captureException(error);
	});
};

export const captureApiMessage = (
	message: string,
	context?: SafeContext,
): void => {
	Sentry.withScope((scope) => {
		if (context) {
			for (const [key, value] of Object.entries(context)) {
				if (value === undefined) continue;
				scope.setTag(key, String(value));
			}
		}
		Sentry.captureMessage(message, "error");
	});
};
