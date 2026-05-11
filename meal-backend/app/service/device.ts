import { Device } from "@/models";
import type { DeviceResponse } from "../interface";

export async function ensureDeviceRecord(deviceId: string): Promise<void> {
	await Device.findOneAndUpdate(
		{ deviceId },
		{
			$setOnInsert: {
				deviceId,
				plan: "free",
				dailyUsageCount: 0,
				dailyUsageDate: "",
			},
		},
		{ upsert: true },
	);
}

const toDeviceResponse = (doc: {
	deviceId: string;
	plan?: string;
	dailyUsageCount: number;
	dailyUsageDate: string;
	createdAt: Date;
	updatedAt: Date;
}): DeviceResponse => ({
	deviceId: doc.deviceId,
	plan: typeof doc.plan === "string" ? doc.plan : "free",
	dailyUsageCount: doc.dailyUsageCount,
	dailyUsageDate: doc.dailyUsageDate,
	createdAt:
		doc.createdAt instanceof Date
			? doc.createdAt.toISOString()
			: new Date(doc.createdAt).toISOString(),
	updatedAt:
		doc.updatedAt instanceof Date
			? doc.updatedAt.toISOString()
			: new Date(doc.updatedAt).toISOString(),
});

export const deviceService = {
	ensureDeviceRecord,
	toDeviceResponse,
};
