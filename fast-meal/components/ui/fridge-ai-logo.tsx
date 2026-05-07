import Svg, { Circle, Line, Path, Rect } from 'react-native-svg';

interface FridgeAiLogoProps {
  size?: number;
}

export const FridgeAiLogo = ({ size = 24 }: FridgeAiLogoProps) => {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 28 28"
      fill="none"
      accessibilityLabel="FridgeAI logo"
    >
      <Rect x="5" y="3" width="18" height="22" rx="4" fill="#FFFFFF" fillOpacity="0.2" />
      <Rect x="5" y="3" width="18" height="22" rx="4" stroke="#FFFFFF" strokeWidth="1.8" />
      <Line x1="5" y1="13" x2="23" y2="13" stroke="#FFFFFF" strokeWidth="1.5" />
      <Rect x="20" y="6" width="1.5" height="4" rx="0.75" fill="#FFFFFF" />
      <Rect x="20" y="15.5" width="1.5" height="4" rx="0.75" fill="#FFFFFF" />
      <Circle cx="20" cy="4" r="4.5" fill="#F5A623" />
      <Path
        d="M20 1.8L20.6 3.4L22.2 4L20.6 4.6L20 6.2L19.4 4.6L17.8 4L19.4 3.4Z"
        fill="#FFFFFF"
      />
    </Svg>
  );
};
