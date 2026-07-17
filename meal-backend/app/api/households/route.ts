import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import { ERROR_MESSAGES } from "@/constants/messages";

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

	const info = await householdService.getHouseholdInfo(deviceId);
	if (!info) {
		return Response.json(
			{ error: ERROR_MESSAGES.HOUSEHOLD_NOT_FOUND },
			{ status: 404 },
		);
	}

	return Response.json(info);
}
