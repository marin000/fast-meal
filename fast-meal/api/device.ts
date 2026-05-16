import type { DeviceResponse } from "@/interface/device";
import { formatApiErrorBody } from "@/utils/api-error-text";

const apiEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/devices`;

export class DailyLimitError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "DailyLimitError";
	}
}

export const fetchRemainingGenerations = async (
	deviceId: string,
): Promise<number> => {
	const response = await fetch(apiEndpoint, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deviceId }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to load device quota (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	const data = (await response.json()) as DeviceResponse;
	return typeof data.dailyUsageCount === "number" ? data.dailyUsageCount : 0;
};
