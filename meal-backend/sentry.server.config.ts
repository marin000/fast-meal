import type { ErrorEvent } from "@sentry/nextjs";
import * as Sentry from "@sentry/nextjs";

const scrubEvent = (event: ErrorEvent): ErrorEvent | null => {
	if (event.request) {
		delete event.request.data;
		delete event.request.cookies;
		if (event.request.headers) {
			delete event.request.headers.authorization;
			delete event.request.headers.cookie;
		}
	}
	return event;
};

Sentry.init({
	dsn: process.env.SENTRY_DSN,
	enabled: Boolean(process.env.SENTRY_DSN),
	sendDefaultPii: false,
	tracesSampleRate: process.env.NODE_ENV === "development" ? 0 : 0.1,
	environment: process.env.NODE_ENV ?? "production",
	beforeSend: scrubEvent,
});
