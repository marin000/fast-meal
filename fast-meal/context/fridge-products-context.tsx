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
	deleteFridgeProduct,
	fetchFridgeProducts,
} from "@/api/fridge-products";
import { useDeviceId } from "@/context/device-id-context";
import type { FridgeProductListItem } from "@/interface/fridge-product";

interface AddFridgeProductInput {
	name: string;
	expirationDate?: string;
	purchasedAt?: string;
}

interface FridgeProductsContextValue {
	items: FridgeProductListItem[];
	isLoading: boolean;
	reload: () => Promise<void>;
	addProduct: (input: AddFridgeProductInput) => Promise<void>;
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
		} catch {
			setItems([]);
		} finally {
			setIsLoading(false);
		}
	}, [deviceId]);

	useEffect(() => {
		void reload();
	}, [reload]);

	const addProduct = useCallback(
		async (input: AddFridgeProductInput) => {
			if (!deviceId) return;
			const created = await createFridgeProduct({
				deviceId,
				name: input.name,
				expirationDate: input.expirationDate,
				purchasedAt: input.purchasedAt,
			});
			setItems((prev) => [created, ...prev]);
		},
		[deviceId],
	);

	const removeById = useCallback(
		async (id: string) => {
			if (!deviceId) return;
			await deleteFridgeProduct(deviceId, id);
			setItems((prev) => prev.filter((item) => item.id !== id));
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
