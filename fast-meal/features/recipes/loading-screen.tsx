import { useTranslation } from "react-i18next";

import { FridgeAiLoading } from "@/components";

export const LoadingScreen = () => {
	const { t } = useTranslation();

	return (
		<FridgeAiLoading
			title={t("loading.title")}
			subtitle={t("loading.subtitle")}
		/>
	);
};
