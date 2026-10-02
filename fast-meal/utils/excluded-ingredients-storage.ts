import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const STORAGE_KEY = "@fast-meal/excluded-ingredients";

export const normalizeExcludedIngredients = (
	values: readonly string[],
): string[] => {
	const seen = new Set<string>();
	const result: string[] = [];

	for (const value of values) {
		const trimmed = value.trim();
		if (!trimmed) continue;
		const key = trimmed.toLowerCase();
		if (seen.has(key)) continue;
		seen.add(key);
		result.push(trimmed);
	}

	return result;
};

const parseStoredList = (raw: string | null): string[] | null => {
	if (!raw) return null;
	try {
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return null;
		if (!parsed.every((item) => typeof item === "string")) return null;
		return normalizeExcludedIngredients(parsed);
	} catch {
		return null;
	}
};

const readFromWeb = (): string[] | null => {
	try {
		if (typeof globalThis.localStorage === "undefined") return null;
		return parseStoredList(globalThis.localStorage.getItem(STORAGE_KEY));
	} catch {
		return null;
	}
};

const writeToWeb = (values: string[]): void => {
	try {
		if (typeof globalThis.localStorage === "undefined") return;
		globalThis.localStorage.setItem(STORAGE_KEY, JSON.stringify(values));
	} catch {
		/* private mode / unavailable */
	}
};

export const getStoredExcludedIngredients = async (): Promise<
	string[] | null
> => {
	if (Platform.OS === "web") {
		return readFromWeb();
	}
	try {
		const value = await AsyncStorage.getItem(STORAGE_KEY);
		return parseStoredList(value);
	} catch {
		return null;
	}
};

export const setStoredExcludedIngredients = async (
	values: readonly string[],
): Promise<void> => {
	const normalized = normalizeExcludedIngredients(values);
	if (Platform.OS === "web") {
		writeToWeb(normalized);
		return;
	}
	try {
		await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
	} catch {
		/* native module missing — in-memory list still applies */
	}
};
