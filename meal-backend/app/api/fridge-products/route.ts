import mongoose from "mongoose";
import type { FridgeProductListItem } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import {
	captureApiError,
	parseFridgeProductBody,
	parseFridgeProductUpdateBody,
	sortFridgeProductDocsByExpiration,
	toFridgeProductListItem,
} from "@/app/utils";
import {
	ERROR_LOG_MESSAGES,
	ERROR_MESSAGES,
	WARNING_MESSAGES,
} from "@/constants/messages";
import { FridgeProduct } from "@/models";

export const runtime = "nodejs";

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

	const parsed = parseFridgeProductUpdateBody(body);
	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_UPDATE_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	if (!mongoose.Types.ObjectId.isValid(parsed.id)) {
		return Response.json({ error: ERROR_MESSAGES.INVALID_ID }, { status: 400 });
	}

	await deviceService.ensureDeviceRecord(parsed.deviceId);
	const householdId = await householdService.resolveHouseholdId(
		parsed.deviceId,
	);

	const $set: Record<string, unknown> = {
		name: parsed.name,
	};
	const $unset: Record<string, 1> = {};

	if (parsed.quantity !== null && parsed.unit !== null) {
		$set.quantity = parsed.quantity;
		$set.unit = parsed.unit;
	} else {
		$unset.quantity = 1;
		$unset.unit = 1;
	}

	if (parsed.expirationDate) {
		$set.expirationDate = parsed.expirationDate;
	} else {
		$unset.expirationDate = 1;
	}

	if (parsed.purchasedAt) {
		$set.purchasedAt = parsed.purchasedAt;
	} else {
		$unset.purchasedAt = 1;
	}

	try {
		const updated = await FridgeProduct.findOneAndUpdate(
			{
				_id: new mongoose.Types.ObjectId(parsed.id),
				householdId,
			},
			{
				$set,
				...(Object.keys($unset).length > 0 ? { $unset } : {}),
			},
			{ new: true },
		).lean();

		if (!updated) {
			return Response.json(
				{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_NOT_FOUND },
				{ status: 404 },
			);
		}

		return Response.json(toFridgeProductListItem(updated));
	} catch (error) {
		console.error(ERROR_LOG_MESSAGES.FRIDGE_PRODUCTS_UPDATE_FAILED, error);
		captureApiError(error, { feature: "fridge_products_update" });
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_UPDATE_FAILED },
			{ status: 500 },
		);
	}
}

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

	const {
		deviceId,
		name,
		quantity,
		unit,
		expirationDate,
		purchasedAt,
		barcode,
	} = parsed;

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
			barcode,
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

	const docs = sortFridgeProductDocsByExpiration(
		await FridgeProduct.find({ householdId }).lean(),
	);

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
