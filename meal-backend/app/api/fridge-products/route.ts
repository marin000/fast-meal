import mongoose from "mongoose";
import type { FridgeProductListItem } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import {
	captureApiError,
	parseFridgeProductBody,
	toFridgeProductListItem,
} from "@/app/utils";
import {
	ERROR_LOG_MESSAGES,
	ERROR_MESSAGES,
	WARNING_MESSAGES,
} from "@/constants/messages";
import { FridgeProduct } from "@/models";

export const runtime = "nodejs";

export async function POST(req: Request): Promise<Response> {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		console.warn(WARNING_MESSAGES.FRIDGE_PRODUCTS_POST_INVALID_JSON);
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseFridgeProductBody(body);

	if (!parsed) {
		console.warn(WARNING_MESSAGES.FRIDGE_PRODUCTS_POST_PARSE_FAILED);
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId, name, quantity, unit, expirationDate, purchasedAt } =
		parsed;

	await deviceService.ensureDeviceRecord(deviceId);
	const householdId = await householdService.resolveHouseholdId(deviceId);

	try {
		const created = await FridgeProduct.create({
			householdId,
			deviceId,
			name,
			quantity,
			unit,
			expirationDate,
			purchasedAt,
		});

		return Response.json(toFridgeProductListItem(created), { status: 201 });
	} catch (error) {
		console.error(ERROR_LOG_MESSAGES.FRIDGE_PRODUCTS_CREATE_FAILED, error);
		captureApiError(error, { feature: "fridge_products_create" });
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_SAVE_FAILED },
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
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_QUERY },
			{ status: 400 },
		);
	}

	const householdId = await householdService.resolveHouseholdId(deviceId);

	const docs = await FridgeProduct.find({ householdId })
		.sort({ createdAt: -1 })
		.lean();

	const fridgeProducts: FridgeProductListItem[] = docs.map(
		toFridgeProductListItem,
	);

	return Response.json({ fridgeProducts });
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

	const result = await FridgeProduct.findOneAndDelete({
		_id: new mongoose.Types.ObjectId(id),
		householdId,
	});

	if (!result) {
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json({ ok: true });
}
