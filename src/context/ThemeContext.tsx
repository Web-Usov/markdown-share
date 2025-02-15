import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type ThemeToSelect = "system" | Theme;

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: ThemeToSelect) => void;
  asSelectedTheme: ThemeToSelect;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<ThemeToSelect>(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeToSelect;
    return savedTheme || "system";
  });

  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";

  useEffect(() => {
    const handleThemeChange = () => {
      if (theme === "system") {
        document.documentElement.setAttribute("data-theme", systemTheme);
      } else {
        document.documentElement.setAttribute("data-theme", theme);
      }
    };

    handleThemeChange();
    localStorage.setItem("theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", handleThemeChange);

    return () => mediaQuery.removeEventListener("change", handleThemeChange);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme: theme === "system" ? systemTheme : theme,
        setTheme,
        asSelectedTheme: theme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
