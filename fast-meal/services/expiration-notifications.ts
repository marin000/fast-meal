import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import {
	ANDROID_CHANNEL_ID,
	EXPIRATION_NOTIFICATION_ID_PREFIX,
	getExpirationNotificationIdentifier,
	PERMISSION_ASKED_KEY,
} from "@/constants/notifications";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import {
	getExpirationNotificationTrigger,
	getNotificationsModule,
} from "@/utils/notifications";
import i18n from "../  i18n";

let handlerConfigured = false;
let androidChannelConfigured = false;

const configureNotificationHandler = () => {
	const Notifications = getNotificationsModule();
	if (!Notifications || handlerConfigured) return;
	handlerConfigured = true;

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: true,
			shouldSetBadge: false,
			shouldShowBanner: true,
			shouldShowList: true,
		}),
	});
};

const configureAndroidChannel = async () => {
	const Notifications = getNotificationsModule();
	if (!Notifications || androidChannelConfigured || Platform.OS !== "android") {
		return;
	}
	androidChannelConfigured = true;

	await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
		name: "Expiration reminders",
		importance: Notifications.AndroidImportance.DEFAULT,
	});
};

const hasNotificationPermission = async (): Promise<boolean> => {
	const Notifications = getNotificationsModule();
	if (!Notifications) return false;

	const { status } = await Notifications.getPermissionsAsync();
	return status === "granted";
};

export const requestExpirationNotificationPermission =
	async (): Promise<boolean> => {
		const Notifications = getNotificationsModule();
		if (!Notifications) return false;

		configureNotificationHandler();
		await configureAndroidChannel();

		const { status: existing } = await Notifications.getPermissionsAsync();
		if (existing === "granted") return true;

		const { status } = await Notifications.requestPermissionsAsync();
		return status === "granted";
	};

export const ensureExpirationNotificationPermission =
	async (): Promise<boolean> => {
		if (!getNotificationsModule()) return false;

		const alreadyAsked = await AsyncStorage.getItem(PERMISSION_ASKED_KEY);
		if (alreadyAsked) return hasNotificationPermission();

		await AsyncStorage.setItem(PERMISSION_ASKED_KEY, "true");
		return requestExpirationNotificationPermission();
	};

const cancelFridgeExpirationNotifications = async (): Promise<void> => {
	const Notifications = getNotificationsModule();
	if (!Notifications) return;

	const scheduled = await Notifications.getAllScheduledNotificationsAsync();

	await Promise.all(
		scheduled
			.filter((notification) =>
				notification.identifier.startsWith(EXPIRATION_NOTIFICATION_ID_PREFIX),
			)
			.map((notification) =>
				Notifications.cancelScheduledNotificationAsync(notification.identifier),
			),
	);
};

const buildNotificationContent = (productName: string) => {
	const Notifications = getNotificationsModule();
	return {
		title: i18n.t("notifications.expirationTitle"),
		body: i18n.t("notifications.expirationBody", { name: productName }),
		data: { screen: "fridge" },
		...(Platform.OS === "android" && Notifications
			? { channelId: ANDROID_CHANNEL_ID }
			: {}),
	};
};

export const syncExpirationNotifications = async (
	products: FridgeProductListItem[],
): Promise<void> => {
	const Notifications = getNotificationsModule();
	if (!Notifications) return;

	configureNotificationHandler();
	await configureAndroidChannel();

	if (!(await hasNotificationPermission())) return;

	await cancelFridgeExpirationNotifications();

	for (const product of products) {
		if (!product.expirationDate) continue;

		const triggerDate = getExpirationNotificationTrigger(
			product.expirationDate,
		);
		if (!triggerDate) continue;

		await Notifications.scheduleNotificationAsync({
			identifier: getExpirationNotificationIdentifier(product.id),
			content: buildNotificationContent(product.name),
			trigger: {
				type: Notifications.SchedulableTriggerInputTypes.DATE,
				date: triggerDate,
			},
		});
	}
};
