import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";
import {
	createFridgeProduct,
	createFridgeProductsBatch,
	deleteFridgeProduct,
	fetchFridgeProducts,
} from "@/api/fridge-products";
import type { FridgeProductUnit } from "@/constants/fridge";
import { useDeviceId } from "@/context/device-id-context";
import { useRefetchOnForeground } from "@/hooks/use-refetch-on-foreground";
import type { FridgeProductListItem } from "@/interface/fridge-product";
import { syncExpirationNotifications } from "@/services/expiration-notifications";

interface AddFridgeProductInput {
	name: string;
	quantity?: number;
	unit?: FridgeProductUnit;
	expirationDate?: string;
	purchasedAt?: string;
	barcode?: string;
}

interface FridgeProductsContextValue {
	items: FridgeProductListItem[];
	isLoading: boolean;
	reload: () => Promise<void>;
	addProduct: (input: AddFridgeProductInput) => Promise<void>;
	addProducts: (inputs: AddFridgeProductInput[]) => Promise<void>;
	removeById: (id: string) => Promise<void>;
}

const FridgeProductsContext = createContext<
	FridgeProductsContextValue | undefined
>(undefined);

export const FridgeProductsProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const { deviceId } = useDeviceId();
	const [items, setItems] = useState<FridgeProductListItem[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const reload = useCallback(async () => {
		if (!deviceId) {
			setItems([]);
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const list = await fetchFridgeProducts(deviceId);
			setItems(list);
			void syncExpirationNotifications(list);
		} catch {
			setItems([]);
		} finally {
			setIsLoading(false);
		}
	}, [deviceId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	useRefetchOnForeground(() => {
		void reload();
	});

	const addProduct = useCallback(
		async (input: AddFridgeProductInput) => {
			if (!deviceId) return;
			const created = await createFridgeProduct({
				deviceId,
				name: input.name,
				quantity: input.quantity,
				unit: input.unit,
				expirationDate: input.expirationDate,
				purchasedAt: input.purchasedAt,
				barcode: input.barcode,
			});
			setItems((prev) => {
				const withoutCreated = prev.filter((item) => item.id !== created.id);
				const next = [created, ...withoutCreated];
				void syncExpirationNotifications(next);
				return next;
			});
		},
		[deviceId],
	);

	const addProducts = useCallback(
		async (inputs: AddFridgeProductInput[]) => {
			if (!deviceId || inputs.length === 0) return;

			const created = await createFridgeProductsBatch({
				deviceId,
				products: inputs.map((input) => ({
					name: input.name,
					quantity: input.quantity,
					unit: input.unit,
					expirationDate: input.expirationDate,
					purchasedAt: input.purchasedAt,
					barcode: input.barcode,
				})),
			});

			setItems((prev) => {
				const createdIds = new Set(created.map((item) => item.id));
				const withoutCreated = prev.filter((item) => !createdIds.has(item.id));
				const next = [...created, ...withoutCreated];
				void syncExpirationNotifications(next);
				return next;
			});
		},
		[deviceId],
	);

	const removeById = useCallback(
		async (id: string) => {
			if (!deviceId) return;
			await deleteFridgeProduct(deviceId, id);
			setItems((prev) => {
				const next = prev.filter((item) => item.id !== id);
				void syncExpirationNotifications(next);
				return next;
			});
		},
		[deviceId],
	);

	return (
		<FridgeProductsContext.Provider
			value={{
				items,
				isLoading,
				reload,
				addProduct,
				addProducts,
				removeById,
			}}
		>
			{children}
		</FridgeProductsContext.Provider>
	);
};

export const useFridgeProducts = (): FridgeProductsContextValue => {
	const ctx = useContext(FridgeProductsContext);
	if (ctx === undefined) {
		throw new Error(
			"useFridgeProducts must be used within FridgeProductsProvider",
		);
	}
	return ctx;
};
