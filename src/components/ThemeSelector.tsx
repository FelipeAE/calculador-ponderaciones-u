import { Theme, THEMES } from '../types/theme';

interface ThemeSelectorProps {
  currentTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export const ThemeSelector = ({ currentTheme, onThemeChange }: ThemeSelectorProps) => {
  return (
    <div className="theme-selector">
      {(Object.keys(THEMES) as Theme[]).map((theme) => (
        <button
          key={theme}
          onClick={() => onThemeChange(theme)}
          className={`theme-button ${currentTheme === theme ? 'active' : ''}`}
          aria-label={`Cambiar a tema ${THEMES[theme].label}`}
          title={THEMES[theme].label}
        >
          {THEMES[theme].icon}
        </button>
      ))}
    </div>
  );
};
