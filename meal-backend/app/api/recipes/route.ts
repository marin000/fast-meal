import mongoose from "mongoose";
import type { Recipe, SavedRecipeListItem } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { connectMongo } from "@/app/service/mongodb";
import { normalizeRecipe, parseSaveRecipeBody } from "@/app/utils";
import { SavedRecipe } from "@/models";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		console.warn("[api/recipes] POST invalid JSON body");
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = parseSaveRecipeBody(body);

	if (!parsed) {
		console.warn(
			"[api/recipes] POST parseSaveRecipeBody failed — expected { deviceId, recipe }",
		);
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
	console.log("[api/recipes] saveRecipe", {
		deviceId,
		cacheKey,
		title: normalizedRecipe.title,
	});

	try {
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
	} catch (error) {
		console.error("[api/recipes] SavedRecipe.create failed", error);
		return Response.json(
			{ error: "Could not save recipe (database error)" },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request): Promise<Response> {
	await connectMongo();

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
	await connectMongo();

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
