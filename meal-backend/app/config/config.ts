if (!process.env.OPENAI_API_KEY) {
	throw new Error("Missing required environment variable: OPENAI_API_KEY");
}

if (!process.env.OPENAI_API_BASE_URL) {
	throw new Error("Missing required environment variable: OPENAI_API_BASE_URL");
}

if (!process.env.MONGODB_URI) {
	throw new Error("Missing required environment variable: MONGODB_URI");
}
export const config = {
	openAiApiKey: process.env.OPENAI_API_KEY,
	openAiApiBaseUrl: process.env.OPENAI_API_BASE_URL,
	mongodbUri: process.env.MONGODB_URI,
};
