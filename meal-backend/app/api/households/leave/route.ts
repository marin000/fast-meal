import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import { parseDeviceIdBody } from "@/app/utils";
import { ERROR_MESSAGES } from "@/constants/messages";

export const runtime = "nodejs";

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

	const parsed = parseDeviceIdBody(body);

	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.MISSING_DEVICE_ID_QUERY },
			{ status: 400 },
		);
	}

	const { deviceId } = parsed;

	const info = await householdService.leaveHousehold(deviceId);
	if (!info) {
		return Response.json(
			{ error: ERROR_MESSAGES.HOUSEHOLD_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json(info);
}
