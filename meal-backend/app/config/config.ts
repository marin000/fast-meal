import { ERROR_MESSAGES } from "@/app/constants/messages";

if (!process.env.OPENAI_API_KEY) {
	throw new Error(ERROR_MESSAGES.MISSING_OPENAI_API_KEY);
}

if (!process.env.OPENAI_API_BASE_URL) {
	throw new Error(ERROR_MESSAGES.MISSING_OPENAI_API_BASE_URL);
}

if (!process.env.MONGODB_URI) {
	throw new Error(ERROR_MESSAGES.MISSING_MONGODB_URI);
}
export const config = {
	openAiApiKey: process.env.OPENAI_API_KEY,
	openAiApiBaseUrl: process.env.OPENAI_API_BASE_URL,
	mongodbUri: process.env.MONGODB_URI,
};
