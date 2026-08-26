import mongoose, { Schema } from "mongoose";
import {
	DAILY_FREE_GENERATION_ALLOWANCE,
	DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
} from "../app/constants/device";

const deviceSchema = new Schema(
	{
		deviceId: { type: String, required: true, unique: true, index: true },
		householdId: { type: String, index: true },
		plan: { type: String, default: "free" },
		dailyUsageCount: { type: Number, default: DAILY_FREE_GENERATION_ALLOWANCE },
		dailyUsageDate: { type: String, default: "" },
		receiptScanUsageCount: {
			type: Number,
			default: DAILY_FREE_RECEIPT_SCAN_ALLOWANCE,
		},
		receiptScanUsageDate: { type: String, default: "" },
	},
	{ timestamps: true, collection: "devices" },
);

export const Device =
	mongoose.models.Device ?? mongoose.model("Device", deviceSchema);
