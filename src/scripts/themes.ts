export const THEMES = ['matrix', 'amber', 'ice', 'dracula', 'mono'] as const;
export type ThemeName = (typeof THEMES)[number];

const STORAGE_KEY = 'theme';

export function getTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored && (THEMES as readonly string[]).includes(stored)) {
    return stored as ThemeName;
  }
  return 'matrix';
}

export function applyTheme(name: ThemeName): void {
  document.documentElement.setAttribute('data-theme', name);
  localStorage.setItem(STORAGE_KEY, name);
}

export function initThemeFromStorage(): void {
  applyTheme(getTheme());
}
