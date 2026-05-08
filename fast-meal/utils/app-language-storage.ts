import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import type { AppLanguage } from "@/constants/settings";

const STORAGE_KEY = "@fast-meal/app-language";

const readFromWeb = (): AppLanguage | null => {
	try {
		if (typeof globalThis.localStorage === "undefined") return null;
		const value = globalThis.localStorage.getItem(STORAGE_KEY);
		return value === "en" || value === "hr" ? value : null;
	} catch {
		return null;
	}
};

const writeToWeb = (lng: AppLanguage): void => {
	try {
		if (typeof globalThis.localStorage === "undefined") return;
		globalThis.localStorage.setItem(STORAGE_KEY, lng);
	} catch {
		/* private mode / unavailable */
	}
};

export const getStoredAppLanguage = async (): Promise<AppLanguage | null> => {
	if (Platform.OS === "web") {
		return readFromWeb();
	}
	try {
		const value = await AsyncStorage.getItem(STORAGE_KEY);
		return value === "en" || value === "hr" ? value : null;
	} catch {
		return null;
	}
};

export const setStoredAppLanguage = async (lng: AppLanguage): Promise<void> => {
	if (Platform.OS === "web") {
		writeToWeb(lng);
		return;
	}
	try {
		await AsyncStorage.setItem(STORAGE_KEY, lng);
	} catch {
		/* native module missing (e.g. misconfigured build) — in-memory language still applies */
	}
};
