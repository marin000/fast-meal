import mongoose, { Schema } from "mongoose";

const deviceSchema = new Schema(
	{
		deviceId: { type: String, required: true, unique: true, index: true },
		householdId: { type: String, index: true },
		plan: { type: String, default: "free" },
		dailyUsageCount: { type: Number, default: 2 },
		dailyUsageDate: { type: String, default: "" },
	},
	{ timestamps: true, collection: "devices" },
);

export const Device =
	mongoose.models.Device ?? mongoose.model("Device", deviceSchema);
