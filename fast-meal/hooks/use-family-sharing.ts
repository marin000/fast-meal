import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Share } from "react-native";

import {
	useFeedbackMessage,
	useFridgeProducts,
	useHousehold,
	useShoppingList,
} from "@/context";

export const useFamilySharing = () => {
	const { t } = useTranslation();
	const { showMessage } = useFeedbackMessage();
	const {
		inviteCode,
		memberCount,
		isLoading,
		isShared,
		joinHousehold,
		leaveHousehold,
	} = useHousehold();
	const { reload: reloadFridge } = useFridgeProducts();
	const { reload: reloadShoppingList } = useShoppingList();
	const [joinCode, setJoinCode] = useState("");
	const [isJoining, setIsJoining] = useState(false);
	const [isLeaving, setIsLeaving] = useState(false);

	const reloadSharedData = useCallback(async () => {
		await Promise.all([reloadFridge(), reloadShoppingList()]);
	}, [reloadFridge, reloadShoppingList]);

	const handleShareCode = useCallback(async () => {
		if (!inviteCode) return;
		try {
			await Share.share({
				message: t("settings.family.shareMessage", { code: inviteCode }),
			});
		} catch {
			showMessage(t("settings.family.shareFailed"), "error");
		}
	}, [inviteCode, showMessage, t]);

	const handleJoin = useCallback(async () => {
		const code = joinCode.trim();
		if (!code) return;

		setIsJoining(true);
		try {
			await joinHousehold(code);
			setJoinCode("");
			await reloadSharedData();
			showMessage(t("settings.family.joinSuccess"), "success");
		} catch {
			showMessage(t("settings.family.joinFailed"), "error");
		} finally {
			setIsJoining(false);
		}
	}, [joinCode, joinHousehold, reloadSharedData, showMessage, t]);

	const handleLeave = useCallback(() => {
		Alert.alert(
			t("settings.family.leaveTitle"),
			t("settings.family.leaveMessage"),
			[
				{ text: t("settings.family.leaveCancel"), style: "cancel" },
				{
					text: t("settings.family.leaveConfirm"),
					style: "destructive",
					onPress: () => {
						void (async () => {
							setIsLeaving(true);
							try {
								await leaveHousehold();
								await reloadSharedData();
								showMessage(t("settings.family.leaveSuccess"), "success");
							} catch {
								showMessage(t("settings.family.leaveFailed"), "error");
							} finally {
								setIsLeaving(false);
							}
						})();
					},
				},
			],
		);
	}, [leaveHousehold, reloadSharedData, showMessage, t]);

	return {
		inviteCode,
		memberCount,
		isLoading,
		isShared,
		joinCode,
		setJoinCode,
		isJoining,
		isLeaving,
		handleShareCode,
		handleJoin,
		handleLeave,
	};
};
