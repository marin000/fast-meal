import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

interface ReceiptIconProps {
	size?: number;
	color: string;
}

export const ReceiptIcon = ({ size = 24, color }: ReceiptIconProps) => (
	<MaterialCommunityIcons name="receipt" size={size} color={color} />
);
