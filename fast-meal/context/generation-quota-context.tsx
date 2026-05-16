import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

import { fetchRemainingGenerations } from "@/api/device";
import { useDeviceId } from "@/context/device-id-context";

interface GenerationQuotaContextValue {
	remainingGenerations: number | null;
	isLoading: boolean;
	refreshQuota: () => Promise<void>;
}

const GenerationQuotaContext = createContext<
	GenerationQuotaContextValue | undefined
>(undefined);

export const GenerationQuotaProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { deviceId } = useDeviceId();
	const [remainingGenerations, setRemainingGenerations] = useState<
		number | null
	>(null);
	const [isLoading, setIsLoading] = useState(false);

	const refreshQuota = useCallback(async () => {
		if (!deviceId) {
			setRemainingGenerations(null);
			return;
		}

		setIsLoading(true);
		try {
			const remaining = await fetchRemainingGenerations(deviceId);
			setRemainingGenerations(remaining);
		} catch {
			setRemainingGenerations(null);
		} finally {
			setIsLoading(false);
		}
	}, [deviceId]);

	useEffect(() => {
		void refreshQuota();
	}, [refreshQuota]);

	return (
		<GenerationQuotaContext.Provider
			value={{ remainingGenerations, isLoading, refreshQuota }}
		>
			{children}
		</GenerationQuotaContext.Provider>
	);
};

export const useGenerationQuota = (): GenerationQuotaContextValue => {
	const ctx = useContext(GenerationQuotaContext);
	if (ctx === undefined) {
		throw new Error(
			"useGenerationQuota must be used within GenerationQuotaProvider",
		);
	}
	return ctx;
};
