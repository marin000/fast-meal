import { deviceService } from "@/app/service/device";
import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import {
	captureApiError,
	parseFridgeProductBatchBody,
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
		console.warn(WARNING_MESSAGES.FRIDGE_PRODUCTS_BATCH_INVALID_JSON);
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseFridgeProductBatchBody(body);

	if (!parsed) {
		console.warn(WARNING_MESSAGES.FRIDGE_PRODUCTS_BATCH_PARSE_FAILED);
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_BATCH_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId, products } = parsed;

	await deviceService.ensureDeviceRecord(deviceId);
	const householdId = await householdService.resolveHouseholdId(deviceId);

	try {
		const docs = products.map((product) => ({
			householdId,
			deviceId,
			name: product.name,
			quantity: product.quantity,
			unit: product.unit,
			expirationDate: product.expirationDate,
			purchasedAt: product.purchasedAt,
			barcode: product.barcode,
		}));

		const created = await FridgeProduct.insertMany(docs);

		return Response.json(
			{
				fridgeProducts: created.map((doc) =>
					toFridgeProductListItem(doc.toObject()),
				),
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error(
			ERROR_LOG_MESSAGES.FRIDGE_PRODUCTS_BATCH_CREATE_FAILED,
			error,
		);
		captureApiError(error, { feature: "fridge_products_batch_create" });
		return Response.json(
			{ error: ERROR_MESSAGES.FRIDGE_PRODUCT_SAVE_FAILED },
			{ status: 500 },
		);
	}
}
