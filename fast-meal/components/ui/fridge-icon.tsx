import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface FridgeIconProps {
	size?: number;
	color: string;
	filled?: boolean;
}

export const FridgeIcon = ({
	size = 24,
	color,
	filled = false,
}: FridgeIconProps) => (
	<MaterialCommunityIcons
		name={filled ? "fridge" : "fridge-outline"}
		size={size}
		color={color}
	/>
);
