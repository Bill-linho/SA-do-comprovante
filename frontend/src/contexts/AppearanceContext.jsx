import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AppearanceContext = createContext(null);
const STORAGE_KEY = 'restaurant-appearance';
const defaults = { theme: 'system', fontSize: 'medium', highContrast: false };

function readSettings() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return { ...defaults, ...saved };
  } catch {
    return defaults;
  }
}

export function AppearanceProvider({ children }) {
  const [settings, setSettings] = useState(readSettings);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const systemDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    const theme = settings.theme === 'system' ? (systemDark ? 'dark' : 'light') : settings.theme;
    document.documentElement.dataset.theme = theme;
    document.documentElement.dataset.fontSize = settings.fontSize;
    document.documentElement.dataset.contrast = settings.highContrast ? 'high' : 'normal';
  }, [settings]);

  useEffect(() => {
    if (settings.theme !== 'system' || !window.matchMedia) return undefined;
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const update = () => {
      document.documentElement.dataset.theme = media.matches ? 'dark' : 'light';
    };
    media.addEventListener?.('change', update);
    return () => media.removeEventListener?.('change', update);
  }, [settings.theme]);

  const value = useMemo(() => ({
    settings,
    updateSettings: (changes) => setSettings(current => ({ ...current, ...changes })),
    resetSettings: () => setSettings(defaults),
  }), [settings]);

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>;
}

export function useAppearance() {
  const context = useContext(AppearanceContext);
  if (!context) throw new Error('useAppearance deve ser usado dentro de AppearanceProvider.');
  return context;
}
