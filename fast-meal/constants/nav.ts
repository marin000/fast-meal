import type { Ionicons } from '@expo/vector-icons';

export type FooterTab = 'home' | 'saved' | 'shoppingList' | 'settings';

export interface FooterItem {
  id: FooterTab;
  labelKey:
    | 'nav.home'
    | 'nav.saved'
    | 'nav.shoppingList'
    | 'nav.settings';
  iconName: keyof typeof Ionicons.glyphMap;
}

export const footerItems: FooterItem[] = [
  { id: 'home', labelKey: 'nav.home', iconName: 'home' },
  { id: 'saved', labelKey: 'nav.saved', iconName: 'bookmark' },
  { id: 'shoppingList', labelKey: 'nav.shoppingList', iconName: 'cart-outline' },
  { id: 'settings', labelKey: 'nav.settings', iconName: 'settings' },
];
