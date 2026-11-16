import { Ionicons } from "@expo/vector-icons";
import { type ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { FridgeAiLoading, FridgeAiLogo } from "@/components";

const STEP_INTERVAL_MS = 7000;

const LOADING_STEPS: {
	icon: ReactNode;
	titleKey: string;
	subtitleKey: string;
}[] = [
	{
		icon: <FridgeAiLogo size={32} />,
		titleKey: "loading.steps.fridge.title",
		subtitleKey: "loading.steps.fridge.subtitle",
	},
	{
		icon: <Ionicons name="sparkles" size={28} color="#FFFFFF" />,
		titleKey: "loading.steps.flavors.title",
		subtitleKey: "loading.steps.flavors.subtitle",
	},
	{
		icon: <Ionicons name="restaurant-outline" size={28} color="#FFFFFF" />,
		titleKey: "loading.steps.recipes.title",
		subtitleKey: "loading.steps.recipes.subtitle",
	},
];

export const LoadingScreen = () => {
	const { t } = useTranslation();
	const [stepIndex, setStepIndex] = useState(0);

	useEffect(() => {
		const intervalId = setInterval(() => {
			setStepIndex((current) => (current + 1) % LOADING_STEPS.length);
		}, STEP_INTERVAL_MS);

		return () => clearInterval(intervalId);
	}, []);

	const step = LOADING_STEPS[stepIndex];

	return <FridgeAiLoading icon={step.icon} title={t(step.titleKey)} subtitle={t(step.subtitleKey)} />;
};
