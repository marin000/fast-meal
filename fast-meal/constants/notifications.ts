export const EXPIRATION_NOTIFICATION_HOUR = 9;
export const EXPIRATION_NOTIFICATION_ID_PREFIX = "fridge-expiration-";
export const PERMISSION_ASKED_KEY =
	"@fast-meal/expiration-notification-permission-asked";
export const ANDROID_CHANNEL_ID = "expiration-reminders";

export const getExpirationNotificationIdentifier = (
	productId: string,
): string => `${EXPIRATION_NOTIFICATION_ID_PREFIX}${productId}`;
