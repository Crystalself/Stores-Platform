"use client"

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material"
import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useLocale } from "next-intl"

interface ThemeContextType {
  isDarkMode: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

interface CustomThemeProviderProps {
  children: ReactNode
}

export function CustomThemeProvider({ children }: CustomThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const locale = useLocale()
  const isRTL = locale === "ar"

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark")
    } else {
      setIsDarkMode(window.matchMedia("(prefers-color-scheme: dark)").matches)
    }
  }, [])

  const toggleTheme = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem("theme", newMode ? "dark" : "light")
  }

  const theme = createTheme({
    direction: isRTL ? "rtl" : "ltr",
    palette: {
      mode: isDarkMode ? "dark" : "light",
      primary: {
        main: "#667eea",
        light: "#8fa5f3",
        dark: "#4c63d2",
        contrastText: "#ffffff",
      },
      secondary: {
        main: "#764ba2",
        light: "#9575cd",
        dark: "#512da8",
        contrastText: "#ffffff",
      },
      background: {
        default: isDarkMode ? "#0a0e27" : "#f8fafc",
        paper: isDarkMode ? "#1e293b" : "#ffffff",
      },
      text: {
        primary: isDarkMode ? "#f1f5f9" : "#1e293b",
        secondary: isDarkMode ? "#94a3b8" : "#64748b",
      },
      divider: isDarkMode ? "#334155" : "#e2e8f0",
      success: {
        main: "#10b981",
        light: "#34d399",
        dark: "#059669",
      },
      warning: {
        main: "#f59e0b",
        light: "#fbbf24",
        dark: "#d97706",
      },
      error: {
        main: "#ef4444",
        light: "#f87171",
        dark: "#dc2626",
      },
      info: {
        main: "#3b82f6",
        light: "#60a5fa",
        dark: "#2563eb",
      },
    },
    typography: {
      fontFamily: isRTL
        ? '"Noto Sans Arabic", "Roboto", "Helvetica", "Arial", sans-serif'
        : '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: "2.5rem",
        fontWeight: 700,
        lineHeight: 1.2,
      },
      h2: {
        fontSize: "2rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h3: {
        fontSize: "1.75rem",
        fontWeight: 600,
        lineHeight: 1.3,
      },
      h4: {
        fontSize: "1.5rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: "1.25rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: "1.125rem",
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: "1rem",
        lineHeight: 1.6,
      },
      body2: {
        fontSize: "0.875rem",
        lineHeight: 1.5,
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            boxShadow: isDarkMode
              ? "0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)"
              : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: isDarkMode
                ? "0 10px 15px -3px rgba(0, 0, 0, 0.4), 0 4px 6px -2px rgba(0, 0, 0, 0.3)"
                : "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            textTransform: "none",
            fontWeight: 600,
            padding: "10px 24px",
            transition: "all 0.2s ease-in-out",
          },
          contained: {
            boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
            "&:hover": {
              boxShadow: "0 8px 20px rgba(102, 126, 234, 0.6)",
              transform: "translateY(-1px)",
            },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiOutlinedInput-root": {
              borderRadius: 12,
              transition: "all 0.2s ease-in-out",
              "&:hover": {
                transform: "translateY(-1px)",
              },
              "&.Mui-focused": {
                transform: "translateY(-1px)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.2)",
              },
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      },
    },
  })

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}
