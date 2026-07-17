import { householdService } from "@/app/service/household";
import { connectMongo } from "@/app/service/mongodb";
import { parseHouseholdJoinBody } from "@/app/utils";
import { ERROR_MESSAGES } from "@/constants/messages";

export const runtime = "nodejs";

const getClientKey = (req: Request): string => {
	const forwarded = req.headers.get("x-forwarded-for");
	if (forwarded) return forwarded.split(",")[0]?.trim() ?? "unknown";
	return req.headers.get("x-real-ip") ?? "unknown";
};

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

	const parsed = parseHouseholdJoinBody(body);

	if (!parsed) {
		return Response.json(
			{ error: ERROR_MESSAGES.INVALID_INVITE_CODE },
			{ status: 400 },
		);
	}

	const { deviceId, inviteCode } = parsed;

	const result = await householdService.joinHousehold(
		deviceId,
		inviteCode,
		getClientKey(req),
	);

	if (!result.ok) {
		const message =
			result.error === "HOUSEHOLD_NOT_FOUND"
				? ERROR_MESSAGES.HOUSEHOLD_NOT_FOUND
				: result.error === "LEAVE_CURRENT_FAMILY_FIRST"
					? ERROR_MESSAGES.LEAVE_CURRENT_FAMILY_FIRST
					: result.error === "RATE_LIMIT_EXCEEDED"
						? ERROR_MESSAGES.RATE_LIMIT_EXCEEDED
						: ERROR_MESSAGES.INVALID_INVITE_CODE;

		return Response.json({ error: message }, { status: result.status });
	}

	return Response.json(result.info);
}
