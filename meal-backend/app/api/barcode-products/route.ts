import type { BarcodeProductResponse } from "@/app/interface/barcode-product";
import { deviceService } from "@/app/service/device";
import { connectMongo } from "@/app/service/mongodb";
import { checkRateLimit } from "@/app/service/rate-limit";
import { captureApiError } from "@/app/utils";
import {
	barcodeLookupCodes,
	fetchOffEssentialsFromOff,
} from "@/app/utils/fetch-off-essentials";
import {
	buildBarcodeProductUpdateSet,
	parseBarcodeProductBody,
	toBarcodeProductResponse,
} from "@/app/utils/parse-barcode-product-body";
import {
	ERROR_LOG_MESSAGES,
	ERROR_MESSAGES,
	WARNING_MESSAGES,
} from "@/constants/messages";
import { BarcodeProduct } from "@/models";

export const runtime = "nodejs";

const BARCODE_WRITE_MAX_ATTEMPTS = 60;
const BARCODE_WRITE_WINDOW_MS = 10 * 60 * 1000;

export async function GET(req: Request): Promise<Response> {
	await connectMongo();

	const { searchParams } = new URL(req.url);
	const deviceId = searchParams.get("deviceId")?.trim();
	const code = searchParams.get("code")?.trim();
	const includeDetails = searchParams.get("include") === "details";
	const resolveOff = searchParams.get("resolve") !== "0";

	if (!deviceId) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_QUERY },
			{ status: 400 },
		);
	}

	if (!code) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_BARCODE_CODE_QUERY },
			{ status: 400 },
		);
	}

	await deviceService.ensureDeviceRecord(deviceId);

	const doc = await BarcodeProduct.findOne({
		code: { $in: barcodeLookupCodes(code) },
	}).lean();

	if (doc) {
		const product: BarcodeProductResponse = toBarcodeProductResponse(
			doc,
			includeDetails,
		);
		return Response.json({ found: true, product });
	}

	if (resolveOff) {
		try {
			const offProduct = await fetchOffEssentialsFromOff(code);
			if (offProduct) {
				try {
					await BarcodeProduct.findOneAndUpdate(
						{ code: offProduct.code },
						{
							$set: {
								code: offProduct.code,
								names: offProduct.names,
								brandLabel: offProduct.brandLabel,
								imageThumbUrl: offProduct.imageThumbUrl,
								categoriesTags: offProduct.categoriesTags,
								source: "off",
								fetchedAt: new Date(),
							},
						},
						{ upsert: true, returnDocument: "after" },
					);
				} catch (persistError) {
					captureApiError(persistError, {
						feature: "barcode_products",
						step: "off_cache_persist",
					});
				}

				return Response.json({ found: true, product: offProduct });
			}
		} catch (error) {
			captureApiError(error, {
				feature: "barcode_products",
				step: "off_resolve",
			});
		}
	}

	return Response.json({ found: false });
}

export async function POST(req: Request): Promise<Response> {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		console.warn(WARNING_MESSAGES.BARCODE_PRODUCTS_POST_INVALID_JSON);
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseBarcodeProductBody(body);
	if (!parsed) {
		console.warn(WARNING_MESSAGES.BARCODE_PRODUCTS_POST_PARSE_FAILED);
		return Response.json(
			{ error: ERROR_MESSAGES.BARCODE_PRODUCT_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const allowed = checkRateLimit(
		`barcode-write:${parsed.deviceId}`,
		BARCODE_WRITE_MAX_ATTEMPTS,
		BARCODE_WRITE_WINDOW_MS,
	);
	if (!allowed) {
		return Response.json(
			{ error: ERROR_MESSAGES.RATE_LIMIT_EXCEEDED },
			{ status: 429 },
		);
	}

	await deviceService.ensureDeviceRecord(parsed.deviceId);

	const updateSet = buildBarcodeProductUpdateSet(parsed);

	try {
		const upserted = await BarcodeProduct.findOneAndUpdate(
			{ code: parsed.code },
			{ $set: updateSet },
			{ upsert: true, returnDocument: "after" },
		).lean();

		if (!upserted) {
			return Response.json(
				{ error: ERROR_MESSAGES.BARCODE_PRODUCT_SAVE_FAILED },
				{ status: 500 },
			);
		}

		return Response.json(
			toBarcodeProductResponse(upserted, parsed.hasDetails),
			{ status: 201 },
		);
	} catch (error) {
		console.error(ERROR_LOG_MESSAGES.BARCODE_PRODUCTS_UPSERT_FAILED, error);
		captureApiError(error, {
			feature: "barcode_products",
			step: "upsert",
		});
		return Response.json(
			{ error: ERROR_MESSAGES.BARCODE_PRODUCT_SAVE_FAILED },
			{ status: 500 },
		);
	}
}
