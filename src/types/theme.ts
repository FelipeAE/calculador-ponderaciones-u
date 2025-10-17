export type Theme = 'light' | 'dark' | 'ocean' | 'forest' | 'sunset';

export interface ThemeConfig {
  name: Theme;
  icon: string;
  label: string;
}

export const THEMES: Record<Theme, ThemeConfig> = {
  light: {
    name: 'light',
    icon: '☀️',
    label: 'Claro'
  },
  dark: {
    name: 'dark',
    icon: '🌙',
    label: 'Oscuro'
  },
  ocean: {
    name: 'ocean',
    icon: '🌊',
    label: 'Océano'
  },
  forest: {
    name: 'forest',
    icon: '🌲',
    label: 'Bosque'
  },
  sunset: {
    name: 'sunset',
    icon: '🌅',
    label: 'Atardecer'
  }
};
