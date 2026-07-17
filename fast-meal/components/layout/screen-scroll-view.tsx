import type { ReactNode } from "react";
import type { StyleProp, ViewStyle } from "react-native";
import { Keyboard, ScrollView, type ScrollViewProps } from "react-native";

interface ScreenScrollViewProps
	extends Omit<ScrollViewProps, "style" | "contentContainerStyle"> {
	children: ReactNode;
	backgroundColor: string;
	contentContainerStyle?: StyleProp<ViewStyle>;
	dismissKeyboardOnScroll?: boolean;
}

export const ScreenScrollView = ({
	children,
	backgroundColor,
	contentContainerStyle,
	dismissKeyboardOnScroll = false,
	keyboardShouldPersistTaps = "handled",
	onScrollBeginDrag,
	...rest
}: ScreenScrollViewProps) => (
	<ScrollView
		{...rest}
		style={{ backgroundColor, flex: 1 }}
		contentContainerStyle={contentContainerStyle}
		keyboardShouldPersistTaps={keyboardShouldPersistTaps}
		onScrollBeginDrag={(event) => {
			if (dismissKeyboardOnScroll) {
				Keyboard.dismiss();
			}
			onScrollBeginDrag?.(event);
		}}
	>
		{children}
	</ScrollView>
);
