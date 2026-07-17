import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import {
	fetchHouseholdInfo,
	joinHousehold as joinHouseholdApi,
	leaveHousehold as leaveHouseholdApi,
} from "@/api/households";
import { useDeviceId } from "@/context/device-id-context";
import type { HouseholdInfo } from "@/interface/household";

const ONE_MEMBER = 1;

interface HouseholdContextValue {
	inviteCode: string | null;
	memberCount: number;
	isLoading: boolean;
	isShared: boolean;
	reload: () => Promise<void>;
	joinHousehold: (inviteCode: string) => Promise<HouseholdInfo>;
	leaveHousehold: () => Promise<HouseholdInfo>;
}

const HouseholdContext = createContext<HouseholdContextValue | undefined>(
	undefined,
);

export const HouseholdProvider = ({ children }: { children: ReactNode }) => {
	const { deviceId } = useDeviceId();
	const [info, setInfo] = useState<HouseholdInfo | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const reload = useCallback(async () => {
		if (!deviceId) {
			setInfo(null);
			setIsLoading(false);
			return;
		}

		setIsLoading(true);
		try {
			const household = await fetchHouseholdInfo(deviceId);
			setInfo(household);
		} catch {
			setInfo(null);
		} finally {
			setIsLoading(false);
		}
	}, [deviceId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	const joinHousehold = useCallback(
		async (inviteCode: string) => {
			if (!deviceId) {
				throw new Error("Device ID is not ready");
			}
			const household = await joinHouseholdApi(deviceId, inviteCode);
			setInfo(household);
			return household;
		},
		[deviceId],
	);

	const leaveHousehold = useCallback(async () => {
		if (!deviceId) {
			throw new Error("Device ID is not ready");
		}
		const household = await leaveHouseholdApi(deviceId);
		setInfo(household);
		return household;
	}, [deviceId]);

	return (
		<HouseholdContext.Provider
			value={{
				inviteCode: info?.inviteCode ?? null,
				memberCount: info?.memberCount ?? ONE_MEMBER,
				isLoading,
				isShared: (info?.memberCount ?? ONE_MEMBER) > ONE_MEMBER,
				reload,
				joinHousehold,
				leaveHousehold,
			}}
		>
			{children}
		</HouseholdContext.Provider>
	);
};

export const useHousehold = (): HouseholdContextValue => {
	const ctx = useContext(HouseholdContext);
	if (ctx === undefined) {
		throw new Error("useHousehold must be used within HouseholdProvider");
	}
	return ctx;
};
