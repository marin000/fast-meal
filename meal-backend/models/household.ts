import mongoose, { Schema } from "mongoose";

const householdSchema = new Schema(
	{
		householdId: { type: String, required: true, unique: true, index: true },
		inviteCode: { type: String, required: true, unique: true, index: true },
		createdByDeviceId: { type: String, required: true, index: true },
	},
	{ timestamps: true, collection: "households" },
);

export const Household =
	mongoose.models.Household ?? mongoose.model("Household", householdSchema);
