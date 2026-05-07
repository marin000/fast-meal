import { DarkTheme, DefaultTheme } from '@react-navigation/native';

export const appBackgroundColor = '#F4F7F4';

export const navigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: appBackgroundColor,
    card: appBackgroundColor,
  },
};

export const navigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: appBackgroundColor,
    card: appBackgroundColor,
  },
};
