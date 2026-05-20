import React, { createContext, useContext, useState, useEffect } from "react";
import { THEMES, DEFAULT_THEME } from "../config/themes";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => {
    return localStorage.getItem("feedback_hub_theme") || DEFAULT_THEME;
  });

  useEffect(() => {
    const theme = THEMES[themeId] || THEMES[DEFAULT_THEME];
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
    localStorage.setItem("feedback_hub_theme", themeId);
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, setThemeId, themes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
