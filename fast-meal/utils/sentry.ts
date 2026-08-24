import * as Sentry from "@sentry/react-native";
import Constants from "expo-constants";

export const ANALYTICS_EVENTS = {
	recipeGenerateRequested: "recipe_generate_requested",
	recipeGenerateSuccess: "recipe_generate_success",
	recipeGenerateError: "recipe_generate_error",
	fridgeImageAttached: "fridge_image_attached",
	recipeSaved: "recipe_saved",
	householdJoined: "household_joined",
	barcodeScanned: "barcode_scanned",
	barcodeLookupMiss: "barcode_lookup_miss",
	fridgeProductsBatchAdded: "fridge_products_batch_added",
	barcodeDetailsOpened: "barcode_details_opened",
} as const;

export type AnalyticsEventName =
	(typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

type SafeEventProps = Record<string, string | number | boolean | undefined>;

const toAttributes = (
	props?: SafeEventProps,
): Record<string, string | number | boolean> => {
	if (!props) return {};
	const attributes: Record<string, string | number | boolean> = {};
	for (const [key, value] of Object.entries(props)) {
		if (value === undefined) continue;
		attributes[key] = value;
	}
	return attributes;
};

export const initSentry = (): void => {
	const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
	if (!dsn) return;

	const appVersion =
		Constants.expoConfig?.version ?? Constants.nativeAppVersion ?? "unknown";

	Sentry.init({
		dsn,
		enabled: !__DEV__,
		sendDefaultPii: false,
		enableLogs: true,
		tracesSampleRate: 0.1,
		environment: __DEV__ ? "development" : "production",
		release: `fastmeal@${appVersion}`,
		beforeSend(event) {
			if (event.request) {
				delete event.request.data;
				delete event.request.cookies;
			}
			return event;
		},
	});

	Sentry.setTag("appVersion", appVersion);
};

export const setSentryDeviceId = (deviceId: string): void => {
	Sentry.setUser({ id: deviceId });
};

export const captureAppException = (
	error: unknown,
	context?: SafeEventProps,
): void => {
	Sentry.withScope((scope) => {
		for (const [key, value] of Object.entries(toAttributes(context))) {
			scope.setTag(key, String(value));
		}
		Sentry.captureException(error);
	});
};

export const trackProductEvent = (
	name: AnalyticsEventName,
	props?: SafeEventProps,
): void => {
	const attributes = toAttributes(props);

	Sentry.addBreadcrumb({
		category: "analytics",
		message: name,
		level: "info",
		data: attributes,
	});

	Sentry.logger.info(name, attributes);
	Sentry.metrics.count(name, 1, { attributes });
};

export { Sentry };
