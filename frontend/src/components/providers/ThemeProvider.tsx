"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { useLocale } from "next-intl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";

interface ThemeContextProps {
  mode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps>({
  mode: "light",
  toggleTheme: () => {},
});

export const useThemeMode = () => useContext(ThemeContext);

interface Props {
  children: React.ReactNode;
}

export default function ThemeProvider({ children }: Props) {
  const locale = useLocale();
  const [mode, setMode] = useState<PaletteMode>("light");

  // إعداد cache لـ emotion مع RTL support حسب اللغة
  const cacheRtl = useMemo(() => {
    return createCache({
      key: locale === "ar" ? "mui-rtl" : "mui",
      stylisPlugins: locale === "ar" ? [rtlPlugin] : [],
      prepend: true,
    });
  }, [locale]);

  // قراءة الوضع من localStorage (مرة واحدة عند التحميل)
  useEffect(() => {
    const storedMode = localStorage.getItem("themeMode") as PaletteMode | null;
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
    } else {
      // اختيار الوضع الافتراضي حسب الوقت أو الإعدادات (مثلاً الوضع الفاتح)
      setMode("light");
    }
  }, []);

  // حفظ الوضع في localStorage عند تغييره
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  // تبديل الوضع
  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // إعداد الثيم الخاص بـ MUI حسب الوضع واللغة
  const theme = useMemo(() => {
    return createTheme({
      direction: locale === "ar" ? "rtl" : "ltr",
      palette: {
        mode,
        ...(mode === "light"
          ? {
              primary: { main: "#1976d2" },
              background: { default: "#f5f5f5", paper: "#fff" },
            }
          : {
              primary: { main: "#90caf9" },
              background: { default: "#121212", paper: "#1d1d1d" },
            }),
      },
      typography: {
        fontFamily: locale === "ar" ? "'Cairo', sans-serif" : "'Roboto', sans-serif",
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: {
            body: {
              direction: locale === "ar" ? "rtl" : "ltr",
            },
          },
        },
      },
    });
  }, [mode, locale]);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeContext.Provider value={{ mode, toggleTheme }}>
        <MuiThemeProvider theme={theme}>
          <CssBaseline />
          {children}
        </MuiThemeProvider>
      </ThemeContext.Provider>
    </CacheProvider>
  );
}
