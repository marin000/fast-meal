if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required environment variable: OPENAI_API_KEY');
}

if (!process.env.OPENAI_API_BASE_URL) {
  throw new Error('Missing required environment variable: OPENAI_API_BASE_URL');
}

export const config = {
  openAiApiKey: process.env.OPENAI_API_KEY,
  openAiApiBaseUrl: process.env.OPENAI_API_BASE_URL,
};
