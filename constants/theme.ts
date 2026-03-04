import { Platform } from 'react-native';

export const Colors = {
  primary: '#D35400', // Terracotta / warm orange (rural earthy feel)
  secondary: '#27AE60', // Natural green for success/safe
  warning: '#F39C12', // Yellow/Orange for suspicious
  danger: '#C0392B', // Red for high risk
  background: '#FDF7E3', // Warm off-white/cream
  surface: '#FFFFFF', // White cards
  text: '#2C3E50', // Dark grey for readable text
  textLight: '#7F8C8D', // Muted text
  border: '#E8E8E8',
};

export const Fonts = Platform.select({
  ios: {
    regular: 'System',
    bold: 'System',
  },
  android: {
    regular: 'sans-serif',
    bold: 'sans-serif-condensed',
  },
  default: {
    regular: 'sans-serif',
    bold: 'sans-serif-medium',
  },
});

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};
