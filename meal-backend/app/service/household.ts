import { randomBytes, randomUUID } from "node:crypto";

import {
	HOUSEHOLD_JOIN_RATE_LIMIT,
	INVITE_CODE_CHARS,
	INVITE_CODE_LENGTH,
} from "@/app/constants/household";
import type { HouseholdInfo } from "@/app/interface";
import { checkRateLimit } from "@/app/service/rate-limit";
import { Device, FridgeProduct, Household, ShoppingListItem } from "@/models";

const generateInviteCode = (): string => {
	const bytes = randomBytes(INVITE_CODE_LENGTH);
	let code = "";
	for (let i = 0; i < INVITE_CODE_LENGTH; i += 1) {
		const byte = bytes[i] ?? 0;
		code += INVITE_CODE_CHARS[byte % INVITE_CODE_CHARS.length];
	}
	return code;
};

const createUniqueInviteCode = async (): Promise<string> => {
	for (let attempt = 0; attempt < 10; attempt += 1) {
		const inviteCode = generateInviteCode();
		const exists = await Household.exists({ inviteCode });
		if (!exists) return inviteCode;
	}
	throw new Error("Could not generate unique invite code");
};

const createHouseholdForDevice = async (
	deviceId: string,
): Promise<{ householdId: string; inviteCode: string }> => {
	const householdId = randomUUID();
	const inviteCode = await createUniqueInviteCode();

	await Household.create({
		householdId,
		inviteCode,
		createdByDeviceId: deviceId,
	});

	return { householdId, inviteCode };
};

const getMemberCount = async (householdId: string): Promise<number> =>
	Device.countDocuments({ householdId });

const toHouseholdInfo = async (household: {
	householdId: string;
	inviteCode: string;
}): Promise<HouseholdInfo> => ({
	householdId: household.householdId,
	inviteCode: household.inviteCode,
	memberCount: await getMemberCount(household.householdId),
});

const mergeShoppingListIntoHousehold = async (
	sourceHouseholdId: string,
	targetHouseholdId: string,
): Promise<void> => {
	const [sourceItems, targetItems] = await Promise.all([
		ShoppingListItem.find({ householdId: sourceHouseholdId }).lean(),
		ShoppingListItem.find({ householdId: targetHouseholdId }).lean(),
	]);

	const existingNames = new Set(
		targetItems.map((item) => item.name.trim().toLowerCase()),
	);

	const toCreate = sourceItems.filter((item) => {
		const key = item.name.trim().toLowerCase();
		if (existingNames.has(key)) return false;
		existingNames.add(key);
		return true;
	});

	if (toCreate.length === 0) return;

	await ShoppingListItem.insertMany(
		toCreate.map((item) => ({
			householdId: targetHouseholdId,
			name: item.name.trim(),
			checked: item.checked,
		})),
	);
};

export async function ensureDeviceHousehold(deviceId: string): Promise<string> {
	const device = await Device.findOne({ deviceId }).lean();
	if (device?.householdId) return device.householdId;

	const { householdId } = await createHouseholdForDevice(deviceId);
	await Device.findOneAndUpdate(
		{ deviceId },
		{ $set: { householdId } },
		{ upsert: false },
	);

	return householdId;
}

export async function resolveHouseholdId(deviceId: string): Promise<string> {
	await Device.findOneAndUpdate(
		{ deviceId },
		{
			$setOnInsert: {
				deviceId,
				plan: "free",
				dailyUsageCount: 2,
				dailyUsageDate: "",
			},
		},
		{ upsert: true },
	);

	return ensureDeviceHousehold(deviceId);
}

export async function getHouseholdInfo(
	deviceId: string,
): Promise<HouseholdInfo | null> {
	const householdId = await resolveHouseholdId(deviceId);
	const household = await Household.findOne({ householdId }).lean();
	if (!household) return null;
	return toHouseholdInfo(household);
}

export async function joinHousehold(
	deviceId: string,
	inviteCode: string,
	clientKey: string,
): Promise<
	| { ok: true; info: HouseholdInfo }
	| { ok: false; error: string; status: number }
> {
	const normalizedCode = inviteCode.trim().toUpperCase();
	if (!normalizedCode) {
		return { ok: false, error: "INVALID_INVITE_CODE", status: 400 };
	}

	const rateLimitKey = `household-join:${deviceId}:${clientKey}`;
	if (
		!checkRateLimit(
			rateLimitKey,
			HOUSEHOLD_JOIN_RATE_LIMIT.maxAttempts,
			HOUSEHOLD_JOIN_RATE_LIMIT.windowMs,
		)
	) {
		return { ok: false, error: "RATE_LIMIT_EXCEEDED", status: 429 };
	}

	const currentHouseholdId = await resolveHouseholdId(deviceId);
	const targetHousehold = await Household.findOne({
		inviteCode: normalizedCode,
	}).lean();

	if (!targetHousehold) {
		return { ok: false, error: "HOUSEHOLD_NOT_FOUND", status: 404 };
	}

	if (targetHousehold.householdId === currentHouseholdId) {
		return { ok: true, info: await toHouseholdInfo(targetHousehold) };
	}

	const currentMemberCount = await getMemberCount(currentHouseholdId);
	if (currentMemberCount > 1) {
		return { ok: false, error: "LEAVE_CURRENT_FAMILY_FIRST", status: 409 };
	}

	await FridgeProduct.updateMany(
		{ householdId: currentHouseholdId },
		{ $set: { householdId: targetHousehold.householdId } },
	);

	await mergeShoppingListIntoHousehold(
		currentHouseholdId,
		targetHousehold.householdId,
	);

	await Device.updateOne(
		{ deviceId },
		{ $set: { householdId: targetHousehold.householdId } },
	);

	return { ok: true, info: await toHouseholdInfo(targetHousehold) };
}

export async function leaveHousehold(
	deviceId: string,
): Promise<HouseholdInfo | null> {
	const householdId = await resolveHouseholdId(deviceId);
	const memberCount = await getMemberCount(householdId);

	if (memberCount <= 1) {
		const household = await Household.findOne({ householdId }).lean();
		return household ? toHouseholdInfo(household) : null;
	}

	const { householdId: newHouseholdId } =
		await createHouseholdForDevice(deviceId);

	await FridgeProduct.updateMany(
		{ householdId, deviceId },
		{ $set: { householdId: newHouseholdId } },
	);

	await Device.updateOne(
		{ deviceId },
		{ $set: { householdId: newHouseholdId } },
	);

	const household = await Household.findOne({
		householdId: newHouseholdId,
	}).lean();

	return household ? toHouseholdInfo(household) : null;
}

export const householdService = {
	ensureDeviceHousehold,
	resolveHouseholdId,
	getHouseholdInfo,
	joinHousehold,
	leaveHousehold,
};
