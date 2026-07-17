import { deviceService } from "@/app/service/device";
import { connectMongo } from "@/app/service/mongodb";
import { parseDeviceIdBody } from "@/app/utils";
import { ERROR_MESSAGES } from "@/constants/messages";
import { Device } from "@/models";

export const runtime = "nodejs";

export async function GET(req: Request) {
	await connectMongo();

	const deviceId = new URL(req.url).searchParams.get("deviceId")?.trim();

	if (!deviceId) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_QUERY },
			{ status: 400 },
		);
	}

	const doc = await Device.findOne({ deviceId }).lean();

	if (!doc) {
		return Response.json(
			{ error: ERROR_MESSAGES.DEVICE_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json(deviceService.toDeviceResponse(doc));
}

export async function POST(req: Request) {
	await connectMongo();

	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json(
			{ error: ERROR_MESSAGES.DEVICE_INVALID_JSON_BODY },
			{ status: 400 },
		);
	}

	const parsed = parseDeviceIdBody(body);

	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.DEVICE_INVALID_REQUEST_BODY },
			{ status: 400 },
		);
	}

	const { deviceId } = parsed;

	await deviceService.ensureDeviceRecord(deviceId);

	const doc = await Device.findOne({ deviceId }).lean();

	if (!doc) {
		return Response.json(
			{ error: ERROR_MESSAGES.DEVICE_NOT_CREATED },
			{ status: 500 },
		);
	}

	return Response.json(deviceService.toDeviceResponse(doc));
}
