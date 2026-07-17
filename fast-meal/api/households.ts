import type { HouseholdInfo } from "@/interface/household";
import { formatApiErrorBody } from "@/utils/api-error-text";

const householdsEndpoint = `${process.env.EXPO_PUBLIC_API_BASE_URL}/api/households`;

export const fetchHouseholdInfo = async (
	deviceId: string,
): Promise<HouseholdInfo> => {
	const params = new URLSearchParams({ deviceId });
	const response = await fetch(`${householdsEndpoint}?${params.toString()}`, {
		method: "GET",
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Failed to load household (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as HouseholdInfo;
};

export const joinHousehold = async (
	deviceId: string,
	inviteCode: string,
): Promise<HouseholdInfo> => {
	const response = await fetch(`${householdsEndpoint}/join`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deviceId, inviteCode }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Join household failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as HouseholdInfo;
};

export const leaveHousehold = async (
	deviceId: string,
): Promise<HouseholdInfo> => {
	const response = await fetch(`${householdsEndpoint}/leave`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ deviceId }),
	});

	if (!response.ok) {
		const text = await response.text();
		throw new Error(
			`Leave household failed (${response.status}): ${formatApiErrorBody(response.status, text)}`,
		);
	}

	return (await response.json()) as HouseholdInfo;
};
