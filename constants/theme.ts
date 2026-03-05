import { Platform } from 'react-native';

export const Colors = {
  // Primary palette — muted clay/terracotta
  primary: '#9B6B4E',        // Warm clay
  primaryLight: '#C4967A',   // Dusty rose-terracotta
  primaryDark: '#6B3F2A',    // Deep umber

  // Secondary palette — muted sage greens
  secondary: '#9feaadff',      // Sage green
  secondaryLight: '#bdf3c1ff', // Soft moss
  secondaryDark: '#3A5440',  // Deep forest

  // Risk level colors — all desaturated
  safe: '#5A7A60',           // Sage green
  suspicious: '#B8924A',     // Muted amber/ochre
  danger: '#8B3A3A',         // Deep muted red

  // Backgrounds — warm parchment & linen
  background: '#F5EFE4',     // Warm linen parchment
  backgroundDark: '#EDE3D0', // Aged parchment
  backgroundDeep: '#E0D4BC', // Deeper linen

  // Surfaces — antique cream
  surface: '#FDFAF4',        // Antique cream
  surfaceElevated: '#F8F2E6',// Slight ivory elevation

  // Text tones — all earthy
  text: '#2E221A',           // Darkest ink
  textLight: '#6B4F3A',      // Warm brown-grey
  textMuted: '#9C8070',      // Faded sepia

  // UI borders — natural wood tones
  border: '#CDB99A',         // Natural linen border
  borderLight: '#E0D0B8',    // Lighter border

  // Accent tones
  gold: '#B89A5A',           // Antique gold
  wheat: '#DEC89A',          // Soft wheat (for text on dark)
  soil: '#7A5235',           // Soil brown — for shadows
  leaf: '#8AA68C',           // Leaf sage

  // ── Analysis Dashboard — premium semantic palette ──
  analysisBg: '#1E1E2E',
  analysisBgLight: '#2A2A3C',
  cardGlass: 'rgba(255,255,255,0.08)',
  cardGlassBorder: 'rgba(255,255,255,0.12)',

  safeGlow: '#22C55E',
  warningGlow: '#F59E0B',
  dangerGlow: '#EF4444',
  accentBlue: '#6366F1',

  // Surface
  white: '#FDFAF4',
};

export const Spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const Fonts = Platform.select({
  default: {
    regular: 'sans-serif',
    bold: 'sans-serif-medium',
  },
});
