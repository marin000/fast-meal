import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

export const useRefetchOnForeground = (refetch: () => void): void => {
	useEffect(() => {
		const handleAppStateChange = (nextState: AppStateStatus) => {
			if (nextState === "active") {
				refetch();
			}
		};

		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange,
		);

		return () => {
			subscription.remove();
		};
	}, [refetch]);
};
