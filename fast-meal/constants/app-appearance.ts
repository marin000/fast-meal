export interface DifficultyAppearance {
	easy: { soft: string; solid: string };
	medium: { soft: string; solid: string };
	hard: { soft: string; solid: string };
}

export interface ExpirationAppearance {
	ok: { soft: string; solid: string };
	soon: { soft: string; solid: string };
	expired: { soft: string; solid: string };
}

export interface AppAppearance {
	background: string;
	card: string;
	cardBorder: string;
	text: string;
	textMuted: string;
	border: string;
	primary: string;
	surfaceOverlay: string;
	chipBg: string;
	chipBorder: string;
	chipText: string;
	chipSelectedBg: string;
	chipSelectedBorder: string;
	chipSelectedText: string;
	inputBg: string;
	inputBorder: string;
	inputPlaceholder: string;
	footerBg: string;
	footerBorder: string;
	footerTabActive: string;
	footerTabInactive: string;
	iconMuted: string;
	nutritionBarTrack: string;
	rowDivider: string;
	logoContainerBg: string;
	brandTextBase: string;
	substitutionBoxBg: string;
	segmentBorder: string;
	segmentInactiveBg: string;
	segmentActiveBg: string;
	segmentInactiveText: string;
	segmentActiveText: string;
	toggleTrack: string;
	toggleTrackActive: string;
	settingsRowDivider: string;
	success: string;
	warning: string;
	danger: string;
	expiration: ExpirationAppearance;
	difficulty: DifficultyAppearance;
}

export const lightAppearance: AppAppearance = {
	background: "#F4F7F4",
	card: "#FFFFFF",
	cardBorder: "rgba(20, 26, 20, 0.08)",
	text: "#141A14",
	textMuted: "#6B7A6B",
	border: "rgba(20, 26, 20, 0.1)",
	primary: "#2D8A4E",
	surfaceOverlay: "rgba(20, 26, 20, 0.06)",
	chipBg: "#FFFFFF",
	chipBorder: "#D7DFE8",
	chipText: "#16263A",
	chipSelectedBg: "#2D8A4E",
	chipSelectedBorder: "#2D8A4E",
	chipSelectedText: "#FFFFFF",
	inputBg: "#FFFFFF",
	inputBorder: "rgba(20, 26, 20, 0.1)",
	inputPlaceholder: "#7D8EA3",
	footerBg: "#FFFFFF",
	footerBorder: "rgba(20, 26, 20, 0.1)",
	footerTabActive: "#2D8A4E",
	footerTabInactive: "#6B7A6B",
	iconMuted: "#6B7A6B",
	nutritionBarTrack: "rgba(20, 26, 20, 0.06)",
	rowDivider: "rgba(20, 26, 20, 0.08)",
	logoContainerBg: "#2D8A4E",
	brandTextBase: "#141A14",
	substitutionBoxBg: "rgba(45, 138, 78, 0.08)",
	segmentBorder: "#D7DFE8",
	segmentInactiveBg: "#FFFFFF",
	segmentActiveBg: "#2D8A4E",
	segmentInactiveText: "#6B7A6B",
	segmentActiveText: "#FFFFFF",
	toggleTrack: "#EEF3EE",
	toggleTrackActive: "#2D8A4E",
	settingsRowDivider: "#E8EDE8",
	success: "#2D8A4E",
	warning: "#D97706",
	danger: "#DC2626",
	expiration: {
		ok: { soft: "rgba(45, 138, 78, 0.12)", solid: "#2D8A4E" },
		soon: { soft: "rgba(217, 119, 6, 0.16)", solid: "#D97706" },
		expired: { soft: "rgba(220, 38, 38, 0.14)", solid: "#DC2626" },
	},
	difficulty: {
		easy: { soft: "rgba(45, 138, 78, 0.12)", solid: "#2D8A4E" },
		medium: { soft: "rgba(198, 138, 14, 0.14)", solid: "#C68A0E" },
		hard: { soft: "rgba(192, 57, 43, 0.12)", solid: "#C0392B" },
	},
};

export const darkAppearance: AppAppearance = {
	background: "#0D1A0F",
	card: "#132116",
	cardBorder: "rgba(232, 245, 233, 0.1)",
	text: "#E8F5E9",
	textMuted: "#7FA87F",
	border: "rgba(232, 245, 233, 0.1)",
	primary: "#4CAF72",
	surfaceOverlay: "rgba(232, 245, 233, 0.08)",
	chipBg: "#182418",
	chipBorder: "rgba(232, 245, 233, 0.15)",
	chipText: "#E8F5E9",
	chipSelectedBg: "#4CAF72",
	chipSelectedBorder: "#4CAF72",
	chipSelectedText: "#FFFFFF",
	inputBg: "#132116",
	inputBorder: "rgba(232, 245, 233, 0.12)",
	inputPlaceholder: "#7FA87F",
	footerBg: "#132116",
	footerBorder: "rgba(232, 245, 233, 0.1)",
	footerTabActive: "#E8F5E9",
	footerTabInactive: "#7FA87F",
	iconMuted: "#7FA87F",
	nutritionBarTrack: "rgba(232, 245, 233, 0.12)",
	rowDivider: "rgba(232, 245, 233, 0.1)",
	logoContainerBg: "#4CAF72",
	brandTextBase: "#E8F5E9",
	substitutionBoxBg: "rgba(76, 175, 114, 0.18)",
	segmentBorder: "rgba(232, 245, 233, 0.15)",
	segmentInactiveBg: "#182418",
	segmentActiveBg: "#4CAF72",
	segmentInactiveText: "#7FA87F",
	segmentActiveText: "#FFFFFF",
	toggleTrack: "#1C2E1E",
	toggleTrackActive: "#4CAF72",
	settingsRowDivider: "rgba(232, 245, 233, 0.1)",
	success: "#4CAF72",
	warning: "#FFB74D",
	danger: "#EF5350",
	expiration: {
		ok: { soft: "rgba(76, 175, 114, 0.22)", solid: "#4CAF72" },
		soon: { soft: "rgba(255, 183, 77, 0.2)", solid: "#FFB74D" },
		expired: { soft: "rgba(239, 83, 80, 0.22)", solid: "#EF5350" },
	},
	difficulty: {
		easy: { soft: "rgba(76, 175, 114, 0.22)", solid: "#4CAF72" },
		medium: { soft: "rgba(245, 166, 35, 0.2)", solid: "#F5A623" },
		hard: { soft: "rgba(239, 83, 80, 0.22)", solid: "#EF5350" },
	},
};
