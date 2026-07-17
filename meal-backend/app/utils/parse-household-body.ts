import { getTrimmedString } from "./helper";

export interface ParsedHouseholdJoinBody {
	deviceId: string;
	inviteCode: string;
}

export const parseHouseholdJoinBody = (
	body: unknown,
): ParsedHouseholdJoinBody | null => {
	const deviceId = getTrimmedString(body, "deviceId");
	const inviteCode = getTrimmedString(body, "inviteCode");

	if (!deviceId || !inviteCode) return null;

	return { deviceId, inviteCode };
};
