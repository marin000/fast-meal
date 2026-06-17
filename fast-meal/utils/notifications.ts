import Constants from "expo-constants";
import { Platform } from "react-native";

import { EXPIRATION_NOTIFICATION_HOUR, isTestExpirationNotificationsEnabled, TEST_NOTIFICATION_DELAY_MS } from "@/constants/notifications";
import { getDaysUntilExpiration, startOfLocalDay } from "./date";

type NotificationsModule = typeof import("expo-notifications");

let notificationsModule: NotificationsModule | null | undefined;

export const isNotificationsAvailable = (): boolean => {
	if (Platform.OS === "web") return false;
	// expo-notifications is not supported in Expo Go (SDK 53+). Use a dev build.
	return Constants.appOwnership !== "expo";
};

export const getNotificationsModule = (): NotificationsModule | null => {
	if (!isNotificationsAvailable()) return null;

	if (notificationsModule === undefined) {
		try {
			notificationsModule =
				require("expo-notifications") as NotificationsModule;
		} catch {
			notificationsModule = null;
		}
	}

	return notificationsModule;
};

export const getExpirationNotificationTrigger = (
	expirationIso: string,
): Date | null => {
	const daysUntil = getDaysUntilExpiration(expirationIso);
	if (daysUntil === null) return null;

	if (isTestExpirationNotificationsEnabled()) {
		return new Date(Date.now() + TEST_NOTIFICATION_DELAY_MS);
	}

	if (daysUntil < 0) return null;

	const expiration = new Date(expirationIso);
	const trigger = startOfLocalDay(expiration);
	trigger.setHours(EXPIRATION_NOTIFICATION_HOUR, 0, 0, 0);

	const now = new Date();

	if (daysUntil === 0) {
		if (trigger.getTime() > now.getTime()) return trigger;
		return new Date(now.getTime() + 5 * 60 * 1000);
	}

	if (trigger.getTime() <= now.getTime()) return null;
	return trigger;
};
