import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useMemo,
	useState,
} from "react";

import { mergeIngredientNames } from "@/utils/helper";

interface HomeIngredientsContextValue {
	ingredients: string;
	setIngredients: (value: string) => void;
	appendIngredients: (names: string[]) => void;
}

const HomeIngredientsContext =
	createContext<HomeIngredientsContextValue | null>(null);

export const HomeIngredientsProvider = ({
	children,
}: {
	children: ReactNode;
}) => {
	const [ingredients, setIngredients] = useState("");

	const appendIngredients = useCallback((names: string[]) => {
		setIngredients((previous) => mergeIngredientNames(previous, names));
	}, []);

	const value = useMemo(
		() => ({
			ingredients,
			setIngredients,
			appendIngredients,
		}),
		[ingredients, appendIngredients],
	);

	return (
		<HomeIngredientsContext.Provider value={value}>
			{children}
		</HomeIngredientsContext.Provider>
	);
};

export const useHomeIngredients = (): HomeIngredientsContextValue => {
	const context = useContext(HomeIngredientsContext);
	if (!context) {
		throw new Error(
			"useHomeIngredients must be used within HomeIngredientsProvider",
		);
	}
	return context;
};
