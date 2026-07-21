import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import type { IngredientImagePayload } from "@/constants/ingredient-image";

interface HomeIngredientImageContextValue {
	image: IngredientImagePayload | null;
	setImage: (image: IngredientImagePayload | null) => void;
	clearImage: () => void;
}

const HomeIngredientImageContext =
	createContext<HomeIngredientImageContextValue | null>(null);

export const HomeIngredientImageProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [image, setImage] = useState<IngredientImagePayload | null>(null);

	const clearImage = useCallback(() => {
		setImage(null);
	}, []);

	const value = useMemo(
		() => ({
			image,
			setImage,
			clearImage,
		}),
		[image, clearImage],
	);

	return (
		<HomeIngredientImageContext.Provider value={value}>
			{children}
		</HomeIngredientImageContext.Provider>
	);
};

export const useHomeIngredientImage = (): HomeIngredientImageContextValue => {
	const context = useContext(HomeIngredientImageContext);
	if (!context) {
		throw new Error(
			"useHomeIngredientImage must be used within HomeIngredientImageProvider",
		);
	}
	return context;
};
