import * as ImagePicker from "expo-image-picker";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "react-native";

import type { IngredientImageErrorCode } from "@/constants/ingredient-image";
import { useHomeIngredientImage } from "@/context/home-ingredient-image-context";
import { processIngredientImageAsset } from "@/utils/process-ingredient-image";
import {
	ANALYTICS_EVENTS,
	captureAppException,
	trackProductEvent,
} from "@/utils/sentry";

const errorMessageKey = (code: IngredientImageErrorCode): string => {
	switch (code) {
		case "unsupportedType":
			return "home.image.errors.unsupportedType";
		case "tooLarge":
			return "home.image.errors.tooLarge";
		case "permissionDenied":
			return "home.image.errors.permissionDenied";
		default:
			return "home.image.errors.processingFailed";
	}
};

export const useIngredientImage = () => {
	const { t } = useTranslation();
	const { image, setImage, clearImage } = useHomeIngredientImage();
	const [imageError, setImageError] = useState<string | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);

	const applyAsset = useCallback(
		async (asset: ImagePicker.ImagePickerAsset) => {
			setIsProcessing(true);
			setImageError(null);
			try {
				const result = await processIngredientImageAsset(asset);
				if (!result.ok) {
					trackProductEvent(ANALYTICS_EVENTS.fridgeImageAttached, {
						ok: false,
						errorCode: result.error,
					});
					const message = t(errorMessageKey(result.error));
					setImageError(message);
					return;
				}
				setImage(result.payload);
				trackProductEvent(ANALYTICS_EVENTS.fridgeImageAttached, {
					ok: true,
				});
			} catch (error) {
				captureAppException(error, { feature: "fridge_image" });
				setImageError(t(errorMessageKey("processingFailed")));
			} finally {
				setIsProcessing(false);
			}
		},
		[setImage, t],
	);

	const pickFromLibrary = useCallback(async () => {
		const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
		if (!permission.granted) {
			setImageError(t(errorMessageKey("permissionDenied")));
			return;
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ["images"],
			allowsMultipleSelection: false,
			quality: 1,
			exif: false,
		});

		if (result.canceled || !result.assets[0]) return;
		await applyAsset(result.assets[0]);
	}, [applyAsset, t]);

	const takePhoto = useCallback(async () => {
		const permission = await ImagePicker.requestCameraPermissionsAsync();
		if (!permission.granted) {
			setImageError(t(errorMessageKey("permissionDenied")));
			return;
		}

		const result = await ImagePicker.launchCameraAsync({
			mediaTypes: ["images"],
			quality: 1,
			exif: false,
		});

		if (result.canceled || !result.assets[0]) return;
		await applyAsset(result.assets[0]);
	}, [applyAsset, t]);

	const showPickerOptions = useCallback(() => {
		Alert.alert(t("home.image.addTitle"), undefined, [
			{
				text: t("home.image.camera"),
				onPress: () => {
					void takePhoto();
				},
			},
			{
				text: t("home.image.gallery"),
				onPress: () => {
					void pickFromLibrary();
				},
			},
			{ text: t("home.image.cancel"), style: "cancel" },
		]);
	}, [pickFromLibrary, t, takePhoto]);

	const removeImage = useCallback(() => {
		clearImage();
		setImageError(null);
	}, [clearImage]);

	return {
		image,
		previewUri: image?.previewUri ?? null,
		imageError,
		isProcessing,
		showPickerOptions,
		pickFromLibrary,
		takePhoto,
		removeImage,
		clearImageError: () => setImageError(null),
	};
};
