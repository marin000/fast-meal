import type { ReactNode } from "react";
import { useEffect } from "react";
import {
	initialWindowMetrics,
	SafeAreaProvider,
} from "react-native-safe-area-context";

import {
	DeviceIdProvider,
	FeedbackMessageProvider,
	FridgeProductsProvider,
	GenerationQuotaProvider,
	HomeIngredientImageProvider,
	HomeIngredientsProvider,
	HouseholdProvider,
	PreferencesProvider,
	ShoppingListProvider,
	useDeviceId,
} from "@/context";
import { setSentryDeviceId } from "@/utils/sentry";

const SentryDeviceContext = () => {
	const { deviceId } = useDeviceId();

	useEffect(() => {
		if (deviceId) {
			setSentryDeviceId(deviceId);
		}
	}, [deviceId]);

	return null;
};

export const RootProviders = ({ children }: { children: ReactNode }) => {
	return (
		<SafeAreaProvider initialMetrics={initialWindowMetrics}>
			<PreferencesProvider>
				<DeviceIdProvider>
					<SentryDeviceContext />
					<HouseholdProvider>
						<GenerationQuotaProvider>
							<FridgeProductsProvider>
								<HomeIngredientsProvider>
									<HomeIngredientImageProvider>
										<ShoppingListProvider>
											<FeedbackMessageProvider>
												{children}
											</FeedbackMessageProvider>
										</ShoppingListProvider>
									</HomeIngredientImageProvider>
								</HomeIngredientsProvider>
							</FridgeProductsProvider>
						</GenerationQuotaProvider>
					</HouseholdProvider>
				</DeviceIdProvider>
			</PreferencesProvider>
		</SafeAreaProvider>
	);
};
