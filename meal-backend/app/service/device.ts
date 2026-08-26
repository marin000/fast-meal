import {
	DAILY_FREE_GENERATION_ALLOWANCE,
	DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
	isDailyGenerationLimitDisabled,
	isDailyReceiptScanLimitDisabled,
} from "@/app/constants/device";
import type { DeviceResponse } from "@/app/interface";
import { householdService } from "@/app/service/household";
import { Device } from "@/models";

const getTodayUtcYmd = (): string => new Date().toISOString().slice(0, 10);

export async function ensureDeviceRecord(deviceId: string): Promise<void> {
	await Device.findOneAndUpdate(
		{ deviceId },
		{
			$setOnInsert: {
				deviceId,
				plan: "free",
				dailyUsageCount: DAILY_FREE_GENERATION_ALLOWANCE,
				dailyUsageDate: "",
				receiptScanUsageCount: DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
				receiptScanUsageDate: "",
			},
		},
		{ upsert: true },
	);
	await householdService.ensureDeviceHousehold(deviceId);
}

const remainingFromDoc = (doc: {
	dailyUsageCount: number;
	dailyUsageDate: string;
}): number => {
	const today = getTodayUtcYmd();
	if (doc.dailyUsageDate !== today) {
		return DAILY_FREE_GENERATION_ALLOWANCE;
	}
	return doc.dailyUsageCount;
};

const remainingReceiptScansFromDoc = (doc: {
	receiptScanUsageCount?: number;
	receiptScanUsageDate?: string;
}): number => {
	const today = getTodayUtcYmd();
	if (doc.receiptScanUsageDate !== today) {
		return DAILY_FREE_RECEIPT_SCAN_ALLOWANCE;
	}
	return typeof doc.receiptScanUsageCount === "number"
		? doc.receiptScanUsageCount
		: DAILY_FREE_RECEIPT_SCAN_ALLOWANCE;
};

export async function getRemainingGenerationsToday(
	deviceId: string,
): Promise<number> {
	if (isDailyGenerationLimitDisabled()) return DAILY_FREE_GENERATION_ALLOWANCE;

	await ensureDeviceRecord(deviceId);
	const doc = await Device.findOne({ deviceId }).lean();
	if (!doc) return 0;
	return remainingFromDoc(doc);
}

export async function getRemainingReceiptScansToday(
	deviceId: string,
): Promise<number> {
	if (isDailyReceiptScanLimitDisabled()) {
		return DAILY_FREE_RECEIPT_SCAN_ALLOWANCE;
	}

	await ensureDeviceRecord(deviceId);
	const doc = await Device.findOne({ deviceId }).lean();
	if (!doc) return 0;
	return remainingReceiptScansFromDoc(doc);
}

/**
 * Decrements remaining generations for today by one. Returns false if none left.
 * Uses an atomic pipeline update so concurrent requests cannot overspend.
 */
export async function tryConsumeGeneration(deviceId: string): Promise<boolean> {
	if (isDailyGenerationLimitDisabled()) return true;

	await ensureDeviceRecord(deviceId);
	const today = getTodayUtcYmd();

	const updated = await Device.findOneAndUpdate(
		{
			deviceId,
			$or: [
				{ dailyUsageDate: { $ne: today } },
				{ dailyUsageCount: { $gt: 0 } },
			],
		},
		[
			{
				$set: {
					dailyUsageDate: today,
					dailyUsageCount: {
						$max: [
							0,
							{
								$subtract: [
									{
										$cond: [
											{ $eq: ["$dailyUsageDate", today] },
											"$dailyUsageCount",
											DAILY_FREE_GENERATION_ALLOWANCE,
										],
									},
									1,
								],
							},
						],
					},
				},
			},
		],
		{ new: true, updatePipeline: true },
	).lean();

	return updated !== null;
}

/**
 * Decrements remaining receipt scans for today by one. Returns false if none left.
 */
export async function tryConsumeReceiptScan(
	deviceId: string,
): Promise<boolean> {
	if (isDailyReceiptScanLimitDisabled()) return true;

	await ensureDeviceRecord(deviceId);
	const today = getTodayUtcYmd();

	const updated = await Device.findOneAndUpdate(
		{
			deviceId,
			$or: [
				{ receiptScanUsageDate: { $ne: today } },
				{ receiptScanUsageCount: { $gt: 0 } },
				{ receiptScanUsageCount: { $exists: false } },
			],
		},
		[
			{
				$set: {
					receiptScanUsageDate: today,
					receiptScanUsageCount: {
						$max: [
							0,
							{
								$subtract: [
									{
										$cond: [
											{ $eq: ["$receiptScanUsageDate", today] },
											{
												$ifNull: [
													"$receiptScanUsageCount",
													DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
												],
											},
											DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
										],
									},
									1,
								],
							},
						],
					},
				},
			},
		],
		{ new: true, updatePipeline: true },
	).lean();

	return updated !== null;
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
	dailyUsageCount: remainingFromDoc(doc),
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
	DAILY_FREE_GENERATION_ALLOWANCE,
	DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
	ensureDeviceRecord,
	getRemainingGenerationsToday,
	getRemainingReceiptScansToday,
	tryConsumeGeneration,
	tryConsumeReceiptScan,
	toDeviceResponse,
};
