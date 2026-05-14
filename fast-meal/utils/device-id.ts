import { STORAGE_KEY } from "@/constants/device";

const createDeviceId = (): string =>
	globalThis.crypto?.randomUUID?.() ??
	`fm-${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

let inMemoryDeviceId: string | null = null;

export const getOrCreateDeviceId = async (): Promise<string> => {
	if (inMemoryDeviceId) return inMemoryDeviceId;

	try {
		const { default: AsyncStorage } = await import(
			"@react-native-async-storage/async-storage"
		);

		const existing = await AsyncStorage.getItem(STORAGE_KEY);
		if (existing && existing.trim().length > 0) {
			inMemoryDeviceId = existing.trim();
			return inMemoryDeviceId;
		}

		inMemoryDeviceId = createDeviceId();
		await AsyncStorage.setItem(STORAGE_KEY, inMemoryDeviceId);
		return inMemoryDeviceId;
	} catch {
		inMemoryDeviceId = createDeviceId();
		return inMemoryDeviceId;
	}
};
