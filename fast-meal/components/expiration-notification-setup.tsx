import { type Href, useRouter } from "expo-router";
import { useEffect } from "react";
import { AppState, type AppStateStatus } from "react-native";

import { useFridgeProducts } from "@/context/fridge-products-context";
import { syncExpirationNotifications } from "@/services/expiration-notifications";
import {
	getNotificationsModule,
	isNotificationsAvailable,
} from "@/utils/notifications";

export const ExpirationNotificationSetup = () => {
	const router = useRouter();
	const { items } = useFridgeProducts();

	useEffect(() => {
		if (!isNotificationsAvailable()) return;

		const Notifications = getNotificationsModule();
		if (!Notifications) return;

		const subscription = Notifications.addNotificationResponseReceivedListener(
			() => {
				router.navigate("/fridge" as Href);
			},
		);

		return () => subscription.remove();
	}, [router]);

	useEffect(() => {
		if (!isNotificationsAvailable()) return;
		void syncExpirationNotifications(items);
	}, [items]);

	useEffect(() => {
		if (!isNotificationsAvailable()) return;

		const handleAppStateChange = (nextState: AppStateStatus) => {
			if (nextState === "active") {
				void syncExpirationNotifications(items);
			}
		};

		const subscription = AppState.addEventListener(
			"change",
			handleAppStateChange,
		);
		return () => subscription.remove();
	}, [items]);

	return null;
};
