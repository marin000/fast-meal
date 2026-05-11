import { deviceService } from "@/app/service/device";
import { Device } from "@/models";

export const runtime = "nodejs";

export async function GET(req: Request) {
	const deviceId = new URL(req.url).searchParams.get("deviceId")?.trim();

	if (!deviceId) {
		return Response.json(
			{ error: "Missing required query parameter: deviceId" },
			{ status: 400 },
		);
	}

	const doc = await Device.findOne({ deviceId }).lean();

	if (!doc) {
		return Response.json({ error: "Device not found" }, { status: 404 });
	}

	return Response.json(deviceService.toDeviceResponse(doc));
}

export async function POST(req: Request) {
	let body: unknown;
	try {
		body = await req.json();
	} catch {
		return Response.json(
			{ error: "Invalid JSON body. Expected { deviceId: string }" },
			{ status: 400 },
		);
	}

	const deviceId =
		typeof body === "object" &&
		body !== null &&
		typeof (body as { deviceId?: unknown }).deviceId === "string"
			? (body as { deviceId: string }).deviceId.trim()
			: "";

	if (!deviceId) {
		return Response.json(
			{ error: "Invalid request body. Expected { deviceId: string }" },
			{ status: 400 },
		);
	}

	await deviceService.ensureDeviceRecord(deviceId);

	const doc = await Device.findOne({ deviceId }).lean();

	if (!doc) {
		return Response.json({ error: "Device was not created" }, { status: 500 });
	}

	return Response.json(deviceService.toDeviceResponse(doc));
}
