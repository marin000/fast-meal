import mongoose from "mongoose";
import type { Recipe, SavedRecipeListItem } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { normalizeRecipe, parseSaveRecipeBody } from "@/app/utils";
import { SavedRecipe } from "@/models";

export async function POST(req: Request): Promise<Response> {
	const body = await req.json();
	const parsed = parseSaveRecipeBody(body);

	if (!parsed) {
		return Response.json(
			{
				error:
					"Invalid request body. Expected { deviceId: string, recipe: object, cacheKey?: string }",
			},
			{ status: 400 },
		);
	}

	const { deviceId, recipe, cacheKey } = parsed;
	const normalizedRecipe = normalizeRecipe(recipe);

	await deviceService.ensureDeviceRecord(deviceId);

	const created = await SavedRecipe.create({
		deviceId,
		cacheKey,
		recipe: normalizedRecipe,
	});

	return Response.json(
		{
			id: created._id.toString(),
			deviceId: created.deviceId,
			cacheKey: created.cacheKey ?? undefined,
			recipe: created.recipe,
			createdAt: created.createdAt.toISOString(),
		},
		{ status: 201 },
	);
}

export async function GET(req: Request): Promise<Response> {
	const { searchParams } = new URL(req.url);
	const deviceId = searchParams.get("deviceId")?.trim();

	if (!deviceId) {
		return Response.json(
			{ error: "Missing required query parameter: deviceId" },
			{ status: 400 },
		);
	}

	const docs = await SavedRecipe.find({ deviceId })
		.sort({ createdAt: -1 })
		.lean();

	const savedRecipes: SavedRecipeListItem[] = docs.map((doc) => ({
		id: doc._id.toString(),
		deviceId: doc.deviceId,
		cacheKey: doc.cacheKey ?? undefined,
		recipe: doc.recipe as Recipe,
		createdAt:
			doc.createdAt instanceof Date
				? doc.createdAt.toISOString()
				: new Date(doc.createdAt).toISOString(),
	}));

	return Response.json({ savedRecipes });
}

export async function DELETE(req: Request): Promise<Response> {
	const { searchParams } = new URL(req.url);
	const deviceId = searchParams.get("deviceId")?.trim();
	const id = searchParams.get("id")?.trim();

	if (!deviceId || !id) {
		return Response.json(
			{ error: "Missing required query parameters: deviceId and id" },
			{ status: 400 },
		);
	}

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return Response.json({ error: "Invalid id" }, { status: 400 });
	}

	const result = await SavedRecipe.findOneAndDelete({
		_id: new mongoose.Types.ObjectId(id),
		deviceId,
	});

	if (!result) {
		return Response.json({ error: "Saved recipe not found" }, { status: 404 });
	}

	return Response.json({ ok: true });
}
