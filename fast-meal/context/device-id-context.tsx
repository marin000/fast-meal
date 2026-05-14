import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";

import { getOrCreateDeviceId } from "@/utils/device-id";

interface DeviceIdContextValue {
	deviceId: string | null;
}

const DeviceIdContext = createContext<DeviceIdContextValue | undefined>(
	undefined,
);

export const DeviceIdProvider = ({ children }: { children: ReactNode }) => {
	const [deviceId, setDeviceId] = useState<string | null>(null);

	useEffect(() => {
		void getOrCreateDeviceId().then(setDeviceId);
	}, []);

	return (
		<DeviceIdContext.Provider value={{ deviceId }}>
			{children}
		</DeviceIdContext.Provider>
	);
};

export const useDeviceId = (): DeviceIdContextValue => {
	const ctx = useContext(DeviceIdContext);
	if (ctx === undefined) {
		throw new Error("useDeviceId must be used within DeviceIdProvider");
	}
	return ctx;
};
