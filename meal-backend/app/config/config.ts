import { ERROR_MESSAGES } from "@/constants/messages";

if (!process.env.OPENAI_API_KEY) {
	throw new Error(ERROR_MESSAGES.MISSING_OPENAI_API_KEY);
}

if (!process.env.OPENAI_API_BASE_URL) {
	throw new Error(ERROR_MESSAGES.MISSING_OPENAI_API_BASE_URL);
}

if (!process.env.MONGODB_URI) {
	throw new Error(ERROR_MESSAGES.MISSING_MONGODB_URI);
}

if (!process.env.SENTRY_DSN) {
	throw new Error(ERROR_MESSAGES.MISSING_SENTRY_DSN);
}

if (!process.env.SENTRY_AUTH_TOKEN) {
	throw new Error(ERROR_MESSAGES.MISSING_SENTRY_AUTH_TOKEN);
}

export const config = {
	openAiApiKey: process.env.OPENAI_API_KEY,
	openAiApiBaseUrl: process.env.OPENAI_API_BASE_URL,
	mongodbUri: process.env.MONGODB_URI,
	sentryDsn: process.env.SENTRY_DSN,
	sentryAuthToken: process.env.SENTRY_AUTH_TOKEN,
};
