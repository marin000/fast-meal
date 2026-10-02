import * as Localization from "expo-localization";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

import type { QuickFilterOption } from "@/constants/home";
import {
	type AppLanguage,
	MAX_EXCLUDED_INGREDIENTS,
} from "@/constants/settings";
import {
	getStoredAppLanguage,
	setStoredAppLanguage,
} from "@/utils/app-language-storage";
import {
	getStoredExcludedIngredients,
	setStoredExcludedIngredients,
} from "@/utils/excluded-ingredients-storage";

import i18n from "../  i18n";

type DietaryStyle = "all" | "veggie" | "vegan";
type DisplayUnits = "metric" | "imperial";

const deviceDefaultLanguage = (): AppLanguage => {
	const code = Localization.getLocales()[0]?.languageCode;
	return code === "hr" ? "hr" : "en";
};

interface PreferencesContextValue {
	dietaryStyle: DietaryStyle;
	setDietaryStyle: (value: DietaryStyle) => void;
	glutenFree: boolean;
	setGlutenFree: (value: boolean) => void;
	gymMode: boolean;
	setGymMode: (value: boolean) => void;
	darkMode: boolean;
	setDarkMode: (value: boolean) => void;
	units: DisplayUnits;
	setUnits: (value: DisplayUnits) => void;
	language: AppLanguage;
	setLanguage: (value: AppLanguage) => void;
	excludedIngredients: string[];
	addExcludedIngredient: (name: string) => boolean;
	removeExcludedIngredient: (name: string) => void;
	lockedQuickFilters: QuickFilterOption[];
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

const deriveLockedQuickFilters = (
	dietaryStyle: DietaryStyle,
	glutenFree: boolean,
	gymMode: boolean,
): QuickFilterOption[] => {
	const lockedFilters = new Set<QuickFilterOption>();

	if (dietaryStyle === "veggie") lockedFilters.add("vegetarian");
	if (dietaryStyle === "vegan") lockedFilters.add("vegan");
	if (glutenFree) lockedFilters.add("glutenFree");
	if (gymMode) lockedFilters.add("highProtein");

	return [...lockedFilters];
};

export const PreferencesProvider = ({ children }: { children: ReactNode }) => {
	const [dietaryStyle, setDietaryStyle] = useState<DietaryStyle>("all");
	const [glutenFree, setGlutenFree] = useState(false);
	const [gymMode, setGymMode] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const [units, setUnits] = useState<DisplayUnits>("metric");
	const [language, setLanguageState] = useState<AppLanguage>(
		deviceDefaultLanguage,
	);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

	useEffect(() => {
		let cancelled = false;

		void (async () => {
			const [storedLanguage, storedExcluded] = await Promise.all([
				getStoredAppLanguage(),
				getStoredExcludedIngredients(),
			]);
			if (cancelled) return;
			if (storedLanguage) {
				setLanguageState(storedLanguage);
				await i18n.changeLanguage(storedLanguage);
			}
			if (storedExcluded) {
				setExcludedIngredients(storedExcluded);
			}
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const setLanguage = useCallback((lng: AppLanguage) => {
		setLanguageState(lng);
		void i18n.changeLanguage(lng);
		void setStoredAppLanguage(lng);
	}, []);

	const addExcludedIngredient = useCallback((name: string): boolean => {
		const trimmed = name.trim();
		if (!trimmed) return false;

		let didAdd = false;
		setExcludedIngredients((current) => {
			if (current.length >= MAX_EXCLUDED_INGREDIENTS) return current;

			const alreadyExists = current.some(
				(item) => item.toLowerCase() === trimmed.toLowerCase(),
			);
			if (alreadyExists) {
				return current;
			}
			const next = [...current, trimmed];
			didAdd = true;
			void setStoredExcludedIngredients(next);
			return next;
		});
		return didAdd;
	}, []);

	const removeExcludedIngredient = useCallback((name: string) => {
		const key = name.trim().toLowerCase();
		if (!key) return;
		setExcludedIngredients((current) => {
			const next = current.filter((item) => item.toLowerCase() !== key);
			if (next.length === current.length) return current;

			void setStoredExcludedIngredients(next);
			return next;
		});
	}, []);

	const lockedQuickFilters = useMemo(
		() => deriveLockedQuickFilters(dietaryStyle, glutenFree, gymMode),
		[dietaryStyle, glutenFree, gymMode],
	);

	const contextValue = useMemo(
		() => ({
			dietaryStyle,
			setDietaryStyle,
			glutenFree,
			setGlutenFree,
			gymMode,
			setGymMode,
			darkMode,
			setDarkMode,
			units,
			setUnits,
			language,
			setLanguage,
			excludedIngredients,
			addExcludedIngredient,
			removeExcludedIngredient,
			lockedQuickFilters,
		}),
		[
			dietaryStyle,
			glutenFree,
			gymMode,
			darkMode,
			units,
			language,
			setLanguage,
			excludedIngredients,
			addExcludedIngredient,
			removeExcludedIngredient,
			lockedQuickFilters,
		],
	);

	return (
		<PreferencesContext.Provider value={contextValue}>
			{children}
		</PreferencesContext.Provider>
	);
};

export const usePreferences = () => {
	const context = useContext(PreferencesContext);

	if (!context) {
		throw new Error("usePreferences must be used within PreferencesProvider");
	}

	return context;
};
