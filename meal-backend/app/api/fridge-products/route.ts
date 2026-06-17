import mongoose from "mongoose";
import type { FridgeProductListItem } from "@/app/interface";
import { deviceService } from "@/app/service/device";
import { parseFridgeProductBody } from "@/app/utils";
import { FridgeProduct } from "@/models";

const toIsoString = (value: unknown): string => {
	if (value instanceof Date) return value.toISOString();
	return new Date(value as string | number).toISOString();
};

const toFridgeProductListItem = (doc: {
	_id: mongoose.Types.ObjectId;
	deviceId: string;
	name: string;
	quantity?: number;
	unit?: string;
	expirationDate?: Date;
	purchasedAt?: Date;
	createdAt: Date;
	updatedAt: Date;
}): FridgeProductListItem => ({
	id: doc._id.toString(),
	deviceId: doc.deviceId,
	name: doc.name,
	quantity: doc.quantity,
	unit: doc.unit as FridgeProductListItem["unit"],
	expirationDate: doc.expirationDate
		? toIsoString(doc.expirationDate)
		: undefined,
	purchasedAt: doc.purchasedAt ? toIsoString(doc.purchasedAt) : undefined,
	createdAt: toIsoString(doc.createdAt),
	updatedAt: toIsoString(doc.updatedAt),
});

export async function POST(req: Request): Promise<Response> {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		console.warn("[api/fridge-products] POST invalid JSON body");
		return Response.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const parsed = parseFridgeProductBody(body);

	if (!parsed) {
		console.warn(
			"[api/fridge-products] POST parseFridgeProductBody failed — expected { deviceId, name, quantity?, unit?, expirationDate?, purchasedAt? }",
		);
		return Response.json(
			{
				error:
					"Invalid request body. Expected { deviceId: string, name: string, quantity?: number, unit?: string, expirationDate?: string, purchasedAt?: string }",
			},
			{ status: 400 },
		);
	}

	const { deviceId, name, quantity, unit, expirationDate, purchasedAt } = parsed;

	await deviceService.ensureDeviceRecord(deviceId);
	console.log("[api/fridge-products] create", { deviceId, name });

	try {
		const created = await FridgeProduct.create({
			deviceId,
			name,
			quantity,
			unit,
			expirationDate,
			purchasedAt,
		});

		return Response.json(toFridgeProductListItem(created), { status: 201 });
	} catch (error) {
		console.error("[api/fridge-products] FridgeProduct.create failed", error);
		return Response.json(
			{ error: "Could not save fridge product (database error)" },
			{ status: 500 },
		);
	}
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

	const docs = await FridgeProduct.find({ deviceId })
		.sort({ createdAt: -1 })
		.lean();

	const fridgeProducts: FridgeProductListItem[] = docs.map((doc) =>
		toFridgeProductListItem({
			_id: doc._id,
			deviceId: doc.deviceId,
			name: doc.name,
			quantity: doc.quantity,
			unit: doc.unit,
			expirationDate: doc.expirationDate,
			purchasedAt: doc.purchasedAt,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		}),
	);

	return Response.json({ fridgeProducts });
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

	const result = await FridgeProduct.findOneAndDelete({
		_id: new mongoose.Types.ObjectId(id),
		deviceId,
	});

	if (!result) {
		return Response.json(
			{ error: "Fridge product not found" },
			{ status: 404 },
		);
	}

	return Response.json({ ok: true });
}
