import fs from "node:fs";
import path from "node:path";
import {
	CROATIAN_LANGUAGE_LABEL,
	ENGLISH_LANGUAGE_LABEL,
} from "@/app/constants/openAI";

const receiptParsePromptTemplate = fs.readFileSync(
	path.join(process.cwd(), "app/prompts/receipt-parse-prompt.txt"),
	"utf-8",
);

const getReceiptLanguageLabel = (language: "en" | "hr"): string =>
	language === "hr" ? CROATIAN_LANGUAGE_LABEL : ENGLISH_LANGUAGE_LABEL;

export const buildReceiptParsePrompt = (language: "en" | "hr"): string => {
	const languageLabel = getReceiptLanguageLabel(language);

	const promptBase = receiptParsePromptTemplate.replaceAll(
		"{{languageLabel}}",
		languageLabel,
	);

	return `${promptBase.trim()}

User interface language: ${JSON.stringify(language)} (${languageLabel}).`;
};
