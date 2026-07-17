import mongoose from "mongoose";
import type { ShoppingListItemResponse } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import {
	normalizeShoppingListName,
	parseShoppingListCreateBody,
	parseShoppingListToggleBody,
	toShoppingListItemResponse,
} from "@/app/utils";
import { ERROR_MESSAGES } from "@/constants/messages";
import { ShoppingListItem } from "@/models";

export const runtime = "nodejs";

export async function GET(req: Request): Promise<Response> {
	await connectMongo();

	const deviceId = new URL(req.url).searchParams.get("deviceId")?.trim();
	if (!deviceId) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_QUERY },
			{ status: 400 },
		);
	}

	const householdId = await householdService.resolveHouseholdId(deviceId);
	const docs = await ShoppingListItem.find({ householdId })
		.sort({ createdAt: 1 })
		.lean();

	const items: ShoppingListItemResponse[] = docs.map(
		toShoppingListItemResponse,
	);
	return Response.json({ items });
}

export async function POST(req: Request): Promise<Response> {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseShoppingListCreateBody(body);

	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.SHOPPING_LIST_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId, name } = parsed;

	await deviceService.ensureDeviceRecord(deviceId);
	const householdId = await householdService.resolveHouseholdId(deviceId);
	const normalizedName = normalizeShoppingListName(name);

	const existing = await ShoppingListItem.findOne({
		householdId,
		name: {
			$regex: new RegExp(
				`^${normalizedName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`,
				"i",
			),
		},
	}).lean();

	if (existing) {
		return Response.json(toShoppingListItemResponse(existing));
	}

	try {
		const created = await ShoppingListItem.create({
			householdId,
			name,
			checked: false,
		});
		return Response.json(toShoppingListItemResponse(created), { status: 201 });
	} catch {
		return Response.json(
			{ error: ERROR_MESSAGES.SHOPPING_LIST_SAVE_FAILED },
			{ status: 500 },
		);
	}
}

export async function PATCH(req: Request): Promise<Response> {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseShoppingListToggleBody(body);

	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.SHOPPING_LIST_TOGGLE_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId, id, checked } = parsed;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return Response.json({ error: ERROR_MESSAGES.INVALID_ID }, { status: 400 });
	}

	const householdId = await householdService.resolveHouseholdId(deviceId);

	const updated = await ShoppingListItem.findOneAndUpdate(
		{ _id: new mongoose.Types.ObjectId(id), householdId },
		{ $set: { checked } },
		{ new: true },
	).lean();

	if (!updated) {
		return Response.json(
			{ error: ERROR_MESSAGES.SHOPPING_LIST_ITEM_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json(toShoppingListItemResponse(updated));
}

export async function DELETE(req: Request): Promise<Response> {
	await connectMongo();

	const { searchParams } = new URL(req.url);
	const deviceId = searchParams.get("deviceId")?.trim();
	const id = searchParams.get("id")?.trim();

	if (!deviceId || !id) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_AND_ID_QUERY },
			{ status: 400 },
		);
	}

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return Response.json({ error: ERROR_MESSAGES.INVALID_ID }, { status: 400 });
	}

	const householdId = await householdService.resolveHouseholdId(deviceId);

	const result = await ShoppingListItem.findOneAndDelete({
		_id: new mongoose.Types.ObjectId(id),
		householdId,
	});

	if (!result) {
		return Response.json(
			{ error: ERROR_MESSAGES.SHOPPING_LIST_ITEM_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json({ ok: true });
}
