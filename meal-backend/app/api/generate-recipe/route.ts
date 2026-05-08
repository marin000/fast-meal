import fs from "node:fs";
import path from "node:path";

import { config } from "@/app/config/config";
import {
	extractRecipesFromOpenAiResponse,
	parseRequestBody,
} from "@/app/utils";

export const runtime = "nodejs";
export const maxDuration = 60;

const mealPromptBase = fs.readFileSync(
	path.join(process.cwd(), "app/prompts/meal-prompt.txt"),
	"utf-8",
);

export async function POST(req: Request) {
	const body = await req.json();
	const parsedBody = parseRequestBody(body);

	if (!parsedBody) {
		return Response.json(
			{
				error:
					"Invalid request body. Expected { ingredients: string[], preferences?: string[], units?: 'metric' | 'imperial' }",
			},
			{ status: 400 },
		);
	}

	const { ingredients, preferences, units } = parsedBody;

	const prompt = `${mealPromptBase.trim()}

  User ingredients: ${JSON.stringify(ingredients, null, 2)}
  User preferences / filters: ${JSON.stringify(preferences, null, 2)}
  User units preference: ${JSON.stringify(units)}`;

	const response = await fetch(`${config.openAiApiBaseUrl}/v1/responses`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${config.openAiApiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			model: "gpt-4.1-mini",
			input: prompt,
		}),
	});

	const data = await response.json();

	try {
		const { recipes } = extractRecipesFromOpenAiResponse(data);
		return Response.json({ recipes });
	} catch (error) {
		const message =
			error instanceof Error ? error.message : "Failed to parse model output";
		return Response.json({ error: message }, { status: 502 });
	}
}
