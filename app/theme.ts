import { useEffect, useState } from "react";

export type ColorSchemeName = keyof typeof colorSchemes;

type ColorScheme = {
  label: string;
  tokens: Record<string, string>;
};

export const colorSchemes = {
  light: {
    label: "Light",
    tokens: {
      "app-bg": "#292523",
      "app-fg": "#ffffff",
      "surface": "#292523",
      "surface-muted": "#3a3532",
      "surface-strong": "#211f1d",
      "border": "#6d6865",
      "text": "#ffffff",
      "text-muted": "rgb(255 255 255 / 0.85)",
      "text-soft": "#918b87",
      "accent": "#f4ff3d",
      "accent-hover": "#f7ff62",
      "accent-contrast": "#211f1d",
      "danger": "#fecaca",
      "nav-bg": "#292523",
      "nav-border": "#6d6865",
      "auth-overlay": "rgb(74 69 69 / 0.95)",
      "auth-surface": "#292523",
      "auth-text": "#ffffff",
      "auth-text-muted": "rgb(255 255 255 / 0.85)",
      "auth-field-border": "#6d6865",
      "auth-placeholder": "#918b87",
      "auth-accent": "#f4ff3d",
      "auth-accent-hover": "#f7ff62",
      "auth-accent-contrast": "#211f1d",
      "auth-error": "#fecaca",
      "radius-control": "0.375rem",
      "radius-panel": "1.5rem",
      "radius-modal": "1.125rem",
      "radius-pill": "9999px",
      "shadow-modal": "0 25px 50px -12px rgb(0 0 0 / 0.25)",
    },
  },
  dark: {
    label: "Dark",
    tokens: {
      "app-bg": "#171412",
      "app-fg": "#ffffff",
      "surface": "#171412",
      "surface-muted": "#292523",
      "surface-strong": "#100e0d",
      "border": "#69625e",
      "text": "#ffffff",
      "text-muted": "rgb(255 255 255 / 0.82)",
      "text-soft": "#a8a09a",
      "accent": "#f4ff3d",
      "accent-hover": "#f7ff62",
      "accent-contrast": "#211f1d",
      "danger": "#fecaca",
      "nav-bg": "#171412",
      "nav-border": "#69625e",
      "auth-overlay": "rgb(10 10 12 / 0.95)",
      "auth-surface": "#171412",
      "auth-text": "#ffffff",
      "auth-text-muted": "rgb(255 255 255 / 0.82)",
      "auth-field-border": "#69625e",
      "auth-placeholder": "#a8a09a",
      "auth-accent": "#f4ff3d",
      "auth-accent-hover": "#f7ff62",
      "auth-accent-contrast": "#211f1d",
      "auth-error": "#fecaca",
      "radius-control": "0.375rem",
      "radius-panel": "1rem",
      "radius-modal": "1rem",
      "radius-pill": "9999px",
      "shadow-modal": "0 25px 50px -12px rgb(0 0 0 / 0.55)",
    },
  },
  yellowy: {
    label: "Yellowy",
    tokens: {
      "app-bg": "#2d2614",
      "app-fg": "#fffceb",
      "surface": "#2d2614",
      "surface-muted": "#3d3318",
      "surface-strong": "#211b0d",
      "border": "#8f7c39",
      "text": "#fffceb",
      "text-muted": "rgb(255 252 235 / 0.85)",
      "text-soft": "#b9a969",
      "accent": "#f4ff3d",
      "accent-hover": "#f7ff62",
      "accent-contrast": "#211f1d",
      "danger": "#fecaca",
      "nav-bg": "#2d2614",
      "nav-border": "#8f7c39",
      "auth-overlay": "rgb(74 69 40 / 0.92)",
      "auth-surface": "#2d2614",
      "auth-text": "#fffceb",
      "auth-text-muted": "rgb(255 252 235 / 0.85)",
      "auth-field-border": "#8f7c39",
      "auth-placeholder": "#b9a969",
      "auth-accent": "#f4ff3d",
      "auth-accent-hover": "#f7ff62",
      "auth-accent-contrast": "#211f1d",
      "auth-error": "#fecaca",
      "radius-control": "0.75rem",
      "radius-panel": "1.75rem",
      "radius-modal": "1.25rem",
      "radius-pill": "9999px",
      "shadow-modal": "0 25px 50px -12px rgb(74 69 40 / 0.35)",
    },
  },
} satisfies Record<string, ColorScheme>;

export const colorSchemeNames = Object.keys(
  colorSchemes,
) as ColorSchemeName[];

export const defaultColorScheme: ColorSchemeName = "light";

const storageKey = "sum-of-us-color-scheme";

export function applyColorScheme(name: ColorSchemeName) {
  const scheme = colorSchemes[name];
  const root = document.documentElement;

  root.dataset.theme = name;
  root.style.colorScheme = name === "dark" ? "dark" : "light";

  for (const [token, value] of Object.entries(scheme.tokens)) {
    root.style.setProperty(`--${token}`, value);
  }
}

function readStoredScheme(): ColorSchemeName {
  if (typeof window === "undefined") {
    return defaultColorScheme;
  }

  const storedScheme = window.localStorage.getItem(storageKey);

  return colorSchemeNames.includes(storedScheme as ColorSchemeName)
    ? (storedScheme as ColorSchemeName)
    : defaultColorScheme;
}

export function useColorScheme() {
  const [schemeName, setSchemeName] = useState<ColorSchemeName>(readStoredScheme);

  useEffect(() => {
    applyColorScheme(schemeName);
    window.localStorage.setItem(storageKey, schemeName);
  }, [schemeName]);

  return {
    scheme: colorSchemes[schemeName],
    schemeName,
    setSchemeName,
  };
}
